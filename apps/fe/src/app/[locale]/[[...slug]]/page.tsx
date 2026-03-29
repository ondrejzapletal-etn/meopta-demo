import { fetchPage, fetchBranch } from '../../../api/fetch';
import { PayloadRedirects } from '../../../components/payloadRedirects/payloadRedirects';
import { Blocks } from '../../../components/blocks';
import { BranchDetailPage } from '../../../blocks/special/branchDetailBlock/branchDetailPage';
import { Breadcrumbs } from '../../../components/breadcrumbs/breadcrumbs';
import { draftPreview } from '../../../utils/draft-preview';
import { createBasicSEO } from '../../../utils/meta';
import { getImageSrcWithFallback } from '../../../utils/images';

export const dynamic = 'force-dynamic';

/**
 * Generates metadata for the page based on the slug
 * @param params The page parameters containing the slug
 * @returns Promise resolving to the page metadata
 */
export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const slugString = slug?.join('/');

  try {
    const page = await fetchPage(slugString ?? 'homepage');
    const metaImageSrc = getImageSrcWithFallback(page.meta?.image ?? undefined);
    return createBasicSEO({
      options: {
        title: page.meta?.title ?? page.title ?? '',
        description: page.meta?.description ?? undefined,
        image: metaImageSrc || undefined,
      },
      robots: {
        index: false,
      },
    });
  } catch {
    // Fallback: try Branch collection
    if (slugString) {
      const branch = await fetchBranch(slugString);
      if (branch) {
        return createBasicSEO({
          options: {
            title: `Pobočka ${branch.name} | Air Bank`,
          },
          robots: {
            index: false,
          },
        });
      }
    }
    return createBasicSEO({ options: { title: '' }, robots: { index: false } });
  }
}

interface PageProps {
  params: Promise<{ slug?: string[] }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

/**
 * Dynamic catch-all route page component that renders pages based on slug
 * @param params Route parameters containing the slug segments
 * @param searchParams URL search parameters for draft preview and other options
 * @returns JSX element containing the rendered page content
 */
const Page = async ({ params, searchParams }: PageProps) => {
  const resolvedSearchParams = await searchParams;
  await draftPreview(resolvedSearchParams);

  const { slug } = await params;
  const slugString = slug?.join('/');
  let page;

  try {
    page = await fetchPage(slugString ?? 'homepage');
  } catch {
    // Fallback: try Branch collection for detail pages
    if (slugString) {
      const branch = await fetchBranch(slugString);
      if (branch) {
        return <BranchDetailPage branch={branch} />;
      }
    }
    return <PayloadRedirects url={`/${slugString ?? ''}`} />;
  }

  // A/B test: use variant B layout when ?ab=B and test is enabled
  const abSegment = resolvedSearchParams['ab'];
  const activeLayout
    = abSegment === 'B' && page.abEnabled
      ? (page.variantB ?? page.layout)
      : page.layout;

  const showBreadcrumbs = slugString && slugString.includes('/');

  return (
    <>
      {showBreadcrumbs && <Breadcrumbs slug={slugString} />}
      <Blocks blocks={activeLayout} />
    </>
  );
};

export default Page;
