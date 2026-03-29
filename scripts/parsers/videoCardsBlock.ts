import type { ParsedBlock } from '../lib/parser-types.js';
import { loadHtml, extractTitle, extractBackgroundImages } from '../lib/html-parser.js';

export function parse(html: string): ParsedBlock {
  const $ = loadHtml(html);

  const sectionTitle = $('h2').first().text().trim() || undefined;

  const items: Array<{
    title: string;
    description: string;
    videoUrl: string;
  }> = [];
  const images: ParsedBlock['images'] = [];

  $('article').each((_, el) => {
    const $el = $(el);
    if ($el.find('h2').length > 0) return;

    const alt = $el.attr('alt') || '';
    const itemTitle = alt || $el.find('h3, h4, p').first().text().trim();

    const bgDiv = $el.find('div[style*="background-image"]').first();
    const style = bgDiv.attr('style') || '';
    const urlMatch = style.match(/url\(['"]?([^'")\s]+)['"]?\)/);
    const bgUrl = urlMatch ? urlMatch[1]! : '';

    const description = $el.find('div[data-list-style-type]').first().text().trim() ||
      $el.find('p').eq(1).text().trim();

    if (itemTitle) {
      items.push({
        title: itemTitle,
        description: description || '',
        videoUrl: '',
      });

      if (bgUrl) {
        images.push({
          fieldPath: `items.${items.length - 1}.image`,
          url: bgUrl,
          alt: itemTitle,
        });
      }
    }
  });

  return {
    blockType: 'videoCardsBlock',
    data: {
      title: sectionTitle,
      items: items.map((item) => ({
        title: item.title,
        description: item.description || undefined,
        videoUrl: item.videoUrl || undefined,
      })),
    },
    images,
    svgs: [],
  };
}
