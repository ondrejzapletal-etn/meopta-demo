import { getOpenAIClient, OPENAI_MODEL } from '../../lib/ai/openai-client';

export interface MetadataAgentInput {
  content: string;
  existingTitle?: string;
  businessContext?: string;
  locale?: string;
}

export interface MetadataAgentResult {
  title: string;
  metaDescription: string;
}

/**
 * Generates an SEO-optimized page title and meta description.
 */
export async function runMetadataAgent(input: MetadataAgentInput): Promise<MetadataAgentResult> {
  const openai = getOpenAIClient();

  const locale = input.locale ?? 'cs';
  const lang = locale === 'en' ? 'English' : 'Czech';
  const contextSection = input.businessContext
    ? `\nBusiness context: ${input.businessContext}`
    : '';

  const systemPrompt = `You are an SEO copywriter.${contextSection}
Generate an SEO-optimized page title and meta description in ${lang}.
Rules:
- Title: 50-60 characters, descriptive, unique.
- Meta description: 130-155 characters, benefit-focused, include a CTA.
- Do NOT use quotes.
- Respond ONLY with valid JSON: { "title": "...", "metaDescription": "..." }`;

  const userPrompt = `${input.existingTitle ? `Current title: "${input.existingTitle}"\n` : ''}Content excerpt: ${input.content.slice(0, 800)}`;

  try {
    const response = await openai.chat.completions.create({
      model: OPENAI_MODEL,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      response_format: { type: 'json_object' },
      max_tokens: 200,
      temperature: 0.4,
    });

    const text = response.choices[0]?.message?.content?.trim() ?? '{}';
    const parsed = JSON.parse(text) as MetadataAgentResult;
    return {
      title: (parsed.title ?? '').slice(0, 60),
      metaDescription: (parsed.metaDescription ?? '').slice(0, 160),
    };
  } catch (err) {
    console.error('[AI] metadataAgent failed:', err);
    return { title: '', metaDescription: '' };
  }
}
