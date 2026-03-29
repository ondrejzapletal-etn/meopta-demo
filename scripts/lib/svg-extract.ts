/**
 * Extract SVG from a remote HTML page by CSS selector and save it locally.
 *
 * Handles four cases:
 *   1. Selector matches an <svg> element → extracts its outerHTML
 *   2. Selector matches a container that contains an <svg> → extracts the first <svg> inside
 *   3. Selector matches an <img src="*.svg"> (or container with one) → downloads the .svg file
 *   4. Selector matches an element with background-image SVG → downloads the .svg file
 *
 * Usage in populate scripts:
 *   import { extractSvgFromUrl, extractMultipleSvgsFromUrl } from './lib/svg-extract.js';
 *
 *   // Single extraction
 *   const localPath = await extractSvgFromUrl(
 *     'https://www.airbank.cz/produkty/pujcka/',
 *     'svg:eq(15)',
 *     'pujcka-icon-urok.svg',
 *   );
 *   const mediaId = await uploadMedia(localPath, 'Úrok');
 *
 *   // Batch extraction (single fetch, multiple selectors)
 *   const paths = await extractMultipleSvgsFromUrl(
 *     'https://www.airbank.cz/produkty/pujcka/',
 *     [
 *       { selector: 'svg:eq(15)', filename: 'icon-urok.svg' },
 *       { selector: 'svg:eq(16)', filename: 'icon-prazdniny.svg' },
 *       { selector: 'svg:eq(17)', filename: 'icon-poplatky.svg' },
 *       { selector: 'svg:eq(18)', filename: 'icon-pojisteni.svg' },
 *     ],
 *   );
 *
 * CLI:
 *   npx tsx scripts/lib/svg-extract.ts <url> <selector> [filename]
 *   npx tsx scripts/lib/svg-extract.ts --list <url>     # list all SVGs on the page
 */

import * as cheerio from 'cheerio';
import { saveSvg, ensureMediaDir } from './image-utils.js';

const DEFAULT_BASE = 'https://www.airbank.cz';

function resolveUrl(raw: string, pageUrl: string): string {
  if (raw.startsWith('http://') || raw.startsWith('https://')) return raw;
  if (raw.startsWith('//')) return `https:${raw}`;
  if (raw.startsWith('/')) {
    try {
      const base = new URL(pageUrl);
      return `${base.origin}${raw}`;
    } catch {
      return `${DEFAULT_BASE}${raw}`;
    }
  }
  // relative
  const base = pageUrl.replace(/\/[^/]*$/, '/');
  return `${base}${raw}`;
}

function cleanSvg(raw: string): string {
  let svg = raw.trim();

  // Ensure xmlns is present (cheerio sometimes strips it)
  if (svg.startsWith('<svg') && !svg.includes('xmlns=')) {
    svg = svg.replace('<svg', '<svg xmlns="http://www.w3.org/2000/svg"');
  }

  return svg;
}

export interface ExtractSvgOptions {
  /** Base URL for resolving relative image paths. Defaults to the page URL origin. */
  baseUrl?: string;
  /** When true, print progress to console. Default: true */
  verbose?: boolean;
}

// ─── Core extraction functions ───────────────────────────────────────────────

/**
 * Fetch a page, find an SVG by CSS selector, and save it locally.
 * Returns the absolute path to the saved .svg file.
 *
 * Selector tips (cheerio / jQuery-style):
 *   - `svg:eq(3)`          — the 4th <svg> on the page (0-indexed)
 *   - `.card:eq(0) svg`    — first <svg> inside the first .card
 *   - `img[src$=".svg"]`   — first <img> whose src ends with .svg
 */
export async function extractSvgFromUrl(
  pageUrl: string,
  selector: string,
  filename: string,
  opts: ExtractSvgOptions = {},
): Promise<string> {
  const verbose = opts.verbose ?? true;

  if (verbose) console.log(`  Fetching ${pageUrl} ...`);
  const res = await fetch(pageUrl);
  if (!res.ok) throw new Error(`Failed to fetch ${pageUrl}: ${res.status}`);
  const html = await res.text();

  return extractSvgFromHtml(html, selector, filename, { ...opts, _pageUrl: pageUrl });
}

/**
 * Extract SVG from already-fetched HTML string.
 * Useful when you already have the HTML (avoids re-fetching).
 */
