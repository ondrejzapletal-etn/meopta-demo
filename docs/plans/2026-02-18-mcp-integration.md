# MCP Integration Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add Model Context Protocol (MCP) support to the Airbank CMS so AI agents (Claude Code, Cursor, etc.) can read and modify CMS content via a standards-compliant MCP endpoint.

**Architecture:** Custom MCP route handler at `/api/mcp` using `@modelcontextprotocol/sdk`'s `WebStandardStreamableHTTPServerTransport` (bypasses the broken `mcp-handler` adapter). Per-request stateless design — new `McpServer` + transport per request. Bearer token auth via the MCP plugin's `payload-mcp-api-keys` collection with HMAC-SHA256 hashing. In-memory sliding-window rate limiting (100 req/min per IP).

**Tech Stack:** Payload CMS 3.76.1, `@payloadcms/plugin-mcp@3.76.1`, `@modelcontextprotocol/sdk@1.26.0`, Vitest for tests, Zod for parameter validation.

**Reference Implementation:** `/Users/vladimir.beran/Documents/Cursor/kamdu/src/app/api/mcp/route.ts` and `kamdu/src/lib/rate-limit.ts`

---

## Task 1: Set Up Vitest Test Infrastructure

The CMS has zero tests (`"test": "echo \"No tests so far.\"`). We need vitest before writing any code.

**Files:**
- Modify: `apps/cms/package.json` (add vitest deps, update test script)
- Create: `apps/cms/vitest.config.ts`
- Create: `apps/cms/src/lib/__tests__/rate-limit.test.ts` (placeholder to verify setup)

**Step 1: Install vitest**

```bash
npm install --save-dev vitest @vitest/coverage-v8 --workspace=apps/cms
```

**Step 2: Create vitest config**

Create `apps/cms/vitest.config.ts`:

```typescript
import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['src/**/__tests__/**/*.test.ts'],
    coverage: {
      provider: 'v8',
      include: ['src/lib/**/*.ts'],
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
});
```

**Step 3: Update test script in package.json**

Change `"test": "echo \"No tests so far.\""` to `"test": "vitest run"`.

**Step 4: Create placeholder test**

Create `apps/cms/src/lib/__tests__/rate-limit.test.ts`:

```typescript
import { describe, it, expect } from 'vitest';

describe('rate-limit (placeholder)', () => {
  it('should be replaced by real tests', () => {
    expect(true).toBe(true);
  });
});
```

**Step 5: Run to verify setup**

```bash
npm test --workspace=apps/cms
```

Expected: 1 test passes.

**Step 6: Commit**

```bash
git add apps/cms/package.json apps/cms/vitest.config.ts apps/cms/src/lib/__tests__/rate-limit.test.ts
git commit -m "chore: set up vitest test infrastructure for CMS"
```

---

## Task 2: Implement Rate Limiter with TDD

Adapted from kamdu's `src/lib/rate-limit.ts`. We only need the `RateLimiter` class (sliding window), `getClientIp`, `createRateLimitHeaders`, and `getApiRateLimiter` singleton. Skip `AccountLockout` (not needed for MCP).

**Files:**
- Create: `apps/cms/src/lib/rate-limit.ts`
- Replace: `apps/cms/src/lib/__tests__/rate-limit.test.ts`

**Step 1: Write the failing tests**

Replace `apps/cms/src/lib/__tests__/rate-limit.test.ts` with:

```typescript
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// Will import from the module we're about to create
import {
  getApiRateLimiter,
  getClientIp,
  createRateLimitHeaders,
  RATE_LIMITS,
} from '../rate-limit';

describe('rate-limit', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  describe('RateLimiter via getApiRateLimiter', () => {
    it('allows requests under the limit', () => {
      const limiter = getApiRateLimiter();
      const result = limiter.check('test-ip');
      expect(result.success).toBe(true);
      expect(result.remaining).toBe(RATE_LIMITS.api.limit - 1);
    });

    it('blocks after limit is exceeded', () => {
      const limiter = getApiRateLimiter();
      for (let i = 0; i < RATE_LIMITS.api.limit; i++) {
        limiter.check('flood-ip');
      }
      const blocked = limiter.check('flood-ip');
      expect(blocked.success).toBe(false);
      expect(blocked.remaining).toBe(0);
    });

    it('allows requests from different IPs independently', () => {
      const limiter = getApiRateLimiter();
      for (let i = 0; i < RATE_LIMITS.api.limit; i++) {
        limiter.check('ip-a');
      }
      const resultB = limiter.check('ip-b');
      expect(resultB.success).toBe(true);
    });

    it('resets after window expires', () => {
      const limiter = getApiRateLimiter();
      for (let i = 0; i < RATE_LIMITS.api.limit; i++) {
        limiter.check('reset-ip');
      }
      expect(limiter.check('reset-ip').success).toBe(false);

      // Advance past the window
      vi.advanceTimersByTime(RATE_LIMITS.api.windowMs + 1);

      expect(limiter.check('reset-ip').success).toBe(true);
    });
  });

  describe('getClientIp', () => {
    it('extracts IP from x-forwarded-for (first value)', () => {
      const request = new Request('http://localhost', {
        headers: { 'x-forwarded-for': '1.2.3.4, 5.6.7.8' },
      });
      expect(getClientIp(request)).toBe('1.2.3.4');
    });

    it('falls back to x-real-ip', () => {
      const request = new Request('http://localhost', {
        headers: { 'x-real-ip': '9.8.7.6' },
      });
      expect(getClientIp(request)).toBe('9.8.7.6');
    });

    it('returns unknown when no proxy headers', () => {
      const request = new Request('http://localhost');
      expect(getClientIp(request)).toBe('unknown');
    });
  });

  describe('createRateLimitHeaders', () => {
    it('includes standard rate limit headers on success', () => {
      const headers = createRateLimitHeaders({
        success: true,
        limit: 100,
        remaining: 99,
        resetAt: 1700000000000,
      });
      expect(headers['X-RateLimit-Limit']).toBe('100');
      expect(headers['X-RateLimit-Remaining']).toBe('99');
    });

    it('includes Retry-After on failure', () => {
      const now = Date.now();
      const headers = createRateLimitHeaders({
        success: false,
        limit: 100,
        remaining: 0,
        resetAt: now + 30000,
      });
      expect(headers['Retry-After']).toBeDefined();
    });
  });
});
```

**Step 2: Run tests — they should fail**

```bash
npm test --workspace=apps/cms
```

Expected: FAIL — module `../rate-limit` does not exist.

**Step 3: Implement rate-limit.ts**

Create `apps/cms/src/lib/rate-limit.ts`:

