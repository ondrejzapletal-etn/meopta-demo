import type { ParsedBlock } from '../lib/parser-types.js';
import { loadHtml, extractTitle, extractLinks, extractImages } from '../lib/html-parser.js';
import { textToLexical } from '../lib/lexical.js';

export function parse(html: string): ParsedBlock {
  const $ = loadHtml(html);

  const title = extractTitle($) || 'Obsah s videem';
  const description = $('p').first().text().trim();
  const links = extractLinks($);

  // Extract video URL from iframe or video element
  let videoUrl = $('iframe').attr('src') || $('video source').attr('src') || '';

  // Convert YouTube nocookie embed URL to standard watch URL
  const embedMatch = videoUrl.match(/embed\/([a-zA-Z0-9_-]+)/);
  if (embedMatch) {
    videoUrl = `https://www.youtube.com/watch?v=${embedMatch[1]}`;
  }

  if (!videoUrl) {
    videoUrl = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ';
  }

  // Extract thumbnail image
  const images = extractImages($);
  const parsedImages = images.length > 0
    ? [{ fieldPath: 'thumbnail', url: images[0]!.src, alt: images[0]!.alt || title }]
    : [];

  return {
    blockType: 'infoVideoBlock',
    data: {
      title,
      description: description ? textToLexical(description) : undefined,
      videoUrl,
      videoPosition: 'right',
      linkLabel: links[0]?.label || undefined,
      linkUrl: links[0]?.url || undefined,
    },
    images: parsedImages,
    svgs: [],
  };
}
