import { NextRequest, NextResponse } from 'next/server';
import { getPayload } from 'payload';

import config from '@payload-config';
import { getDocumentContext } from '../../../../../ai/context/getCurrentDocumentContext';
import { routeChat } from '../../../../../ai/orchestrator/chatRouter';
import type { ChatMessage } from '../../../../../ai/orchestrator/chatRouter';
import { RateLimiter, getClientIp, createRateLimitHeaders } from '../../../../../lib/rate-limit';

/**
 * POST /api/ai/chat
 *
 * Authenticated AI chat endpoint. Detects user intent, loads relevant context,
 * routes to the appropriate agent, and returns a structured response.
 *
 * Input:
 *   { message: string, history: ChatMessage[], currentDocumentId?: string, collection?: string }
 *
 * Output:
 *   { role: 'assistant', content: string, type: 'text' | 'page-creation-preview', previewData?: unknown, timestamp: string }
 */

const chatRateLimiter = new RateLimiter({ limit: 20, windowMs: 60 * 1000 });

export async function POST(req: NextRequest): Promise<NextResponse> {
  const ip = getClientIp(req);
  const rl = chatRateLimiter.check(ip);
  const rlHeaders = createRateLimitHeaders(rl);

  if (!rl.success) {
    return NextResponse.json(
      { error: 'Too many requests. Please wait before sending another message.' },
      { status: 429, headers: rlHeaders },
    );
  }

  const payload = await getPayload({ config });
  const { user } = await payload.auth({ headers: req.headers });

  if (!user) {
    return NextResponse.json(
      { error: 'Unauthorized. Please log in.' },
      { status: 401, headers: rlHeaders },
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body.' }, { status: 400, headers: rlHeaders });
  }

  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return NextResponse.json(
      { error: 'Request body must be a JSON object.' },
      { status: 400, headers: rlHeaders },
    );
  }

  const {
    message,
    history = [],
    currentDocumentId,
    collection,
  } = body as Record<string, unknown>;

  if (typeof message !== 'string' || !message.trim()) {
    return NextResponse.json(
      { error: '`message` is required.' },
      { status: 400, headers: rlHeaders },
    );
  }

  // Load document context if available
  let docContext = null;
  if (
    typeof currentDocumentId === 'string'
    && currentDocumentId
    && typeof collection === 'string'
    && collection
    && collection !== 'globals'
  ) {
    docContext = await getDocumentContext(payload, currentDocumentId, collection);
  }

  // Load business context global (relevant subset only)
  let businessContext = '';
  try {
    const bc = (await payload.findGlobal({
      slug: 'business-context',
      overrideAccess: true,
    })) as Record<string, unknown>;

    const parts: string[] = [];
    if (bc.companyName) parts.push(`Company: ${bc.companyName}`);
    if (bc.businessDescription) parts.push(`Business: ${bc.businessDescription}`);
    if (bc.brandVoice) parts.push(`Brand voice: ${bc.brandVoice}`);
    if (bc.forbiddenPhrases) parts.push(`Forbidden: ${bc.forbiddenPhrases}`);
    if (bc.editorialRules) parts.push(`Rules: ${bc.editorialRules}`);
    businessContext = parts.join('\n');
  } catch {
    // Business context is optional — silently skip if not configured
  }

  const result = await routeChat({
    message: message.trim(),
    history: Array.isArray(history) ? (history as ChatMessage[]) : [],
    docContext,
    businessContext,
    payload,
    locale: 'cs',
  });

  return NextResponse.json(
    {
      role: 'assistant',
      content: result.content,
      type: result.type,
      previewData: result.previewData ?? null,
      timestamp: new Date().toISOString(),
    },
    { headers: rlHeaders },
  );
}
