import { getOpenAIClient, OPENAI_MODEL } from './openai-client';

interface GenerateMetaDescriptionOptions {
  title: string;
  textContent: string;
  /** BCP-47 locale code. Defaults to 'cs' (Czech). */
  locale?: string;
}

const LANGUAGE_NAMES: Record<string, string> = {
  cs: 'Czech',
  en: 'English',
};

/**
 * Generates an SEO meta description for a page or article using OpenAI.
 *
 * Returns the generated string (max 160 chars) or an empty string on error
 * so the CMS field stays editable without crashing the admin.
 */
export async function generateMetaDescription({
  title,
  textContent,
  locale = 'cs',
}: GenerateMetaDescriptionOptions): Promise<string> {
  const languageName = LANGUAGE_NAMES[locale] ?? 'Czech';

  const systemPrompt = `You are an SEO copywriter for Meopta, a Czech company that develops and produces optical and imaging products. 
Your task: write a single meta description in ${languageName}.
Rules:
- Length: 130–155 characters (strict maximum 160).
- Tone: friendly, clear, benefit-focused — no corporate jargon.
- Do NOT include the page title literally.
- Do NOT use quotes.
- Output ONLY the meta description text, nothing else.`;

  const userPrompt = textContent.trim()
    ? `Page title: "${title}"\n\nPage content excerpt:\n${textContent}`
    : `Page title: "${title}"`;

  try {
    const openai = getOpenAIClient();
    const response = await openai.chat.completions.create({
      model: OPENAI_MODEL,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      max_tokens: 100,
      temperature: 0.5,
    });

    const text = response.choices[0]?.message?.content?.trim() ?? '';
    // Hard-trim to 160 chars as a safety net
    return text.slice(0, 160);
  } catch (err) {
    console.error('[AI] generateMetaDescription failed:', err);
    return '';
  }
}
