import { getOpenAIClient, OPENAI_MODEL } from '../../lib/ai/openai-client';

export interface GEOAgentInput {
  title: string;
  content: string;
  metaDescription?: string;
  businessContext?: string;
}

export interface GEOAgentResult {
  entityClarity: number;
  aiReadability: number;
  snippetQuality: number;
  issues: string[];
  recommendations: string[];
}

/**
 * GEO (Generative Engine Optimization) agent.
 * Evaluates how well the page content is optimized for LLM/AI answer engines
 * (e.g. ChatGPT Search, Perplexity, Google SGE).
 */
export async function runGeoAgent(input: GEOAgentInput): Promise<GEOAgentResult> {
  const openai = getOpenAIClient();

  const contextSection = input.businessContext
    ? `\nBusiness context: ${input.businessContext}`
    : '';

  const systemPrompt = `You are a GEO (Generative Engine Optimization) specialist.${contextSection}
Evaluate how well the page content is optimized for AI answer engines (ChatGPT, Perplexity, Google SGE).
Respond ONLY with valid JSON matching this schema:
{
  "entityClarity": <number 0-100>,
  "aiReadability": <number 0-100>,
  "snippetQuality": <number 0-100>,
  "issues": [<string>, ...],
  "recommendations": [<string>, ...]
}
Write issues and recommendations in the same language as the page content.`;

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
    return JSON.parse(text) as GEOAgentResult;
  } catch (err) {
    console.error('[AI] geoAgent failed:', err);
    return {
      entityClarity: 0,
      aiReadability: 0,
      snippetQuality: 0,
      issues: ['GEO analýza selhala.'],
      recommendations: [],
    };
  }
}
