import type { ParsedBlock } from '../lib/parser-types.js';
import { loadHtml, extractTitle } from '../lib/html-parser.js';
import { textToLexical } from '../lib/lexical.js';

export function parse(html: string): ParsedBlock {
  const $ = loadHtml(html);

  const title = extractTitle($) || undefined;

  const items: Array<{ title: string; content: unknown }> = [];

  $('button, [role="button"], h3').each((_, el) => {
    const $el = $(el);
    const itemTitle = $el.text().trim();
    const $content = $el.next();
    const contentText = $content.text().trim();

    if (itemTitle && itemTitle.length < 200) {
      items.push({
        title: itemTitle,
        content: textToLexical(contentText || 'Obsah kroku.'),
      });
    }
  });

  if (items.length === 0) {
    $('article').each((_, el) => {
      const $el = $(el);
      const itemTitle = $el.find('h3, h4, strong').first().text().trim();
      const contentText = $el.find('p').first().text().trim();
      if (itemTitle) {
        items.push({
          title: itemTitle,
          content: textToLexical(contentText || 'Obsah kroku.'),
        });
      }
    });
  }

  return {
    blockType: 'stepsVerticalCollapsibleBlock',
    data: {
      title,
      items,
    },
    images: [],
    svgs: [],
  };
}
