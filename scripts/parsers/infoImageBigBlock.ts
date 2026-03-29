import type { ParsedBlock } from '../lib/parser-types.js';
import { loadHtml, extractTitle, extractLinks, extractImages, extractBackgroundImages } from '../lib/html-parser.js';
import { textToLexical } from '../lib/lexical.js';

export function parse(html: string): ParsedBlock {
  const $ = loadHtml(html);

  const title = extractTitle($) || 'Obsah s velkým obrázkem';
  const description = $('p').first().text().trim();
  const links = extractLinks($);
  const images = extractImages($);

  // Image is required for this block type — fallback to CSS background-image
  const bgImages = images.length === 0 ? extractBackgroundImages($) : [];

  const parsedImages = images.length > 0
    ? [{ fieldPath: 'image', url: images[0]!.src, alt: images[0]!.alt || title }]
    : bgImages.length > 0
      ? [{ fieldPath: 'image', url: bgImages[0]!, alt: title }]
      : [{ fieldPath: 'image', url: 'placeholder', alt: title }];

  return {
    blockType: 'infoImageBigBlock',
    data: {
      title,
      description: description ? textToLexical(description) : undefined,
      imagePosition: 'left',
      linkLabel: links[0]?.label || undefined,
      linkUrl: links[0]?.url || undefined,
    },
    images: parsedImages,
    svgs: [],
  };
}
