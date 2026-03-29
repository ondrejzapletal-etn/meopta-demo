import type { ParsedBlock } from '../lib/parser-types.js';
import { loadHtml } from '../lib/html-parser.js';

export function parse(html: string): ParsedBlock {
  const $ = loadHtml(html);

  // Extract YouTube URL from iframe src
  const iframeSrc = $('iframe').attr('src') || '';
  let videoUrl = '';

  // Extract video ID from embed URL
  const embedMatch = iframeSrc.match(/embed\/([a-zA-Z0-9_-]+)/);
  if (embedMatch) {
    videoUrl = `https://www.youtube.com/watch?v=${embedMatch[1]}`;
  } else {
    videoUrl = iframeSrc || 'https://www.youtube.com/watch?v=LJQZl56A9TM';
  }

  const title = $('iframe').attr('title') || '';

  return {
    blockType: 'youtubeVideoBlock',
    data: {
      title: title || undefined,
      videoUrl,
    },
    images: [],
    svgs: [],
  };
}
