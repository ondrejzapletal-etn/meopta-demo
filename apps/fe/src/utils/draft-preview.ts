'use server';
import { revalidatePath } from 'next/cache';
import { draftMode } from 'next/headers';

/**
 * Enables or disables draft mode based on the preview secret in search parameters
 * @param searchParams - URL search parameters containing the preview secret
 */
export const draftPreview = async (searchParams: { [key: string]: string | string[] | undefined }) => {
  const previewSecret = searchParams['preview-secret'];
  const mode = await draftMode();

  if (previewSecret === process.env.PREVIEW_SECRET) {
    mode.enable();
  } else {
    mode.disable();
  }
};

/**
 * Revalidates the root path to refresh cached content
 * Used by the live preview component to update content when changes are made in Payload CMS
 */
export const revalidatePreview = async () => {
  revalidatePath('/');
};
