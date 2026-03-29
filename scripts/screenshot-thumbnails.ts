/**
 * Screenshot block thumbnails from local test pages.
 * Saves to apps/cms/public/block-thumbnails/{slug}.png
 *
 * Usage:
 *   npx tsx scripts/screenshot-thumbnails.ts [--slug=blockName] [--base-url=http://localhost:3000]
 *
 * Requires FE dev server running at localhost:3000
 */

import { chromium } from '@playwright/test';
import * as path from 'path';
import * as fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const OUTPUT_DIR = path.resolve(__dirname, '../apps/cms/public/block-thumbnails');

const ALL_SLUGS = [
  // Hero
  'heroPlainBlock',
  'heroWithImageBlock',
  'heroSliderBlock',
  'heroWithImageAndSearchBlock',
  'heroWithImageCompactBlock',
  // Content
  'richTextBlock',
  'featureBlock',
  'infoDoubleImageBlock',
  'infoImageBigBlock',
  'infoVideoBlock',
  'contentCardsBlock',
  'callbackBlock',
  'contactStripBlock',
  'flashMessageBlock',
  'conversionsBlock',
  'imageBlock',
  'jumbotronWithStickerBlock',
  'infoDesktopBlock',
  'infoImageBlock',
  'infoPlainBlock',
  'jumbotronBlock',
  // Benefits
  'benefitsBlock',
  'benefitsWithImageBlock',
  'productCardsVerticalBlock',
  'productCardHorizontalBlock',
  'benefitsWithListBlock',
  // Cards
  'infoCardNarrowBlock',
  'loyalCustomerBenefitsBlock',
  'discountsBlock',
  'faqItemsBlock',
  'infoCenterFaqBlock',
  'infoCenterCardsBlock',
  'videoCardsBlock',
  'linkCardsBlock',
  'heroReasonsSimplifiedBlock',
  // Tables
  'exchangeTradedFundsTableBlock',
  'downloadSectionBlock',
  'exchangeRatesBlock',
  'compareTableBlock',
  'compareBondsTableBlock',
  'tableCardCollapsibleBlock',
  'exchangeCompareTableBlock',
  // Interactive
  'loanCalculatorBlock',
  'mortgageCalculatorBlock',
  'inflationCalculatorBlock',
  'zonkyCalculatorBlock',
  'zoneInterestBlock',
  'portuCalculatorBlock',
  'portuPensionCalculatorBlock',
  'pensionSavingsCalculatorBlock',
  // Special
  'timelineBlock',
  'topManagementCardsBlock',
  'pressCenterContactBlock',
  'logoCarouselBlock',
  'featureApplicationBlock',
  'youtubeVideoBlock',
  'callbackSimplifiedBlock',
  'loyalCustomerTimelineBlock',
  'omnichannelBannerBlock',
  'productCardsHorizontalBlock',
  'stepsBlock',
  'stepsVerticalCollapsibleBlock',
  'loyalCustomerApplicationBlock',
];

async function main() {
  const args = process.argv.slice(2);
  const slugArg = args.find((a) => a.startsWith('--slug='));
  const baseUrlArg = args.find((a) => a.startsWith('--base-url='));

  const targetSlug = slugArg?.split('=')[1];
  const baseUrl = baseUrlArg?.split('=').slice(1).join('=') || 'http://localhost:3000';
  const slugs = targetSlug ? [targetSlug] : ALL_SLUGS;

  const executablePath =
    process.env.PLAYWRIGHT_CHROMIUM_PATH ||
    `${process.env.HOME}/.cache/ms-playwright/chromium-1210/chrome-linux64/chrome`;

  const browser = await chromium.launch({
    headless: true,
    executablePath,
  });

  const context = await browser.newContext({
    viewport: { width: 1280, height: 900 },
  });

  const page = await context.newPage();

  fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  const results: { slug: string; status: 'ok' | 'fail'; error?: string }[] = [];

  console.log(`Taking thumbnails for ${slugs.length} blocks → ${OUTPUT_DIR}\n`);

  for (const slug of slugs) {
    const url = `${baseUrl}/test/blocks/${slug}`;
    const outPath = path.join(OUTPUT_DIR, `${slug}.png`);

    try {
      await page.goto(url, { waitUntil: 'networkidle', timeout: 30_000 });

      // Wait for animations to settle
      await page.waitForTimeout(1500);

      // Scroll to trigger intersection-observer animations, then wait
      await page.evaluate(() => window.scrollTo(0, 0));
      await page.waitForTimeout(800);

      // Find the main block element (has data-testid)
      const section = await page.$('[data-testid]');
      if (section) {
        await section.screenshot({ path: outPath });
      } else {
        // Fallback: screenshot full page body
        await page.screenshot({ path: outPath, fullPage: false });
      }

      console.log(`  ✓ ${slug}`);
      results.push({ slug, status: 'ok' });
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      console.error(`  ✗ ${slug}: ${msg}`);
      results.push({ slug, status: 'fail', error: msg });
    }
  }

  await browser.close();

  const ok = results.filter((r) => r.status === 'ok').length;
  const fail = results.filter((r) => r.status === 'fail').length;
  console.log(`\nDone: ${ok} ok, ${fail} failed`);
  if (fail > 0) {
    console.log('Failed:');
    results.filter((r) => r.status === 'fail').forEach((r) => console.log(`  - ${r.slug}: ${r.error}`));
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
