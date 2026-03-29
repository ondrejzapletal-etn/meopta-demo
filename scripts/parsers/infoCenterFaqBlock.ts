import type { ParsedBlock } from '../lib/parser-types.js';
import { loadHtml, extractTitle } from '../lib/html-parser.js';

export function parse(html: string): ParsedBlock {
  const $ = loadHtml(html);

  const title = extractTitle($) || undefined;

  const items: Array<{
    icon: string;
    question: string;
    url: string;
  }> = [];

  // FAQ grid items have icon, question text, and link
  $('a[href], article, [class*="card"]').each((_, el) => {
    const $el = $(el);
    const question = $el.find('h3, h4, span').first().text().trim() || $el.text().trim();
    const url = $el.is('a') ? $el.attr('href') : $el.find('a').first().attr('href');

    if (question && question.length < 200 && url) {
      items.push({
        icon: 'info',
        question,
        url: url || '/',
      });
    }
  });

  return {
    blockType: 'infoCenterFaqBlock',
    data: {
      title,
      items,
    },
    images: [],
    svgs: [],
  };
}
