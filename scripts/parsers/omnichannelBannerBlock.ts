import type { ParsedBlock } from '../lib/parser-types.js';
import { loadHtml, extractTitle, extractLinks } from '../lib/html-parser.js';

export function parse(html: string): ParsedBlock {
  const $ = loadHtml(html);

  const title = extractTitle($) || undefined;
  const description = $('p').first().text().trim();
  const links = extractLinks($);

  const items = links.map((link) => ({
    icon: 'chat',
    label: link.label || 'Kontakt',
    linkUrl: link.url || '/',
  }));

  return {
    blockType: 'omnichannelBannerBlock',
    data: {
      title,
      description: description || undefined,
      items: items.length > 0 ? items : [
        { icon: 'phone', label: 'Zavolejte nam', linkUrl: 'tel:+420800151515' },
        { icon: 'email', label: 'Napiste nam', linkUrl: '/' },
        { icon: 'chat', label: 'Chat', linkUrl: '/' },
      ],
      backgroundColor: 'green',
    },
    images: [],
    svgs: [],
  };
}
