import crypto from 'node:crypto';

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { WebStandardStreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/webStandardStreamableHttp.js';
import { NextRequest, NextResponse } from 'next/server';
import { getPayload, type BasePayload, type TypedUser } from 'payload';
import { z } from 'zod';

import config from '@payload-config';
import { MCP_COLLECTIONS, MCP_GLOBALS } from '../../../../lib/mcp-config';
import {
  getApiRateLimiter,
  getClientIp,
  createRateLimitHeaders,
} from '../../../../lib/rate-limit';

/**
 * Custom MCP API route for Airbank CMS.
 *
 * Bypasses the broken mcp-handler adapter from @payloadcms/plugin-mcp.
 * Uses @modelcontextprotocol/sdk's WebStandardStreamableHTTPServerTransport
 * directly with standard Web API Request/Response.
 *
 * Per-request stateless design: new McpServer + transport per request.
 * This avoids stale user references and matches stateless HTTP semantics.
 *
 * @see https://github.com/vercel/mcp-adapter/issues — upstream bug in mcp-handler
 */

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function toCamelCase(str: string): string {
  return str
    .replace(/[-_\s]+(.)?/g, (_, chr: string) => (chr ? chr.toUpperCase() : ''))
    .replace(/^(.)/, (_, chr: string) => chr.toLowerCase());
}

function toToolName(prefix: string, slug: string): string {
  const camel = toCamelCase(slug);
  return `${prefix}${camel.charAt(0).toUpperCase()}${camel.slice(1)}`;
}

class JsonValidationError extends Error {}

function parseJsonObject(str: string, paramName: string): Record<string, unknown> {
  let parsed: unknown;
  try {
    parsed = JSON.parse(str);
  } catch {
    throw new JsonValidationError(`Invalid JSON in '${paramName}' parameter`);
  }
  if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
    throw new JsonValidationError(
      `'${paramName}' must be a JSON object, not ${Array.isArray(parsed) ? 'an array' : typeof parsed}`,
    );
  }
  return parsed as Record<string, unknown>;
}

function toolError(
  error: unknown,
  slug: string,
  op: string,
): { content: { type: 'text'; text: string }[] } {
  if (error instanceof JsonValidationError) {
    return { content: [{ type: 'text' as const, text: `Error: ${error.message}` }] };
  }
  console.error(`[MCP] Tool error in ${op} ${slug}:`, error);
  return { content: [{ type: 'text' as const, text: 'Error: Operation failed' }] };
}

// ---------------------------------------------------------------------------
// Zod parameter schemas
// ---------------------------------------------------------------------------

const findParams = {
  id: z
    .union([z.string(), z.number()])
    .optional()
    .describe('Optional: specific document ID to retrieve'),
  limit: z
    .number()
    .int()
    .min(1)
    .max(100)
    .optional()
    .default(10)
    .describe('Maximum documents to return (default: 10, max: 100)'),
  page: z
    .number()
    .int()
    .min(1)
    .optional()
    .default(1)
    .describe('Page number for pagination (default: 1)'),
  sort: z.string().optional().describe('Sort field (prefix with - for descending)'),
  where: z.string().optional().describe('JSON where clause for filtering'),
  select: z.string().optional().describe('JSON object defining fields to return'),
  depth: z
    .number()
    .int()
    .min(0)
    .max(5)
    .optional()
    .default(0)
    .describe('Relationship population depth (default: 0)'),
};

const createParams = {
  data: z.string().describe('JSON string with the new document data'),
  depth: z
    .number()
    .int()
    .min(0)
    .max(5)
    .optional()
    .default(0)
    .describe('Population depth in response (default: 0)'),
};

const updateParams = {
  id: z.union([z.string(), z.number()]).optional().describe('Document ID to update'),
  data: z.string().describe('JSON string with update data'),
  where: z.string().optional().describe('JSON where clause to update multiple documents'),
  depth: z.number().int().min(0).max(5).optional().default(0).describe('Population depth'),
};

