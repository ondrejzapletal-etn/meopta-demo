import type { ParsedBlock } from '../lib/parser-types.js';
import { loadHtml } from '../lib/html-parser.js';

export function parse(html: string): ParsedBlock {
  const $ = loadHtml(html);

  const title = $('h1').first().text().trim() || $('h2').first().text().trim() || undefined;

  // Extract button link — the <a> that contains a <span> with text + arrow SVG (not a card link)
  let linkLabel: string | undefined;
  let linkUrl: string | undefined;
  $('a[href]').each((_, el) => {
    const $el = $(el);
    const spans = $el.find('span');
    const childDivs = $el.children('div');
    // Card links have child divs; the button link has spans instead
    if (childDivs.length >= 2) return;
    if (spans.length > 0 && $el.find('svg').length > 0 && !linkLabel) {
      linkLabel = spans.first().text().trim() || undefined;
      linkUrl = $el.attr('href') || undefined;
    }
  });

  // Extract counter text (the "100" number)
  let counterText: string | undefined;
  $('div').each((_, el) => {
    const text = $(el).clone().children().remove().end().text().trim();
    if (/^\d{2,3}$/.test(text)) {
      counterText = text;
      return false; // break
    }
  });

  // Extract card items
  const items: Array<{
    number: number;
    title: string;
    url: string;
    description: string;
  }> = [];

  const images: ParsedBlock['images'] = [];
  const seen = new Set<string>();

  $('a[href]').each((_, el) => {
    const $el = $(el);
    const href = $el.attr('href') || '';
    const childDivs = $el.children('div');
    if (childDivs.length < 2) return;
    if (seen.has(href)) return;

    const numberText = childDivs.first().text().trim().replace(/\s*\/\s*$/, '');
    const cardTitle = childDivs.eq(1).text().trim();

    if (cardTitle) {
      const idx = items.length;
      seen.add(href);
      items.push({
        number: parseInt(numberText, 10) || idx + 1,
        title: cardTitle,
        url: href,
        description: '',
      });

      // Extract card image (added as <img> inside <a>)
      const cardImg = $el.find('img').first();
      if (cardImg.length) {
        images.push({
          fieldPath: `items.${idx}.image`,
          url: cardImg.attr('src') || '',
          alt: cardImg.attr('alt') || '',
        });
      }
    }
  });

  // Extract decorative image (heart-shaped gift box) — last <img> outside cards
  const allImgs = $('img');
  const lastImg = allImgs.last();
  if (lastImg.length && !lastImg.closest('a[href]').length) {
    images.push({
      fieldPath: 'image',
      url: lastImg.attr('src') || '',
      alt: lastImg.attr('alt') || '',
    });
  }

  return {
    blockType: 'heroReasonsSimplifiedBlock',
    data: {
      title,
      linkLabel,
      linkUrl,
      counterText,
      items,
    },
    images,
    svgs: [],
  };
}
