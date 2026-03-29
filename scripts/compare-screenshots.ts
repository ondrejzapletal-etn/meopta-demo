/**
 * Visual comparison script — screenshots each block via test page and compares
 * with scraped reference screenshots.
 *
 * Usage:
 *   npx tsx scripts/compare-screenshots.ts [--slug=blockName] [--base-url=http://localhost:3000] [--viewport=1280] [--threshold=15]
 *
 * Viewports: 375 (mobile), 768 (tablet), 1280 (desktop, default)
 *
 * Requires: FE dev server running, reference screenshots from full scrape
 */

import { chromium } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { PNG } from 'pngjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const REF_DIR = path.resolve(__dirname, 'reference');
const OUTPUT_DIR = path.resolve(__dirname, 'comparison-output');

// Current block slugs from blockComponents registry (blocks.tsx)
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

const VIEWPORT_PRESETS: Record<number, { width: number; height: number }> = {
  375: { width: 375, height: 812 },
  768: { width: 768, height: 1024 },
  1280: { width: 1280, height: 900 },
};

interface ComparisonResult {
  slug: string;
  viewport: number;
  hasReference: boolean;
  hasActual: boolean;
  pixelDiffPercent: number | null;
  status: 'pass' | 'fail' | 'skip' | 'error';
  error?: string;
}

/**
 * Simple pixel-diff comparison between two PNG images.
 * Returns the percentage of pixels that differ.
 * Optionally generates a diff overlay image.
 */
function compareImages(
  refPath: string,
  actualPath: string,
  diffPath?: string,
): number {
  const refBuf = fs.readFileSync(refPath);
  const actBuf = fs.readFileSync(actualPath);

  const refPng = PNG.sync.read(refBuf);
  const actPng = PNG.sync.read(actBuf);

  // If sizes differ significantly, normalize by scaling comparison
  const width = Math.min(refPng.width, actPng.width);
  const height = Math.min(refPng.height, actPng.height);
  const totalPixels = width * height;

  if (totalPixels === 0) return 100;

  let diffPixels = 0;
  const threshold = 30; // color channel threshold for "different"

  // Create diff image if path provided
  let diffPng: InstanceType<typeof PNG> | null = null;
  if (diffPath) {
    diffPng = new PNG({ width, height });
  }

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const refIdx = (refPng.width * y + x) * 4;
      const actIdx = (actPng.width * y + x) * 4;

      const dr = Math.abs(
        (refPng.data[refIdx] || 0) - (actPng.data[actIdx] || 0),
      );
      const dg = Math.abs(
        (refPng.data[refIdx + 1] || 0) - (actPng.data[actIdx + 1] || 0),
      );
      const db = Math.abs(
        (refPng.data[refIdx + 2] || 0) - (actPng.data[actIdx + 2] || 0),
      );

      const isDiff = dr > threshold || dg > threshold || db > threshold;
      if (isDiff) {
        diffPixels++;
      }

      if (diffPng) {
        const outIdx = (width * y + x) * 4;
        if (isDiff) {
          // Highlight diff pixels in red
          diffPng.data[outIdx] = 255;
          diffPng.data[outIdx + 1] = 0;
          diffPng.data[outIdx + 2] = 0;
          diffPng.data[outIdx + 3] = 200;
        } else {
          // Show actual image with reduced opacity
          diffPng.data[outIdx] = actPng.data[actIdx] || 0;
          diffPng.data[outIdx + 1] = actPng.data[actIdx + 1] || 0;
          diffPng.data[outIdx + 2] = actPng.data[actIdx + 2] || 0;
          diffPng.data[outIdx + 3] = 128;
        }
      }
    }
  }

  // Write diff image
  if (diffPng && diffPath) {
    const buffer = PNG.sync.write(diffPng);
    fs.writeFileSync(diffPath, buffer);
  }

  // Also account for size difference
  const maxPixels = Math.max(
    refPng.width * refPng.height,
    actPng.width * actPng.height,
  );
  const sizeDiffPixels = maxPixels - totalPixels;

  return ((diffPixels + sizeDiffPixels) / maxPixels) * 100;
}

/**
 * Create a side-by-side comparison image: [reference | actual | diff]
 */
function createSideBySide(
  refPath: string,
  actualPath: string,
  diffPath: string,
  outputPath: string,
): void {
  const refPng = PNG.sync.read(fs.readFileSync(refPath));
  const actPng = PNG.sync.read(fs.readFileSync(actualPath));
  const diffPng = PNG.sync.read(fs.readFileSync(diffPath));

  const gap = 4; // gap between images
  const maxHeight = Math.max(refPng.height, actPng.height, diffPng.height);
  const totalWidth = refPng.width + actPng.width + diffPng.width + gap * 2;

  const output = new PNG({ width: totalWidth, height: maxHeight });

  // Fill with white background
  for (let i = 0; i < output.data.length; i += 4) {
    output.data[i] = 255;
    output.data[i + 1] = 255;
    output.data[i + 2] = 255;
    output.data[i + 3] = 255;
  }

  // Copy reference image
  copyRegion(refPng, output, 0);

  // Copy actual image
  copyRegion(actPng, output, refPng.width + gap);

  // Copy diff image
  copyRegion(diffPng, output, refPng.width + actPng.width + gap * 2);

  const buffer = PNG.sync.write(output);
  fs.writeFileSync(outputPath, buffer);
}

