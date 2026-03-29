import { searchPlugin } from '@payloadcms/plugin-search';
import { DefaultTypedEditorState } from '@payloadcms/richtext-lexical';
import { Article as ArticleDoc } from '@repo/shared/payload-types';
import { Article } from '../collections/Article';
import { Category } from '../collections/Category';
import { Page } from '../collections/Page';
import { extractPlainText } from '../utils/lexical';

/**
 * Search plugin configuration for Payload CMS
 * Enables full-text search across specified collections and adds description extraction for articles
 * @returns Configured search plugin instance
 */
export const searchPluginConfig = searchPlugin({
  collections: [Page.slug, Category.slug, Article.slug],
  beforeSync: ({ originalDoc, searchDoc }) => {
    const collection = searchDoc.doc.relationTo;

    if (collection === Article.slug) {
      const article = originalDoc as ArticleDoc;

      return {
        ...searchDoc,
        description: extractPlainText(article.content as DefaultTypedEditorState | null | undefined),
      };
    }
    return searchDoc;
  },
  searchOverrides: {
    fields: ({ defaultFields }) => [
      ...defaultFields,
      {
        name: 'description',
        type: 'textarea',
        label: 'Description',
        admin: {
          readOnly: true,
        },
      },
    ],
  },
});
