import { writeFileSync, mkdirSync, existsSync } from 'fs';
import path from 'path';
import { deflateSync } from 'zlib';

const MEDIA_DIR = '/tmp/demo-media';

export function ensureMediaDir(): void {
  mkdirSync(MEDIA_DIR, { recursive: true });
}

/**
 * Download an image from a URL and save it locally.
 * Returns the local file path.
 */
export async function downloadImage(
  url: string,
  filename: string,
): Promise<string> {
  ensureMediaDir();

  // Handle placeholder URLs - create a placeholder image
  if (url === 'placeholder' || !url) {
    return createPlaceholderImage(filename || 'placeholder.png');
  }

  const filePath = path.join(MEDIA_DIR, filename);

  // Handle relative URLs
  let fullUrl = url;
  if (url.startsWith('//')) {
    fullUrl = `https:${url}`;
  } else if (url.startsWith('/')) {
    fullUrl = `https://www.airbank.cz${url}`;
  }

  const res = await fetch(fullUrl);
  if (!res.ok) {
    throw new Error(`Failed to download image ${fullUrl}: ${res.status}`);
  }

  const buffer = Buffer.from(await res.arrayBuffer());
  writeFileSync(filePath, buffer);
  return filePath;
}

/**
 * Save SVG content as a file.
 * Returns the local file path.
 */
export function saveSvg(svgContent: string, filename: string): string {
  ensureMediaDir();
  const filePath = path.join(MEDIA_DIR, filename);
  writeFileSync(filePath, svgContent);
  return filePath;
}

/**
 * Create a 200x200 green PNG placeholder image using raw PNG construction.
 * Returns the local file path.
 */
export function createPlaceholderImage(filename: string): string {
  ensureMediaDir();
  const filePath = path.join(MEDIA_DIR, filename);

  if (!existsSync(filePath)) {
    const pngData = generateGreenPng(200, 200);
    writeFileSync(filePath, pngData);
  }
  return filePath;
}

function generateGreenPng(width: number, height: number): Buffer {
  // PNG signature
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  // IHDR chunk
  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(width, 0);
  ihdrData.writeUInt32BE(height, 4);
  ihdrData[8] = 8;  // bit depth
  ihdrData[9] = 2;  // color type: RGB
  ihdrData[10] = 0; // compression
  ihdrData[11] = 0; // filter
  ihdrData[12] = 0; // interlace
  const ihdr = createPngChunk('IHDR', ihdrData);

  // Raw image data: filter byte (0) + RGB pixels per row
  const rowSize = 1 + width * 3;
  const rawData = Buffer.alloc(rowSize * height);
  for (let y = 0; y < height; y++) {
    rawData[y * rowSize] = 0; // filter: none
    for (let x = 0; x < width; x++) {
      const offset = y * rowSize + 1 + x * 3;
      rawData[offset] = 0xc0;     // R (Air Bank green)
      rawData[offset + 1] = 0xd0; // G
      rawData[offset + 2] = 0xdf; // B
    }
  }

  // IDAT chunk (compressed)
  const compressed = deflateSync(rawData);
  const idat = createPngChunk('IDAT', compressed);

  // IEND chunk
  const iend = createPngChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdr, idat, iend]);
}

function createPngChunk(type: string, data: Buffer): Buffer {
  const length = Buffer.alloc(4);
  length.writeUInt32BE(data.length, 0);

  const typeBuffer = Buffer.from(type, 'ascii');
  const payload = Buffer.concat([typeBuffer, data]);

  const crc = crc32(payload);
  const crcBuffer = Buffer.alloc(4);
  crcBuffer.writeUInt32BE(crc, 0);

  return Buffer.concat([length, payload, crcBuffer]);
}

function crc32(data: Buffer): number {
  let crc = 0xFFFFFFFF;
  for (let i = 0; i < data.length; i++) {
    crc = crc ^ data[i]!;
    for (let j = 0; j < 8; j++) {
      crc = (crc >>> 1) ^ (crc & 1 ? 0xEDB88320 : 0);
    }
  }
  return (crc ^ 0xFFFFFFFF) >>> 0;
}

/**
 * Generate a safe filename from a URL or name.
 */
export function safeFilename(input: string, ext: string = '.png'): string {
  const base = input
    .replace(/https?:\/\//, '')
    .replace(/[^a-zA-Z0-9._-]/g, '_')
    .slice(0, 100);
  return base.endsWith(ext) ? base : `${base}${ext}`;
}

/**
 * Extract the original image URL from CDN pattern.
 * CDN pattern: https://cdn.siteone.io/img.siteone.cz/rs_{size}_fill_auto/{encoded_url}
 */
export function decodeCdnUrl(cdnUrl: string): string {
  const match = cdnUrl.match(/rs_\d+_fill_auto\/(.+)$/);
  if (match) {
    return decodeURIComponent(match[1]!);
  }
  return cdnUrl;
}
