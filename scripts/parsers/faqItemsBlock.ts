import type { ParsedBlock } from '../lib/parser-types.js';
import { loadHtml, extractTitle } from '../lib/html-parser.js';
import { textToLexical } from '../lib/lexical.js';

export function parse(html: string): ParsedBlock {
  const $ = loadHtml(html);

  const title = extractTitle($) || undefined;

  const items: Array<{ title: string; content: unknown }> = [];

  // FAQ items are typically button + content pairs
  $('button, [role="button"], h3, [class*="accordion"]').each((_, el) => {
    const $el = $(el);
    const itemTitle = $el.text().trim();

    // Content is typically the next sibling
    const $content = $el.next();
    const contentText = $content.text().trim();

    if (itemTitle && itemTitle.length < 200) {
      items.push({
        title: itemTitle,
        content: textToLexical(contentText || 'Obsah odpovědi.'),
      });
    }
  });

  // If no items found via buttons, try div-based pattern
  if (items.length === 0) {
    $('article, [class*="item"]').each((_, el) => {
      const $el = $(el);
      const itemTitle = $el.find('h3, h4, strong').first().text().trim();
      const contentText = $el.find('p').first().text().trim();

      if (itemTitle) {
        items.push({
          title: itemTitle,
          content: textToLexical(contentText || 'Obsah odpovědi.'),
        });
      }
    });
  }

  return {
    blockType: 'faqItemsBlock',
    data: {
      title,
      numbered: true,
      allowMultiple: false,
      items,
    },
    images: [],
    svgs: [],
  };
}
