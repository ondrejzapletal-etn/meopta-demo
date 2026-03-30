import { postgresAdapter } from '@payloadcms/db-postgres';
import { lexicalEditor, EXPERIMENTAL_TableFeature } from '@payloadcms/richtext-lexical';
import { azureStorage } from '@payloadcms/storage-azure';
import { cs } from '@payloadcms/translations/languages/cs';
import { en } from '@payloadcms/translations/languages/en';
import path from 'path';
import { buildConfig, type Plugin } from 'payload';
import sharp from 'sharp';
import { fileURLToPath } from 'url';

import { Article } from './collections/Article';
import { Asset } from './collections/Asset';
import { Branch } from './collections/Branch';
import { Category } from './collections/Category';
import { Media } from './collections/Media';
import { Page } from './collections/Page';
import { ThirdPartyAccess } from './collections/ThirdPartyAccess';
import { User } from './collections/User';
import { Footer } from './globals/Footer';
import { Header } from './globals/Header';
import { Settings } from './globals/Settings';
import { BusinessContext } from './globals/BusinessContext';
import { mcpPlugin } from '@payloadcms/plugin-mcp';
import { MCP_COLLECTIONS, MCP_GLOBALS } from './lib/mcp-config';
import { nestedDocsPluginConfig } from './plugins/nested';
import { redirectsPluginConfig } from './plugins/redirects';
import { searchPluginConfig } from './plugins/search';
import { seoPluginConfig } from './plugins/seo';
import { validationPlugin } from './plugins/validation';

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

const azureStoragePlugin: Plugin[] = process.env.AZURE_STORAGE_CONNECTION_STRING
  ? [
      azureStorage({
        collections: {
          media: {
            disablePayloadAccessControl: true,
            // Guard against undefined filename for non-resizable formats (SVG).
            // Payload skips imageSizes for SVGs (Sharp can't process vectors),
            // but the cloud-storage plugin's beforeChange hook still calls
            // generateURL for every size — crashing on path.posix.join(prefix, undefined).
            generateFileURL: ({ filename, prefix = '' }) => {
              if (!filename) return '';
              const baseURL = process.env.AZURE_STORAGE_BASE_URL ?? '';
              const containerName = process.env.AZURE_STORAGE_CONTAINER_NAME ?? 'media';
              return `${baseURL}/${containerName}/${path.posix.join(prefix, filename)}`;
            },
          },
        },
        connectionString: process.env.AZURE_STORAGE_CONNECTION_STRING,
        containerName: process.env.AZURE_STORAGE_CONTAINER_NAME ?? 'media',
        baseURL: process.env.AZURE_STORAGE_BASE_URL ?? '',
        allowContainerCreate: true,
      }),
    ]
  : [];

/**
 * Payload CMS configuration for the nextjs-payload-template project.
 *
 * This configuration sets up:
 * - PostgreSQL database adapter
 * - Lexical rich text editor
 * - Multi-language support
 * - Collections for content management
 * - Global configurations
 * - Live preview integration with Next.js frontend
 * - Search, SEO, and redirects plugins
 * - TypeScript type generation to shared package
 *
 * @see {@link https://payloadcms.com/docs/configuration/overview | Payload Configuration Docs}
 */
export default buildConfig({
  admin: {
    user: User.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    components: {
      afterNavLinks: [
        {
          path: './components/AiNavSection',
          exportName: 'AiNavSection',
        },
        {
          path: './components/AIChat/AIChatRoot',
          exportName: 'AIChatRoot',
        },
      ],
      views: {
        aiGenerateContent: {
          Component: {
            path: './components/ai-views/GenerateContent',
            exportName: 'GenerateContentView',
          },
          path: '/ai/generate-content',
          exact: true,
        },
        aiIncreaseConversions: {
          Component: {
            path: './components/ai-views/IncreaseConversions',
            exportName: 'IncreaseConversionsView',
          },
          path: '/ai/increase-conversions',
          exact: true,
        },
        aiGetMoreVisits: {
          Component: {
            path: './components/ai-views/GetMoreVisits',
            exportName: 'GetMoreVisitsView',
          },
          path: '/ai/get-more-visits',
          exact: true,
        },
      },
    },
    livePreview: {
      url: ({ data }) => {
        const pageData = data as { slug?: string; abEnabled?: boolean; abPreviewSegment?: string };
        const slug = pageData.slug || '';
        const pagePath = slug === 'homepage' ? '' : slug;
        const abParam
          = pageData.abEnabled && pageData.abPreviewSegment === 'B' ? '&ab=B' : '';
        return `${process.env.FE_URL}/${pagePath}?preview-secret=${process.env.PREVIEW_SECRET}${abParam}`;
      },
      collections: [Page.slug],
      breakpoints: [
        { label: 'Mobile', name: 'mobile', width: 375, height: 810 },
        { label: 'Tablet', name: 'tablet', width: 800, height: 1080 },
        { label: 'Desktop', name: 'desktop', width: 1440, height: 900 },
      ],
    },
  },
  collections: [
    Article,
    Asset,
    Branch,
    Category,
    Media,
    Page,
    User,
    ThirdPartyAccess,
  ],
  cors: {
    origins: [
    ],
    headers: [
      'traceparent',
      'tracestate',
    ],
  },
  editor: lexicalEditor({
    features: ({ defaultFeatures }) => [...defaultFeatures, EXPERIMENTAL_TableFeature()],
  }),
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI || '',
    },
  }),
  globals: [
    Header,
    Footer,
    Settings,
    BusinessContext,
  ],
  i18n: {
    supportedLanguages: { cs, en },
    translations: {
      cs: {
        'plugin-seo': {
          autoGenerate: 'Generovat pomocí AI',
          lengthTipDescription:
            'Text pro meta description, které se zobrazuje na stránce s výsledky vyhledávání Google. Mělo by mít 120-150 znaků a obsahovat důležitá klíčová slova. Při generování pomocí AI je zpracován titulek stránky a její obsah a vytvořeno vhodné meta description. Pro pomoc při psaní kvalitních meta titulů navštivte ',
        },
      },
      en: {
        'plugin-seo': {
          autoGenerate: 'Generate with AI',
          lengthTipDescription:
            'This is the meta description shown in Google search results. It should be 120–150 characters and include relevant keywords. When generating with AI, the page title and content are processed to create a suitable meta description. For help writing quality meta titles, see ',
        },
      },
    },
  },
  plugins: [
    nestedDocsPluginConfig,
    searchPluginConfig,
    seoPluginConfig,
    validationPlugin,
    redirectsPluginConfig,
    // mcpPlugin creates the payload-mcp-api-keys collection and DB schema.
    // Its built-in HTTP adapter (mcp-handler) is broken, so we use a custom
    // route handler at /api/mcp instead (see apps/cms/src/app/(payload)/api/mcp/route.ts).
    mcpPlugin({
      collections: Object.fromEntries(
        Object.entries(MCP_COLLECTIONS).map(([slug, ops]) => {
          const allOps = ops.find && ops.create && ops.update && ops.delete;
          return [slug, { enabled: allOps ? true : ops }];
        }),
      ),
      globals: Object.fromEntries(
        Object.entries(MCP_GLOBALS).map(([slug, ops]) => [slug, { enabled: ops }]),
      ),
    }),
    ...azureStoragePlugin,
  ],
  secret: process.env.PAYLOAD_SECRET || '',
  serverURL: process.env.CMS_URL || '',
  sharp,
  typescript: {
    declare: false,
    outputFile: path.resolve(dirname, '../../../packages/shared/src/payload-types.ts'),
  },
});
