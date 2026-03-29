import type { ParsedBlock } from '../lib/parser-types.js';
import { loadHtml, extractTitle } from '../lib/html-parser.js';

export function parse(html: string): ParsedBlock {
  const $ = loadHtml(html);

  const title = extractTitle($) || 'Kalkulačka půjčky';
  const description = $('p').first().text().trim();

  return {
    blockType: 'loanCalculatorBlock',
    data: {
      title,
      minAmount: 20000,
      maxAmount: 800000,
      defaultAmount: 200000,
      minMonths: 6,
      maxMonths: 96,
      defaultMonths: 36,
      interestRate: 4.9,
      description: description || undefined,
    },
    images: [],
    svgs: [],
  };
}
