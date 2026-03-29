import type { ParsedBlock } from '../lib/parser-types.js';
import { loadHtml, extractTitle, extractLinks, extractImages } from '../lib/html-parser.js';
import { textToLexical } from '../lib/lexical.js';

export function parse(html: string): ParsedBlock {
  const $ = loadHtml(html);

  const title = extractTitle($) || 'Obsah s dvojobrázkem';
  const description = $('p').first().text().trim();
  const links = extractLinks($);
  const images = extractImages($);

  const parsedImages: ParsedBlock['images'] = [];
  if (images.length >= 1) {
    parsedImages.push({
      fieldPath: 'imageLeft',
      url: images[0]!.src,
      alt: images[0]!.alt || `${title} - left`,
    });
  }
  if (images.length >= 2) {
    parsedImages.push({
      fieldPath: 'imageRight',
      url: images[1]!.src,
      alt: images[1]!.alt || `${title} - right`,
    });
  }

  return {
    blockType: 'infoDoubleImageBlock',
    data: {
      title,
      description: description ? textToLexical(description) : undefined,
      linkLabel: links[0]?.label || undefined,
      linkUrl: links[0]?.url || undefined,
    },
    images: parsedImages,
    svgs: [],
  };
}
