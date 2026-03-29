import type { ParsedBlock } from '../lib/parser-types.js';
import { loadHtml, extractTitle, extractLinks, extractImages, extractBackgroundImages } from '../lib/html-parser.js';

export function parse(html: string): ParsedBlock {
  const $ = loadHtml(html);

  const title = extractTitle($) || 'Obrazek s textem';
  const description = $('p').first().text().trim();
  const links = extractLinks($);
  const images = extractImages($);
  const bgImages = images.length === 0 ? extractBackgroundImages($) : [];

  const parsedImages = images.length > 0
    ? [{ fieldPath: 'image', url: images[0]!.src, alt: images[0]!.alt || title }]
    : bgImages.length > 0
      ? [{ fieldPath: 'image', url: bgImages[0]!, alt: title }]
      : [{ fieldPath: 'image', url: 'placeholder', alt: title }];

  return {
    blockType: 'imageBlock',
    data: {
      title,
      description: description || undefined,
      imagePosition: 'right',
      linkLabel: links[0]?.label || undefined,
      linkUrl: links[0]?.url || undefined,
    },
    images: parsedImages,
    svgs: [],
  };
}
