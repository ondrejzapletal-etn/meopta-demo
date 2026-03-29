import type { ParsedBlock } from '../lib/parser-types.js';
import { loadHtml, extractTitle, extractLinks } from '../lib/html-parser.js';
import { textToLexical } from '../lib/lexical.js';

export function parse(html: string): ParsedBlock {
  const $ = loadHtml(html);

  const title = extractTitle($) || 'Hero bez obrázku';
  const description = $('p').first().text().trim();
  const links = extractLinks($);

  const linkItems = links.slice(0, 2).map((link, i) => ({
    label: link.label,
    url: link.url,
    appearance: i === 0 ? 'primary' : 'outline',
  }));

  return {
    blockType: 'heroPlainBlock',
    data: {
      backgroundColor: 'green',
      title,
      description: description ? textToLexical(description) : undefined,
      links: linkItems.length > 0 ? linkItems : undefined,
    },
    images: [],
    svgs: [],
  };
}
