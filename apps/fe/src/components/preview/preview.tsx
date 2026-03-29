'use client';
import { RefreshRouteOnSave } from '@payloadcms/live-preview-react';
import { useRouter } from 'next/navigation';
import { revalidatePreview } from '../../utils/draft-preview';

interface PreviewProps {
  url: string;
}

/**
 * Live preview component that enables real-time content updates from Payload CMS
 * Automatically refreshes the page when content changes are saved in the CMS
 * @param url - The server URL for the live preview connection
 * @returns JSX element that handles live preview functionality
 */
export const Preview = ({ url }: PreviewProps) => {
  const router = useRouter();

  return (
    <RefreshRouteOnSave
      refresh={() => {
        revalidatePreview();
        router.refresh();
      }}
      serverURL={url}
    />
  );
};