```typescript
/**
 * In-memory rate limiter with sliding window algorithm.
 * No external dependencies — suitable for single-instance deployments.
 *
 * Adapted from kamdu project reference implementation.
 */

interface RateLimitRecord {
  count: number;
  timestamps: number[];
  lastAccess: number;
}

interface RateLimitConfig {
  limit: number;
  windowMs: number;
}

export interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  resetAt: number;
}

export const RATE_LIMITS = {
  api: { limit: 100, windowMs: 60 * 1000 },
} as const;

export class RateLimiter {
  private store = new Map<string, RateLimitRecord>();
  private config: RateLimitConfig;
  private maxEntries: number;
  private cleanupInterval: ReturnType<typeof setInterval> | null = null;

  constructor(config: RateLimitConfig, maxEntries = 10000) {
    this.config = config;
    this.maxEntries = maxEntries;
    this.startCleanup();
  }

  check(identifier: string): RateLimitResult {
    const now = Date.now();
    const windowStart = now - this.config.windowMs;

    let record = this.store.get(identifier);

    if (!record) {
      record = { count: 0, timestamps: [], lastAccess: now };
      this.store.set(identifier, record);
    }

    record.lastAccess = now;
    record.timestamps = record.timestamps.filter((ts) => ts > windowStart);
    record.count = record.timestamps.length;

    if (record.count >= this.config.limit) {
      const oldestInWindow = Math.min(...record.timestamps);
      const resetAt = oldestInWindow + this.config.windowMs;
      return { success: false, limit: this.config.limit, remaining: 0, resetAt };
    }

    record.timestamps.push(now);
    record.count = record.timestamps.length;

    if (this.store.size > this.maxEntries) {
      this.evictOldest();
    }

    return {
      success: true,
      limit: this.config.limit,
      remaining: this.config.limit - record.count,
      resetAt: now + this.config.windowMs,
    };
  }

  private evictOldest(): void {
    const entries = Array.from(this.store.entries());
    entries.sort((a, b) => a[1].lastAccess - b[1].lastAccess);
    const toRemove = Math.ceil(this.maxEntries * 0.1);
    for (let i = 0; i < toRemove && i < entries.length; i++) {
      this.store.delete(entries[i][0]);
    }
  }

  private startCleanup(): void {
    this.cleanupInterval = setInterval(() => {
      const now = Date.now();
      const windowStart = now - this.config.windowMs;
      for (const [key, record] of this.store.entries()) {
        record.timestamps = record.timestamps.filter((ts) => ts > windowStart);
        if (record.timestamps.length === 0) {
          this.store.delete(key);
        }
      }
    }, 60 * 1000);

    if (this.cleanupInterval.unref) {
      this.cleanupInterval.unref();
    }
  }

  get size(): number {
    return this.store.size;
  }
}

// Singleton
let apiLimiter: RateLimiter | null = null;

export function getApiRateLimiter(): RateLimiter {
  if (!apiLimiter) {
    apiLimiter = new RateLimiter(RATE_LIMITS.api);
  }
  return apiLimiter;
}

export function getClientIp(request: Request): string {
  const forwardedFor = request.headers.get('x-forwarded-for');
  if (forwardedFor) {
    return forwardedFor.split(',')[0].trim();
  }
  const realIp = request.headers.get('x-real-ip');
  if (realIp) {
    return realIp;
  }
  return 'unknown';
}

export function createRateLimitHeaders(result: RateLimitResult): Record<string, string> {
  return {
    'X-RateLimit-Limit': result.limit.toString(),
    'X-RateLimit-Remaining': result.remaining.toString(),
    'X-RateLimit-Reset': Math.ceil(result.resetAt / 1000).toString(),
    ...(result.success
      ? {}
      : { 'Retry-After': Math.ceil((result.resetAt - Date.now()) / 1000).toString() }),
  };
}
```

**Step 4: Run tests — they should pass**

```bash
npm test --workspace=apps/cms
```

Expected: All tests PASS.

**Step 5: Commit**

```bash
git add apps/cms/src/lib/rate-limit.ts apps/cms/src/lib/__tests__/rate-limit.test.ts
git commit -m "feat: add sliding-window rate limiter with tests"
```

---

## Task 3: Update CMS Middleware — Exempt MCP Path from Basic Auth

The middleware at `apps/cms/src/middleware.ts` checks HTTP Basic Auth on all requests except `/api/health/live` and JWT-auth headers. MCP clients send `Bearer <api-key>` headers. We need to:
1. Exempt `/api/mcp` from Basic Auth entirely (it has its own auth)
2. Allow `Bearer` auth headers through (not just `JWT`)

**Files:**
- Modify: `apps/cms/src/middleware.ts:4-29`

**Step 1: Modify the checkBasicAuth function**

In `apps/cms/src/middleware.ts`, update `checkBasicAuth` to add MCP exemptions:

```typescript
function checkBasicAuth(request: NextRequest): NextResponse | null {
  const user = process.env.HTTP_BASIC_USER;
  const password = process.env.HTTP_BASIC_PASSWORD;

  if (!user || !password) return null;
  if (request.nextUrl.pathname === '/api/health/live') return null;
  // MCP endpoint has its own auth (Bearer API key)
  if (request.nextUrl.pathname === '/api/mcp') return null;

  const authHeader = request.headers.get('authorization');

  // Allow JWT auth through (Payload CMS API clients)
  if (authHeader?.startsWith('JWT ')) return null;
  // Allow Bearer auth through (MCP and API key clients)
  if (authHeader?.startsWith('Bearer ')) return null;

  // Check Basic Auth
  if (authHeader?.startsWith('Basic ')) {
    const decoded = atob(authHeader.slice(6));
    const sep = decoded.indexOf(':');
    if (sep !== -1 && decoded.slice(0, sep) === user && decoded.slice(sep + 1) === password) {
      return null;
    }
  }

  return new NextResponse('Authentication required', {
    status: 401,
    headers: { 'WWW-Authenticate': 'Basic realm="Airbank CMS"' },
  });
}
```

**Step 2: Verify TypeScript compiles**

```bash
npm run tsc --workspace=apps/cms
```

Expected: No errors.

**Step 3: Commit**

```bash
git add apps/cms/src/middleware.ts
git commit -m "feat: exempt /api/mcp and Bearer auth from HTTP Basic Auth"
```

---

## Task 4: Upgrade Payload CMS to 3.76.1

The MCP plugin requires Payload 3.76.1+. Current version is 3.49.1 (27 minor versions behind). All `@payloadcms/*` packages must be upgraded together.

