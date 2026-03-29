import type { ParsedBlock } from '../lib/parser-types.js';
import { loadHtml, extractTitle } from '../lib/html-parser.js';

export function parse(html: string): ParsedBlock {
  const $ = loadHtml(html);

  const title = extractTitle($) || 'Můžete získat 2 různé balíčky výhod';

  // Tab titles from <button> elements: "Platím s Air Bank" / "Žiju s Air Bank"
  const beforeTitle = $('button').first().text().trim() || 'Platím s Air Bank';
  const afterTitle = $('button').eq(1).text().trim() || 'Žiju s Air Bank';

  // Benefit values are in <b> elements, 4 per tier, duplicated for responsive
  // b[0-3] = tier 1 (Platím) benefits, b[4-7] = tier 2 (Žiju) benefits
  // Each b's parent structure: b → div (value cell) → div (benefit row)
  // Label is in a span within the first child div of the benefit row
  const tier1: Array<{ label: string; value: string }> = [];
  const tier2: Array<{ label: string; value: string }> = [];

  $('b').each((i, el) => {
    if (i >= 8) return; // Skip responsive duplicates

    const $b = $(el);
    const value = $b.text().trim();
    const $row = $b.parent().parent();
    const label = $row.children('div').first().find('span').first().text().trim();

    if (i < 4) {
      tier1.push({ label, value });
    } else {
      tier2.push({ label, value });
    }
  });

  const items = tier1.map((before, i) => ({
    label: before.label,
    beforeValue: before.value || '✓',
    afterValue: tier2[i]?.value || '✓',
    highlight: false,
  }));

  return {
    blockType: 'loyalCustomerBenefitsBlock',
    data: {
      title,
      beforeTitle,
      afterTitle,
      items,
    },
    images: [],
    svgs: [],
  };
}
