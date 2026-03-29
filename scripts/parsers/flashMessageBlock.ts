import type { ParsedBlock } from '../lib/parser-types.js';
import { loadHtml } from '../lib/html-parser.js';

export function parse(html: string): ParsedBlock {
  const $ = loadHtml(html);

  // FlashMessage has a simple text content inside a span
  const content = $('span').first().text().trim() ||
    $('section').text().trim();

  return {
    blockType: 'flashMessageBlock',
    data: {
      title: 'TIP',
      content: content || 'Informace pro zákazníky.',
    },
    images: [],
    svgs: [],
  };
}