export async function extractSvgFromHtml(
  html: string,
  selector: string,
  filename: string,
  opts: ExtractSvgOptions & { _pageUrl?: string } = {},
): Promise<string> {
  const verbose = opts.verbose ?? true;
  const pageUrl = opts._pageUrl ?? opts.baseUrl ?? DEFAULT_BASE;
  const $ = cheerio.load(html);

  const el = $(selector).first();
  if (el.length === 0) {
    throw new Error(`Selector "${selector}" matched nothing on the page`);
  }

  const tagName = (el.prop('tagName') ?? '').toLowerCase();

  // Case 1: selector directly matched an <svg>
  if (tagName === 'svg') {
    const svgContent = cleanSvg($.html(el));
    if (verbose) console.log(`  Found inline <svg> at "${selector}" (${svgContent.length} bytes)`);
    return saveSvg(svgContent, filename);
  }

  // Case 2: selector matched an <img> pointing to an .svg
  if (tagName === 'img') {
    const src = el.attr('src') || el.attr('data-src') || '';
    if (src && (src.endsWith('.svg') || src.includes('.svg'))) {
      const fullUrl = resolveUrl(src, pageUrl);
      if (verbose) console.log(`  Found <img> SVG reference: ${fullUrl}`);
      return downloadSvgFile(fullUrl, filename);
    }
  }

  // Case 3: selector matched a container — look inside for <svg> first, then <img>
  const innerSvg = el.find('svg').first();
  if (innerSvg.length > 0) {
    const svgContent = cleanSvg($.html(innerSvg));
    if (verbose) console.log(`  Found inline <svg> inside "${selector}" (${svgContent.length} bytes)`);
    return saveSvg(svgContent, filename);
  }

  const innerImg = el.find('img[src$=".svg"], img[data-src$=".svg"]').first();
  if (innerImg.length > 0) {
    const src = innerImg.attr('src') || innerImg.attr('data-src') || '';
    const fullUrl = resolveUrl(src, pageUrl);
    if (verbose) console.log(`  Found <img> SVG inside "${selector}": ${fullUrl}`);
    return downloadSvgFile(fullUrl, filename);
  }

  // Case 4: check CSS background-image
  const bgStyle = el.attr('style') || '';
  const bgMatch = bgStyle.match(/url\(["']?([^"')]+\.svg[^"')]*?)["']?\)/);
  if (bgMatch?.[1]) {
    const fullUrl = resolveUrl(bgMatch[1], pageUrl);
    if (verbose) console.log(`  Found background SVG at "${selector}": ${fullUrl}`);
    return downloadSvgFile(fullUrl, filename);
  }

  throw new Error(
    `Selector "${selector}" matched a <${tagName}> but no SVG found (no inline <svg>, no <img src="*.svg">, no background SVG)`,
  );
}

/**
 * Download an SVG file from a URL and save it locally.
 */
export async function downloadSvgFile(url: string, filename: string): Promise<string> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to download SVG ${url}: ${res.status}`);
  const content = await res.text();

  if (!content.includes('<svg')) {
    throw new Error(`Downloaded content from ${url} does not appear to be SVG`);
  }

  return saveSvg(content, filename);
}

/**
 * Convenience: extract multiple SVGs from the same page in one fetch.
 * Returns a map of filename → local file path.
 */
export async function extractMultipleSvgsFromUrl(
  pageUrl: string,
  extractions: Array<{ selector: string; filename: string }>,
  opts: ExtractSvgOptions = {},
): Promise<Record<string, string>> {
  const verbose = opts.verbose ?? true;

  if (verbose) console.log(`  Fetching ${pageUrl} ...`);
  const res = await fetch(pageUrl);
  if (!res.ok) throw new Error(`Failed to fetch ${pageUrl}: ${res.status}`);
  const html = await res.text();

  const results: Record<string, string> = {};
  for (const { selector, filename } of extractions) {
    try {
      results[filename] = await extractSvgFromHtml(html, selector, filename, {
        ...opts,
        _pageUrl: pageUrl,
      });
    } catch (err) {
      if (verbose) console.warn(`  Warning: ${filename}: ${(err as Error).message}`);
    }
  }
  return results;
}

// ─── List mode — discover SVGs on a page ─────────────────────────────────────

interface SvgInfo {
  index: number;
  selector: string;
  type: 'inline' | 'img';
  viewBox: string;
  size: string;
  parentTag: string;
  textHint: string;
}

export async function listSvgsOnPage(pageUrl: string): Promise<SvgInfo[]> {
  const res = await fetch(pageUrl);
  if (!res.ok) throw new Error(`Failed to fetch ${pageUrl}: ${res.status}`);
  const html = await res.text();
  const $ = cheerio.load(html);

  const svgs: SvgInfo[] = [];

  // Inline <svg> elements
  $('svg').each((i, el) => {
    const $el = $(el);
    const viewBox = $el.attr('viewbox') || $el.attr('viewBox') || '';
    const w = $el.attr('width') || '';
    const h = $el.attr('height') || '';
    const parentTag = ($el.parent().prop('tagName') ?? '').toLowerCase();
    const htmlContent = $.html(el);

    // Try to find nearby text for identification
    const parentText = $el.parent().text().trim().slice(0, 50);
    const ariaLabel = $el.attr('aria-label') || '';

    svgs.push({
      index: i,
      selector: `svg:eq(${i})`,
      type: 'inline',
      viewBox,
      size: w && h ? `${w}x${h}` : `${htmlContent.length}B`,
      parentTag,
      textHint: ariaLabel || parentText || '',
    });
  });

  // <img src="*.svg"> elements
  $('img').each((_, el) => {
    const $el = $(el);
    const src = $el.attr('src') || $el.attr('data-src') || '';
    if (!src.includes('.svg')) return;
    const alt = $el.attr('alt') || '';

    svgs.push({
      index: svgs.length,
      selector: `img[src="${src}"]`,
      type: 'img',
      viewBox: '',
      size: '',
      parentTag: ($el.parent().prop('tagName') ?? '').toLowerCase(),
      textHint: alt || src.split('/').pop() || '',
    });
  });

  return svgs;
}

// ─── CLI ─────────────────────────────────────────────────────────────────────

const isCli = process.argv[1]?.endsWith('svg-extract.ts') || process.argv[1]?.endsWith('svg-extract.js');

if (isCli) {
  const args = process.argv.slice(2);

  if (args.length === 0 || args.includes('--help') || args.includes('-h')) {
    console.log(`
Usage:
  npx tsx scripts/lib/svg-extract.ts <url> <selector> [filename]
  npx tsx scripts/lib/svg-extract.ts --list <url>

Commands:
  --list <url>   List all SVGs on the page with selectors you can copy-paste

Extract an SVG from a web page and save it locally to /tmp/demo-media/.

Arguments:
  url        Page URL to fetch
  selector   CSS selector — use cheerio/jQuery syntax, e.g. svg:eq(3)
  filename   Output filename (default: extracted-<timestamp>.svg)

Examples:
  # First, list available SVGs to find the right index
  npx tsx scripts/lib/svg-extract.ts --list https://www.airbank.cz/produkty/pujcka/

  # Then extract by index (the selectors are shown in --list output)
  npx tsx scripts/lib/svg-extract.ts \\
    https://www.airbank.cz/produkty/pujcka/ \\
    'svg:eq(15)' \\
    pujcka-icon-urok.svg

  # Or extract SVG from an <img> element
  npx tsx scripts/lib/svg-extract.ts \\
    https://www.airbank.cz/ \\
    'img[src$=".svg"]:eq(0)' \\
    some-badge.svg
`);
    process.exit(0);
  }

  ensureMediaDir();

  if (args[0] === '--list') {
    const url = args[1];
    if (!url) {
      console.error('Usage: --list <url>');
      process.exit(1);
    }

    console.log(`Fetching ${url} ...\n`);
    listSvgsOnPage(url)
      .then((svgs) => {
        if (svgs.length === 0) {
          console.log('No SVGs found on the page.');
          return;
        }
        console.log(`Found ${svgs.length} SVGs:\n`);
        console.log(
          'IDX  TYPE     SELECTOR                          VIEWBOX          SIZE       PARENT   HINT',
        );
        console.log('─'.repeat(120));
        for (const s of svgs) {
          const idx = String(s.index).padEnd(4);
          const type = s.type.padEnd(8);
          const sel = s.selector.padEnd(33);
          const vb = s.viewBox.padEnd(16);
          const size = s.size.padEnd(10);
          const parent = `<${s.parentTag}>`.padEnd(8);
          const hint = s.textHint.slice(0, 40);
          console.log(`${idx} ${type} ${sel} ${vb} ${size} ${parent} ${hint}`);
        }
        console.log(
          `\nUse:  npx tsx scripts/lib/svg-extract.ts ${url} 'svg:eq(N)' output.svg`,
        );
      })
      .catch((err) => {
        console.error(`Error: ${(err as Error).message}`);
        process.exit(1);
      });
  } else {
    const [url, selector, filename] = args;
    if (!url || !selector) {
      console.error('Usage: <url> <selector> [filename]');
      process.exit(1);
    }
    const outName = filename || `extracted-${Date.now()}.svg`;

    extractSvgFromUrl(url, selector, outName)
      .then((path) => {
        console.log(`\nSaved: ${path}`);
      })
      .catch((err) => {
        console.error(`\nError: ${(err as Error).message}`);
        process.exit(1);
      });
  }
}
