import type { ParsedBlock } from '../lib/parser-types.js';
import { loadHtml, extractTitle, extractLinks, extractImages } from '../lib/html-parser.js';

export function parse(html: string): ParsedBlock {
  const $ = loadHtml(html);

  const title = extractTitle($) || 'Banner';
  const description = $('p').first().text().trim();
  const links = extractLinks($);
  const images = extractImages($);

  const parsedImages = images.length > 0
    ? [{ fieldPath: 'image', url: images[0]!.src, alt: images[0]!.alt || title }]
    : [];

  // Try to find sticker text from badge/sticker elements
  const stickerText = $('[class*="sticker"], [class*="badge"], [class*="label"]').first().text().trim() || undefined;

  return {
    blockType: 'jumbotronWithStickerBlock',
    data: {
      title,
      description: description || undefined,
      stickerText,
      linkLabel: links[0]?.label || undefined,
      linkUrl: links[0]?.url || undefined,
      backgroundColor: 'green',
    },
    images: parsedImages,
    svgs: [],
  };
}
