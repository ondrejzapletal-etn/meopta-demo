import type { ParsedBlock } from '../lib/parser-types.js';
import { loadHtml, extractTitle, extractLinks, extractImages } from '../lib/html-parser.js';

export function parse(html: string): ParsedBlock {
  const $ = loadHtml(html);

  const title = extractTitle($) || 'Hero kompaktní';
  const description = $('p').first().text().trim();
  const images = extractImages($);
  const links = extractLinks($);

  // Extract breadcrumbs from nav/ol elements
  const breadcrumbs: Array<{ label: string; url: string }> = [];
  $('nav ol li').each((_, el) => {
    const $el = $(el);
    const label = $el.text().trim();
    const url = $el.find('a').attr('href') || '';
    if (label) breadcrumbs.push({ label, url });
  });

  const linkItems = links.slice(0, 2).map((link, i) => ({
    label: link.label,
    url: link.url,
    appearance: i === 0 ? 'primary' : 'outline',
  }));

  const parsedImages = images.length > 0
    ? [{ fieldPath: 'image', url: images[0]!.src, alt: images[0]!.alt || title }]
    : [];

  return {
    blockType: 'heroWithImageCompactBlock',
    data: {
      backgroundColor: 'lightGrey',
      title,
      description: description || undefined,
      links: linkItems.length > 0 ? linkItems : undefined,
      breadcrumbs: breadcrumbs.length > 0 ? breadcrumbs : undefined,
    },
    images: parsedImages,
    svgs: [],
  };
}
