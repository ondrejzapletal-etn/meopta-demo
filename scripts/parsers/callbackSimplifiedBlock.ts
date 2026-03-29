import type { ParsedBlock } from '../lib/parser-types.js';
import { loadHtml, extractTitle } from '../lib/html-parser.js';

export function parse(html: string): ParsedBlock {
  const $ = loadHtml(html);

  const title = extractTitle($) || 'Kontaktujte nás';

  // Get description from paragraph
  const paragraphs: string[] = [];
  $('p').each((_, el) => {
    const text = $(el).text().trim();
    if (text) paragraphs.push(text);
  });

  return {
    blockType: 'callbackSimplifiedBlock',
    data: {
      title,
      description: paragraphs[0] || undefined,
      showPhone: true,
      showSubject: true,
    },
    images: [],
    svgs: [],
  };
}
