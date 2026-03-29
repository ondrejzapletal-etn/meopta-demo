import type { ParsedBlock } from '../lib/parser-types.js';
import { loadHtml, extractTitle } from '../lib/html-parser.js';

export function parse(html: string): ParsedBlock {
  const $ = loadHtml(html);

  const title = extractTitle($) || undefined;

  const items: Array<{
    icon: string;
    title: string;
    description: string;
    linkLabel: string;
    linkUrl: string;
  }> = [];

  $('article, [class*="card"]').each((_, el) => {
    const $el = $(el);
    const itemTitle = $el.find('h3, h4').first().text().trim();
    const description = $el.find('p').first().text().trim();
    const link = $el.find('a[href]').first();
    const linkLabel = link.find('span').first().text().trim() || link.text().trim();
    const linkUrl = link.attr('href') || '/';

    if (itemTitle) {
      items.push({
        icon: 'creditCard',
        title: itemTitle,
        description,
        linkLabel,
        linkUrl,
      });
    }
  });

  return {
    blockType: 'productCardsVerticalBlock',
    data: {
      title,
      items,
    },
    images: [],
    svgs: [],
  };
}
