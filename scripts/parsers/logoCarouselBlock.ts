import type { ParsedBlock } from '../lib/parser-types.js';
import { loadHtml, extractTitle, extractImages } from '../lib/html-parser.js';

export function parse(html: string): ParsedBlock {
  const $ = loadHtml(html);

  const title = extractTitle($) || undefined;
  const allImages = extractImages($);

  const logos: Array<{ name: string; url: string }> = [];
  const images: ParsedBlock['images'] = [];

  allImages.forEach((img, i) => {
    logos.push({
      name: img.alt || `Logo ${i + 1}`,
      url: '',
    });
    images.push({
      fieldPath: `logos.${i}.image`,
      url: img.src,
      alt: img.alt || `Logo ${i + 1}`,
    });
  });

  // If no img tags, check for SVG logos
  if (logos.length === 0) {
    $('svg').each((i, el) => {
      const $el = $(el);
      const viewBox = $el.attr('viewBox') || '';
      // Only count SVGs that are logos (large viewBox, not small icons)
      if (viewBox) {
        logos.push({ name: `Logo ${i + 1}`, url: '' });
      }
    });
  }

  return {
    blockType: 'logoCarouselBlock',
    data: {
      title,
      logos,
    },
    images,
    svgs: [],
  };
}
