import type { ParsedBlock } from '../lib/parser-types.js';
import { loadHtml, extractTitle, extractLinks } from '../lib/html-parser.js';
import { textToLexical } from '../lib/lexical.js';

export function parse(html: string): ParsedBlock {
  const $ = loadHtml(html);

  const title = extractTitle($);
  const description = $('p').first().text().trim();
  const links = extractLinks($);

  const content = textToLexical(description || 'Demo obsah');

  return {
    blockType: 'richTextBlock',
    data: {
      title: title || undefined,
      content,
      ...(links.length > 0 ? {} : {}),
    },
    images: [],
    svgs: [],
  };
}
