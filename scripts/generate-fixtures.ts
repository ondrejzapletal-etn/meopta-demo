/**
 * Generate fixture.json files from parsers + reference HTML.
 *
 * For each block, loads the structure.html, runs the parser, and saves the
 * parsed output as fixture.json (replacing placeholder fixtures).
 *
 * Usage:
 *   npx tsx scripts/generate-fixtures.ts --all
 *   npx tsx scripts/generate-fixtures.ts --slug=heroPlainBlock
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import type { ParsedBlock } from './lib/parser-types.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const REF_DIR = path.resolve(__dirname, 'reference');

// ─── Parser Registry (same as populate-demo.ts) ─────────────────────────────

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

// Some reference directories use old slug names
const OLD_DIR_NAMES: Record<string, string> = {
  youtubeVideoBlock: 'youTubeEmbedBlock',
};

const PLACEHOLDER_SIGNATURE = 'est cupidatat laborum';

function loadReferenceHtml(slug: string): string | null {
  // Try the slug directory directly
  let htmlPath = path.join(REF_DIR, slug, 'structure.html');

  // Try old directory name
  if (!existsSync(htmlPath) && OLD_DIR_NAMES[slug]) {
    const altPath = path.join(REF_DIR, OLD_DIR_NAMES[slug]!, 'structure.html');
    if (existsSync(altPath)) {
      htmlPath = altPath;
    }
  }

  // Try component-mapping.json for reference index lookup
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
    return null;
  }

  const content = readFileSync(htmlPath, 'utf-8');

  // Check if it's a placeholder
  if (content.length < 200 && content.includes(PLACEHOLDER_SIGNATURE)) {
    return null;
  }

  return content;
}

function generateFixture(slug: string): {
  success: boolean;
  fixture?: Record<string, unknown>;
  error?: string;
  isPlaceholder?: boolean;
} {
  const parser = PARSERS[slug];
  if (!parser) {
    return { success: false, error: `No parser found for ${slug}` };
  }

  const html = loadReferenceHtml(slug);
  if (!html) {
    return {
      success: false,
      error: 'No real reference HTML (placeholder or missing)',
      isPlaceholder: true,
    };
  }

  try {
    const parsed = parser(html);

    // Build fixture from parsed data
    const fixture: Record<string, unknown> = {
      id: `fixture-${slug}`,
      blockType: parsed.blockType,
      ...parsed.data,
    };

    // Replace image references with fixture-friendly placeholders
    for (const img of parsed.images) {
      setNestedValue(fixture, img.fieldPath, {
        url: `/placeholder.jpg`,
        alt: img.alt || 'image',
        width: 800,
        height: 600,
      });
    }

    // Replace SVG references with inline content markers
    for (const svg of parsed.svgs) {
      setNestedValue(fixture, svg.fieldPath, {
        url: `/placeholder-${svg.name}.svg`,
        alt: svg.name,
        width: 48,
        height: 48,
      });
    }

    return { success: true, fixture };
  } catch (err) {
    return { success: false, error: `Parser error: ${err}` };
  }
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
      if (!Array.isArray(current[part])) {
        current[part] = [];
      }
      current = current[part] as Record<string, unknown>;
    } else if (/^\d+$/.test(part)) {
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

async function main(): Promise<void> {
  const args = process.argv.slice(2);
  const allFlag = args.includes('--all');
  const slugArg = args.find((a) => a.startsWith('--slug='));

  let slugs: string[];

  if (allFlag) {
    slugs = Object.keys(PARSERS).sort();
  } else if (slugArg) {
    slugs = [slugArg.split('=')[1]!];
  } else {
    console.log('Usage:');
    console.log('  npx tsx scripts/generate-fixtures.ts --all');
    console.log('  npx tsx scripts/generate-fixtures.ts --slug=heroPlainBlock');
    process.exit(0);
  }

  console.log(`Generating fixtures for ${slugs.length} block(s)...\n`);

  let success = 0;
  let skipped = 0;
  let failed = 0;

  for (const slug of slugs) {
    const result = generateFixture(slug);

    if (result.success && result.fixture) {
      const fixtureDir = path.join(REF_DIR, slug);
      mkdirSync(fixtureDir, { recursive: true });
      const fixturePath = path.join(fixtureDir, 'fixture.json');
      writeFileSync(fixturePath, JSON.stringify(result.fixture, null, 2));
      console.log(`  [OK] ${slug}`);
      success++;
    } else if (result.isPlaceholder) {
      console.log(`  [SKIP] ${slug} — ${result.error}`);
      skipped++;
    } else {
      console.log(`  [FAIL] ${slug} — ${result.error}`);
      failed++;
    }
  }

  console.log(`\n=== Done ===`);
  console.log(`  Success: ${success}`);
  console.log(`  Skipped (placeholder HTML): ${skipped}`);
  console.log(`  Failed: ${failed}`);
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
