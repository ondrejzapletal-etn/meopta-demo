import type { ParsedBlock } from '../lib/parser-types.js';
import { loadHtml, extractTitle } from '../lib/html-parser.js';

export function parse(html: string): ParsedBlock {
  const $ = loadHtml(html);

  const title = extractTitle($) || 'DPS kalkulacka';
  const description = $('p').first().text().trim();

  return {
    blockType: 'pensionSavingsCalculatorBlock',
    data: {
      title,
      minMonthly: 300,
      maxMonthly: 10000,
      defaultMonthly: 1000,
      minYears: 5,
      maxYears: 40,
      defaultYears: 20,
      expectedReturn: 4,
      stateContribution: 230,
      description: description || undefined,
    },
    images: [],
    svgs: [],
  };
}
