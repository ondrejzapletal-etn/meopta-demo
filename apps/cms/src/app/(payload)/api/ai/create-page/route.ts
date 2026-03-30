import { NextRequest, NextResponse } from 'next/server';
import { getPayload } from 'payload';

import config from '@payload-config';
import { RateLimiter, getClientIp, createRateLimitHeaders } from '../../../../../lib/rate-limit';

/**
 * POST /api/ai/create-page
 *
 * Creates a new Payload CMS page from an AI-generated draft.
 * Status is always 'draft' — never auto-published.
 * Must be explicitly approved by the user in the UI before calling this endpoint.
 *
 * Input:
 *   { title: string, slug: string, blocks: unknown[] }
 *
 * Output:
 *   { id: string | number, adminUrl: string }
 */

const createPageRateLimiter = new RateLimiter({ limit: 5, windowMs: 60 * 1000 });

export async function POST(req: NextRequest): Promise<NextResponse> {
    // --- AI layout validation: kontrola povinných polí v blocích ---
    if (Array.isArray(blocks)) {
      for (let i = 0; i < blocks.length; i++) {
        const block = blocks[i];
        if (block && typeof block === 'object' && 'blockType' in block) {
          // Hero Plain Block: vyžaduje title
          if (block.blockType === 'heroPlainBlock') {
            if (!('title' in block) || typeof block.title !== 'string' || !block.title.trim()) {
              return NextResponse.json(
                { error: `Chybí povinné pole 'title' v bloku Hero Plain Block (blok #${i + 1}).` },
                { status: 400, headers: rlHeaders },
              );
            }
          }
          // Zde lze přidat další validace pro jiné bloky...
        }
      }
    }
  const ip = getClientIp(req);
  const rl = createPageRateLimiter.check(ip);
  const rlHeaders = createRateLimitHeaders(rl);

  if (!rl.success) {
    return NextResponse.json(
      { error: 'Too many page creation requests. Please wait.' },
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

  const { title, slug, blocks = [] } = body as Record<string, unknown>;


  if (typeof title !== 'string' || !title.trim()) {
    return NextResponse.json({ error: '`title` is required.' }, { status: 400, headers: rlHeaders });
  }

  if (typeof slug !== 'string' || !slug.trim()) {
    return NextResponse.json({ error: `Slug je prázdný nebo neplatný. Zadaný slug: '${slug ?? ''}'` }, { status: 400, headers: rlHeaders });
  }

  // Sanitize slug: lowercase, hyphens only
  const sanitizedSlug = slug
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .slice(0, 100);

  try {
    const page = await payload.create({
      collection: 'pages',
      data: {
        title: title.trim(),
        slug: sanitizedSlug,
        layout: Array.isArray(blocks) ? blocks : [],
        _status: 'draft',
      },
      overrideAccess: false,
      user,
    });

    const cmsUrl = process.env.CMS_URL ?? 'http://localhost:3001';
    const adminUrl = `${cmsUrl}/admin/collections/pages/${page.id}`;

    return NextResponse.json({ id: page.id, adminUrl }, { headers: rlHeaders });
  } catch (err: any) {
    console.error('[AI] create-page failed:', err);
    let errorMsg = `Nepodařilo se vytvořit stránku. Slug: '${slug}'.`;
    // Pokud je v err.errors detailní info, vypiš ji
    if (err?.errors && Array.isArray(err.errors)) {
      const slugError = err.errors.find((e: any) => (e?.message || '').toLowerCase().includes('slug') || (e?.field || '').toLowerCase().includes('slug'));
      if (slugError) {
        errorMsg = `Chyba slugu: '${slug}'. Detail: ${slugError.message || JSON.stringify(slugError)}`;
      }
    } else if (err?.message && (err.message.toLowerCase().includes('duplicate') || err.message.toLowerCase().includes('slug') || err.message.toLowerCase().includes('unique'))) {
      errorMsg = `Duplicitní nebo neplatný slug: '${slug}'. Detail: ${err.message}`;
    } else if (err?.status === 400) {
      errorMsg = `Chyba validace (400) při vytváření stránky. Slug: '${slug}'. Detail: ${err.message || JSON.stringify(err)}`;
    }
    return NextResponse.json(
      { error: errorMsg },
      { status: 500, headers: rlHeaders },
    );
  }
}
