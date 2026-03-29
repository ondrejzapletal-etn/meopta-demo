import { notFound, permanentRedirect } from 'next/navigation';
import { Redirect } from '@repo/shared/payload-types';
import { fetchRedirects } from '../../api/fetch';

interface Props {
  disableNotFound?: boolean;
  url: string;
}

export const PayloadRedirects: React.FC<Props> = async ({ disableNotFound, url }) => {
  const redirects = await fetchRedirects();
  const redirectItem = redirects.find((r: Redirect) => r.from === url);

  if (redirectItem) {
    let targetUrl: string | null = null;

    if (redirectItem.to?.url) {
      targetUrl = redirectItem.to.url;
    } else {
      const ref = redirectItem.to?.reference;
      if (ref) {
        const slug = typeof ref.value === 'object' ? ref.value?.slug : null;
        if (slug) {
          targetUrl = `/${slug}`;
        }
      }
    }

    if (targetUrl) {
      permanentRedirect(targetUrl);
    }
  }

  if (disableNotFound) return null;
  notFound();
};
