import type { ParsedBlock } from '../lib/parser-types.js';
import { loadHtml, extractTitle } from '../lib/html-parser.js';

export function parse(html: string): ParsedBlock {
  const $ = loadHtml(html);

  const title = extractTitle($) || 'Srovnani kurzu';

  const providers: Array<{ name: string }> = [];
  const currencies: Array<{
    label: string;
    values: Array<{ value: string; highlighted: boolean }>;
  }> = [];

  const columnEls: cheerio.Element[] = [];
  $('div').each((_, el) => {
    if ($(el).children('div').length === 11) {
      columnEls.push(el);
    }
  });

  if (columnEls.length >= 2) {
    const headerCells = $(columnEls[0]).children('div');
    const currencyLabels: string[] = [];
    headerCells.each((i, cell) => {
      if (i % 2 === 0) {
        const $cell = $(cell);
        const childDivs = $cell.children('div');
        const text = childDivs.length > 0 ? childDivs.first().text().trim() : $cell.text().trim();
        currencyLabels.push(text);
      }
    });

    for (let colIdx = 1; colIdx < columnEls.length; colIdx++) {
      const $col = $(columnEls[colIdx]!);
      const cells = $col.children('div');
      const isHighlighted = colIdx === 1;

      const cell0Divs = cells.eq(0).children('div');
      const providerName = cell0Divs.first().text().trim();
      const firstValue = cell0Divs.eq(1).text().trim();

      providers.push({ name: providerName });

      const providerValues: Array<{ value: string; highlighted: boolean }> = [];
      providerValues.push({ value: firstValue, highlighted: isHighlighted });

      cells.each((i, cell) => {
        if (i > 0 && i % 2 === 0) {
          const $cell = $(cell);
          const childDivs = $cell.children('div');
          const text = childDivs.length > 0 ? childDivs.first().text().trim() : $cell.text().trim();
          providerValues.push({ value: text || '-', highlighted: isHighlighted });
        }
      });

      providerValues.forEach((val, fi) => {
        if (!currencies[fi]) {
          currencies[fi] = { label: currencyLabels[fi] || '', values: [] };
        }
        currencies[fi]!.values.push(val);
      });
    }
  }

  return {
    blockType: 'exchangeCompareTableBlock',
    data: {
      title,
      providers,
      currencies,
    },
    images: [],
    svgs: [],
  };
}
