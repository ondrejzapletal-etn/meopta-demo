import type { ParsedBlock } from '../lib/parser-types.js';
import { loadHtml, extractTitle } from '../lib/html-parser.js';

export function parse(html: string): ParsedBlock {
  const $ = loadHtml(html);

  const title = extractTitle($) || undefined;

  const items: Array<{
    name: string;
    role: string;
    linkedinUrl: string;
  }> = [];
  const images: ParsedBlock['images'] = [];

  // Management cards have person name, role, image, LinkedIn
  $('article, [class*="card"]').each((_, el) => {
    const $el = $(el);
    const name = $el.find('h3, h4, strong').first().text().trim();
    const role = $el.find('p, [class*="role"], [class*="position"]').first().text().trim();
    const linkedinUrl = $el.find('a[href*="linkedin"]').attr('href') || '';

    if (name) {
      items.push({ name, role, linkedinUrl });

      const img = $el.find('img').first();
      if (img.length) {
        images.push({
          fieldPath: `items.${items.length - 1}.image`,
          url: img.attr('src') || img.attr('data-src') || '',
          alt: img.attr('alt') || name,
        });
      }
    }
  });

  return {
    blockType: 'topManagementCardsBlock',
    data: {
      title,
      items,
    },
    images,
    svgs: [],
  };
}
