import type { ParsedBlock } from '../lib/parser-types.js';
import { loadHtml, extractTitle } from '../lib/html-parser.js';

export function parse(html: string): ParsedBlock {
  const $ = loadHtml(html);

  const title = extractTitle($) || 'Kurzovní lístek';

  // Extract last updated time
  const lastUpdated = $('[class*="update"], [class*="date"], time').first().text().trim();

  const rates: Array<{
    currencyCode: string;
    currencyName: string;
    country: string;
    buyRate: string;
    sellRate: string;
    midRate: string;
  }> = [];

  $('tr, [class*="row"]').each((_, el) => {
    const cells = $(el).find('td, [class*="cell"]');
    if (cells.length < 3) return;

    const firstCell = $(cells[0]).text().trim();
    // Skip header rows
    if (firstCell.toLowerCase().includes('měna') || firstCell.toLowerCase().includes('currency')) return;

    const currencyCode = firstCell.slice(0, 3).toUpperCase();
    const currencyName = $(cells[0]).text().trim();
    const buyRate = $(cells[1]).text().trim();
    const sellRate = $(cells[2]).text().trim();
    const midRate = cells.length > 3 ? $(cells[3]).text().trim() : '';

    if (currencyCode && buyRate) {
      rates.push({
        currencyCode,
        currencyName,
        country: '',
        buyRate,
        sellRate,
        midRate,
      });
    }
  });

  return {
    blockType: 'exchangeRatesBlock',
    data: {
      title,
      lastUpdated: lastUpdated || undefined,
      rates,
    },
    images: [],
    svgs: [],
  };
}
