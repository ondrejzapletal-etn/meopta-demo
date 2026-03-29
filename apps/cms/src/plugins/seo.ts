import { seoPlugin } from '@payloadcms/plugin-seo';
import { Article } from '../collections/Article';
import { Media } from '../collections/Media';
import { Page } from '../collections/Page';
import { prepareDocumentContext } from '../lib/ai/extract-content';
import { generateMetaDescription } from '../lib/ai/generate-meta-description';

/**
 * SEO plugin configuration for Payload CMS
 * Adds SEO fields and meta tag generation to specified collections.
 *
 * The "Auto-generate" button in the SEO tab calls `generateDescription`
 * server-side. It uses OpenAI (gpt-4o-mini by default) with content
 * extracted from the document's blocks (Pages) or Lexical body (Articles).
 *
 * Requires OPENAI_API_KEY in apps/cms/.env.
 * Falls back to an empty string on error — field remains editable.
 */
export const seoPluginConfig = seoPlugin({
  collections: [Page.slug, Article.slug],
  uploadsCollection: Media.slug,
  generateTitle: ({ doc }) => `${doc.title} - Meta title`,
  generateDescription: async ({ doc, collectionSlug }) => {
    const textContent = prepareDocumentContext(
      doc as Record<string, unknown>,
      collectionSlug ?? '',
    );
    return generateMetaDescription({
      title: String(doc.title ?? ''),
      textContent,
    });
  },
  generateImage: ({ doc }) => doc.meta?.image,
  tabbedUI: true,
});
