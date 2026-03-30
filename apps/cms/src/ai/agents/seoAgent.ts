import { getOpenAIClient, OPENAI_MODEL } from '../../lib/ai/openai-client';

export interface SEOAgentInput {
  title: string;
  content: string;
  metaDescription?: string;
  businessContext?: string;
  locale?: string;
}

export interface SEOAgentResult {
  score: number;
  issues: string[];
  fixes: string[];
}

/**
 * Analyzes a page for SEO quality and returns a score, issues, and actionable fixes.
 */
export async function runSeoAgent(input: SEOAgentInput): Promise<SEOAgentResult> {
  const openai = getOpenAIClient();

  const contextSection = input.businessContext
    ? `\nBusiness context: ${input.businessContext}`
    : '';

  const systemPrompt = `You are an expert SEO analyst for a website.${contextSection}
Analyze the provided page content and respond ONLY with valid JSON matching this schema:
{
  "score": <number 0-100>,
  "issues": [<string>, ...],
  "fixes": [<string>, ...]
}
Be specific and actionable. Write issues and fixes in the same language as the page content.`;

  const userPrompt = `Title: "${input.title}"
Meta description: "${input.metaDescription ?? 'Not provided'}"
Content excerpt: ${input.content.slice(0, 800)}`;

  try {
    const response = await openai.chat.completions.create({
      model: OPENAI_MODEL,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      response_format: { type: 'json_object' },
      max_tokens: 600,
      temperature: 0.3,
    });

    const text = response.choices[0]?.message?.content?.trim() ?? '{}';
    return JSON.parse(text) as SEOAgentResult;
  } catch (err) {
    console.error('[AI] seoAgent failed:', err);
    return { score: 0, issues: ['SEO analýza selhala.'], fixes: [] };
  }
}
