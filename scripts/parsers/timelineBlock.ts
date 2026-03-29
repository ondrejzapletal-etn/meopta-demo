import type { ParsedBlock } from '../lib/parser-types.js';
import { loadHtml, extractTitle } from '../lib/html-parser.js';

export function parse(html: string): ParsedBlock {
  const $ = loadHtml(html);

  const title = extractTitle($) || undefined;

  const items: Array<{
    year: string;
    title: string;
    description: string;
  }> = [];

  // Timeline items are in <li> elements (slider-slide)
  // Each contains <h3> with year and <div data-list-style-type="check"> with description
  $('li').each((_, el) => {
    const $el = $(el);
    const year = $el.find('h3').first().text().trim();
    if (!year || !/^\d{4}$/.test(year)) return;

    const description = $el.find('div[data-list-style-type]').first().text().trim();

    items.push({
      year,
      title: year,
      description: description || '',
    });
  });

  return {
    blockType: 'timelineBlock',
    data: {
      title,
      items,
    },
    images: [],
    svgs: [],
  };
}
