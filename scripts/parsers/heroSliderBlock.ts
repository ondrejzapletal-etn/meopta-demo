import type { ParsedBlock } from '../lib/parser-types.js';
import { loadHtml } from '../lib/html-parser.js';

export function parse(html: string): ParsedBlock {
  const $ = loadHtml(html);

  const slides: Array<{
    title: string;
    description: string;
    backgroundColor: string;
    linkLabel: string;
    linkUrl: string;
  }> = [];
  const images: ParsedBlock['images'] = [];

  // Select only the actual slide <li> elements
  $('li.slide').each((i, el) => {
    const $el = $(el);
    const title = $el.find('h1, h2').first().text().trim();
    const description = $el.find('p').first().text().trim();

    // Links can be <a> or <button> elements
    const link = $el.find('a[href]').first();
    const button = $el.find('button').first();
    const linkLabel = link.length
      ? (link.find('span').first().text().trim() || link.text().trim())
      : (button.find('span').first().text().trim() || button.text().trim());
    const linkUrl = link.attr('href') || '/';

    if (title) {
      slides.push({
        title,
        description,
        backgroundColor: 'green',
        linkLabel,
        linkUrl,
      });

      const img = $el.find('img').first();
      if (img.length) {
        images.push({
          fieldPath: `slides.${slides.length - 1}.image`,
          url: img.attr('src') || img.attr('data-src') || '',
          alt: img.attr('alt') || title,
        });
      }
    }
  });

  // Ensure at least one slide
  if (slides.length === 0) {
    slides.push({
      title: 'Vítejte v Air Bank',
      description: 'Banka, která vás bude bavit',
      backgroundColor: 'green',
      linkLabel: 'Zjistit více',
      linkUrl: '/',
    });
  }

  return {
    blockType: 'heroSliderBlock',
    data: {
      slides,
      autoPlay: true,
      autoPlayInterval: 5000,
    },
    images,
    svgs: [],
  };
}
