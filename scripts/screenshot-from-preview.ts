/**
 * Screenshot block thumbnails from the live Airbank preview page.
 * Loads the page once, closes cookie dialog, then screenshots each component.
 * Saves to apps/cms/public/block-thumbnails/{slug}.png
 *
 * Usage:
 *   npx tsx scripts/screenshot-from-preview.ts
 */

import { chromium, type Page, type ElementHandle } from '@playwright/test';
import * as path from 'path';
import * as fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PREVIEW_URL = 'https://www.airbank.cz/page-preview/?idPage=506&rev=1-fmxfs4qn419axbna1s';
const OUTPUT_DIR = path.resolve(__dirname, '../apps/cms/public/block-thumbnails');
const MAPPING_FILE = path.resolve(__dirname, 'reference/component-mapping.json');

// abId → section order (from component-mapping.json "mapping")
// primaryReferencePerSlug: which section is the canonical one for each CMS slug
// Extra: for CMS blocks not in primaryReferencePerSlug, use these abIds
const EXTRA_SLUG_TO_ABID: Record<string, string> = {
  conversionsBlock:              'Conversions',
  exchangeCompareTableBlock:     'ExchangeCompareTable',
  heroReasonsSimplifiedBlock:    'HeroReasonsSimplified',
  imageBlock:                    'Image',
  infoCenterCardsBlock:          'InfoCenterCards',
  infoDesktopBlock:              'InfoDesktop',
  infoImageBlock:                'InfoImage',
  infoPlainBlock:                'InfoPlain',
  jumbotronBlock:                'Jumbotron',
  jumbotronWithStickerBlock:     'JumbotronWithSticker',
  linkCardsBlock:                'LinkCards',
  loyalCustomerApplicationBlock: 'LoyalCustomerApplication',
  loyalCustomerTimelineBlock:    'LoyalCustomerTimeline',
  omnichannelBannerBlock:        'OmnichannelBanner',
  pensionSavingsCalculatorBlock: 'SupplementaryPensionSavingsCalculatorEnhanced',
  portuCalculatorBlock:          'PortuCalculator',
  portuPensionCalculatorBlock:   'PortuCalculatorPension',
  productCardsHorizontalBlock:   'ProductCardsHorizontal',
  stepsBlock:                    'Steps',
  stepsVerticalCollapsibleBlock: 'StepsVerticalCollapsible',
  tableCardCollapsibleBlock:     'TableCardCollapsible',
  videoCardsBlock:               'VideoCards',
  youTubeEmbedBlock:             'YouTube',
};

async function closeCookieDialog(page: Page): Promise<void> {
  // Try to find and click cookie rejection/accept button
  const cookieSelectors = [
    'button:has-text("ODMÍTNOUT VŠE")',
    'button:has-text("Odmítnout vše")',
    'button:has-text("POVOLIT VŠE")',
    'button:has-text("vychutnejte")',
    '[class*="cookie"] button',
    '[id*="cookie"] button',
    '[class*="consent"] button',
  ];

  for (const selector of cookieSelectors) {
    try {
      const btn = await page.$(selector);
      if (btn) {
        await btn.click();
        console.log(`  Cookies zavřeny (${selector})`);
        await page.waitForTimeout(800);
        return;
      }
    } catch {
      // try next
    }
  }

  // Try pressing Escape
  await page.keyboard.press('Escape');
  await page.waitForTimeout(500);
  console.log('  Cookie dialog: zkusil Escape');
}

async function screenshotElement(
  page: Page,
  selector: string,
  outPath: string,
): Promise<void> {
  // Re-query element fresh to avoid stale reference
  const element = await page.$(selector);
  if (!element) throw new Error(`Element not found: ${selector}`);

  // Scroll element into view
  const box = await element.boundingBox();
  if (box) {
    await page.evaluate((y) => window.scrollTo({ top: Math.max(0, y - 80), behavior: 'instant' }), box.y);
  }
  await page.waitForTimeout(300);

  // Wait for enter-viewport animations to finish
  await page.waitForTimeout(1500);

  // Re-query again after scroll to get fresh reference
  const fresh = await page.$(selector);
  if (!fresh) throw new Error(`Element detached after scroll: ${selector}`);
  await fresh.screenshot({ path: outPath });
}

async function findElementByAbId(page: Page, abId: string): Promise<ElementHandle | null> {
  // Elements have id like "HeroPlain-_t6j3atjo0" or just id="kalkulacka"
  // Try prefix match first
  const el = await page.$(`[id^="${abId}-"]`);
  if (el) return el;

  // Some have exact id (e.g. "kalkulacka", "hypotecni-kalkulacka")
  const exactMap: Record<string, string> = {
    kalkulacka:                                 'zonkyCalculatorBlock',
    'hypotecni-kalkulacka':                     'mortgageCalculatorBlock',
  };
  for (const [id, _slug] of Object.entries(exactMap)) {
    if (abId === id) {
      return await page.$(`#${id}`);
    }
  }

  return null;
}

