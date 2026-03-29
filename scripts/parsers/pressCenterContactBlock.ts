import type { ParsedBlock } from '../lib/parser-types.js';
import { loadHtml, extractTitle } from '../lib/html-parser.js';

export function parse(html: string): ParsedBlock {
  const $ = loadHtml(html);

  let title = extractTitle($) || undefined;

  const items: Array<{
    name: string;
    role: string;
    email: string;
    phone: string;
  }> = [];
  const images: ParsedBlock['images'] = [];

  // Reference HTML: article[0] = header (h2 + p), article[1+] = contact cards
  // Contact cards use <dl> with <dt>/<dd> pairs for name/role, and <img> for photos
  $('article').each((_, el) => {
    const $el = $(el);

    // Skip header article (contains h2)
    if ($el.find('h2').length > 0) {
      title = $el.find('h2').first().text().trim() || title;
      return;
    }

    // Extract name and role from <dd> elements
    const dds = $el.find('dd');
    const name = dds.eq(0).text().trim();
    const role = dds.eq(1).text().trim();

    // Extract email and phone from mailto:/tel: links (if present)
    let email = '';
    let phone = '';
    $el.find('a[href]').each((_, a) => {
      const href = $(a).attr('href') || '';
      if (href.startsWith('mailto:')) {
        email = href.replace('mailto:', '');
      } else if (href.startsWith('tel:')) {
        phone = href.replace('tel:', '');
      }
    });

    if (name) {
      items.push({ name, role, email, phone });

      const img = $el.find('img').first();
      if (img.length) {
        images.push({
          fieldPath: `items.${items.length - 1}.image`,
          url: img.attr('src') || img.attr('data-src') || '',
          alt: img.attr('alt') || name,
        });
      }
    }
  });

  return {
    blockType: 'pressCenterContactBlock',
    data: {
      title,
      items,
    },
    images,
    svgs: [],
  };
}
