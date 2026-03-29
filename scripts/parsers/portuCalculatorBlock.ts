import type { ParsedBlock } from '../lib/parser-types.js';
import { loadHtml, extractTitle } from '../lib/html-parser.js';

export function parse(html: string): ParsedBlock {
  const $ = loadHtml(html);

  const title = extractTitle($) || 'Portu kalkulacka';
  const description = $('p').first().text().trim();

  return {
    blockType: 'portuCalculatorBlock',
    data: {
      title,
      minAmount: 10000,
      maxAmount: 5000000,
      defaultAmount: 500000,
      minYears: 1,
      maxYears: 30,
      defaultYears: 10,
      expectedReturn: 6,
      description: description || undefined,
    },
    images: [],
    svgs: [],
  };
}
