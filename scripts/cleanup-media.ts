/**
 * Cleanup unused media from CMS.
 *
 * Scans all pages and globals (header, footer) for media references,
 * then deletes any media items that are not referenced anywhere.
 *
 * Usage:
 *   npx tsx scripts/cleanup-media.ts          # dry-run (default)
 *   npx tsx scripts/cleanup-media.ts --delete  # actually delete
 */

import { getToken, getCmsUrl } from './lib/auth.js';

const DRY_RUN = !process.argv.includes('--delete');

async function headers(): Promise<Record<string, string>> {
  const token = await getToken();
  return {
    Authorization: `JWT ${token}`,
    'Content-Type': 'application/json',
  };
}

// ─── Fetch helpers ───────────────────────────────────────────────────────────

async function fetchAllMedia(): Promise<Array<{ id: number; filename: string }>> {
  const h = await headers();
  const all: Array<{ id: number; filename: string }> = [];
  let page = 1;
  let hasMore = true;

  while (hasMore) {
    const url = `${getCmsUrl()}/api/media?limit=100&page=${page}&depth=0`;
    const res = await fetch(url, { headers: h });
    if (!res.ok) throw new Error(`Fetch media failed (${res.status})`);

    const data = (await res.json()) as {
      docs: Array<{ id: number; filename: string }>;
      hasNextPage: boolean;
    };
    all.push(...data.docs);
    hasMore = data.hasNextPage;
    page++;
  }

  return all;
}

async function fetchAllPages(): Promise<unknown[]> {
  const h = await headers();
  const all: unknown[] = [];
  let page = 1;
  let hasMore = true;

  while (hasMore) {
    const url = `${getCmsUrl()}/api/pages?limit=100&page=${page}&depth=0`;
    const res = await fetch(url, { headers: h });
    if (!res.ok) throw new Error(`Fetch pages failed (${res.status})`);

    const data = (await res.json()) as { docs: unknown[]; hasNextPage: boolean };
    all.push(...data.docs);
    hasMore = data.hasNextPage;
    page++;
  }

  return all;
}

async function fetchGlobal(slug: string): Promise<unknown> {
  const h = await headers();
  const url = `${getCmsUrl()}/api/globals/${slug}?depth=0`;
  const res = await fetch(url, { headers: h });
  if (!res.ok) throw new Error(`Fetch global "${slug}" failed (${res.status})`);
  return res.json();
}

// ─── Collect referenced media IDs ────────────────────────────────────────────

/**
 * Recursively walk any JSON value and collect all numbers that could be
 * media references. In Payload with depth=0, upload fields are stored as
 * plain numeric IDs.
 */
function collectMediaIds(value: unknown, ids: Set<number>): void {
  if (value === null || value === undefined) return;

  if (typeof value === 'number' && Number.isInteger(value) && value > 0) {
    ids.add(value);
    return;
  }

  if (Array.isArray(value)) {
    for (const item of value) {
      collectMediaIds(item, ids);
    }
    return;
  }

  if (typeof value === 'object') {
    for (const val of Object.values(value as Record<string, unknown>)) {
      collectMediaIds(val, ids);
    }
  }
}

// ─── Delete ──────────────────────────────────────────────────────────────────

async function deleteMedia(id: number): Promise<void> {
  const h = await headers();
  const res = await fetch(`${getCmsUrl()}/api/media/${id}`, {
    method: 'DELETE',
    headers: h,
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Delete media ${id} failed (${res.status}): ${text}`);
  }
}

// ─── Main ────────────────────────────────────────────────────────────────────

async function main() {
  console.log(DRY_RUN ? '=== DRY RUN (use --delete to actually delete) ===' : '=== DELETING unused media ===');
  console.log();

  // 1. Fetch all media
  const allMedia = await fetchAllMedia();
  console.log(`Media in CMS: ${allMedia.length}`);

  if (allMedia.length === 0) {
    console.log('Nothing to clean up.');
    return;
  }

  const allMediaIds = new Set(allMedia.map((m) => m.id));

  // 2. Collect referenced IDs from pages and globals
  const referencedIds = new Set<number>();

  const pages = await fetchAllPages();
  console.log(`Pages found: ${pages.length}`);
  for (const page of pages) {
    collectMediaIds(page, referencedIds);
  }

  for (const globalSlug of ['header', 'footer']) {
    const global = await fetchGlobal(globalSlug);
    collectMediaIds(global, referencedIds);
  }

  // Only keep IDs that actually exist in media collection
  const referencedMediaIds = new Set([...referencedIds].filter((id) => allMediaIds.has(id)));
  console.log(`Referenced media: ${referencedMediaIds.size}`);

  // 3. Find unused
  const unused = allMedia.filter((m) => !referencedMediaIds.has(m.id));
  console.log(`Unused media: ${unused.length}`);
  console.log();

  if (unused.length === 0) {
    console.log('All media is in use. Nothing to delete.');
    return;
  }

  for (const m of unused) {
    console.log(`  ${DRY_RUN ? '[would delete]' : '[deleting]'} id=${m.id}  ${m.filename}`);
    if (!DRY_RUN) {
      await deleteMedia(m.id);
    }
  }

  console.log();
  console.log(DRY_RUN ? `Would delete ${unused.length} media items. Run with --delete to confirm.` : `Deleted ${unused.length} media items.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
