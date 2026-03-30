import type { Payload } from 'payload';
import { extractTextFromBlocks, extractTextFromLexical } from '../../lib/ai/extract-content';

export interface DocumentContext {
  id: string;
  collection: string;
  title: string;
  slug?: string;
  metaDescription?: string;
  contentSummary: string;
}

/**
 * Loads and extracts context from a Payload document (page or article)
 * for use as AI prompt context.
 *
 * Max output: ~1200 chars of content summary (token budget).
 */
export async function getDocumentContext(
  payload: Payload,
  docId: string,
  collection: string,
): Promise<DocumentContext | null> {
  try {
    const doc = await payload.findByID({
      collection,
      id: docId,
      overrideAccess: true,
    });

    if (!doc) return null;

    const title = String((doc as Record<string, unknown>).title ?? '');
    const slug = String((doc as Record<string, unknown>).slug ?? '');

    // Extract meta description from SEO plugin fields
    const meta = (doc as Record<string, unknown>).meta as Record<string, unknown> | undefined;
    const metaDescription = String(meta?.description ?? '');

    // Build content summary from layout blocks or article content
    let contentSummary = '';
    const layout = (doc as Record<string, unknown>).layout;
    const content = (doc as Record<string, unknown>).content;

    if (Array.isArray(layout)) {
      contentSummary = extractTextFromBlocks(layout);
    } else if (content) {
      contentSummary = extractTextFromLexical(content);
    }

    return { id: docId, collection, title, slug, metaDescription, contentSummary };
  } catch (err) {
    console.error('[AI] getDocumentContext failed:', err);
    return null;
  }
}
