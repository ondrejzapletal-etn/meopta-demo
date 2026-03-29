import type { ParsedBlock } from '../lib/parser-types.js';
import { loadHtml, extractTitle, extractLinks } from '../lib/html-parser.js';
import { textToLexical } from '../lib/lexical.js';

export function parse(html: string): ParsedBlock {
  const $ = loadHtml(html);

  const title = extractTitle($);
  const description = $('p').first().text().trim();
  const links = extractLinks($);

  return {
    blockType: 'infoPlainBlock',
    data: {
      title: title || undefined,
      content: textToLexical(description || 'Demo obsah'),
      linkLabel: links[0]?.label || undefined,
      linkUrl: links[0]?.url || undefined,
      secondaryLinkLabel: links[1]?.label || undefined,
      secondaryLinkUrl: links[1]?.url || undefined,
    },
    images: [],
    svgs: [],
  };
}
