import { NextRequest, NextResponse } from 'next/server';
import { getPayload } from 'payload';

import config from '@payload-config';
import { prepareDocumentContext } from '../../../../lib/ai/extract-content';
import { generateMetaDescription } from '../../../../lib/ai/generate-meta-description';
import { RateLimiter, getClientIp, createRateLimitHeaders } from '../../../../lib/rate-limit';

/**
 * /api/ai — Generic AI action endpoint for the Payload CMS admin UI.
 *
 * Authentication: Payload admin session cookie (same as standard admin login).
 * Rate limit:     20 AI requests per minute per IP (LLM calls are expensive).
 *
 * Supported actions:
 *   - generate-meta-description
 *
 * Designed to be extended: add new actions as the AI toolset grows.
 */

// ---------------------------------------------------------------------------
// Rate limiter – tighter than MCP (20/min vs 100/min)
// ---------------------------------------------------------------------------
const aiRateLimiter = new RateLimiter({ limit: 20, windowMs: 60 * 1000 });

// ---------------------------------------------------------------------------
// Action registry
// ---------------------------------------------------------------------------

type ActionHandler = (
  doc: Record<string, unknown>,
  collectionSlug: string,
  locale: string,
) => Promise<string>;

const ACTION_HANDLERS: Record<string, ActionHandler> = {
  'generate-meta-description': async (doc, collectionSlug, locale) => {
    const textContent = prepareDocumentContext(doc, collectionSlug);
    return generateMetaDescription({ title: String(doc.title ?? ''), textContent, locale });
  },
};

// ---------------------------------------------------------------------------
// Route handler
// ---------------------------------------------------------------------------

export async function POST(req: NextRequest): Promise<NextResponse> {
  // --- Rate limit ---
  const ip = getClientIp(req);
  const rl = aiRateLimiter.check(ip);
  const rlHeaders = createRateLimitHeaders(rl);

  if (!rl.success) {
    return NextResponse.json(
      { error: 'Too many requests. Please wait before generating again.' },
      { status: 429, headers: rlHeaders },
    );
  }

  // --- Auth: require a valid Payload admin session ---
  const payload = await getPayload({ config });
  const { user } = await payload.auth({ headers: req.headers });

  if (!user) {
    return NextResponse.json(
      { error: 'Unauthorized. Please log in to the CMS admin.' },
      { status: 401, headers: rlHeaders },
    );
  }

  // --- Parse & validate request body ---
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body.' }, { status: 400, headers: rlHeaders });
  }

  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return NextResponse.json({ error: 'Request body must be a JSON object.' }, { status: 400, headers: rlHeaders });
  }

  const { action, docId, collectionSlug, locale = 'cs' } = body as Record<string, unknown>;

  if (typeof action !== 'string' || !action) {
    return NextResponse.json({ error: '`action` is required.' }, { status: 400, headers: rlHeaders });
  }

  if (typeof collectionSlug !== 'string' || !collectionSlug) {
    return NextResponse.json({ error: '`collectionSlug` is required.' }, { status: 400, headers: rlHeaders });
  }

  if (!docId || (typeof docId !== 'string' && typeof docId !== 'number')) {
    return NextResponse.json({ error: '`docId` is required.' }, { status: 400, headers: rlHeaders });
  }

  const handler = ACTION_HANDLERS[action];
  if (!handler) {
    return NextResponse.json(
      { error: `Unknown action "${action}". Supported: ${Object.keys(ACTION_HANDLERS).join(', ')}` },
      { status: 400, headers: rlHeaders },
    );
  }

  // --- Fetch the document ---
  let doc: Record<string, unknown>;
  try {
    const result = await payload.findByID({
      collection: collectionSlug as Parameters<typeof payload.findByID>[0]['collection'],
      id: docId as string,
      depth: 2,
      draft: true,
    });
    doc = result as unknown as Record<string, unknown>;
  } catch (err) {
    console.error(`[AI] Failed to fetch doc ${collectionSlug}/${docId}:`, err);
    return NextResponse.json(
      { error: `Document not found: ${collectionSlug}/${docId}` },
      { status: 404, headers: rlHeaders },
    );
  }

  // --- Run AI action ---
  try {
    const result = await handler(doc, collectionSlug, String(locale));
    return NextResponse.json({ result }, { status: 200, headers: rlHeaders });
  } catch (err) {
    console.error(`[AI] Action "${action}" failed:`, err);
    return NextResponse.json(
      { error: 'AI generation failed. Check OPENAI_API_KEY and try again.' },
      { status: 500, headers: rlHeaders },
    );
  }
}
