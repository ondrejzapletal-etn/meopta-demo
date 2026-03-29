import { nestedDocsPlugin } from '@payloadcms/plugin-nested-docs';
import { Page } from '../collections/Page';

/**
 * Nested docs plugin configuration for Payload CMS
 * Enables hierarchical page structure with breadcrumb generation and URL construction
 * @returns Configured nested docs plugin instance
 */
export const nestedDocsPluginConfig = nestedDocsPlugin({
  collections: [Page.slug],
  generateLabel: (_, doc) => doc.title as string,
  generateURL: (docs) =>
    docs.reduce((url, doc) => `${url}/${doc.slug}`, ''),
});
