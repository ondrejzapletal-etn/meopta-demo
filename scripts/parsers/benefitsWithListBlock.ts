import type { ParsedBlock } from '../lib/parser-types.js';
import { loadHtml, extractTitle } from '../lib/html-parser.js';

export function parse(html: string): ParsedBlock {
  const $ = loadHtml(html);

  const title = extractTitle($) || undefined;

  // Extract description (perex) — the <p> right after <h2>
  let description: string | undefined;
  const perexEl = $('h2').next('p');
  if (perexEl.length) {
    description = perexEl.text().trim() || undefined;
  }

  // Extract cards (upper section: SVG icon + h3 + text)
  const cards: Array<{ title?: string; text?: string }> = [];
  const svgs: ParsedBlock['svgs'] = [];

  // Cards are inside the first grid section (css-2eo29l or css-op0gvx > css-jdhla5)
  $('article article').each((i, el) => {
    const cardTitle = $(el).find('h3').first().text().trim() || undefined;
    const cardText = $(el).find('[data-list-style-type]').first().text().trim() || undefined;

    // Extract SVG icon
    const svgEl = $(el).find('svg').first();
    if (svgEl.length) {
      const svgHtml = $.html(svgEl);
      const svgName = `benefitsWithList-card-${i}`;
      svgs.push({
        name: svgName,
        content: svgHtml,
        fieldPath: `cards.${i}.icon`,
      });
    }

    cards.push({ title: cardTitle, text: cardText });
  });

  // Extract checklist items (lower section with checkmark + text)
  const items: Array<{ text: string }> = [];
  // The checklist items are in the second grid section with checkmark SVGs
  const checklistSection = $('[class*="css-op0gvx"], [class*="css-4y6h17"]').last();
  checklistSection.find('[class*="css-1rvxldj"]').each((_, el) => {
    const text = $(el).find('p').first().text().trim();
    if (text) items.push({ text });
  });

  // Fallback: if no checklist items found via class, try data-list-style-type="check" in second section
  if (items.length === 0) {
    let inChecklistSection = false;
    $('[data-list-style-type="check"]').each((_, el) => {
      const parent = $(el).closest('article article');
      // Skip card-level check items (in the upper card section)
      if (parent.length && parent.find('svg[viewBox="0 0 56 56"]').length) return;
      inChecklistSection = true;
      const text = $(el).find('p').text().trim() || $(el).text().trim();
      if (text) items.push({ text });
    });
    if (!inChecklistSection) {
      // Final fallback: look for p elements inside the second container section
      $('p[class*="css-1gkvtsy"]').each((_, el) => {
        const text = $(el).text().trim();
        if (text) items.push({ text });
      });
    }
  }

  return {
    blockType: 'benefitsWithListBlock',
    data: {
      title,
      description,
      cards,
      items,
      expanded: false,
    },
    images: [],
    svgs,
  };
}
