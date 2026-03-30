import type { Payload } from 'payload';
import type { DocumentContext } from '../context/getCurrentDocumentContext';
import { runCmsHelpAgent } from '../agents/cmsHelpAgent';
import { runGeoAgent } from '../agents/geoAgent';
import { runMetadataAgent } from '../agents/metadataAgent';
import { runPageCreationAgent } from '../agents/pageCreationAgent';
import { runSeoAgent } from '../agents/seoAgent';
import { runSiteKnowledgeAgent } from '../agents/siteKnowledgeAgent';
import { getOpenAIClient, OPENAI_MODEL } from '../../lib/ai/openai-client';

export type ChatMessage = {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
};

export type ChatResponseType = 'text' | 'page-creation-preview';

export interface ChatRouterInput {
  message: string;
  history: ChatMessage[];
  docContext: DocumentContext | null;
  businessContext: string;
  payload: Payload;
  locale?: string;
}

export interface ChatRouterResult {
  content: string;
  type: ChatResponseType;
  previewData?: unknown;
}

// ---------------------------------------------------------------------------
// Intent detection
// ---------------------------------------------------------------------------

type Intent
  = | 'metadata'
    | 'seo'
    | 'geo'
    | 'create-page'
    | 'site-knowledge'
    | 'cms-help'
    | 'general';

function detectIntent(message: string): Intent {
  const lower = message.toLowerCase();

  if (/\b(meta|titulek|description|meta\s*popis|titl(e|ek))\b/.test(lower)) return 'metadata';
  if (/\bseo\b/.test(lower)) return 'seo';
  if (/\bgeo\b/.test(lower)) return 'geo';
  if (
    /\b(vytvo[rř]|create|novou?\s*str[aá]nku?|new\s*page|generate\s*page)\b/.test(lower)
  )
    return 'create-page';
  if (
    /\b(podobn[áéě]|related|duplicit|intern[íi]\s*odkaz|internal\s*link|similar)\b/.test(lower)
  )
    return 'site-knowledge';
  if (
    /\b(jak|kde|how|where|edit(ovat)?|nastav[ií]|kde\s*najdu)\b/.test(lower)
  )
    return 'cms-help';

  return 'general';
}

// ---------------------------------------------------------------------------
// Business context summary (max 600 chars to save tokens)
// ---------------------------------------------------------------------------

function buildBusinessContextSummary(raw: string): string {
  return raw.slice(0, 600);
}

// ---------------------------------------------------------------------------
// General fallback — direct OpenAI chat with page context
// ---------------------------------------------------------------------------

async function runGeneralAgent(
  message: string,
  history: ChatMessage[],
  docContext: DocumentContext | null,
  businessContext: string,
): Promise<string> {
  const openai = getOpenAIClient();

  const contextSection = docContext
    ? `\nCurrent page: "${docContext.title}" (/${docContext.slug ?? ''})\nContent excerpt: ${docContext.contentSummary.slice(0, 400)}`
    : '';

  const bizSection = businessContext
    ? `\nBusiness context: ${buildBusinessContextSummary(businessContext)}`
    : '';

  const systemPrompt = `You are a helpful AI content assistant for a CMS admin.${bizSection}${contextSection}
Answer concisely. Respond in the same language as the user's message.`;

  const messages = [
    { role: 'system' as const, content: systemPrompt },
    ...history.slice(-4).map((m) => ({ role: m.role, content: m.content })),
    { role: 'user' as const, content: message },
  ];

  const response = await openai.chat.completions.create({
    model: OPENAI_MODEL,
    messages,
    max_tokens: 500,
    temperature: 0.6,
  });

  return response.choices[0]?.message?.content?.trim() ?? 'Nepodařilo se získat odpověď.';
}

// ---------------------------------------------------------------------------
// Main router
// ---------------------------------------------------------------------------

