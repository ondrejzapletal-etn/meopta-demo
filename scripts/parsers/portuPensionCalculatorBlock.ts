import type { ParsedBlock } from '../lib/parser-types.js';
import { loadHtml, extractTitle } from '../lib/html-parser.js';

export function parse(html: string): ParsedBlock {
  const $ = loadHtml(html);

  const title = extractTitle($) || 'Portu DIP kalkulacka';
  const description = $('p').first().text().trim();

  return {
    blockType: 'portuPensionCalculatorBlock',
    data: {
      title,
      minMonthly: 500,
      maxMonthly: 10000,
      defaultMonthly: 3000,
      minYears: 5,
      maxYears: 40,
      defaultYears: 20,
      expectedReturn: 5,
      description: description || undefined,
    },
    images: [],
    svgs: [],
  };
}
