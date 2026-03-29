import type { ParsedBlock } from '../lib/parser-types.js';
import { loadHtml, extractTitle } from '../lib/html-parser.js';

export function parse(html: string): ParsedBlock {
  const $ = loadHtml(html);

  const title = extractTitle($) || 'Inflační kalkulačka';
  const description = $('p').first().text().trim();

  return {
    blockType: 'inflationCalculatorBlock',
    data: {
      title,
      defaultAmount: 100000,
      minYears: 1,
      maxYears: 30,
      defaultYears: 10,
      defaultInflation: 3,
      description: description || undefined,
    },
    images: [],
    svgs: [],
  };
}
