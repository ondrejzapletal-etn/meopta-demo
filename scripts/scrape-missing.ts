/**
 * Targeted re-scrape of missing reference data from Airbank preview page.
 *
 * Scrapes HTML structure + screenshots at 3 viewports for specified positions.
 *
 * Usage:
 *   npx tsx scripts/scrape-missing.ts --all              # re-scrape all positions
 *   npx tsx scripts/scrape-missing.ts --positions=14,20,27  # specific positions
 *   npx tsx scripts/scrape-missing.ts --missing           # only blocks with placeholder HTML or missing screenshots
 *   npx tsx scripts/scrape-missing.ts --slug=imageBlock   # single block by slug
 */

import { chromium, type Browser, type Page } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PREVIEW_URL =
  'https://www.airbank.cz/page-preview/?idPage=506&rev=1-fmxfs4qn419axbna1s';

const REF_DIR = path.resolve(__dirname, 'reference');

const VIEWPORTS = [
  { width: 1280, height: 900, suffix: '' },
  { width: 768, height: 1024, suffix: '-768' },
  { width: 375, height: 812, suffix: '-375' },
];

// Placeholder HTML signature (85 bytes)
const PLACEHOLDER_SIGNATURE = 'est cupidatat laborum';

// Component mapping: position -> slug (from component-mapping.json and populate-demo.ts)
const POSITION_TO_SLUG: Record<number, string> = {
  0: 'heroPlainBlock',
  1: 'heroWithImageBlock',
  2: 'heroWithImageAndSearchBlock',
  3: 'heroWithImageCompactBlock',
  4: 'heroSliderBlock',
  5: 'benefitsBlock',
  7: 'benefitsWithImageBlock',
  8: 'benefitsWithListBlock',
  9: 'callbackBlock',
  10: 'callbackSimplifiedBlock',
  11: 'compareTableBlock',
  12: 'exchangeTradedFundsTableBlock',
  13: 'loyalCustomerBenefitsBlock',
  14: 'tableCardCollapsibleBlock',
  15: 'discountsBlock',
  16: 'exchangeRatesBlock',
  18: 'contentCardsBlock',
  19: 'contactStripBlock',
  20: 'conversionsBlock',
  21: 'faqItemsBlock',
  22: 'downloadSectionBlock',
  23: 'featureBlock',
  24: 'featureApplicationBlock',
  25: 'flashMessageBlock',
  26: 'richTextBlock',
  27: 'imageBlock',
  28: 'infoCardNarrowBlock',
  29: 'jumbotronWithStickerBlock',
  30: 'infoCenterCardsBlock',
  31: 'infoCenterFaqBlock',
  32: 'infoDesktopBlock',
  33: 'infoDoubleImageBlock',
  34: 'infoImageBlock',
  35: 'infoImageBigBlock',
  36: 'infoPlainBlock',
  37: 'infoVideoBlock',
  38: 'jumbotronBlock',
  40: 'linkCardsBlock',
  41: 'loyalCustomerApplicationBlock',
  42: 'loyalCustomerTimelineBlock',
  43: 'omnichannelBannerBlock',
  44: 'pressCenterContactBlock',
  45: 'productCardHorizontalBlock',
  46: 'productCardsVerticalBlock',
  47: 'productCardsHorizontalBlock',
  50: 'stepsBlock',
  51: 'timelineBlock',
  52: 'topManagementCardsBlock',
  53: 'videoCardsBlock',
  54: 'youtubeVideoBlock',
  55: 'zoneInterestBlock',
  56: 'zonkyCalculatorBlock',
  57: 'inflationCalculatorBlock',
  58: 'loanCalculatorBlock',
  59: 'mortgageCalculatorBlock',
  60: 'portuCalculatorBlock',
  61: 'portuPensionCalculatorBlock',
  62: 'pensionSavingsCalculatorBlock',
  63: 'compareBondsTableBlock',
  64: 'exchangeCompareTableBlock',
  65: 'heroReasonsSimplifiedBlock',
  66: 'logoCarouselBlock',
  67: 'stepsVerticalCollapsibleBlock',
};

const SLUG_TO_POSITION: Record<string, number> = {};
for (const [pos, slug] of Object.entries(POSITION_TO_SLUG)) {
  SLUG_TO_POSITION[slug] = parseInt(pos, 10);
}

function isPlaceholderHtml(htmlPath: string): boolean {
  if (!fs.existsSync(htmlPath)) return true;
  const content = fs.readFileSync(htmlPath, 'utf-8');
  return content.length < 200 && content.includes(PLACEHOLDER_SIGNATURE);
}

function isMissingScreenshot(slug: string): boolean {
  return !fs.existsSync(path.join(REF_DIR, slug, 'screenshot.png'));
}

function findMissingPositions(): number[] {
  const positions: Set<number> = new Set();

  for (const [posStr, slug] of Object.entries(POSITION_TO_SLUG)) {
    const pos = parseInt(posStr, 10);
    const htmlPath = path.join(REF_DIR, slug, 'structure.html');

    if (isPlaceholderHtml(htmlPath) || isMissingScreenshot(slug)) {
      positions.add(pos);
    }
  }

  return Array.from(positions).sort((a, b) => a - b);
}

async function launchBrowser(): Promise<Browser> {
  const executablePath =
    process.env.PLAYWRIGHT_CHROMIUM_PATH ||
    `${process.env.HOME}/.cache/ms-playwright/chromium-1210/chrome-linux64/chrome`;

  return chromium.launch({
    headless: true,
    executablePath,
  });
}