const deleteParams = {
  id: z.union([z.string(), z.number()]).optional().describe('Document ID to delete'),
  where: z.string().optional().describe('JSON where clause to delete multiple documents'),
  depth: z.number().int().min(0).max(5).optional().default(0).describe('Population depth'),
};

const globalFindParams = {
  depth: z
    .number()
    .int()
    .min(0)
    .max(5)
    .optional()
    .default(0)
    .describe('Relationship population depth (default: 0)'),
  select: z.string().optional().describe('JSON object defining fields to return'),
};

const globalUpdateParams = {
  data: z.string().describe('JSON string with update data'),
  depth: z.number().int().min(0).max(5).optional().default(0).describe('Population depth'),
};

// ---------------------------------------------------------------------------
// Auth — validate Bearer API key (HMAC-SHA256 against payload-mcp-api-keys)
// ---------------------------------------------------------------------------

async function authenticateApiKey(request: NextRequest) {
  const payload = await getPayload({ config });

  // Support both: Bearer header (Claude Code / mcp-remote) and ?key= query param (Claude.ai connectors)
  const authHeader = request.headers.get('authorization');
  const queryKey = new URL(request.url).searchParams.get('key');

  let apiKey: string | null = null;
  if (authHeader?.startsWith('Bearer ')) {
    apiKey = authHeader.replace('Bearer ', '').trim();
  } else if (queryKey) {
    apiKey = queryKey.trim();
  }

  if (!apiKey) {
    return null;
  }

  // HMAC-SHA256 index lookup. Note: the DB query for apiKeyIndex reveals timing
  // information (hit vs miss), but the actual key comparison is hash-based so
  // the raw key is never compared directly. Acceptable for this use case.
  const sha256 = crypto.createHmac('sha256', payload.secret).update(apiKey).digest('hex');

  // TODO: Remove `any` cast once Payload exposes typed API for dynamic collection access
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { docs } = await (payload as any).find({
    collection: 'payload-mcp-api-keys',
    where: { apiKeyIndex: { equals: sha256 } },
    limit: 1,
    pagination: false,
    depth: 1,
  });

  if (docs.length === 0) {
    return null;
  }

  const apiKeyDoc = docs[0] as unknown as Record<string, unknown>;
  const userField = apiKeyDoc.user;

  if (!userField || typeof userField === 'number' || typeof userField === 'string') {
    console.warn('[MCP] API key user relationship not populated or user deleted');
    return null;
  }

  const user = userField as TypedUser;
  user.collection = 'users';
  // TODO: Remove `any` cast once Payload exposes typed _strategy property
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (user as any)._strategy = 'mcp-api-key';

  return { apiKeyDoc, user, payload };
}

// ---------------------------------------------------------------------------
// Tool registration — collections
// ---------------------------------------------------------------------------

