#!/usr/bin/env npx tsx
/**
 * Scrape branch gallery photos from airbank.cz and upload to CMS.
 *
 * This script:
 * 1. Fetches each branch detail page from airbank.cz
 * 2. Extracts all branch-photo URLs
 * 3. Downloads and uploads photos to CMS media
 * 4. Updates each branch with gallery + listingImage
 *
 * Usage:
 *   npx tsx scripts/populate-pobocky-gallery.ts            # full run
 *   npx tsx scripts/populate-pobocky-gallery.ts --dry-run   # scrape only, print URLs
 */

import {
  uploadMedia,
  findCollectionItems,
  updateCollectionItem,
} from './lib/cms-api.js';
import { downloadImage, safeFilename } from './lib/image-utils.js';

const BASE_URL = 'https://www.airbank.cz';

// ─── Media cache ─────────────────────────────────────────────────────────────

const mediaCache: Record<string, number> = {};

async function ensureMedia(url: string, alt: string): Promise<number> {
  if (mediaCache[url]) return mediaCache[url]!;

  const filename = safeFilename(url, '.jpg');
  const localPath = await downloadImage(url, filename);
  const id = await uploadMedia(localPath, alt);
  mediaCache[url] = id;
  return id;
}

// ─── Scraping ────────────────────────────────────────────────────────────────

interface BranchGallery {
  slug: string;
  photoUrls: string[];
}

async function scrapeBranchPhotos(slug: string): Promise<string[]> {
  // slug is like "mapa-pobocek-a-bankomatu/brno-jostova-2"
  const url = `${BASE_URL}/${slug}/`;
  const res = await fetch(url);
  if (!res.ok) {
    console.warn(`  Failed to fetch ${url}: ${res.status}`);
    return [];
  }

  const html = await res.text();

  // Extract all branch-photo references from the HTML
  const matches = html.matchAll(/branch-photo\/([^"')\s]+)/g);
  const photoFiles = new Set<string>();
  for (const m of matches) {
    photoFiles.add(m[1]!);
  }

  // Convert to full URLs, deduplicate
  return Array.from(photoFiles).map(f => `${BASE_URL}/data/branch-photo/${f}`);
}

// ─── Main ────────────────────────────────────────────────────────────────────

async function main(): Promise<void> {
  const args = process.argv.slice(2);
  const dryRun = args.includes('--dry-run');

  // 1. Get all branches from CMS
  console.log('Fetching branches from CMS...');
  const result = await findCollectionItems('branches', 'limit=100&depth=0&sort=name');
  const branches = result.docs as Array<{ id: number; slug: string; name: string }>;
  console.log(`Found ${branches.length} branches in CMS.\n`);

  if (branches.length === 0) {
    console.error('No branches found. Run populate-pobocky.ts first.');
    process.exit(1);
  }

  let totalPhotos = 0;
  let branchesUpdated = 0;

  for (let i = 0; i < branches.length; i++) {
    const branch = branches[i]!;
    console.log(`${i + 1}/${branches.length} ${branch.name} (${branch.slug})`);

    // 2. Scrape photo URLs from original page
    const photoUrls = await scrapeBranchPhotos(branch.slug);
    console.log(`  Found ${photoUrls.length} photos`);

    if (photoUrls.length === 0) {
      console.warn('  No photos found, skipping');
      continue;
    }

    if (dryRun) {
      photoUrls.forEach(u => console.log(`    ${u}`));
      totalPhotos += photoUrls.length;
      continue;
    }

    // 3. Download & upload each photo
    const galleryItems: Array<{ image: number }> = [];
    for (let j = 0; j < photoUrls.length; j++) {
      const photoUrl = photoUrls[j]!;
      try {
        process.stdout.write(`  Uploading ${j + 1}/${photoUrls.length}...\r`);
        const mediaId = await ensureMedia(photoUrl, `${branch.name} - foto ${j + 1}`);
        galleryItems.push({ image: mediaId });
      } catch (err) {
        console.warn(`  Failed to upload ${photoUrl}: ${(err as Error).message}`);
      }
    }
    console.log(`  Uploaded ${galleryItems.length} photos`);

    if (galleryItems.length === 0) continue;

    // 4. Update branch: first photo = listingImage, all photos = gallery
    const listingImageId = galleryItems[0]!.image;
    try {
      await updateCollectionItem('branches', branch.id, {
        gallery: galleryItems,
        listingImage: listingImageId,
      });
      console.log(`  Updated branch (gallery: ${galleryItems.length}, listingImage: ${listingImageId})`);
      branchesUpdated++;
      totalPhotos += galleryItems.length;
    } catch (err) {
      console.error(`  Failed to update branch: ${(err as Error).message}`);
    }
  }

  console.log(`\nDone! Updated ${branchesUpdated} branches with ${totalPhotos} total photos.`);
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
