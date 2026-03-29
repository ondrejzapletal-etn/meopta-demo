import type { ParsedBlock } from '../lib/parser-types.js';
import { loadHtml, extractTitle, extractBackgroundImages } from '../lib/html-parser.js';

export function parse(html: string): ParsedBlock {
  const $ = loadHtml(html);

  // Section title from h2 in header article
  const sectionTitle = $('h2').first().text().trim() || undefined;

  const items: Array<{
    title: string;
    description: string;
    linkLabel: string;
    linkUrl: string;
  }> = [];
  const images: ParsedBlock['images'] = [];

  // Reference HTML: alternating article pairs
  // - Card articles have alt="..." attribute and a div with background-image
  // - Description articles contain div[data-list-style-type] with text
  const articles = $('article').toArray();

  for (let i = 0; i < articles.length; i++) {
    const $el = $(articles[i]!);
    const alt = $el.attr('alt') || '';
    if (!alt) continue; // Skip header and description articles

    // Title from alt attribute
    const itemTitle = alt;

    // Image from background-image CSS on child div
    const bgDiv = $el.find('div[style*="background-image"]').first();
    const style = bgDiv.attr('style') || '';
    const urlMatch = style.match(/url\(['"]?([^'")\s]+)['"]?\)/);
    const bgUrl = urlMatch ? urlMatch[1]! : '';

    // Description from the next article (description article)
    const nextArticle = articles[i + 1] ? $(articles[i + 1]!) : null;
    const description = nextArticle
      ? nextArticle.find('div[data-list-style-type]').first().text().trim() ||
        nextArticle.text().trim()
      : '';

    items.push({
      title: itemTitle,
      description,
      linkLabel: 'Více',
      linkUrl: '/',
    });

    if (bgUrl) {
      images.push({
        fieldPath: `items.${items.length - 1}.image`,
        url: bgUrl,
        alt: itemTitle,
      });
    }
  }

  return {
    blockType: 'contentCardsBlock',
    data: {
      title: sectionTitle,
      items: items.map((item) => ({
        title: item.title,
        description: item.description || undefined,
        linkLabel: item.linkLabel,
        linkUrl: item.linkUrl,
      })),
    },
    images,
    svgs: [],
  };
}
