#!/usr/bin/env npx tsx
/**
 * Populate CMS with demo content from Airbank preview reference data.
 *
 * Usage:
 *   npx tsx scripts/populate-demo.ts --block=heroPlainBlock   # single block
 *   npx tsx scripts/populate-demo.ts --all                    # all blocks (preview order)
 *   npx tsx scripts/populate-demo.ts --reset                  # reset page + state
 *   npx tsx scripts/populate-demo.ts --dry-run                # print JSON only
 *   npx tsx scripts/populate-demo.ts --dry-run --block=heroPlainBlock
 */

import { readFileSync, existsSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

import {
  findPage,
  createPage,
  updatePage,
  deletePage,
  deleteAllMedia,
  uploadMedia,
} from './lib/cms-api.js';
import {
  loadState,
  saveState,
  resetState,
  getCachedMediaId,
  setCachedMediaId,
  markBlockProcessed,
  markPositionProcessed,
  type DemoState,
} from './lib/state.js';
import type { ParsedBlock } from './lib/parser-types.js';

// ─── Parser Registry ────────────────────────────────────────────────────────

import { parse as parseRichTextBlock } from './parsers/richTextBlock.js';
import { parse as parseFlashMessageBlock } from './parsers/flashMessageBlock.js';
import { parse as parseContactStripBlock } from './parsers/contactStripBlock.js';
import { parse as parseYoutubeVideoBlock } from './parsers/youtubeVideoBlock.js';
import { parse as parseCallbackSimplifiedBlock } from './parsers/callbackSimplifiedBlock.js';
import { parse as parseHeroPlainBlock } from './parsers/heroPlainBlock.js';
import { parse as parseHeroWithImageBlock } from './parsers/heroWithImageBlock.js';
import { parse as parseHeroWithImageCompactBlock } from './parsers/heroWithImageCompactBlock.js';
import { parse as parseCallbackBlock } from './parsers/callbackBlock.js';
import { parse as parseFeatureBlock } from './parsers/featureBlock.js';
import { parse as parseInfoImageBigBlock } from './parsers/infoImageBigBlock.js';
import { parse as parseInfoDoubleImageBlock } from './parsers/infoDoubleImageBlock.js';
import { parse as parseInfoVideoBlock } from './parsers/infoVideoBlock.js';
import { parse as parseBenefitsBlock } from './parsers/benefitsBlock.js';
import { parse as parseBenefitsWithImageBlock } from './parsers/benefitsWithImageBlock.js';
import { parse as parseBenefitsWithListBlock } from './parsers/benefitsWithListBlock.js';
import { parse as parseContentCardsBlock } from './parsers/contentCardsBlock.js';
import { parse as parseFaqItemsBlock } from './parsers/faqItemsBlock.js';
import { parse as parseTimelineBlock } from './parsers/timelineBlock.js';
import { parse as parseTopManagementCardsBlock } from './parsers/topManagementCardsBlock.js';
import { parse as parsePressCenterContactBlock } from './parsers/pressCenterContactBlock.js';
import { parse as parseDiscountsBlock } from './parsers/discountsBlock.js';
import { parse as parseInfoCardNarrowBlock } from './parsers/infoCardNarrowBlock.js';
import { parse as parseLogoCarouselBlock } from './parsers/logoCarouselBlock.js';
import { parse as parseProductCardsVerticalBlock } from './parsers/productCardsVerticalBlock.js';
import { parse as parseProductCardHorizontalBlock } from './parsers/productCardHorizontalBlock.js';
import { parse as parseFeatureApplicationBlock } from './parsers/featureApplicationBlock.js';
import { parse as parseInfoCenterFaqBlock } from './parsers/infoCenterFaqBlock.js';
import { parse as parseLoyalCustomerBenefitsBlock } from './parsers/loyalCustomerBenefitsBlock.js';
import { parse as parseCompareTableBlock } from './parsers/compareTableBlock.js';
import { parse as parseCompareBondsTableBlock } from './parsers/compareBondsTableBlock.js';
import { parse as parseExchangeTradedFundsTableBlock } from './parsers/exchangeTradedFundsTableBlock.js';
import { parse as parseDownloadSectionBlock } from './parsers/downloadSectionBlock.js';
import { parse as parseExchangeRatesBlock } from './parsers/exchangeRatesBlock.js';
import { parse as parseHeroSliderBlock } from './parsers/heroSliderBlock.js';
import { parse as parseHeroWithImageAndSearchBlock } from './parsers/heroWithImageAndSearchBlock.js';
import { parse as parseZonkyCalculatorBlock } from './parsers/zonkyCalculatorBlock.js';
import { parse as parseLoanCalculatorBlock } from './parsers/loanCalculatorBlock.js';
import { parse as parseMortgageCalculatorBlock } from './parsers/mortgageCalculatorBlock.js';
import { parse as parseInflationCalculatorBlock } from './parsers/inflationCalculatorBlock.js';
import { parse as parseZoneInterestBlock } from './parsers/zoneInterestBlock.js';
import { parse as parseConversionsBlock } from './parsers/conversionsBlock.js';
import { parse as parseImageBlock } from './parsers/imageBlock.js';
import { parse as parseJumbotronWithStickerBlock } from './parsers/jumbotronWithStickerBlock.js';
import { parse as parseInfoDesktopBlock } from './parsers/infoDesktopBlock.js';
import { parse as parseInfoImageBlock } from './parsers/infoImageBlock.js';
import { parse as parseInfoPlainBlock } from './parsers/infoPlainBlock.js';
import { parse as parseJumbotronBlock } from './parsers/jumbotronBlock.js';
import { parse as parseInfoCenterCardsBlock } from './parsers/infoCenterCardsBlock.js';
import { parse as parseVideoCardsBlock } from './parsers/videoCardsBlock.js';
import { parse as parseLinkCardsBlock } from './parsers/linkCardsBlock.js';
import { parse as parseHeroReasonsSimplifiedBlock } from './parsers/heroReasonsSimplifiedBlock.js';
import { parse as parseTableCardCollapsibleBlock } from './parsers/tableCardCollapsibleBlock.js';
import { parse as parseExchangeCompareTableBlock } from './parsers/exchangeCompareTableBlock.js';
import { parse as parsePortuCalculatorBlock } from './parsers/portuCalculatorBlock.js';
import { parse as parsePortuPensionCalculatorBlock } from './parsers/portuPensionCalculatorBlock.js';
import { parse as parsePensionSavingsCalculatorBlock } from './parsers/pensionSavingsCalculatorBlock.js';
import { parse as parseLoyalCustomerTimelineBlock } from './parsers/loyalCustomerTimelineBlock.js';
import { parse as parseOmnichannelBannerBlock } from './parsers/omnichannelBannerBlock.js';
import { parse as parseProductCardsHorizontalBlock } from './parsers/productCardsHorizontalBlock.js';
import { parse as parseStepsBlock } from './parsers/stepsBlock.js';
import { parse as parseStepsVerticalCollapsibleBlock } from './parsers/stepsVerticalCollapsibleBlock.js';
import { parse as parseLoyalCustomerApplicationBlock } from './parsers/loyalCustomerApplicationBlock.js';

type ParserFn = (html: string) => ParsedBlock;

const PARSERS: Record<string, ParserFn> = {
  richTextBlock: parseRichTextBlock,
  flashMessageBlock: parseFlashMessageBlock,
  contactStripBlock: parseContactStripBlock,
  youtubeVideoBlock: parseYoutubeVideoBlock,
  callbackSimplifiedBlock: parseCallbackSimplifiedBlock,
  heroPlainBlock: parseHeroPlainBlock,
  heroWithImageBlock: parseHeroWithImageBlock,
  heroWithImageCompactBlock: parseHeroWithImageCompactBlock,
  callbackBlock: parseCallbackBlock,
  featureBlock: parseFeatureBlock,
  infoImageBigBlock: parseInfoImageBigBlock,
  infoDoubleImageBlock: parseInfoDoubleImageBlock,
  infoVideoBlock: parseInfoVideoBlock,
  benefitsBlock: parseBenefitsBlock,
  benefitsWithImageBlock: parseBenefitsWithImageBlock,
  benefitsWithListBlock: parseBenefitsWithListBlock,
  contentCardsBlock: parseContentCardsBlock,
  faqItemsBlock: parseFaqItemsBlock,
  timelineBlock: parseTimelineBlock,
  topManagementCardsBlock: parseTopManagementCardsBlock,
  pressCenterContactBlock: parsePressCenterContactBlock,
  discountsBlock: parseDiscountsBlock,
  infoCardNarrowBlock: parseInfoCardNarrowBlock,
  logoCarouselBlock: parseLogoCarouselBlock,
  productCardsVerticalBlock: parseProductCardsVerticalBlock,
  productCardHorizontalBlock: parseProductCardHorizontalBlock,
  featureApplicationBlock: parseFeatureApplicationBlock,
  infoCenterFaqBlock: parseInfoCenterFaqBlock,
  loyalCustomerBenefitsBlock: parseLoyalCustomerBenefitsBlock,
  compareTableBlock: parseCompareTableBlock,
  compareBondsTableBlock: parseCompareBondsTableBlock,
  exchangeTradedFundsTableBlock: parseExchangeTradedFundsTableBlock,
  downloadSectionBlock: parseDownloadSectionBlock,
  exchangeRatesBlock: parseExchangeRatesBlock,
  heroSliderBlock: parseHeroSliderBlock,
  heroWithImageAndSearchBlock: parseHeroWithImageAndSearchBlock,
  zonkyCalculatorBlock: parseZonkyCalculatorBlock,
  loanCalculatorBlock: parseLoanCalculatorBlock,
  mortgageCalculatorBlock: parseMortgageCalculatorBlock,
  inflationCalculatorBlock: parseInflationCalculatorBlock,
  zoneInterestBlock: parseZoneInterestBlock,
  conversionsBlock: parseConversionsBlock,
  imageBlock: parseImageBlock,
  jumbotronWithStickerBlock: parseJumbotronWithStickerBlock,
  infoDesktopBlock: parseInfoDesktopBlock,
  infoImageBlock: parseInfoImageBlock,
  infoPlainBlock: parseInfoPlainBlock,
  jumbotronBlock: parseJumbotronBlock,
  infoCenterCardsBlock: parseInfoCenterCardsBlock,
  videoCardsBlock: parseVideoCardsBlock,
  linkCardsBlock: parseLinkCardsBlock,
  heroReasonsSimplifiedBlock: parseHeroReasonsSimplifiedBlock,
  tableCardCollapsibleBlock: parseTableCardCollapsibleBlock,
  exchangeCompareTableBlock: parseExchangeCompareTableBlock,
  portuCalculatorBlock: parsePortuCalculatorBlock,
  portuPensionCalculatorBlock: parsePortuPensionCalculatorBlock,
  pensionSavingsCalculatorBlock: parsePensionSavingsCalculatorBlock,
  loyalCustomerTimelineBlock: parseLoyalCustomerTimelineBlock,
  omnichannelBannerBlock: parseOmnichannelBannerBlock,
  productCardsHorizontalBlock: parseProductCardsHorizontalBlock,
  stepsBlock: parseStepsBlock,
  stepsVerticalCollapsibleBlock: parseStepsVerticalCollapsibleBlock,
  loyalCustomerApplicationBlock: parseLoyalCustomerApplicationBlock,
};

// ─── Per-position data overrides (for duplicate slugs with different content) ─

const POSITION_OVERRIDES: Record<number, Record<string, unknown>> = {
  6: {
    // Second benefitsBlock: 4-column variant
    title: 'Benefity (1–4 bloky)',
    description: 'magna nisi consectetur non exercitation',
    columns: '4',
    items: [
      { title: 'tempor', description: 'tempornontempornonnon' },
      { title: 'nisi quis deserunt Excepteur', description: 'nisi quis deserunt Excepteurofficia elit commodo Duis magna' },
      { title: 'officia et dolore', description: 'officia et dolorecupidatatcupidatat' },
      { title: 'consectetur anim', description: 'consectetur animofficia elit commodo Duis magna' },
    ],
  },
};

// ─── Full Order (all blocks with positions) ──────────────────────────────────

const FULL_ORDER: Array<{pos: number; slug: string}> = [
  { pos: 0,  slug: 'heroPlainBlock' },
  { pos: 1,  slug: 'heroWithImageBlock' },
  { pos: 2,  slug: 'heroWithImageAndSearchBlock' },
  { pos: 3,  slug: 'heroWithImageCompactBlock' },
  { pos: 4,  slug: 'heroSliderBlock' },
  { pos: 5,  slug: 'benefitsBlock' },
  { pos: 6,  slug: 'benefitsBlock' },
  { pos: 7,  slug: 'benefitsWithImageBlock' },
  { pos: 8,  slug: 'benefitsWithListBlock' },
  { pos: 9,  slug: 'callbackBlock' },
  { pos: 10, slug: 'callbackSimplifiedBlock' },
  { pos: 11, slug: 'compareTableBlock' },
  { pos: 12, slug: 'exchangeTradedFundsTableBlock' },
  { pos: 13, slug: 'loyalCustomerBenefitsBlock' },
  { pos: 14, slug: 'tableCardCollapsibleBlock' },
  { pos: 15, slug: 'discountsBlock' },
  { pos: 16, slug: 'exchangeRatesBlock' },
  { pos: 18, slug: 'contentCardsBlock' },
  { pos: 19, slug: 'contactStripBlock' },
  { pos: 20, slug: 'conversionsBlock' },
  { pos: 21, slug: 'faqItemsBlock' },
  { pos: 22, slug: 'downloadSectionBlock' },
  { pos: 23, slug: 'featureBlock' },
  { pos: 24, slug: 'featureApplicationBlock' },
  { pos: 25, slug: 'flashMessageBlock' },
  { pos: 26, slug: 'richTextBlock' },
  { pos: 27, slug: 'imageBlock' },
  { pos: 28, slug: 'infoCardNarrowBlock' },
  { pos: 29, slug: 'jumbotronWithStickerBlock' },
  { pos: 30, slug: 'infoCenterCardsBlock' },
  { pos: 31, slug: 'infoCenterFaqBlock' },
  { pos: 32, slug: 'infoDesktopBlock' },
  { pos: 33, slug: 'infoDoubleImageBlock' },
  { pos: 34, slug: 'infoImageBlock' },
  { pos: 35, slug: 'infoImageBigBlock' },
  { pos: 36, slug: 'infoPlainBlock' },
  { pos: 37, slug: 'infoVideoBlock' },
  { pos: 38, slug: 'jumbotronBlock' },
  { pos: 40, slug: 'linkCardsBlock' },
  { pos: 41, slug: 'loyalCustomerApplicationBlock' },
  { pos: 42, slug: 'loyalCustomerTimelineBlock' },
  { pos: 43, slug: 'omnichannelBannerBlock' },
  { pos: 44, slug: 'pressCenterContactBlock' },
  { pos: 45, slug: 'productCardHorizontalBlock' },
  { pos: 46, slug: 'productCardsVerticalBlock' },
  { pos: 47, slug: 'productCardsHorizontalBlock' },
  { pos: 50, slug: 'stepsBlock' },
  { pos: 51, slug: 'timelineBlock' },
  { pos: 52, slug: 'topManagementCardsBlock' },
  { pos: 53, slug: 'videoCardsBlock' },
  { pos: 54, slug: 'youtubeVideoBlock' },
  { pos: 55, slug: 'zoneInterestBlock' },
  { pos: 56, slug: 'zonkyCalculatorBlock' },
  { pos: 57, slug: 'inflationCalculatorBlock' },
  { pos: 58, slug: 'loanCalculatorBlock' },
  { pos: 59, slug: 'mortgageCalculatorBlock' },
  { pos: 60, slug: 'portuCalculatorBlock' },
  { pos: 61, slug: 'portuPensionCalculatorBlock' },
  { pos: 62, slug: 'pensionSavingsCalculatorBlock' },
  { pos: 63, slug: 'compareBondsTableBlock' },
  { pos: 64, slug: 'exchangeCompareTableBlock' },
  { pos: 65, slug: 'heroReasonsSimplifiedBlock' },
  { pos: 66, slug: 'logoCarouselBlock' },
  { pos: 67, slug: 'stepsVerticalCollapsibleBlock' },
];

// ─── Constants ──────────────────────────────────────────────────────────────

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const REF_DIR = path.resolve(__dirname, 'reference');
const PAGE_TITLE = 'Airbank Demo';
const PAGE_SLUG = 'airbank-demo';

// ─── Helpers ────────────────────────────────────────────────────────────────

// Some reference directories use old slug names from before renames
const OLD_DIR_NAMES: Record<string, string> = {
  youtubeVideoBlock: 'youTubeEmbedBlock',
};

function loadReferenceHtml(slug: string): string {
  // Try the slug directory directly
  let htmlPath = path.join(REF_DIR, slug, 'structure.html');

  // Try old directory name
  if (!existsSync(htmlPath) && OLD_DIR_NAMES[slug]) {
    const altPath = path.join(REF_DIR, OLD_DIR_NAMES[slug]!, 'structure.html');
    if (existsSync(altPath)) {
      htmlPath = altPath;
    }
  }

  // Try to find via component-mapping.json
  if (!existsSync(htmlPath)) {
    const mappingPath = path.join(REF_DIR, 'component-mapping.json');
    if (existsSync(mappingPath)) {
      const mapping = JSON.parse(readFileSync(mappingPath, 'utf-8'));
      const refIndex = mapping.primaryReferencePerSlug?.[slug];
      if (refIndex !== undefined) {
        const entry = mapping.mapping?.[String(refIndex)];
        if (entry?.slug && entry.slug !== slug) {
          const altPath = path.join(REF_DIR, entry.slug, 'structure.html');
          if (existsSync(altPath)) {
            htmlPath = altPath;
          }
        }
      }
    }
  }

  if (!existsSync(htmlPath)) {
    throw new Error(`Reference HTML not found for ${slug}: ${htmlPath}`);
  }

  return readFileSync(htmlPath, 'utf-8');
}

async function resolveImages(
  parsed: ParsedBlock,
  state: DemoState,
): Promise<Record<string, unknown>> {
  const data = { ...parsed.data };

  // Upload raster images
  for (const img of parsed.images) {
    const cacheKey = img.url || img.alt;
    let mediaId = getCachedMediaId(state, cacheKey);

    if (!mediaId) {
      try {
        const { downloadImage, safeFilename } = await import('./lib/image-utils.js');
        const localPath = await downloadImage(img.url, safeFilename(img.url));
        mediaId = await uploadMedia(localPath, img.alt || 'image');
        setCachedMediaId(state, cacheKey, mediaId);
        saveState(state);
      } catch (err) {
        console.warn(`  Warning: Could not download image ${img.url}: ${err}`);
        // Use placeholder for required image fields
        try {
          const { createPlaceholderImage } = await import('./lib/image-utils.js');
          const placeholderPath = createPlaceholderImage(`placeholder-${img.fieldPath.replace(/\./g, '-')}.png`);
          mediaId = await uploadMedia(placeholderPath, img.alt || 'placeholder');
          setCachedMediaId(state, cacheKey, mediaId);
          saveState(state);
        } catch (err2) {
          console.warn(`  Warning: Could not create placeholder: ${err2}`);
          continue;
        }
      }
    }

    setNestedValue(data, img.fieldPath, mediaId);
  }

  // Upload SVGs
  for (const svg of parsed.svgs) {
    const cacheKey = `svg:${svg.name}`;
    let mediaId = getCachedMediaId(state, cacheKey);

    if (!mediaId) {
      try {
        const { saveSvg } = await import('./lib/image-utils.js');
        const localPath = saveSvg(svg.content, `${svg.name}.svg`);
        mediaId = await uploadMedia(localPath, svg.name);
        setCachedMediaId(state, cacheKey, mediaId);
        saveState(state);
      } catch (err) {
        console.warn(`  Warning: Could not upload SVG ${svg.name}: ${err}`);
        continue;
      }
    }

    setNestedValue(data, svg.fieldPath, mediaId);
  }

  return data;
}

function setNestedValue(
  obj: Record<string, unknown>,
  fieldPath: string,
  value: unknown,
): void {
  const parts = fieldPath.split('.');
  let current: Record<string, unknown> = obj;

  for (let i = 0; i < parts.length - 1; i++) {
    const part = parts[i]!;
    const nextPart = parts[i + 1]!;

    if (/^\d+$/.test(nextPart)) {
      // Next part is array index
      if (!Array.isArray(current[part])) {
        current[part] = [];
      }
      current = current[part] as Record<string, unknown>;
    } else if (/^\d+$/.test(part)) {
      // Current part is array index
      const idx = parseInt(part, 10);
      const arr = current as unknown as Array<Record<string, unknown>>;
      if (!arr[idx]) arr[idx] = {};
      current = arr[idx] as Record<string, unknown>;
    } else {
      if (!current[part] || typeof current[part] !== 'object') {
        current[part] = {};
      }
      current = current[part] as Record<string, unknown>;
    }
  }

  const lastPart = parts[parts.length - 1]!;
  if (/^\d+$/.test(lastPart)) {
    (current as unknown as unknown[])[parseInt(lastPart, 10)] = value;
  } else {
    current[lastPart] = value;
  }
}

// ─── Main Processing ────────────────────────────────────────────────────────

async function processBlock(
  slug: string,
  state: DemoState,
  dryRun: boolean,
): Promise<Record<string, unknown> | null> {
  console.log(`\n--- Processing: ${slug} ---`);

  const parser = PARSERS[slug];
  if (!parser) {
    console.error(`  No parser found for ${slug}`);
    return null;
  }

  // Load reference HTML
  let html: string;
  try {
    html = loadReferenceHtml(slug);
  } catch (err) {
    console.error(`  ${err}`);
    return null;
  }

  // Parse HTML
  const parsed = parser(html);
  console.log(`  Parsed: blockType=${parsed.blockType}, images=${parsed.images.length}, svgs=${parsed.svgs.length}`);

  if (dryRun) {
    console.log('  [DRY RUN] Block data:');
    console.log(JSON.stringify(parsed.data, null, 2));
    return parsed.data;
  }

  // Resolve images (upload to CMS)
  const blockData = await resolveImages(parsed, state);

  // Add blockType
  const block = { blockType: parsed.blockType, ...blockData };
  console.log(`  Block ready: ${JSON.stringify(block).slice(0, 200)}...`);

  return block;
}

async function ensurePage(state: DemoState): Promise<number> {
  if (state.pageId) {
    // Verify page still exists
    const existing = await findPage(PAGE_SLUG);
    if (existing) return existing.id;
  }

  // Create new page
  const existing = await findPage(PAGE_SLUG);
  if (existing) {
    state.pageId = existing.id;
    saveState(state);
    return existing.id;
  }

  const page = await createPage(PAGE_TITLE, PAGE_SLUG, []);
  state.pageId = page.id;
  saveState(state);
  console.log(`Created page: ${PAGE_TITLE} (id=${page.id}, slug=${PAGE_SLUG})`);
  return page.id;
}

async function appendBlockToPage(
  pageId: number,
  block: Record<string, unknown>,
  state: DemoState,
): Promise<void> {
  // Get current page layout
  const page = await findPage(PAGE_SLUG);
  const currentLayout = page?.layout || [];

  // Append new block
  const newLayout = [...currentLayout, block];

  await updatePage(pageId, newLayout);
  saveState(state);
  console.log(`  Appended to page (total blocks: ${newLayout.length})`);
}

// ─── CLI ────────────────────────────────────────────────────────────────────

async function main(): Promise<void> {
  const args = process.argv.slice(2);

  const blockArg = args.find((a) => a.startsWith('--block='));
  const dryRun = args.includes('--dry-run');
  const doReset = args.includes('--reset');
  const doAll = args.includes('--all');

  if (doReset) {
    console.log('Resetting demo state...');
    const state = loadState();
    if (state.pageId) {
      try {
        await deletePage(state.pageId);
        console.log(`Deleted page ${state.pageId}`);
      } catch {
        console.log('Page already deleted or not found');
      }
    }
    try {
      await deleteAllMedia();
      console.log('Deleted all media');
    } catch {
      console.log('Could not delete media');
    }
    resetState();
    console.log('State reset. Ready for fresh population.');
    return;
  }

  let entriesToProcess: Array<{pos: number; slug: string}> = [];

  if (blockArg) {
    const slug = blockArg.split('=')[1]!;
    entriesToProcess = [{ pos: -1, slug }];
  } else if (doAll) {
    entriesToProcess = FULL_ORDER;
  } else {
    console.log('Usage:');
    console.log('  npx tsx scripts/populate-demo.ts --block=heroPlainBlock');
    console.log('  npx tsx scripts/populate-demo.ts --all');
    console.log('  npx tsx scripts/populate-demo.ts --reset');
    console.log('  npx tsx scripts/populate-demo.ts --dry-run --block=heroPlainBlock');
    process.exit(0);
  }

  const state = loadState();

  if (!dryRun) {
    console.log('Ensuring demo page exists...');
    await ensurePage(state);
  }

  console.log(`\nProcessing ${entriesToProcess.length} block(s)...`);

  let success = 0;
  let failed = 0;
  const processedPositions = new Set<number>();

  for (const entry of entriesToProcess) {
    const { pos, slug } = entry;

    // Track by position to allow duplicate slugs at different positions
    if (!dryRun && pos >= 0 && (state.processedPositions ?? []).includes(pos)) {
      console.log(`\n--- Skipping: ${slug} at pos ${pos} (already processed) ---`);
      success++;
      continue;
    }

    try {
      const block = await processBlock(slug, state, dryRun);
      if (block && !dryRun) {
        // Apply position-specific overrides (e.g. 4-column benefitsBlock)
        if (pos >= 0 && POSITION_OVERRIDES[pos]) {
          const overrides = POSITION_OVERRIDES[pos]!;
          for (const [key, val] of Object.entries(overrides)) {
            if (Array.isArray(val) && Array.isArray(block[key])) {
              // Deep-merge arrays: keep existing item fields (like icon media IDs),
              // override only the fields specified in the override
              const existing = block[key] as Record<string, unknown>[];
              const overrideArr = val as Record<string, unknown>[];
              block[key] = overrideArr.map((ov, idx) => ({
                ...(existing[idx] ?? {}),
                ...ov,
              }));
            } else {
              (block as Record<string, unknown>)[key] = val;
            }
          }
          // For override items without an icon, reuse a cached SVG
          const items = (block as Record<string, unknown>).items;
          if (Array.isArray(items)) {
            for (let idx = 0; idx < items.length; idx++) {
              const item = items[idx] as Record<string, unknown>;
              if (!item.icon) {
                const reuseIdx = idx % 3; // cycle through benefit-icon-0/1/2
                const mediaId = getCachedMediaId(state, `svg:benefit-icon-${reuseIdx}`);
                if (mediaId) item.icon = mediaId;
              }
            }
          }
          console.log(`  Applied override for pos ${pos}`);
        }
        await appendBlockToPage(state.pageId!, block, state);
        if (pos >= 0) {
          markPositionProcessed(state, pos);
          markBlockProcessed(state, slug);
        }
      }
      success++;
    } catch (err) {
      console.error(`  ERROR processing ${slug}: ${err}`);
      failed++;
    }
  }

  console.log(`\n=== Done ===`);
  console.log(`Success: ${success}, Failed: ${failed}`);

  if (!dryRun && state.pageId) {
    console.log(`\nView in CMS: http://localhost:3001/admin/collections/pages/${state.pageId}`);
    console.log(`View on FE:  http://localhost:3000/cs/${PAGE_SLUG}`);
  }
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
