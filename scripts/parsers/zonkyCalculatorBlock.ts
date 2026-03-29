import type { ParsedBlock } from '../lib/parser-types.js';
import { loadHtml, extractTitle } from '../lib/html-parser.js';

export function parse(html: string): ParsedBlock {
  const $ = loadHtml(html);

  const title = extractTitle($) || 'Investiční kalkulačka';
  const description = $('p').first().text().trim();

  return {
    blockType: 'zonkyCalculatorBlock',
    data: {
      title,
      minAmount: 10000,
      maxAmount: 5000000,
      defaultAmount: 500000,
      minYears: 1,
      maxYears: 30,
      defaultYears: 10,
      expectedReturn: 7,
      description: description || undefined,
    },
    images: [],
    svgs: [],
  };
}
