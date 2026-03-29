import type { ParsedBlock } from '../lib/parser-types.js';
import { loadHtml, extractTitle, extractImages } from '../lib/html-parser.js';

export function parse(html: string): ParsedBlock {
  const $ = loadHtml(html);

  const title = extractTitle($) || 'Stahnete si aplikaci';
  const description = $('p').first().text().trim();

  const images = extractImages($);
  const parsedImages = images.length > 0
    ? [{ fieldPath: 'image', url: images[0]!.src, alt: images[0]!.alt || title }]
    : [];

  return {
    blockType: 'loyalCustomerApplicationBlock',
    data: {
      title,
      description: description || undefined,
      rating: '4.8',
    },
    images: parsedImages,
    svgs: [],
  };
}
