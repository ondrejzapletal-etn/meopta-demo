import { getOpenAIClient, OPENAI_MODEL } from '../../lib/ai/openai-client';

export interface CMSHelpAgentInput {
  question: string;
}

export interface CMSHelpAgentResult {
  answer: string;
  steps?: string[];
}

const CMS_KNOWLEDGE = `
Payload CMS admin knowledge base:
- Pages: Admin > Collections > Stránky (Pages). Edit blocks in the "Obsah" tab.
- Articles: Admin > Collections > Články (Articles).
- Media: Admin > Collections > Média. Upload images and files here.
- SEO: Open a page/article, click the SEO tab, fill in title and meta description. Use "Generovat pomocí AI" button to auto-generate.
- Header/Footer: Admin > Globals > Header | Footer.
- Business Context for AI: Admin > Globals > AI – Kontext businessu.
- Publishing: Use the "Publish" button in the status bar. Drafts are saved but not visible on the website.
- Versions: Click the clock icon to see older versions of a document.
- Live preview: Click the eye icon in the top bar to preview pages.
- Search plugin: Admin > Collections > Search provides full-text search index.
- AI Chat: Click "AI Chat" in the left sidebar to open the AI assistant.
`;

/**
 * Answers user questions about how to use the CMS admin interface.
 */
export async function runCmsHelpAgent(input: CMSHelpAgentInput): Promise<CMSHelpAgentResult> {
  const openai = getOpenAIClient();

  const systemPrompt = `You are a helpful Payload CMS admin assistant.
Answer user questions about how to use the CMS based on this knowledge base:
${CMS_KNOWLEDGE}
Be concise. If the question is about something not in the knowledge base, say so honestly.
Respond in the same language as the question.
Respond ONLY with valid JSON: { "answer": "...", "steps": ["step 1", "step 2"] }
Omit "steps" if not applicable.`;

  try {
    const response = await openai.chat.completions.create({
      model: OPENAI_MODEL,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: input.question },
      ],
      response_format: { type: 'json_object' },
      max_tokens: 400,
      temperature: 0.4,
    });

    const text = response.choices[0]?.message?.content?.trim() ?? '{}';
    return JSON.parse(text) as CMSHelpAgentResult;
  } catch (err) {
    console.error('[AI] cmsHelpAgent failed:', err);
    return { answer: 'Nepodařilo se získat odpověď. Zkuste to znovu.' };
  }
}