function copyRegion(
  src: InstanceType<typeof PNG>,
  dst: InstanceType<typeof PNG>,
  xOffset: number,
): void {
  for (let y = 0; y < src.height && y < dst.height; y++) {
    for (let x = 0; x < src.width; x++) {
      const srcIdx = (src.width * y + x) * 4;
      const dstIdx = (dst.width * y + (x + xOffset)) * 4;
      dst.data[dstIdx] = src.data[srcIdx]!;
      dst.data[dstIdx + 1] = src.data[srcIdx + 1]!;
      dst.data[dstIdx + 2] = src.data[srcIdx + 2]!;
      dst.data[dstIdx + 3] = src.data[srcIdx + 3]!;
    }
  }
}

async function main(): Promise<void> {
  const args = process.argv.slice(2);
  const slugArg = args.find((a) => a.startsWith('--slug='));
  const baseUrlArg = args.find((a) => a.startsWith('--base-url='));
  const thresholdArg = args.find((a) => a.startsWith('--threshold='));
  const viewportArg = args.find((a) => a.startsWith('--viewport='));

  const targetSlug = slugArg?.split('=')[1];
  const baseUrl =
    baseUrlArg?.split('=').slice(1).join('=') || 'http://localhost:3000';
  const diffThreshold = parseFloat(thresholdArg?.split('=')[1] || '15');
  const viewportWidth = parseInt(viewportArg?.split('=')[1] || '1280', 10);
  const viewport = VIEWPORT_PRESETS[viewportWidth] || {
    width: viewportWidth,
    height: 900,
  };

  const slugs = targetSlug ? [targetSlug] : ALL_SLUGS;

  // Create output dir with viewport subfolder
  const viewportOutputDir = path.join(OUTPUT_DIR, `${viewportWidth}px`);
  fs.mkdirSync(viewportOutputDir, { recursive: true });

  const executablePath =
    process.env.PLAYWRIGHT_CHROMIUM_PATH ||
    `${process.env.HOME}/.cache/ms-playwright/chromium-1210/chrome-linux64/chrome`;

  const browser = await chromium.launch({
    headless: true,
    executablePath,
  });

  const page = await browser.newPage({ viewport });

  const results: ComparisonResult[] = [];

  console.log('Visual Comparison Report');
  console.log('========================\n');
  console.log(`Base URL: ${baseUrl}`);
  console.log(`Viewport: ${viewport.width}×${viewport.height}`);
  console.log(`Diff threshold: ${diffThreshold}%\n`);

  for (const slug of slugs) {
    // Determine reference screenshot path based on viewport
    const refScreenshot =
      viewportWidth === 1280
        ? path.join(REF_DIR, slug, 'screenshot.png')
        : path.join(REF_DIR, slug, `screenshot-${viewportWidth}.png`);
    const actualScreenshot = path.join(viewportOutputDir, `${slug}-actual.png`);
    const diffScreenshot = path.join(viewportOutputDir, `${slug}-diff.png`);
    const sxsScreenshot = path.join(
      viewportOutputDir,
      `${slug}-side-by-side.png`,
    );
    const hasReference = fs.existsSync(refScreenshot);

    const result: ComparisonResult = {
      slug,
      viewport: viewportWidth,
      hasReference,
      hasActual: false,
      pixelDiffPercent: null,
      status: 'skip',
    };

    if (!hasReference) {
      console.log(`  [SKIP] ${slug} — no reference screenshot`);
      results.push(result);
      continue;
    }

    try {
      const url = `${baseUrl}/test/blocks/${slug}`;
      await page.goto(url, { waitUntil: 'networkidle', timeout: 30_000 });
      await page.waitForTimeout(1000); // wait for animations

      // Screenshot the main section
      const section = await page.$('[data-testid]');
      if (section) {
        await section.screenshot({ path: actualScreenshot });
      } else {
        await page.screenshot({ path: actualScreenshot, fullPage: true });
      }
      result.hasActual = true;

      // Compare with diff overlay
      const diff = compareImages(refScreenshot, actualScreenshot, diffScreenshot);
      result.pixelDiffPercent = Math.round(diff * 100) / 100;
      result.status = diff <= diffThreshold ? 'pass' : 'fail';

      // Generate side-by-side for failed comparisons
      if (result.status === 'fail') {
        try {
          createSideBySide(
            refScreenshot,
            actualScreenshot,
            diffScreenshot,
            sxsScreenshot,
          );
        } catch {
          // Side-by-side generation is optional
        }
      }

      const icon = result.status === 'pass' ? '✓' : '✗';
      console.log(`  [${icon}] ${slug} — ${result.pixelDiffPercent}% diff`);
    } catch (err) {
      result.status = 'error';
      result.error = (err as Error).message;
      console.log(`  [ERR] ${slug} — ${result.error}`);
    }

    results.push(result);
  }

  await browser.close();

  // Summary
  const passed = results.filter((r) => r.status === 'pass');
  const failed = results.filter((r) => r.status === 'fail');
  const skipped = results.filter((r) => r.status === 'skip');
  const errors = results.filter((r) => r.status === 'error');

  console.log('\n--- Summary ---');
  console.log(`  Viewport: ${viewportWidth}px`);
  console.log(`  Passed: ${passed.length}`);
  console.log(`  Failed: ${failed.length}`);
  console.log(`  Skipped: ${skipped.length}`);
  console.log(`  Errors: ${errors.length}`);

  if (failed.length > 0) {
    console.log('\nFailed blocks:');
    for (const r of failed) {
      console.log(`  ${r.slug}: ${r.pixelDiffPercent}% diff`);
    }
  }

  // Write results
  const reportPath = path.join(
    viewportOutputDir,
    'comparison-report.json',
  );
  fs.writeFileSync(reportPath, JSON.stringify(results, null, 2));
  console.log(`\nReport written to: ${reportPath}`);

  if (failed.length > 0) {
    process.exit(1);
  }
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
