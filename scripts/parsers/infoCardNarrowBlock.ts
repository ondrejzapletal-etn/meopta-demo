import type { ParsedBlock } from '../lib/parser-types.js';
import { loadHtml } from '../lib/html-parser.js';

export function parse(html: string): ParsedBlock {
  const $ = loadHtml(html);

  // Block title is in <h1> (not h2)
  const title = $('h1').first().text().trim() || undefined;

  const items: Array<{
    number: number;
    title: string;
    description: string;
    linkLabel: string;
    linkUrl: string;
  }> = [];

  // Reference HTML: no articles, no card/reason classes
  // Cards are <a href="..."> elements with 2 child <div>s:
  //   div[0] = number text (e.g., "5 /")
  //   div[1] = label text (e.g., "Vše v aplikaci jednoduše")
  // Cards are duplicated for responsive layout — deduplicate by href
  const seen = new Set<string>();

  $('a[href]').each((_, el) => {
    const $el = $(el);
    const href = $el.attr('href') || '';

    // Skip non-card links (e.g., CTA buttons, empty hrefs)
    const childDivs = $el.children('div');
    if (childDivs.length < 2) return;
    if (seen.has(href)) return;

    const numberText = childDivs.first().text().trim().replace(/\s*\/\s*$/, '');
    const cardTitle = childDivs.eq(1).text().trim();

    if (cardTitle) {
      seen.add(href);
      items.push({
        number: parseInt(numberText, 10) || items.length + 1,
        title: cardTitle,
        description: '',
        linkLabel: cardTitle,
        linkUrl: href,
      });
    }
  });

  return {
    blockType: 'infoCardNarrowBlock',
    data: {
      title,
      items,
    },
    images: [],
    svgs: [],
  };
}