**Files:**
- Modify: `apps/cms/package.json` (bump all @payloadcms/* deps to 3.76.1)

**Step 1: Update all Payload packages**

```bash
cd /Users/vladimir.beran/Documents/Cursor/airbank-demo
npm install \
  payload@3.76.1 \
  @payloadcms/db-postgres@3.76.1 \
  @payloadcms/next@3.76.1 \
  @payloadcms/plugin-nested-docs@3.76.1 \
  @payloadcms/plugin-redirects@3.76.1 \
  @payloadcms/plugin-search@3.76.1 \
  @payloadcms/plugin-seo@3.76.1 \
  @payloadcms/storage-azure@3.76.1 \
  @payloadcms/richtext-lexical@3.76.1 \
  @payloadcms/ui@3.76.1 \
  --workspace=apps/cms
```

**Step 2: Verify TypeScript compiles**

```bash
npm run tsc
```

Expected: No errors (or only pre-existing ones). If there are breaking changes, fix them before proceeding.

**Step 3: Verify lint passes**

```bash
npm run lint --workspace=apps/cms
```

**Step 4: Commit**

```bash
git add apps/cms/package.json package-lock.json
git commit -m "chore: upgrade Payload CMS from 3.49.1 to 3.76.1"
```

> **WARNING:** This is the highest-risk task. If 3.76.1 introduces breaking API changes, you may need to fix them. Check the Payload changelog for 3.49.1→3.76.1 breaking changes. If the upgrade is too disruptive, consider an intermediate version that still satisfies `@payloadcms/plugin-mcp` peer deps.

---

## Task 5: Install MCP Dependencies

**Files:**
- Modify: `apps/cms/package.json`

**Step 1: Install MCP plugin and SDK**

```bash
npm install \
  @payloadcms/plugin-mcp@3.76.1 \
  @modelcontextprotocol/sdk@1.26.0 \
  --workspace=apps/cms
```

**Step 2: Verify install succeeded**

```bash
npm run tsc --workspace=apps/cms
```

**Step 3: Commit**

```bash
git add apps/cms/package.json package-lock.json
git commit -m "chore: install @payloadcms/plugin-mcp and @modelcontextprotocol/sdk"
```

---

## Task 6: Configure MCP Plugin in payload.config.ts

Register the MCP plugin with all content collections enabled for read, and limited write for safe collections.

**Files:**
- Modify: `apps/cms/src/payload.config.ts`

**Step 1: Add MCP plugin import and configuration**

Add to imports:

```typescript
import { mcpPlugin } from '@payloadcms/plugin-mcp';
```

Add to the plugins array (before `...azureStoragePlugin`):

```typescript
mcpPlugin({
  collections: {
    pages: { enabled: true },
    articles: { enabled: true },
    media: { enabled: { find: true, create: true } },
    assets: { enabled: { find: true } },
    categories: { enabled: true },
  },
}),
```

Also add `@payloadcms/translations/languages/cs` import if not present (already there).

**Step 2: Run type generation**

```bash
npm run cms:generate
```

This will update `packages/shared/src/payload-types.ts` with the new `payload-mcp-api-keys` collection type.

**Step 3: Verify TypeScript compiles**

```bash
npm run tsc
```

**Step 4: Commit**

```bash
git add apps/cms/src/payload.config.ts packages/shared/src/payload-types.ts
git commit -m "feat: configure @payloadcms/plugin-mcp with collection permissions"
```

---

## Task 7: Create Custom MCP Route Handler

This is the core implementation. The route at `apps/cms/src/app/(payload)/api/mcp/route.ts` intercepts MCP requests before the `[...slug]` catch-all.

**Files:**
- Create: `apps/cms/src/app/(payload)/api/mcp/route.ts`

**Step 1: Create the MCP route handler**

Create `apps/cms/src/app/(payload)/api/mcp/route.ts`:

```typescript
import crypto from 'node:crypto';

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { WebStandardStreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/webStandardStreamableHttp.js';
import { NextRequest, NextResponse } from 'next/server';
import { getPayload, type BasePayload, type TypedUser } from 'payload';
import { z } from 'zod';

import config from '@payload-config';
import {
  getApiRateLimiter,
  getClientIp,
  createRateLimitHeaders,
} from '@/lib/rate-limit';

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
// Collection config — must stay in sync with mcpPlugin({ collections })
// in payload.config.ts
// ---------------------------------------------------------------------------

type CollectionOps = { find?: boolean; create?: boolean; update?: boolean; delete?: boolean };

const MCP_COLLECTIONS: Record<string, CollectionOps> = {
  pages: { find: true, create: true, update: true, delete: true },
  articles: { find: true, create: true, update: true, delete: true },
  media: { find: true, create: true },
  assets: { find: true },
  categories: { find: true, create: true, update: true, delete: true },
};

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
    .describe('Maximum number of documents to return (default: 10, max: 100)'),
  page: z
    .number()
    .int()
    .min(1)
    .optional()
    .default(1)
    .describe('Page number for pagination (default: 1)'),
  sort: z.string().optional().describe('Field to sort by (prefix with - for descending)'),
  where: z.string().optional().describe('JSON string for where clause filtering'),
  select: z.string().optional().describe('JSON string defining which fields to return'),
  depth: z
    .number()
    .int()
    .min(0)
    .max(10)
    .optional()
    .default(0)
    .describe('Relationship population depth (default: 0)'),
};

const createParams = {
  data: z.string().describe('JSON string containing the data for the new document'),
  depth: z
    .number()
    .int()
    .min(0)
    .max(10)
    .optional()
    .default(0)
    .describe('Relationship population depth in response (default: 0)'),
};

const updateParams = {
  id: z.union([z.string(), z.number()]).optional().describe('Document ID to update'),
  data: z.string().describe('JSON string containing the update data'),
  where: z.string().optional().describe('JSON where clause to update multiple documents'),
  depth: z.number().int().min(0).max(10).optional().default(0).describe('Population depth'),
};

const deleteParams = {
  id: z.union([z.string(), z.number()]).optional().describe('Document ID to delete'),
  where: z.string().optional().describe('JSON where clause to delete multiple documents'),
  depth: z.number().int().min(0).max(10).optional().default(0).describe('Population depth'),
};

// ---------------------------------------------------------------------------
// Auth — validate Bearer API key (HMAC-SHA256 against payload-mcp-api-keys)
// ---------------------------------------------------------------------------

async function authenticateApiKey(request: NextRequest) {
  const payload = await getPayload({ config });

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

  const sha256 = crypto.createHmac('sha256', payload.secret).update(apiKey).digest('hex');

  const { docs } = await payload.find({
    collection: 'payload-mcp-api-keys' as string as 'users',
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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (user as any)._strategy = 'mcp-api-key';

  return { apiKeyDoc, user, payload };
}

// ---------------------------------------------------------------------------
// Tool registration
// ---------------------------------------------------------------------------

function registerTools(
  server: McpServer,
  payload: BasePayload,
  user: TypedUser,
  apiKeyDoc: Record<string, unknown>,
) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const api = payload as any;

  for (const [slug, ops] of Object.entries(MCP_COLLECTIONS)) {
    const camelSlug = toCamelCase(slug);
    const keyPerms = apiKeyDoc[camelSlug] as Record<string, boolean> | undefined;

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

    registerTools(server, payload, user, apiKeyDoc);

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
```

**Step 2: Verify TypeScript compiles**

```bash
npm run tsc --workspace=apps/cms
```

**Step 3: Verify lint passes**

```bash
npm run lint --workspace=apps/cms
```

**Step 4: Commit**

```bash
git add apps/cms/src/app/\(payload\)/api/mcp/route.ts
git commit -m "feat: add custom MCP route handler with auth and rate limiting"
```

---

## Task 8: Add MCP Config Files for IDE Integration

Create config files so Claude Code, Cursor, and other MCP clients can auto-discover the endpoint.

**Files:**
- Create: `.mcp.json` (root — Claude Code)
- Create: `.cursor/mcp.json` (Cursor IDE)

**Step 1: Create `.mcp.json`**

```json
{
  "mcpServers": {
    "airbank-cms": {
      "type": "streamable-http",
      "url": "http://localhost:3001/api/mcp",
      "note": "Start CMS first: npm run cms:dev. Create an MCP API key in /admin → MCP API Keys."
    }
  }
}
```

**Step 2: Create `.cursor/mcp.json`**

```json
{
  "mcpServers": {
    "airbank-cms": {
      "type": "streamable-http",
      "url": "http://localhost:3001/api/mcp",
      "note": "Start CMS first: npm run cms:dev. Create an MCP API key in /admin → MCP API Keys."
    }
  }
}
```

**Step 3: Commit**

```bash
git add .mcp.json .cursor/mcp.json
git commit -m "feat: add MCP config files for Claude Code and Cursor IDE"
```

---

## Task 9: Update CLAUDE.md with MCP Documentation

Add an MCP section to `CLAUDE.md` so future Claude sessions know about the MCP endpoint.

**Files:**
- Modify: `CLAUDE.md`

**Step 1: Add MCP section**

Add after the "Observability & Instrumentation" section:

```markdown
## MCP (Model Context Protocol) Integration

**Endpoint:** `POST /api/mcp` (CMS, port 3001)

**Authentication:** Bearer token via MCP API key. Create keys in CMS admin → MCP API Keys collection.

**Available collections via MCP:**
| Collection | Find | Create | Update | Delete |
|-----------|------|--------|--------|--------|
| pages | Yes | Yes | Yes | Yes |
| articles | Yes | Yes | Yes | Yes |
| media | Yes | Yes | No | No |
| assets | Yes | No | No | No |
| categories | Yes | Yes | Yes | Yes |

**Architecture:**
- Custom route handler bypasses broken `mcp-handler` adapter
- Per-request stateless design (new McpServer per request)
- In-memory sliding-window rate limiter (100 req/min per IP)
- HMAC-SHA256 API key authentication via `payload-mcp-api-keys` collection

**IDE configuration:**
- Claude Code: `.mcp.json` in project root
- Cursor: `.cursor/mcp.json`

**Testing locally:**
1. Start CMS: `npm run cms:dev`
2. Create MCP API key in admin panel
3. Test with curl:
   ```bash
   curl -X POST http://localhost:3001/api/mcp \
     -H "Authorization: Bearer YOUR_API_KEY" \
     -H "Content-Type: application/json" \
     -d '{"jsonrpc":"2.0","method":"tools/list","id":1}'
   ```
```

**Step 2: Commit**

```bash
git add CLAUDE.md
git commit -m "docs: add MCP integration section to CLAUDE.md"
```

---

## Task 10: Update Deploy Workflow — Add MCP Health Check

The deploy workflow should verify MCP endpoint is accessible after deployment.

**Files:**
- Modify: `.github/workflows/deploy-azure.yml`

**Step 1: Add MCP health check step**

Add after "Verify FE health" step, before "Deployment summary":

```yaml
      - name: Verify MCP endpoint
        run: |
          # MCP should return 401 without auth (not 500/404)
          STATUS=$(curl -sf -o /dev/null -w "%{http_code}" \
            -X POST "https://${{ steps.cms-fqdn.outputs.fqdn }}/api/mcp" \
            -H "Content-Type: application/json" \
            -d '{"jsonrpc":"2.0","method":"tools/list","id":1}' \
            2>/dev/null || echo "000")
          if [ "$STATUS" = "401" ]; then
            echo "MCP endpoint responding correctly (401 without auth)"
          else
            echo "WARNING: MCP endpoint returned unexpected status: $STATUS"
          fi
```

**Step 2: Add MCP URL to deployment summary**

Update the summary table to include MCP endpoint.

**Step 3: Commit**

```bash
git add .github/workflows/deploy-azure.yml
git commit -m "feat: add MCP endpoint verification to deploy workflow"
```

---

## Task 11: Local Integration Test

Start the CMS locally and verify the MCP endpoint works end-to-end.

**Step 1: Ensure PostgreSQL is running**

```bash
docker-compose up postgres -d
```

**Step 2: Start CMS**

```bash
npm run cms:dev
```

**Step 3: Verify MCP returns 401 without auth**

```bash
curl -v -X POST http://localhost:3001/api/mcp \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","method":"tools/list","id":1}'
```

Expected: HTTP 401 with `{"errors":[{"message":"Unauthorized..."}]}`

**Step 4: Verify GET returns 405**

```bash
curl -v http://localhost:3001/api/mcp
```

Expected: HTTP 405

**Step 5: (If admin user exists) Create MCP API key and test authenticated request**

1. Go to `http://localhost:3001/admin`
2. Navigate to MCP API Keys collection
3. Create a new key
4. Copy the API key
5. Test:

```bash
curl -X POST http://localhost:3001/api/mcp \
  -H "Authorization: Bearer YOUR_KEY" \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","method":"tools/list","id":1}'
```

Expected: JSON response listing available MCP tools.

**Step 6: Run full validation**

```bash
npm run tsc
npm run lint
npm test --workspace=apps/cms
```

All should pass.

---

## Task 12: Final Commit and Push

**Step 1: Review all changes**

```bash
git diff main --stat
```

**Step 2: Push branch**

```bash
git push -u origin feature/issue-22-mcp-integration
```

**Step 3: Create PR**

```bash
gh pr create --base main \
  --title "feat: add MCP (Model Context Protocol) integration" \
  --body "Closes #22

## Changes
- Set up vitest test infrastructure for CMS
- Added sliding-window rate limiter with tests
- Updated middleware to exempt MCP endpoint from Basic Auth
- Upgraded Payload CMS from 3.49.1 to 3.76.1
- Installed @payloadcms/plugin-mcp and @modelcontextprotocol/sdk
- Configured MCP plugin with collection permissions
- Created custom MCP route handler with auth and rate limiting
- Added IDE config files (.mcp.json, .cursor/mcp.json)
- Updated CLAUDE.md with MCP documentation
- Added MCP health check to deploy workflow

## Verification
- [x] TypeScript passes
- [x] ESLint passes
- [x] Rate limiter tests pass
- [x] MCP endpoint returns 401 without auth
- [x] MCP endpoint returns tools list with valid auth
- [x] All issue requirements addressed"
```
