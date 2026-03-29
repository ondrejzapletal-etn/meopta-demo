import type { ParsedBlock } from '../lib/parser-types.js';
import { loadHtml, extractTitle } from '../lib/html-parser.js';

export function parse(html: string): ParsedBlock {
  const $ = loadHtml(html);

  const title = extractTitle($) || 'Graf spoření';
  const description = $('p').first().text().trim();

  return {
    blockType: 'zoneInterestBlock',
    data: {
      title,
      monthlyDeposit: 5000,
      interestRate: 3,
      years: 10,
      description: description || undefined,
    },
    images: [],
    svgs: [],
  };
}
