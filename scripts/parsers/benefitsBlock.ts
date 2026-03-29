import type { ParsedBlock } from '../lib/parser-types.js';
import { loadHtml, extractTitle } from '../lib/html-parser.js';

export function parse(html: string): ParsedBlock {
  const $ = loadHtml(html);

  const title = extractTitle($) || undefined;
  const description = $('article').first().find('p').first().text().trim() || undefined;

  // Extract benefit items from repeated article elements (inside the grid)
  const items: Array<{ title: string; description: string }> = [];
  const svgs: ParsedBlock['svgs'] = [];

  // The benefits items are article elements inside the grid div
  const benefitArticles = $('article article, div[class*="1k815o"] article');
  if (benefitArticles.length === 0) {
    // Fallback: all articles except the wrapper
    $('article').each((i, el) => {
      if (i === 0) return; // Skip outer wrapper article
      const $el = $(el);
      const itemTitle = $el.find('h3, h4').first().text().trim();
      const itemDesc = $el.find('[data-list-style-type], div:last-child').last().text().trim();
      if (itemTitle) {
        items.push({ title: itemTitle, description: itemDesc });
        const svgEl = $el.find('svg').first();
        if (svgEl.length) {
          svgs.push({
            fieldPath: `items.${items.length - 1}.icon`,
            content: $.html(svgEl),
            name: `benefit-icon-${items.length - 1}`,
          });
        }
      }
    });
  } else {
    benefitArticles.each((i, el) => {
      const $el = $(el);
      const itemTitle = $el.find('h3, h4').first().text().trim();
      const itemDesc = $el.find('[data-list-style-type], div:last-child').text().trim();
      if (itemTitle) {
        items.push({ title: itemTitle, description: itemDesc });
        const svgEl = $el.find('svg').first();
        if (svgEl.length) {
          svgs.push({
            fieldPath: `items.${items.length - 1}.icon`,
            content: $.html(svgEl),
            name: `benefit-icon-${items.length - 1}`,
          });
        }
      }
    });
  }

  // Determine columns based on item count
  const columns = items.length <= 2 ? '2' : items.length >= 4 ? '4' : '3';

  return {
    blockType: 'benefitsBlock',
    data: {
      title,
      description,
      columns,
      items: items.map((item) => ({
        title: item.title,
        description: item.description || undefined,
      })),
    },
    images: [],
    svgs,
  };
}