async function scrollFullPage(page: Page): Promise<void> {
  await page.evaluate(`(async () => {
    const delay = ms => new Promise(r => setTimeout(r, ms));
    const scrollHeight = document.body.scrollHeight;
    const step = window.innerHeight / 2;
    for (let y = 0; y < scrollHeight; y += step) {
      window.scrollTo(0, y);
      await delay(300);
    }
    window.scrollTo(0, 0);
    await delay(500);
  })()`);
}

async function scrapePositions(positions: number[]): Promise<void> {
  console.log(`Scraping ${positions.length} positions from preview page...`);
  console.log(`Positions: ${positions.join(', ')}\n`);

  const browser = await launchBrowser();

  // We'll scrape at each viewport size
  for (const vp of VIEWPORTS) {
    console.log(`\n=== Viewport: ${vp.width}×${vp.height} ===\n`);

    const page = await browser.newPage({
      viewport: { width: vp.width, height: vp.height },
    });

    await page.goto(PREVIEW_URL, { waitUntil: 'networkidle', timeout: 60_000 });
    await scrollFullPage(page);

    // Get all top-level component wrappers using the known selector
    const selector = 'main > div';
    const handles = await page.$$(selector);
    console.log(`Found ${handles.length} components on page at ${vp.width}px`);

    // Extract HTML (only at 1280px — HTML structure is viewport-independent)
    if (vp.width === 1280) {
      const htmls = await page.evaluate(
        `(() => {
          const elements = document.querySelectorAll('main > div');
          return Array.from(elements).map(el => el.outerHTML);
        })()`,
      ) as string[];

      for (const pos of positions) {
        if (pos >= handles.length) {
          console.log(`  [SKIP] Position ${pos} — out of range (${handles.length} components)`);
          continue;
        }

        const slug = POSITION_TO_SLUG[pos];
        if (!slug) {
          console.log(`  [SKIP] Position ${pos} — no slug mapping`);
          continue;
        }

        const compDir = path.join(REF_DIR, slug);
        fs.mkdirSync(compDir, { recursive: true });

        const html = htmls[pos];
        if (html) {
          fs.writeFileSync(path.join(compDir, 'structure.html'), html);
          console.log(`  [HTML] ${slug} (pos ${pos}) — ${html.length} bytes`);
        }
      }
    }

    // Screenshots at current viewport
    for (const pos of positions) {
      if (pos >= handles.length) continue;

      const slug = POSITION_TO_SLUG[pos];
      if (!slug) continue;

      const handle = handles[pos];
      if (!handle) continue;

      const compDir = path.join(REF_DIR, slug);
      fs.mkdirSync(compDir, { recursive: true });

      const screenshotName =
        vp.suffix === ''
          ? 'screenshot.png'
          : `screenshot${vp.suffix}.png`;

      try {
        await handle.scrollIntoViewIfNeeded();
        await page.waitForTimeout(500);
        await handle.screenshot({
          path: path.join(compDir, screenshotName),
        });
        console.log(`  [SCREENSHOT] ${slug} — ${screenshotName}`);
      } catch (err) {
        console.warn(`  [WARN] Could not screenshot ${slug} at ${vp.width}px: ${err}`);
      }
    }

    await page.close();
  }

  await browser.close();

  console.log('\n=== Done ===');
  console.log(`Scraped ${positions.length} positions across ${VIEWPORTS.length} viewports.`);
}

async function main(): Promise<void> {
  const args = process.argv.slice(2);

  const allFlag = args.includes('--all');
  const missingFlag = args.includes('--missing');
  const positionsArg = args.find((a) => a.startsWith('--positions='));
  const slugArg = args.find((a) => a.startsWith('--slug='));

  let positions: number[];

  if (allFlag) {
    positions = Object.keys(POSITION_TO_SLUG).map(Number).sort((a, b) => a - b);
    console.log(`Mode: ALL — scraping all ${positions.length} positions`);
  } else if (missingFlag) {
    positions = findMissingPositions();
    console.log(`Mode: MISSING — found ${positions.length} positions with placeholder HTML or missing screenshots`);
    for (const pos of positions) {
      const slug = POSITION_TO_SLUG[pos];
      const htmlPath = path.join(REF_DIR, slug!, 'structure.html');
      const hasPlaceholder = isPlaceholderHtml(htmlPath);
      const hasMissingScreenshot = isMissingScreenshot(slug!);
      console.log(`  pos=${pos} slug=${slug} placeholder=${hasPlaceholder} noScreenshot=${hasMissingScreenshot}`);
    }
  } else if (positionsArg) {
    positions = positionsArg
      .split('=')[1]!
      .split(',')
      .map(Number)
      .filter((n) => !isNaN(n));
    console.log(`Mode: POSITIONS — scraping positions: ${positions.join(', ')}`);
  } else if (slugArg) {
    const slug = slugArg.split('=')[1]!;
    const pos = SLUG_TO_POSITION[slug];
    if (pos === undefined) {
      console.error(`Unknown slug: ${slug}`);
      process.exit(1);
    }
    positions = [pos];
    console.log(`Mode: SLUG — scraping ${slug} at position ${pos}`);
  } else {
    console.log('Usage:');
    console.log('  npx tsx scripts/scrape-missing.ts --all');
    console.log('  npx tsx scripts/scrape-missing.ts --missing');
    console.log('  npx tsx scripts/scrape-missing.ts --positions=14,20,27');
    console.log('  npx tsx scripts/scrape-missing.ts --slug=imageBlock');
    process.exit(0);
  }

  if (positions.length === 0) {
    console.log('No positions to scrape. All reference data is present.');
    return;
  }

  await scrapePositions(positions);
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
