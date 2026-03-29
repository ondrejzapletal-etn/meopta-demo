import * as cheerio from 'cheerio';

export type CheerioAPI = cheerio.CheerioAPI;

export function loadHtml(html: string): CheerioAPI {
  return cheerio.load(html);
}

/** Extract first heading text (h1-h6) */
export function extractTitle($: CheerioAPI): string {
  const el = $('h1, h2, h3, h4, h5, h6').first();
  return el.text().trim();
}

/** Extract all paragraphs as joined text */
export function extractDescription($: CheerioAPI): string {
  const paragraphs: string[] = [];
  $('p').each((_, el) => {
    const text = $(el).text().trim();
    if (text) paragraphs.push(text);
  });
  return paragraphs.join('\n');
}

/** Extract first paragraph text */
export function extractFirstParagraph($: CheerioAPI): string {
  return $('p').first().text().trim();
}

/** Extract links as { label, url } pairs */
export function extractLinks($: CheerioAPI): Array<{ label: string; url: string }> {
  const links: Array<{ label: string; url: string }> = [];
  $('a[href]').each((_, el) => {
    const $el = $(el);
    const label = $el.find('span').first().text().trim() || $el.text().trim();
    const url = $el.attr('href') || '/';
    if (label && !label.includes('svg')) {
      links.push({ label, url });
    }
  });
  return links;
}

/** Extract image sources */
export function extractImages(
  $: CheerioAPI,
): Array<{ src: string; alt: string }> {
  const images: Array<{ src: string; alt: string }> = [];
  $('img').each((_, el) => {
    const $el = $(el);
    const src = $el.attr('src') || $el.attr('data-src') || '';
    const alt = $el.attr('alt') || '';
    if (src) images.push({ src, alt });
  });
  return images;
}

/** Extract background images from style attributes */
export function extractBackgroundImages($: CheerioAPI): string[] {
  const urls: string[] = [];
  $('[style]').each((_, el) => {
    const style = $(el).attr('style') || '';
    const match = style.match(/url\(["']?([^"')]+)["']?\)/);
    if (match?.[1]) urls.push(match[1]);
  });
  return urls;
}

/** Extract inline SVGs as string content */
export function extractSvgs($: CheerioAPI): Array<{ content: string; viewBox: string }> {
  const svgs: Array<{ content: string; viewBox: string }> = [];
  $('svg').each((_, el) => {
    const $el = $(el);
    const viewBox = $el.attr('viewBox') || '';
    const html = $.html(el);
    if (html && viewBox) {
      svgs.push({ content: html, viewBox });
    }
  });
  return svgs;
}

/** Extract repeated article/card items with their sub-content */
export function extractRepeatedItems(
  $: CheerioAPI,
  selector: string = 'article',
): Array<{
  title: string;
  description: string;
  imageUrl: string;
  links: Array<{ label: string; url: string }>;
  svgContent: string;
}> {
  const items: Array<{
    title: string;
    description: string;
    imageUrl: string;
    links: Array<{ label: string; url: string }>;
    svgContent: string;
  }> = [];

  $(selector).each((_, el) => {
    const $el = $(el);
    const title =
      $el.find('h2, h3, h4, h5').first().text().trim();
    const description = $el
      .find('p, [data-list-style-type], .css-7swpvo, div:not(:has(*))')
      .first()
      .text()
      .trim();

    const imgEl = $el.find('img').first();
    const imageUrl = imgEl.attr('src') || imgEl.attr('data-src') || '';

    const links: Array<{ label: string; url: string }> = [];
    $el.find('a[href]').each((_, a) => {
      const $a = $(a);
      const label = $a.find('span').first().text().trim() || $a.text().trim();
      const url = $a.attr('href') || '/';
      if (label) links.push({ label, url });
    });

    const svgEl = $el.find('svg').first();
    const svgContent = svgEl.length > 0 ? $.html(svgEl) : '';

    items.push({ title, description, imageUrl, links, svgContent });
  });

  return items;
}

/** Get text content from element matching a CSS class pattern */
export function findTextByClass($: CheerioAPI, classPattern: string): string {
  const el = $(`[class*="${classPattern}"]`).first();
  return el.text().trim();
}

/** Extract the Airbank component ID from the wrapper div id attribute */
export function extractComponentId($: CheerioAPI): string {
  const wrapper = $('[id]').first();
  const id = wrapper.attr('id') || '';
  return id.replace(/-_[a-z0-9]+$/, '');
}
