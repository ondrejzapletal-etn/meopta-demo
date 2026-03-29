import type { ParsedBlock } from '../lib/parser-types.js';
import { loadHtml, extractTitle } from '../lib/html-parser.js';

export function parse(html: string): ParsedBlock {
  const $ = loadHtml(html);

  let title = extractTitle($) || undefined;

  const items: Array<{
    title: string;
    description: string;
    linkLabel: string;
    linkUrl: string;
  }> = [];

  $('article').each((_, el) => {
    const $el = $(el);
    if ($el.find('h2').length > 0) {
      title = $el.find('h2').first().text().trim() || title;
      return;
    }

    const ps = $el.find('p');
    const itemTitle = ps.first().text().trim();
    const description = ps.eq(1).text().trim();

    const link = $el.find('a[href]').first();
    const linkLabel = link.length
      ? (link.find('span').first().text().trim() || link.text().trim())
      : '';
    const linkUrl = link.attr('href') || '';

    if (itemTitle) {
      items.push({ title: itemTitle, description, linkLabel, linkUrl });
    }
  });

  return {
    blockType: 'productCardsHorizontalBlock',
    data: {
      title,
      items,
    },
    images: [],
    svgs: [],
  };
}
