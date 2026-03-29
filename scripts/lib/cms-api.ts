import { getToken, getCmsUrl } from './auth.js';
import { readFileSync } from 'fs';
import { createHash } from 'crypto';
import path from 'path';

function fileContentHash(filePath: string): string {
  return createHash('sha256').update(readFileSync(filePath)).digest('hex').slice(0, 16);
}

async function headers(): Promise<Record<string, string>> {
  const token = await getToken();
  return {
    Authorization: `JWT ${token}`,
    'Content-Type': 'application/json',
  };
}

// ─── Media ──────────────────────────────────────────────────────────────────

export async function uploadMedia(
  filePath: string,
  alt: string,
): Promise<number> {
  const hash = fileContentHash(filePath);

  // Check CMS DB for existing media with same content hash — works across
  // machines and CI, unlike a local cache file.
  const h = await headers();
  const checkUrl = `${getCmsUrl()}/api/media?where[sourceHash][equals]=${hash}&limit=1&depth=0`;
  const checkRes = await fetch(checkUrl, { headers: h });
  if (checkRes.ok) {
    const checkData = (await checkRes.json()) as { docs: Array<{ id: number }> };
    if (checkData.docs[0]) return checkData.docs[0].id;
  }

  const token = await getToken();
  const url = `${getCmsUrl()}/api/media`;

  const fileName = path.basename(filePath);
  const fileBuffer = readFileSync(filePath);
  const mimeType = guessMimeType(fileName);

  const formData = new FormData();
  formData.append('file', new Blob([fileBuffer], { type: mimeType }), fileName);
  formData.append('_payload', JSON.stringify({ alt: alt || 'image', sourceHash: hash }));

  const res = await fetch(url, {
    method: 'POST',
    headers: { Authorization: `JWT ${token}` },
    body: formData,
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Upload media failed (${res.status}): ${text}`);
  }

  const data = (await res.json()) as { doc: { id: number } };
  return data.doc.id;
}

function guessMimeType(filename: string): string {
  const ext = path.extname(filename).toLowerCase();
  const map: Record<string, string> = {
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.webp': 'image/webp',
    '.svg': 'image/svg+xml',
    '.avif': 'image/avif',
  };
  return map[ext] || 'application/octet-stream';
}

// ─── Pages ──────────────────────────────────────────────────────────────────

export interface PageData {
  id: number;
  title: string;
  slug: string;
  layout: Array<Record<string, unknown>>;
}

export async function findPage(slug: string): Promise<PageData | null> {
  const h = await headers();
  const url = `${getCmsUrl()}/api/pages?where[slug][equals]=${encodeURIComponent(slug)}&depth=0`;
  const res = await fetch(url, { headers: h });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Find page failed (${res.status}): ${text}`);
  }

  const data = (await res.json()) as { docs: PageData[] };
  return data.docs[0] ?? null;
}

export async function createPage(
  title: string,
  slug: string,
  layout: Array<Record<string, unknown>> = [],
): Promise<PageData> {
  const h = await headers();
  const url = `${getCmsUrl()}/api/pages`;

  const res = await fetch(url, {
    method: 'POST',
    headers: h,
    body: JSON.stringify({ title, slug, layout, _status: 'published' }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Create page failed (${res.status}): ${text}`);
  }

  const data = (await res.json()) as { doc: PageData };
  return data.doc;
}

export async function updatePage(
  id: number,
  layout: Array<Record<string, unknown>>,
): Promise<PageData> {
  const h = await headers();
  const url = `${getCmsUrl()}/api/pages/${id}`;

  const res = await fetch(url, {
    method: 'PATCH',
    headers: h,
    body: JSON.stringify({ layout, _status: 'published' }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Update page failed (${res.status}): ${text}`);
  }

  const data = (await res.json()) as { doc: PageData };
  return data.doc;
}

export async function deletePage(id: number): Promise<void> {
  const h = await headers();
  const url = `${getCmsUrl()}/api/pages/${id}`;
  const res = await fetch(url, { method: 'DELETE', headers: h });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Delete page failed (${res.status}): ${text}`);
  }
}

// ─── Generic Collections ─────────────────────────────────────────────────────

export async function createCollectionItem(
  collection: string,
  data: Record<string, unknown>,
): Promise<{ id: number }> {
  const h = await headers();
  const url = `${getCmsUrl()}/api/${collection}`;

  const res = await fetch(url, {
    method: 'POST',
    headers: h,
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Create ${collection} item failed (${res.status}): ${text}`);
  }

  const result = (await res.json()) as { doc: { id: number } };
  return result.doc;
}

export async function findCollectionItems(
  collection: string,
  query?: string,
): Promise<{ docs: Array<{ id: number; slug?: string }> }> {
  const h = await headers();
  const url = `${getCmsUrl()}/api/${collection}${query ? `?${query}` : '?limit=100&depth=0'}`;
  const res = await fetch(url, { headers: h });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Find ${collection} items failed (${res.status}): ${text}`);
  }

  return (await res.json()) as { docs: Array<{ id: number; slug?: string }> };
}

export async function updateCollectionItem(
  collection: string,
  id: number,
  data: Record<string, unknown>,
): Promise<{ id: number }> {
  const h = await headers();
  const url = `${getCmsUrl()}/api/${collection}/${id}`;

  const res = await fetch(url, {
    method: 'PATCH',
    headers: h,
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Update ${collection} item failed (${res.status}): ${text}`);
  }

  const result = (await res.json()) as { doc: { id: number } };
  return result.doc;
}

export async function deleteCollectionItem(
  collection: string,
  id: number,
): Promise<void> {
  const h = await headers();
  const url = `${getCmsUrl()}/api/${collection}/${id}`;
  const res = await fetch(url, { method: 'DELETE', headers: h });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Delete ${collection} item failed (${res.status}): ${text}`);
  }
}

export async function deleteAllMedia(): Promise<void> {
  const h = await headers();
  const url = `${getCmsUrl()}/api/media?limit=100&depth=0`;
  const res = await fetch(url, { headers: h });

  if (!res.ok) return;

  const data = (await res.json()) as { docs: Array<{ id: number }> };
  for (const doc of data.docs) {
    await fetch(`${getCmsUrl()}/api/media/${doc.id}`, {
      method: 'DELETE',
      headers: h,
    });
  }
}
