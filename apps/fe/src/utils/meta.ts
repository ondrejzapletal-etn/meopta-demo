import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { throwIfMissingEnv } from './env';

interface BasicMetaOptions {
  title?: string;
  description?: string;
  image?: string;
  keywords?: string;
  locale?: string;
  creator?: string;
  siteName?: string;
}

interface RobotsOptions {
  index?: boolean;
  follow?: boolean;
};

interface CreateBasicSEOOptions {
  options: BasicMetaOptions;
  robots: RobotsOptions;
}

/**
 * Creates base SEO metadata for a Next.js page (title, description,
 * OpenGraph, Twitter, and robots), localized via `next-intl`.
 *
 * Fallbacks:
 * - If `title`/`description`/`keywords`/`siteName`/`creator` are not provided,
 *   defaults from translations (`meta.*`) are used.
 * - `robots.index` and `robots.follow` default to `true`.
 *
 * @param options - Basic metadata options
 * @param options.title - Page title
 * @param options.description - Page description
 * @param options.keywords - Keywords
 * @param options.locale - Locale for OpenGraph (e.g., `cs_CZ`)
 * @param options.creator - Author/publisher (used in Twitter metadata and `publisher`)
 * @param options.siteName - Site name (OpenGraph `siteName`)
 * @param robots - Robots indexing options
 * @param robots.index - Allow indexing
 * @param robots.follow - Allow following links
 * @returns Metadata ready for Next.js `generateMetadata`.
 */
export const createBasicSEO = async ({ options, robots }: CreateBasicSEOOptions): Promise<Metadata> => {
  const t = await getTranslations();
  const { title, description, image, keywords, locale, creator, siteName } = options;
  const { index = true, follow = true } = robots;

  return {
    title: title ?? t('meta.defaultTitle'),
    description: description ?? t('meta.defaultDescription'),

    metadataBase: new URL(throwIfMissingEnv('NEXT_PUBLIC_FE_HOST')),
    applicationName: t('meta.applicationName'),
    authors: [{ name: t('meta.etnetera') }],
    publisher: creator ?? t('meta.etnetera'),
    keywords: keywords ?? t('meta.defaultKeywords'),

    robots: {
      index,
      follow,
      googleBot: {
        index,
        follow,
      },
    },

    alternates: {
      canonical: './',
    },

    twitter: {
      card: 'summary_large_image',
      title: title ?? t('meta.defaultTitle'),
      description: description ?? t('meta.defaultDescription'),
      creator: creator ?? t('meta.twitterCreator'),
      images: image ? [image] : ['/favicon.png'],
    },

    openGraph: {
      title: title ?? t('meta.defaultTitle'),
      description: description ?? t('meta.defaultDescription'),
      images: image ? [{ url: image }] : [{ url: '/favicon.png' }],
      type: 'website',
      locale: locale ?? 'cs_CZ',
      siteName: siteName ?? t('meta.siteName'),
      url: './',
    },
  };
};
