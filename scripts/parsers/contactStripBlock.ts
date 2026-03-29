import type { ParsedBlock } from '../lib/parser-types.js';
import { loadHtml, extractLinks } from '../lib/html-parser.js';

export function parse(html: string): ParsedBlock {
  const $ = loadHtml(html);

  const text = $('p').first().text().trim() ||
    $('[class*="evzb5c"]').text().trim() ||
    'Potřebujete poradit?';

  const links = extractLinks($);
  const link = links[0];

  return {
    blockType: 'contactStripBlock',
    data: {
      text,
      linkLabel: link?.label || 'Kontaktujte nás',
      linkUrl: link?.url || '/',
      backgroundColor: 'lightGreen',
    },
    images: [],
    svgs: [],
  };
}
