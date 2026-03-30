import type { CollectionAfterChangeHook } from 'payload';
import { getOpenAIClient, OPENAI_MODEL } from '../lib/ai/openai-client';
import { extractTextFromBlocks, extractTextFromLexical } from '../lib/ai/extract-content';

/**
 * generateAISummary — Payload afterChange hook.
 *
 * Automatically generates a 2-sentence AI summary of the page/article content
 * and saves it to the hidden `aiSummary` field. The summary is used by the
 * siteKnowledgeAgent for related-content and duplicate detection.
 *
 * Guarded by `req.context.isSummaryUpdate` flag to prevent infinite loops.
 */
export const generateAISummary: CollectionAfterChangeHook = async ({
  doc,
  req,
  collection,
}) => {
  // Prevent re-triggering when we update aiSummary itself
  if (req.context?.isSummaryUpdate) return doc;

  const data = doc as Record<string, unknown>;
  const title = String(data.title ?? '');

  // Extract text content
  let content = '';
  if (Array.isArray(data.layout)) {
    content = extractTextFromBlocks(data.layout);
  } else if (data.content) {
    content = extractTextFromLexical(data.content);
  }

  if (!title && !content) return doc;

  // Fire-and-forget: run in background so autosave returns immediately.
  // Waiting for OpenAI here would block the save response for 2–30+ seconds,
  // causing the admin "Publish Changes" button to never activate.
  const isDraft = (doc as Record<string, unknown>)._status === 'draft';
  const docId = doc.id;
  void (async () => {
    try {
      const openai = getOpenAIClient();

      const response = await openai.chat.completions.create({
        model: OPENAI_MODEL,
        messages: [
          {
            role: 'system',
            content:
              'Summarize the following page in 1-2 sentences for internal AI search context. Be concise and factual. Use the same language as the content.',
          },
          {
            role: 'user',
            content: `Title: "${title}"\nContent: ${content.slice(0, 600)}`,
          },
        ],
        max_tokens: 80,
        temperature: 0.3,
      });

      const summary = response.choices[0]?.message?.content?.trim() ?? '';
      if (!summary) return;

      // Preserve draft state — without `draft: true` Payload would publish the document,
      // which breaks the "Publish changes" button in the admin UI.
      await req.payload.update({
        collection: collection.slug,
        id: docId,
        data: { aiSummary: summary },
        context: { isSummaryUpdate: true },
        overrideAccess: true,
        draft: isDraft,
      });
    } catch (err) {
      // Non-fatal — log but don't block the save
      console.error('[AI] generateAISummary failed:', err);
    }
  })();

  return doc;
};
