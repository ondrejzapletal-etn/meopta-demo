import type { ParsedBlock } from '../lib/parser-types.js';
import { loadHtml, extractTitle } from '../lib/html-parser.js';

export function parse(html: string): ParsedBlock {
  const $ = loadHtml(html);

  const title = extractTitle($) || 'Srovnání';

  const banks: Array<{ name: string }> = [];
  const features: Array<{
    label: string;
    values: Array<{ value: string; subtitle?: string; highlighted: boolean }>;
  }> = [];
  const images: ParsedBlock['images'] = [];

  // Reference HTML: div-based table (no thead/tbody/tr/td)
  // Each "column" is a div with exactly 11 direct div children (6 data + 5 separators)
  // Even-indexed children (0,2,4,6,8,10) are data cells, odd are separators
  // Column 1 = feature labels (header), Columns 2+ = bank data
  const columnEls: cheerio.Element[] = [];
  $('div').each((_, el) => {
    if ($(el).children('div').length === 11) {
      columnEls.push(el);
    }
  });

  if (columnEls.length < 2) {
    return { blockType: 'compareTableBlock', data: { title, banks, features }, images, svgs: [] };
  }

  // Extract feature labels from header column (first column)
  const headerCells = $(columnEls[0]).children('div');
  const featureLabels: string[] = [];
  headerCells.each((i, cell) => {
    if (i % 2 === 0) {
      const $cell = $(cell);
      // cell[0] has 2 child divs (label repeated), cells[2+] have direct text
      const childDivs = $cell.children('div');
      const text = childDivs.length > 0
        ? childDivs.first().text().trim()
        : $cell.text().trim();
      featureLabels.push(text);
    }
  });

  // Process bank columns (index 1+)
  for (let colIdx = 1; colIdx < columnEls.length; colIdx++) {
    const $col = $(columnEls[colIdx]!);
    const cells = $col.children('div');
    const isHighlighted = colIdx === 1; // First bank (Air Bank) is highlighted

    // cell[0]: bank name (first child div) + first feature value (second child div)
    const cell0Divs = cells.eq(0).children('div');
    const bankName = cell0Divs.first().text().trim();
    const firstFeatureValue = cell0Divs.eq(1).text().trim();

    banks.push({ name: bankName });

    // Build values array for this bank
    const bankValues: Array<{ value: string; subtitle?: string; highlighted: boolean }> = [];

    // Feature[0] value from cell[0] second child div (card/account type)
    bankValues.push({ value: firstFeatureValue, highlighted: isHighlighted });

    // Features[1-5] from cells [2,4,6,8,10]
    cells.each((i, cell) => {
      if (i > 0 && i % 2 === 0) {
        const $cell = $(cell);
        // Use first child div text if present (compound value like "0 Kč" + detail)
        const childDivs = $cell.children('div');
        const text = childDivs.length > 0
          ? childDivs.first().text().trim()
          : $cell.text().trim();
        const subtitle = childDivs.length > 1
          ? childDivs.eq(1).text().trim()
          : undefined;
        const hasSvg = $cell.find('svg').length > 0;
        const value = text || (hasSvg ? '✓' : '–');
        bankValues.push({ value, subtitle: subtitle || undefined, highlighted: isHighlighted });
      }
    });

    // Add this bank's values to the features array
    bankValues.forEach((val, fi) => {
      if (!features[fi]) {
        features[fi] = { label: featureLabels[fi] || '', values: [] };
      }
      features[fi]!.values.push(val);
    });
  }

  return {
    blockType: 'compareTableBlock',
    data: {
      title,
      banks,
      features,
    },
    images,
    svgs: [],
  };
}
