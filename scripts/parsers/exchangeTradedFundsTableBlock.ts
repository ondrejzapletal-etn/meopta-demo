import type { ParsedBlock } from '../lib/parser-types.js';
import { loadHtml, extractTitle } from '../lib/html-parser.js';

export function parse(html: string): ParsedBlock {
  const $ = loadHtml(html);

  const title = extractTitle($) || 'Ceník';

  // Reference HTML: div-based pricing table (no thead/tbody/tr/td)
  // Structure: groups container has N group children
  // Each group: first child = header (2 h4s: left label + right value column), rest = data rows
  // Each data row: 2 child divs: left (p label) + right (span value)

  // Navigate from first h4 to the groups container:
  // h4 → div → div → div (header div) → div (group) → div (groups container)
  const firstH4 = $('h4').first();
  if (!firstH4.length) {
    return { blockType: 'exchangeTradedFundsTableBlock', data: { title, columns: [], rows: [] }, images: [], svgs: [] };
  }

  const groupDiv = firstH4.parent().parent().parent().parent(); // group container
  const groupsParent = groupDiv.parent(); // parent holding all groups

  // Collect column headers and rows from all groups
  const columns: Array<{ label: string }> = [];
  const rows: Array<{ label: string; values: Array<{ value: string }> }> = [];

  groupsParent.children().each((_, group) => {
    const $group = $(group);
    const children = $group.children();

    // First child = header with 2 h4s
    const headerChild = children.first();
    const h4s = headerChild.find('h4');
    if (h4s.length >= 2) {
      const rightH4 = $(h4s[1]).text().trim();
      columns.push({ label: rightH4 });
    }

    // Remaining children = data rows
    children.each((j, kid) => {
      if (j === 0) return; // Skip header
      const $kid = $(kid);
      const label = $kid.find('p').first().text().trim();
      const value = $kid.find('span').first().text().trim();
      if (label) {
        // Create values array matching column count
        // This row's value goes in the column corresponding to this group
        const values: Array<{ value: string }> = columns.map((_, ci) =>
          ci === columns.length - 1 ? { value } : { value: '' },
        );
        rows.push({ label, values });
      }
    });
  });

  return {
    blockType: 'exchangeTradedFundsTableBlock',
    data: {
      title,
      columns,
      rows,
    },
    images: [],
    svgs: [],
  };
}
