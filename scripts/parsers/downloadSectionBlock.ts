import type { ParsedBlock } from '../lib/parser-types.js';
import { loadHtml, extractTitle } from '../lib/html-parser.js';

export function parse(html: string): ParsedBlock {
  const $ = loadHtml(html);

  const title = extractTitle($) || undefined;

  const items: Array<{
    title: string;
    description: string;
    fileUrl: string;
    fileSize: string;
    category: string;
  }> = [];

  // Reference HTML: single app download section (not a file list)
  // Structure: <p> containing <strong> (title) + <span> (description)
  // Plus app store links (Apple + Google) and a QR code <img>
  const itemTitle = $('strong').first().text().trim();
  const itemDesc = $('strong').parent().find('span').first().text().trim()
    || $('p span').first().text().trim();

  // Extract app store URLs
  const appStoreUrl = $('a[href*="apple.com"]').first().attr('href') || '';
  const playStoreUrl = $('a[href*="play.google.com"]').first().attr('href') || '';

  if (itemTitle) {
    items.push({
      title: itemTitle,
      description: itemDesc,
      fileUrl: appStoreUrl || playStoreUrl || '#',
      fileSize: '',
      category: '',
    });
  }

  return {
    blockType: 'downloadSectionBlock',
    data: {
      title,
      items,
    },
    images: [],
    svgs: [],
  };
}