function registerCollectionTools(
  server: McpServer,
  payload: BasePayload,
  user: TypedUser,
  apiKeyDoc: Record<string, unknown>,
) {
  // TODO: Remove `any` cast once Payload exposes typed API for dynamic collection access
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const api = payload as any;

  for (const [slug, ops] of Object.entries(MCP_COLLECTIONS)) {
    const camelSlug = toCamelCase(slug);
    const rawPerms = apiKeyDoc[camelSlug];
    const keyPerms
      = rawPerms && typeof rawPerms === 'object' && !Array.isArray(rawPerms)
        ? (rawPerms as Record<string, boolean>)
        : undefined;

    if (ops.find && keyPerms?.find !== false) {
      server.tool(
        toToolName('find', slug),
        `Find documents in the ${slug} collection`,
        findParams,
        async ({ id, limit, page, sort, where, select, depth }) => {
          try {
            const selectClause = select ? parseJsonObject(select, 'select') : undefined;
            if (id) {
              const doc = await api.findByID({
                id,
                collection: slug,
                depth,
                ...(selectClause && { select: selectClause }),
                overrideAccess: false,
                user,
              });
              return {
                content: [
                  {
                    type: 'text' as const,
                    text: `Resource from "${slug}":\n${JSON.stringify(doc, null, 2)}`,
                  },
                ],
              };
            }
            const whereClause = where ? parseJsonObject(where, 'where') : undefined;
            const result = await api.find({
              collection: slug,
              depth,
              limit,
              page,
              ...(sort && { sort }),
              ...(whereClause && { where: whereClause }),
              ...(selectClause && { select: selectClause }),
              overrideAccess: false,
              user,
            });
            let text = `Collection: "${slug}"\nTotal: ${result.totalDocs} documents\nPage: ${result.page} of ${result.totalPages}\n`;
            for (const doc of result.docs) {
              text += `\n\`\`\`json\n${JSON.stringify(doc, null, 2)}\n\`\`\``;
            }
            return { content: [{ type: 'text' as const, text }] };
          } catch (error) {
            return toolError(error, slug, 'find');
          }
        },
      );
    }

    if (ops.create && keyPerms?.create !== false) {
      server.tool(
        toToolName('create', slug),
        `Create a document in the ${slug} collection`,
        createParams,
        async ({ data, depth }) => {
          try {
            const result = await api.create({
              collection: slug,
              data: parseJsonObject(data, 'data'),
              depth,
              overrideAccess: false,
              user,
            });
            return {
              content: [
                {
                  type: 'text' as const,
                  text: `Created in "${slug}":\n${JSON.stringify(result, null, 2)}`,
                },
              ],
            };
          } catch (error) {
            return toolError(error, slug, 'create');
          }
        },
      );
    }

    if (ops.update && keyPerms?.update !== false) {
      server.tool(
        toToolName('update', slug),
        `Update a document in the ${slug} collection`,
        updateParams,
        async ({ id, data, where, depth }) => {
          try {
            if (id) {
              const result = await api.update({
                collection: slug,
                id,
                data: parseJsonObject(data, 'data'),
                depth,
                overrideAccess: false,
                user,
              });
              return {
                content: [
                  {
                    type: 'text' as const,
                    text: `Updated in "${slug}":\n${JSON.stringify(result, null, 2)}`,
                  },
                ],
              };
            }
            if (where) {
              const result = await api.update({
                collection: slug,
                data: parseJsonObject(data, 'data'),
                where: parseJsonObject(where, 'where'),
                depth,
                overrideAccess: false,
                user,
              });
              return {
                content: [
                  {
                    type: 'text' as const,
                    text: `Updated in "${slug}":\n${JSON.stringify(result, null, 2)}`,
                  },
                ],
              };
            }
            return {
              isError: true,
              content: [{ type: 'text' as const, text: 'Error: Either id or where is required' }],
            };
          } catch (error) {
            return toolError(error, slug, 'update');
          }
        },
      );
    }

    if (ops.delete && keyPerms?.delete !== false) {
      server.tool(
        toToolName('delete', slug),
        `Delete a document from the ${slug} collection`,
        deleteParams,
        async ({ id, where, depth }) => {
          try {
            if (id) {
              const result = await api.delete({
                collection: slug,
                id,
                depth,
                overrideAccess: false,
                user,
              });
              return {
                content: [
                  {
                    type: 'text' as const,
                    text: `Deleted from "${slug}":\n${JSON.stringify(result, null, 2)}`,
                  },
                ],
              };
            }
            if (where) {
              const result = await api.delete({
                collection: slug,
                where: parseJsonObject(where, 'where'),
                depth,
                overrideAccess: false,
                user,
              });
              return {
                content: [
                  {
                    type: 'text' as const,
                    text: `Deleted from "${slug}":\n${JSON.stringify(result, null, 2)}`,
                  },
                ],
              };
            }
            return {
              isError: true,
              content: [{ type: 'text' as const, text: 'Error: Either id or where is required' }],
            };
          } catch (error) {
            return toolError(error, slug, 'delete');
          }
        },
      );
    }
  }
}

// ---------------------------------------------------------------------------
// Tool registration — globals
// ---------------------------------------------------------------------------

