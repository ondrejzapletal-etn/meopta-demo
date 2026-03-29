import { Media } from '@repo/shared/payload-types';

/**
 * Get the image src from the image url. If the image url is not from the CMS, return the image url. Otherwise, return the image url with the CMS_URL.
 * @param image - The image url
 * @returns The image url with the CMS_URL or the image url if it is not from the CMS
 */
export const getImageSrc = (image: string) => {
  if (!image.startsWith('/api/media')) return image;
  const cmsUrl = process.env.CMS_URL ?? process.env.NEXT_PUBLIC_CMS_URL ?? '';
  return `${cmsUrl}${image}`;
};

/**
 * Get the image src from the image media object. If the image url is not from the CMS, return the image url.
 * Otherwise, return the image url with the CMS_URL.
 * If the image is not found and a placeholder dimension is provided, return a placeholder image.
 * @param image - The image media object or the image id
 * @param placeholder - The placeholder image size
 * @returns The image url with the CMS_URL or the image url if it is not from the CMS
 */
export const getImageSrcWithFallback = (
  image?: Media | (number | null),
  placeholder?: { width: number; height: number },
) => {
  if (typeof image !== 'object') return '';
  if (!image?.url) {
    if (placeholder) {
      return `https://placehold.co/${placeholder.width}x${placeholder.height}.png`;
    } else return '';
  }
  return getImageSrc(image.url);
};
