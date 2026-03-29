/**
 * Extract computed CSS styles for each block from the Airbank preview page.
 *
 * For each block, extracts the computed styles of all elements within the block
 * wrapper div at 3 viewports (1280, 768, 375). Output is saved as
 * scripts/reference/{slug}/computed-styles.json.
 *
 * Usage:
 *   npx tsx scripts/extract-block-styles.ts --all
 *   npx tsx scripts/extract-block-styles.ts --slug=heroPlainBlock
 *   npx tsx scripts/extract-block-styles.ts --positions=0,1,5
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
  { width: 1280, height: 900, label: '1280' },
  { width: 768, height: 1024, label: '768' },
  { width: 375, height: 812, label: '375' },
];

// CSS properties to extract
const CSS_PROPERTIES = [
  'display',
  'flexDirection',
  'justifyContent',
  'alignItems',
  'gap',
  'width',
  'height',
  'maxWidth',
  'minHeight',
  'padding',
  'paddingTop',
  'paddingRight',
  'paddingBottom',
  'paddingLeft',
  'margin',
  'marginTop',
  'marginRight',
  'marginBottom',
  'marginLeft',
  'fontSize',
  'fontWeight',
  'lineHeight',
  'letterSpacing',
  'textAlign',
  'color',
  'backgroundColor',
  'backgroundImage',
  'borderRadius',
  'border',
  'borderTop',
  'borderBottom',
  'boxShadow',
  'position',
  'top',
  'left',
  'right',
  'bottom',
  'zIndex',
  'overflow',
  'overflowX',
  'overflowY',
  'opacity',
  'transform',
  'gridTemplateColumns',
  'gridTemplateRows',
  'gridGap',
  'flexWrap',
  'flexGrow',
  'flexShrink',
  'flexBasis',
  'textDecoration',
  'whiteSpace',
  'textOverflow',
  'aspectRatio',
  'objectFit',
  'objectPosition',
];

// Position -> slug mapping (same as scrape-missing.ts)
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

interface ElementStyle {
  selector: string;
  tag: string;
  classes: string;
  text: string;
  styles: Record<string, string>;
  children: ElementStyle[];
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

async function extractStylesForPosition(
  page: Page,
  position: number,
  maxDepth: number = 5,
): Promise<ElementStyle | null> {
  const cssProps = JSON.stringify(CSS_PROPERTIES);

  const result = await page.evaluate(
    `(() => {
      const CSS_PROPS = ${cssProps};
      const MAX_DEPTH = ${maxDepth};

      const containers = document.querySelectorAll('main > div');
      const container = containers[${position}];
      if (!container) return null;

      function getSelector(el, depth) {
        const tag = el.tagName.toLowerCase();
        const cls = (el.className || '').toString().trim().split(/\\s+/).filter(Boolean).slice(0, 3).join('.');
        const prefix = '  '.repeat(depth);
        return prefix + tag + (cls ? '.' + cls : '');
      }

      function getDirectText(el) {
        let text = '';
        for (const node of el.childNodes) {
          if (node.nodeType === 3) {
            text += node.textContent;
          }
        }
        return text.trim().slice(0, 80);
      }

      function extractElement(el, depth) {
        if (depth > MAX_DEPTH) return null;
        if (el.nodeType !== 1) return null;

        const computed = window.getComputedStyle(el);
        const styles = {};
        for (const prop of CSS_PROPS) {
          const val = computed[prop];
          if (val !== undefined && val !== '' && val !== 'none' && val !== 'normal' && val !== 'auto' && val !== '0px' && val !== 'rgba(0, 0, 0, 0)') {
            styles[prop] = val;
          }
        }

        const children = [];
        for (const child of el.children) {
          const childResult = extractElement(child, depth + 1);
          if (childResult) children.push(childResult);
        }

        return {
          selector: getSelector(el, depth),
          tag: el.tagName.toLowerCase(),
          classes: (el.className || '').toString().trim().slice(0, 200),
          text: getDirectText(el),
          styles: styles,
          children: children,
        };
      }

      return extractElement(container, 0);
    })()`,
  ) as ElementStyle | null;

  return result;
}

async function main(): Promise<void> {
  const args = process.argv.slice(2);
  const allFlag = args.includes('--all');
  const slugArg = args.find((a) => a.startsWith('--slug='));
  const positionsArg = args.find((a) => a.startsWith('--positions='));
  const depthArg = args.find((a) => a.startsWith('--depth='));

  const maxDepth = parseInt(depthArg?.split('=')[1] || '5', 10);

  let positions: number[];

  if (allFlag) {
    positions = Object.keys(POSITION_TO_SLUG)
      .map(Number)
      .sort((a, b) => a - b);
  } else if (slugArg) {
    const slug = slugArg.split('=')[1]!;
    const pos = SLUG_TO_POSITION[slug];
    if (pos === undefined) {
      console.error(`Unknown slug: ${slug}`);
      process.exit(1);
    }
    positions = [pos];
  } else if (positionsArg) {
    positions = positionsArg
      .split('=')[1]!
      .split(',')
      .map(Number)
      .filter((n) => !isNaN(n));
  } else {
    console.log('Usage:');
    console.log('  npx tsx scripts/extract-block-styles.ts --all');
    console.log('  npx tsx scripts/extract-block-styles.ts --slug=heroPlainBlock');
    console.log('  npx tsx scripts/extract-block-styles.ts --positions=0,1,5');
    console.log('  npx tsx scripts/extract-block-styles.ts --slug=heroPlainBlock --depth=8');
    process.exit(0);
  }

  console.log(
    `Extracting computed styles for ${positions.length} positions, max depth ${maxDepth}`,
  );
  console.log(`Viewports: ${VIEWPORTS.map((v) => v.label).join(', ')}\n`);

  const browser = await launchBrowser();

  for (const vp of VIEWPORTS) {
    console.log(`\n=== Viewport: ${vp.width}×${vp.height} ===\n`);

    const page = await browser.newPage({
      viewport: { width: vp.width, height: vp.height },
    });

    await page.goto(PREVIEW_URL, {
      waitUntil: 'networkidle',
      timeout: 60_000,
    });
    await scrollFullPage(page);

    for (const pos of positions) {
      const slug = POSITION_TO_SLUG[pos];
      if (!slug) {
        console.log(`  [SKIP] Position ${pos} — no slug mapping`);
        continue;
      }

      console.log(`  Extracting: ${slug} (pos ${pos})...`);

      try {
        const styles = await extractStylesForPosition(page, pos, maxDepth);

        if (!styles) {
          console.log(`    [WARN] No element found at position ${pos}`);
          continue;
        }

        const compDir = path.join(REF_DIR, slug);
        fs.mkdirSync(compDir, { recursive: true });

        // Load or create the computed-styles.json
        const stylesPath = path.join(compDir, 'computed-styles.json');
        let allStyles: Record<string, ElementStyle> = {};

        if (fs.existsSync(stylesPath)) {
          try {
            allStyles = JSON.parse(fs.readFileSync(stylesPath, 'utf-8'));
          } catch {
            allStyles = {};
          }
        }

        allStyles[vp.label] = styles;
        fs.writeFileSync(stylesPath, JSON.stringify(allStyles, null, 2));
        console.log(`    Saved ${countElements(styles)} elements`);
      } catch (err) {
        console.warn(`    [ERR] ${slug}: ${err}`);
      }
    }

    await page.close();
  }

  await browser.close();
  console.log('\n=== Done ===');
}

function countElements(style: ElementStyle): number {
  let count = 1;
  for (const child of style.children) {
    count += countElements(child);
  }
  return count;
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
