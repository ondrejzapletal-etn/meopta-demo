import type { ParsedBlock } from '../lib/parser-types.js';
import { loadHtml, extractTitle } from '../lib/html-parser.js';

export function parse(html: string): ParsedBlock {
  const $ = loadHtml(html);

  const title = extractTitle($) || undefined;

  const items: Array<{
    title: string;
    description: string;
    linkLabel: string;
    linkUrl: string;
  }> = [];

  // Strategy 1: links with aria-label (production HTML)
  $('a[aria-label]').each((_, el) => {
    const $el = $(el);
    const href = $el.attr('href') || '/';
    const text = $el.text().trim();

    if (text && href !== '#') {
      items.push({
        title: text,
        description: '',
        linkLabel: 'Více informací',
        linkUrl: href,
      });
    }
  });

  // Strategy 2: cards structured as <a> wrapping <article> with <h5> title
  // (reference/scraped HTML pattern)
  if (items.length === 0) {
    $('a[href] article h5').each((_, el) => {
      const $h5 = $(el);
      const $link = $h5.closest('a');
      const href = $link.attr('href') || '/';
      const text = $h5.text().trim();

      if (text) {
        items.push({
          title: text,
          description: '',
          linkLabel: 'Více informací',
          linkUrl: href,
        });
      }
    });
  }

  // Strategy 3: fallback - links inside the card grid area (production div-based layout)
  if (items.length === 0) {
    $('a[href]').each((_, el) => {
      const $el = $(el);
      const href = $el.attr('href') || '';
      const text = $el.find('div').text().trim() || $el.text().trim();

      // Skip if it's the title area or a generic link
      if (!text || href === '#' || href === '/') return;

      items.push({
        title: text,
        description: '',
        linkLabel: 'Více informací',
        linkUrl: href,
      });
    });
  }

  return {
    blockType: 'infoCenterCardsBlock',
    data: {
      title,
      items,
    },
    images: [],
    svgs: [],
  };
}
