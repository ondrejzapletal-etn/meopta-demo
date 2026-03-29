import type { ParsedBlock } from '../lib/parser-types.js';
import { loadHtml, extractTitle } from '../lib/html-parser.js';

export function parse(html: string): ParsedBlock {
  const $ = loadHtml(html);

  const title = extractTitle($) || 'Hypoteční kalkulačka';
  const description = $('p').first().text().trim();

  return {
    blockType: 'mortgageCalculatorBlock',
    data: {
      title,
      minAmount: 500000,
      maxAmount: 10000000,
      defaultAmount: 3000000,
      minYears: 5,
      maxYears: 30,
      defaultYears: 20,
      interestRate: 5.49,
      description: description || undefined,
    },
    images: [],
    svgs: [],
  };
}
