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
  const images: ParsedBlock['images'] = [];

  // Reference HTML: article[0] = header (h2 + p), article[1+] = product cards
  // Cards have SVG illustrations (not <img>), titles in <p> tags (not h3/h4)
  // Card structure: svg + div containing p (title) + p (description) + optional a (link)
  $('article').each((_, el) => {
    const $el = $(el);

    // Skip header article (contains h2)
    if ($el.find('h2').length > 0) {
      title = $el.find('h2').first().text().trim() || title;
      return;
    }

    // Titles and descriptions are in <p> tags
    const ps = $el.find('p');
    const itemTitle = ps.first().text().trim();
    const description = ps.eq(1).text().trim();

    // Link button (e.g., "Více informací")
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
    blockType: 'productCardHorizontalBlock',
    data: {
      title,
      items,
    },
    images,
    svgs: [],
  };
}
