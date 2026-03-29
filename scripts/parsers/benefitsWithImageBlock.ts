import type { ParsedBlock } from '../lib/parser-types.js';
import { loadHtml, extractTitle } from '../lib/html-parser.js';

export function parse(html: string): ParsedBlock {
  const $ = loadHtml(html);

  const title = extractTitle($) || undefined;
  const description = $('article').first().find('> p, > div > p').first().text().trim() || undefined;

  const items: Array<{ title: string; description: string }> = [];
  const images: ParsedBlock['images'] = [];

  // Inner articles contain img + p (no h3/h4 titles in reference HTML)
  $('article article').each((i, el) => {
    const $el = $(el);
    const img = $el.find('img').first();
    const itemDesc = $el.find('p').first().text().trim();
    const itemTitle = $el.find('h3, h4').first().text().trim() || img.attr('alt') || `Benefit ${i + 1}`;

    items.push({ title: itemTitle, description: itemDesc });

    if (img.length) {
      images.push({
        fieldPath: `items.${items.length - 1}.image`,
        url: img.attr('src') || img.attr('data-src') || '',
        alt: img.attr('alt') || itemTitle,
      });
    }
  });

  const columns = items.length <= 2 ? '2' : items.length >= 4 ? '4' : '3';

  return {
    blockType: 'benefitsWithImageBlock',
    data: {
      title,
      description,
      columns,
      items: items.map((item) => ({
        title: item.title,
        description: item.description || undefined,
      })),
    },
    images,
    svgs: [],
  };
}
