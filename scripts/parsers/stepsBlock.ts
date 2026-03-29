import type { ParsedBlock } from '../lib/parser-types.js';
import { loadHtml, extractTitle } from '../lib/html-parser.js';

export function parse(html: string): ParsedBlock {
  const $ = loadHtml(html);

  const title = extractTitle($) || undefined;

  const items: Array<{
    stepNumber: number;
    title: string;
    description: string;
  }> = [];

  $('li').each((_, el) => {
    const $el = $(el);
    const stepText = $el.find('h3').first().text().trim();
    if (!stepText) return;

    const description = $el.find('div[data-list-style-type]').first().text().trim() ||
      $el.find('p').first().text().trim();

    items.push({
      stepNumber: items.length + 1,
      title: stepText,
      description: description || '',
    });
  });

  if (items.length === 0) {
    $('article').each((_, el) => {
      const $el = $(el);
      const stepTitle = $el.find('h3, h4').first().text().trim();
      const description = $el.find('p').first().text().trim();
      if (stepTitle) {
        items.push({
          stepNumber: items.length + 1,
          title: stepTitle,
          description: description || '',
        });
      }
    });
  }

  return {
    blockType: 'stepsBlock',
    data: {
      title,
      items,
    },
    images: [],
    svgs: [],
  };
}
