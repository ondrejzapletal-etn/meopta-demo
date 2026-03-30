import type { Payload } from 'payload';
import { getOpenAIClient, OPENAI_MODEL } from '../../lib/ai/openai-client';

export interface SiteKnowledgeAgentInput {
  query: string;
  currentDocId?: string;
  payload: Payload;
}

export interface SiteKnowledgeAgentResult {
  relatedPages: { title: string; slug: string }[];
  duplicates: { title: string; slug: string }[];
  internalLinks: string[];
  summary: string;
}

/**
 * Searches the site's pages and articles for related content, potential
 * duplicates, and internal linking opportunities.
 */
export async function runSiteKnowledgeAgent(
  input: SiteKnowledgeAgentInput,
): Promise<SiteKnowledgeAgentResult> {
  const { payload, query, currentDocId } = input;

  // Fetch up to 200 page summaries from the DB
  const pagesResult = await payload.find({
    collection: 'pages',
    limit: 200,
    select: { title: true, slug: true, aiSummary: true },
    overrideAccess: true,
  });

  const candidates = pagesResult.docs
    .filter((p) => String(p.id) !== currentDocId)
    .map((p) => ({
      title: String(p.title ?? ''),
      slug: String(p.slug ?? ''),
      summary: String((p as Record<string, unknown>).aiSummary ?? ''),
    }));

  if (candidates.length === 0) {
    return { relatedPages: [], duplicates: [], internalLinks: [], summary: 'Žádné stránky k porovnání.' };
  }

  const openai = getOpenAIClient();

  const systemPrompt = `You are a site architecture analyst.
Given a user query and a list of existing pages (title, slug, summary), identify:
- relatedPages: pages related to the query topic (max 5)
- duplicates: pages that might duplicate the query topic (max 3)
- internalLinks: suggested slugs to link from the new/current page (max 5)
- summary: one sentence summary of findings

Respond ONLY with valid JSON:
{
  "relatedPages": [{"title":"...","slug":"..."}],
  "duplicates": [{"title":"...","slug":"..."}],
  "internalLinks": ["slug1","slug2"],
  "summary": "..."
}`;

  const pagesContext = candidates
    .slice(0, 50) // limit tokens
    .map((p) => `- "${p.title}" (/${p.slug}): ${p.summary}`)
    .join('\n');

  const userPrompt = `Query: "${query}"\n\nExisting pages:\n${pagesContext}`;

  try {
    const response = await openai.chat.completions.create({
      model: OPENAI_MODEL,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      response_format: { type: 'json_object' },
      max_tokens: 500,
      temperature: 0.3,
    });

    const text = response.choices[0]?.message?.content?.trim() ?? '{}';
    return JSON.parse(text) as SiteKnowledgeAgentResult;
  } catch (err) {
    console.error('[AI] siteKnowledgeAgent failed:', err);
    return { relatedPages: [], duplicates: [], internalLinks: [], summary: 'Analýza selhala.' };
  }
}
