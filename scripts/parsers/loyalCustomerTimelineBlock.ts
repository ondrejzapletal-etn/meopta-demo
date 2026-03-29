import type { ParsedBlock } from '../lib/parser-types.js';
import { loadHtml, extractTitle } from '../lib/html-parser.js';

export function parse(html: string): ParsedBlock {
  const $ = loadHtml(html);

  const title = extractTitle($) || undefined;
  const description = $('p').first().text().trim() || undefined;

  const items: Array<{
    step: string;
    title: string;
    description: string;
  }> = [];

  const svgs: ParsedBlock['svgs'] = [];

  // Reference HTML: timeline items are div children inside a scroll container
  // Each item has class css-1njavpf, containing:
  //   - div.css-kqv77x with SVG icon + connector line
  //   - div.css-1446p72 with text label (may contain nested <p>)
  // We select items by finding divs that contain both an SVG and a text label div
  const containerEl = $('div').filter((_, el) => {
    const children = $(el).children('div');
    // Container has 4+ timeline item children, each containing svg
    return children.length >= 3 && children.filter((__, child) => $(child).find('svg').length > 0).length >= 3;
  }).first();

  if (containerEl.length > 0) {
    containerEl.children('div').each((i, el) => {
      const $el = $(el);
      // Extract text from the label div (last child div that doesn't contain svg)
      const textDivs = $el.children('div').filter((_, child) => $(child).find('svg').length === 0);
      const text = textDivs.text().trim();

      // Extract SVG from icon container
      const svg = $el.find('svg').first();
      if (svg.length > 0) {
        svgs.push({
          fieldPath: `items.${i}.icon`,
          svg: $.html(svg),
        });
      }

      if (text) {
        items.push({
          step: String(i + 1),
          title: text,
          description: '',
        });
      }
    });
  }

  // Fallback: try li or article elements
  if (items.length === 0) {
    $('li, article').each((_, el) => {
      const $el = $(el);
      const step = $el.find('h3, h4').first().text().trim();
      const desc = $el.find('p').first().text().trim();
      if (step) {
        items.push({ step, title: step, description: desc || '' });
      }
    });
  }

  return {
    blockType: 'loyalCustomerTimelineBlock',
    data: {
      title,
      description,
      items,
    },
    images: [],
    svgs,
  };
}