export async function routeChat(input: ChatRouterInput): Promise<ChatRouterResult> {
  const { message, history, docContext, businessContext, payload, locale } = input;
  const intent = detectIntent(message);
  const bizSummary = buildBusinessContextSummary(businessContext);

  try {
    switch (intent) {
      case 'seo': {
        if (!docContext) {
          return {
            type: 'text',
            content:
              'Pro SEO analýzu otevřete konkrétní stránku nebo článek v CMS editoru a pak se znovu zeptejte.',
          };
        }
        const result = await runSeoAgent({
          title: docContext.title,
          content: docContext.contentSummary,
          metaDescription: docContext.metaDescription,
          businessContext: bizSummary,
          locale,
        });
        return {
          type: 'text',
          content: `**SEO skóre: ${result.score}/100**\n\n${
            result.issues.length
              ? `**Problémy:**\n${result.issues.map((i) => `- ${i}`).join('\n')}\n\n`
              : ''
          }**Doporučené opravy:**\n${result.fixes.map((f) => `- ${f}`).join('\n')}`,
        };
      }

      case 'geo': {
        if (!docContext) {
          return {
            type: 'text',
            content:
              'Pro GEO analýzu otevřete konkrétní stránku nebo článek v CMS editoru a pak se znovu zeptejte.',
          };
        }
        const result = await runGeoAgent({
          title: docContext.title,
          content: docContext.contentSummary,
          metaDescription: docContext.metaDescription,
          businessContext: bizSummary,
        });
        return {
          type: 'text',
          content: `**GEO hodnocení:**\n- Jasnost entit: ${result.entityClarity}/100\n- Čitelnost pro AI: ${result.aiReadability}/100\n- Kvalita snippetu: ${result.snippetQuality}/100\n\n${
            result.issues.length
              ? `**Problémy:**\n${result.issues.map((i) => `- ${i}`).join('\n')}\n\n`
              : ''
          }**Doporučení:**\n${result.recommendations.map((r) => `- ${r}`).join('\n')}`,
        };
      }

      case 'metadata': {
        const result = await runMetadataAgent({
          content: docContext?.contentSummary ?? message,
          existingTitle: docContext?.title,
          businessContext: bizSummary,
          locale,
        });
        return {
          type: 'text',
          content: `**Navrhovaný titulek:**\n${result.title}\n\n**Meta description:**\n${result.metaDescription}`,
        };
      }

      case 'create-page': {
        // Run duplicate check first
        const knowledgeResult = await runSiteKnowledgeAgent({
          query: message,
          currentDocId: docContext?.id,
          payload,
        });

        const pageResult = await runPageCreationAgent({
          topic: message,
          businessContext: bizSummary,
          locale,
        });

        const duplicateWarning
          = knowledgeResult.duplicates.length > 0
            ? `\n\n⚠️ **Možné duplicity:**\n${knowledgeResult.duplicates.map((d) => `- [${d.title}](/${d.slug})`).join('\n')}`
            : '';

        return {
          type: 'page-creation-preview',
          content: `Připravil jsem návrh stránky. Chcete ji vytvořit jako koncept?${duplicateWarning}`,
          previewData: pageResult,
        };
      }

      case 'site-knowledge': {
        const result = await runSiteKnowledgeAgent({
          query: message,
          currentDocId: docContext?.id,
          payload,
        });
        const related = result.relatedPages.map((p) => `- ${p.title} (/${p.slug})`).join('\n');
        const links = result.internalLinks.map((l) => `- /${l}`).join('\n');
        return {
          type: 'text',
          content: `**${result.summary}**\n\n${related ? `**Příbuzné stránky:**\n${related}\n\n` : ''}${links ? `**Doporučené interní odkazy:**\n${links}` : ''}`,
        };
      }

      case 'cms-help': {
        const result = await runCmsHelpAgent({ question: message });
        const steps
          = result.steps && result.steps.length > 0
            ? `\n\n**Postup:**\n${result.steps.map((s, i) => `${i + 1}. ${s}`).join('\n')}`
            : '';
        return { type: 'text', content: `${result.answer}${steps}` };
      }

      default: {
        const content = await runGeneralAgent(message, history, docContext, businessContext);
        return { type: 'text', content };
      }
    }
  } catch (err) {
    console.error('[AI] chatRouter error:', err);
    return { type: 'text', content: 'Požadavek selhal. Zkuste to znovu.' };
  }
}
