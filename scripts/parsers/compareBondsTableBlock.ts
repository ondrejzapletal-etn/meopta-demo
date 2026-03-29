import type { ParsedBlock } from '../lib/parser-types.js';
import { loadHtml, extractTitle } from '../lib/html-parser.js';

export function parse(html: string): ParsedBlock {
  const $ = loadHtml(html);

  const title = extractTitle($) || 'Termínované vklady';
  const description = $('article p, section > p').first().text().trim();

  const rows: Array<{
    period: string;
    interestRate: string;
    minAmount: string;
    highlighted: boolean;
  }> = [];

  // Reference HTML: div-based layout (no table/tr/td)
  // Periods in <p> tags containing "Vklad na X měsíc..."
  // Interest rates in <span> tags containing "X,X %"
  // Min amounts in <span> tags containing "X Kč"
  const periods: string[] = [];
  $('p').each((_, el) => {
    const text = $(el).text().trim();
    if (text.match(/vklad|měsíc/i) && text.length < 50) {
      periods.push(text);
    }
  });

  const rates: string[] = [];
  const amounts: string[] = [];
  $('span').each((_, el) => {
    const text = $(el).text().trim();
    if (text.match(/\d+[,.]\d+\s*%/)) {
      rates.push(text);
    } else if (text.match(/\d[\d\s]*Kč/)) {
      amounts.push(text);
    }
  });

  // Build rows by matching periods with rates and amounts by index
  for (let i = 0; i < periods.length; i++) {
    rows.push({
      period: periods[i]!,
      interestRate: rates[i] || '',
      minAmount: amounts[i] || '',
      highlighted: false,
    });
  }

  return {
    blockType: 'compareBondsTableBlock',
    data: {
      title,
      description: description || undefined,
      rows,
    },
    images: [],
    svgs: [],
  };
}
