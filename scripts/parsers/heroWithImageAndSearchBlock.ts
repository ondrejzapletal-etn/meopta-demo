import type { ParsedBlock } from '../lib/parser-types.js';
import { loadHtml, extractTitle, extractLinks, extractImages } from '../lib/html-parser.js';

export function parse(html: string): ParsedBlock {
  const $ = loadHtml(html);

  const title = extractTitle($) || 'HERO s vyhledáváním';
  const description = $('p').first().text().trim();
  const images = extractImages($);
  const links = extractLinks($);

  // Extract search placeholder
  const searchPlaceholder =
    $('input[type="search"], input[type="text"]').attr('placeholder') ||
    'Co hledáte?';

  const linkItems = links.slice(0, 2).map((link, i) => ({
    label: link.label,
    url: link.url,
    appearance: i === 0 ? 'primary' : 'outline',
  }));

  const parsedImages = images.length > 0
    ? [{ fieldPath: 'image', url: images[0]!.src, alt: images[0]!.alt || title }]
    : [];

  return {
    blockType: 'heroWithImageAndSearchBlock',
    data: {
      title,
      description: description || undefined,
      searchPlaceholder,
      backgroundColor: 'green',
      links: linkItems.length > 0 ? linkItems : undefined,
    },
    images: parsedImages,
    svgs: [],
  };
}
