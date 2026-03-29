import type { ParsedBlock } from '../lib/parser-types.js';
import { loadHtml, extractTitle } from '../lib/html-parser.js';

export function parse(html: string): ParsedBlock {
  const $ = loadHtml(html);

  const title = extractTitle($) || undefined;

  const items: Array<{
    title: string;
    description: string;
    discount: string;
    linkUrl: string;
  }> = [];
  const images: ParsedBlock['images'] = [];

  // Reference HTML: articles with div containing "Až <span>6 %</span> lastminute.com"
  // No h3/h4, no img tags — images are CSS class backgrounds (not extractable)
  $('article').each((_, el) => {
    const $el = $(el);
    const fullText = $el.text().trim();
    if (!fullText) return;

    // Discount percentage is in a nested span (e.g., "6 %", "10 %")
    const discountMatch = fullText.match(/(\d+\s*%)/);
    const discount = discountMatch ? discountMatch[1] : '';

    // Brand name: remove "Až" prefix and discount percentage
    const brandName = fullText
      .replace(/^Až\s*/, '')
      .replace(/\d+\s*%/, '')
      .trim();

    if (brandName) {
      items.push({
        title: brandName,
        description: '',
        discount: discount ? `Až ${discount}` : '',
        linkUrl: '/',
      });
    }
  });

  return {
    blockType: 'discountsBlock',
    data: {
      title,
      itemsPerPage: 6,
      items,
    },
    images,
    svgs: [],
  };
}