function registerGlobalTools(
  server: McpServer,
  payload: BasePayload,
  user: TypedUser,
  apiKeyDoc: Record<string, unknown>,
) {
  // TODO: Remove `any` cast once Payload exposes typed API for dynamic collection access
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const api = payload as any;

  for (const [slug, ops] of Object.entries(MCP_GLOBALS)) {
    const camelSlug = toCamelCase(slug);
    const rawPerms = apiKeyDoc[camelSlug];
    const keyPerms
      = rawPerms && typeof rawPerms === 'object' && !Array.isArray(rawPerms)
        ? (rawPerms as Record<string, boolean>)
        : undefined;

    if (ops.find && keyPerms?.find !== false) {
      server.tool(
        toToolName('findGlobal', slug),
        `Get the ${slug} global configuration`,
        globalFindParams,
        async ({ depth, select }) => {
          try {
            const selectClause = select ? parseJsonObject(select, 'select') : undefined;
            const doc = await api.findGlobal({
              slug,
              depth,
              ...(selectClause && { select: selectClause }),
              overrideAccess: false,
              user,
            });
            return {
              content: [
                {
                  type: 'text' as const,
                  text: `Global "${slug}":\n${JSON.stringify(doc, null, 2)}`,
                },
              ],
            };
          } catch (error) {
            return toolError(error, slug, 'findGlobal');
          }
        },
      );
    }

    if (ops.update && keyPerms?.update !== false) {
      server.tool(
        toToolName('updateGlobal', slug),
        `Update the ${slug} global configuration`,
        globalUpdateParams,
        async ({ data, depth }) => {
          try {
            const result = await api.updateGlobal({
              slug,
              data: parseJsonObject(data, 'data'),
              depth,
              overrideAccess: false,
              user,
            });
            return {
              content: [
                {
                  type: 'text' as const,
                  text: `Updated global "${slug}":\n${JSON.stringify(result, null, 2)}`,
                },
              ],
            };
          } catch (error) {
            return toolError(error, slug, 'updateGlobal');
          }
        },
      );
    }
  }
}

// ---------------------------------------------------------------------------
// Route handlers
// ---------------------------------------------------------------------------

export async function POST(request: NextRequest) {
  const limiter = getApiRateLimiter();
  const clientIp = getClientIp(request);
  const rateLimitResult = limiter.check(clientIp);

  if (!rateLimitResult.success) {
    return NextResponse.json(
      { errors: [{ message: 'Too many requests. Try again later.' }] },
      { status: 429, headers: createRateLimitHeaders(rateLimitResult) },
    );
  }

  try {
    const auth = await authenticateApiKey(request);
    if (!auth) {
      return NextResponse.json(
        { errors: [{ message: 'Unauthorized, you must be logged in to make this request.' }] },
        { status: 401 },
      );
    }

    const { apiKeyDoc, user, payload } = auth;

    const server = new McpServer({ name: 'airbank-mcp', version: '1.0.0' });
    const transport = new WebStandardStreamableHTTPServerTransport({
      enableJsonResponse: true,
    });

    registerCollectionTools(server, payload, user, apiKeyDoc);
    registerGlobalTools(server, payload, user, apiKeyDoc);

    try {
      await server.connect(transport);
      const response = await transport.handleRequest(request);

      const rateLimitHeaders = createRateLimitHeaders(rateLimitResult);
      for (const [key, value] of Object.entries(rateLimitHeaders)) {
        response.headers.set(key, value);
      }

      return response;
    } finally {
      await transport.close?.();
      await server.close();
    }
  } catch (error) {
    console.error('[MCP] Handler error:', error);
    return NextResponse.json(
      { errors: [{ message: 'Internal MCP error' }] },
      { status: 500 },
    );
  }
}

export async function GET() {
  return NextResponse.json(
    { jsonrpc: '2.0', error: { code: -32000, message: 'Method not allowed.' }, id: null },
    { status: 405 },
  );
}

export async function DELETE() {
  return NextResponse.json(
    { jsonrpc: '2.0', error: { code: -32000, message: 'Method not allowed.' }, id: null },
    { status: 405 },
  );
}