async function main() {
  const mapping = JSON.parse(fs.readFileSync(MAPPING_FILE, 'utf-8'));
  const primaryRef: Record<string, number> = mapping.primaryReferencePerSlug;
  const catalogEntries: Array<{ order: number; abId: string; slug: string | null }> =
    Object.entries(mapping.mapping).map(([order, entry]: [string, any]) => ({
      order: parseInt(order),
      abId: entry.abId,
      slug: entry.slug,
    }));

  // Build abId lookup by order
  const orderToAbId: Record<number, string> = {};
  for (const entry of catalogEntries) {
    orderToAbId[entry.order] = entry.abId;
  }

  // Build full slug→abId map
  const slugToAbId: Record<string, string> = {};
  for (const [slug, order] of Object.entries(primaryRef)) {
    const abId = orderToAbId[order as unknown as number];
    if (abId) slugToAbId[slug] = abId;
  }
  // Add extras
  Object.assign(slugToAbId, EXTRA_SLUG_TO_ABID);

  const executablePath =
    process.env.PLAYWRIGHT_CHROMIUM_PATH ||
    `${process.env.HOME}/.cache/ms-playwright/chromium-1210/chrome-linux64/chrome`;

  console.log('Spouštím Chromium...');
  const browser = await chromium.launch({
    headless: true,
    executablePath,
  });

  const context = await browser.newContext({
    viewport: { width: 1280, height: 900 },
    locale: 'cs-CZ',
  });
  const page = await context.newPage();

  console.log(`Načítám preview stránku: ${PREVIEW_URL}`);
  console.log('(stránka se načítá pomalu, čekám...)');

  await page.goto(PREVIEW_URL, { waitUntil: 'networkidle', timeout: 120_000 });
  console.log('Stránka načtena.');

  // Extra wait for JS rendering
  await page.waitForTimeout(3000);

  // Close cookie dialog
  await closeCookieDialog(page);

  // Close any modal overlays ("vychutnejte si náš web")
  const modalOverlaySelectors = [
    '[class*="modal"] [class*="close"]',
    '[class*="overlay"] button',
    'button[aria-label*="zavřít"]',
    'button[aria-label*="close"]',
  ];
  for (const sel of modalOverlaySelectors) {
    try {
      const el = await page.$(sel);
      if (el) {
        await el.click();
        console.log(`  Modal zavřen (${sel})`);
        await page.waitForTimeout(500);
      }
    } catch {}
  }

  await page.waitForTimeout(1000);

  fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  const results: { slug: string; status: 'ok' | 'fail' | 'skip'; info?: string }[] = [];

  const onlyArg = process.argv.find((a) => a.startsWith('--only='));
  const onlyList = onlyArg ? onlyArg.split('=')[1].split(',') : null;
  const allSlugs = onlyList ? onlyList : Object.keys(slugToAbId);
  console.log(`\nFotím ${allSlugs.length} bloků...\n`);

  for (const slug of allSlugs) {
    const abId = slugToAbId[slug];
    const outPath = path.join(OUTPUT_DIR, `${slug}.png`);

    try {
      // Build selector
      let selector: string;
      if (abId === 'kalkulacka') {
        selector = '#kalkulacka';
      } else if (abId === 'hypotecni-kalkulacka') {
        selector = '#hypotecni-kalkulacka';
      } else {
        selector = `[id^="${abId}-"]`;
      }

      // Quick existence check
      const exists = await page.$(selector);
      if (!exists) {
        console.log(`  ⚠ ${slug} (${abId}) — element nenalezen`);
        results.push({ slug, status: 'skip', info: `abId=${abId} not found` });
        continue;
      }

      await screenshotElement(page, selector, outPath);
      console.log(`  ✓ ${slug}`);
      results.push({ slug, status: 'ok' });
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      console.error(`  ✗ ${slug}: ${msg}`);
      results.push({ slug, status: 'fail', info: msg });
    }
  }

  await browser.close();

  const ok = results.filter((r) => r.status === 'ok').length;
  const skip = results.filter((r) => r.status === 'skip').length;
  const fail = results.filter((r) => r.status === 'fail').length;
  console.log(`\nHotovo: ${ok} ok, ${skip} nenalezeno, ${fail} chyb`);
  if (skip > 0) {
    console.log('Nenalezené elementy:');
    results.filter((r) => r.status === 'skip').forEach((r) => console.log(`  - ${r.slug}: ${r.info}`));
  }
  if (fail > 0) {
    console.log('Chyby:');
    results.filter((r) => r.status === 'fail').forEach((r) => console.log(`  - ${r.slug}: ${r.info}`));
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
