import type { ParsedBlock } from '../lib/parser-types.js';
import { loadHtml, extractTitle, extractLinks, extractImages } from '../lib/html-parser.js';
import { textToLexical } from '../lib/lexical.js';

export function parse(html: string): ParsedBlock {
  const $ = loadHtml(html);

  const title = extractTitle($) || 'Hero s obrázkem';
  const description = $('p').first().text().trim();
  const links = extractLinks($);
  const images = extractImages($);

  const linkItems = links.slice(0, 2).map((link, i) => ({
    label: link.label,
    url: link.url,
    appearance: i === 0 ? 'primary' : 'outline',
  }));

  const parsedImages = images.length > 0
    ? [{ fieldPath: 'image', url: images[0]!.src, alt: images[0]!.alt || title }]
    : [];

  return {
    blockType: 'heroWithImageBlock',
    data: {
      backgroundColor: 'lightGrey',
      imagePosition: 'right',
      title,
      description: description ? textToLexical(description) : undefined,
      links: linkItems.length > 0 ? linkItems : undefined,
    },
    images: parsedImages,
    svgs: [],
  };
}
