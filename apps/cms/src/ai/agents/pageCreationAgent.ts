import { getOpenAIClient, OPENAI_MODEL } from '../../lib/ai/openai-client';

export interface PageCreationAgentInput {
  topic: string;
  businessContext?: string;
  locale?: string;
}

export interface PageCreationAgentResult {
  title: string;
  slug: string;
  blocks: unknown[];
  summary: string;
}

/**
 * Generates a draft Payload CMS page JSON from a user-described topic.
 * Returns a preview that must be explicitly approved by the user before creation.
 * Status is always 'draft' — never auto-published.
 */
export async function runPageCreationAgent(
  input: PageCreationAgentInput,
): Promise<PageCreationAgentResult> {
  const openai = getOpenAIClient();

  const locale = input.locale ?? 'cs';
  const lang = locale === 'en' ? 'English' : 'Czech';
  const contextSection = input.businessContext
    ? `\nBusiness context: ${input.businessContext}`
    : '';

  const systemPrompt = `You are a CMS content architect.${contextSection}
Generate a draft page structure in ${lang} for the given topic.
Use simple block types: heroPlainBlock and richTextBlock.
Respond ONLY with valid JSON:
{
  "title": "<page title>",
  "slug": "<url-slug-lowercase-hyphens>",
  "summary": "<one sentence describing the page>",
  "blocks": [
    { "blockType": "heroPlainBlock", "heading": "...", "subheading": "..." },
    { "blockType": "richTextBlock", "content": { "root": { "type": "root", "children": [{ "type": "paragraph", "children": [{ "type": "text", "text": "..." }] }] } } }
  ]
}`;

  const userPrompt = `Create a page about: ${input.topic}`;

  try {
    const response = await openai.chat.completions.create({
      model: OPENAI_MODEL,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      response_format: { type: 'json_object' },
      max_tokens: 800,
      temperature: 0.5,
    });

    const text = response.choices[0]?.message?.content?.trim() ?? '{}';
    return JSON.parse(text) as PageCreationAgentResult;
  } catch (err) {
    console.error('[AI] pageCreationAgent failed:', err);
    return {
      title: input.topic,
      slug: input.topic.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
      blocks: [],
      summary: '',
    };
  }
}
