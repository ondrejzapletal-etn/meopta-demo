/**
 * Scrape Airbank preview page — two-step process:
 *   Step 1 (recon):  Discover DOM structure, build component catalog
 *   Step 2 (full):   Extract HTML + screenshots per component
 *
 * Usage:
 *   npx tsx scripts/scrape-components.ts recon
 *   npx tsx scripts/scrape-components.ts full [--selector=".css-selector"]
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

// All 43 known CMS block slugs
const KNOWN_SLUGS = [
  'heroBlock',
  'heroWithImageBlock',
  'heroSliderBlock',
  'heroSearchBlock',
  'heroCompactBlock',
  'richTextBlock',
  'contentWithImageBlock',
  'contentWithDoubleImageBlock',
  'contentWithLargeImageBlock',
  'contentWithVideoBlock',
  'contentCardsBlock',
  'ctaBlock',
  'infoStripBlock',
  'tipBarBlock',
  'benefitIconsBlock',
  'benefitImagesBlock',
  'benefitCardsVerticalBlock',
  'benefitCardsHorizontalBlock',
  'smallBenefitsBlock',
  'reasonCardsBlock',
  'quickActionMenuBlock',
  'tariffComparisonBlock',
  'discountCardsBlock',
  'accordionBlock',
  'faqGridBlock',
  'tariffTableBlock',
  'downloadTableBlock',
  'exchangeRatesBlock',
  'bankComparisonBlock',
  'termDepositTableBlock',
  'tabsBlock',
  'loanCalculatorBlock',
  'mortgageCalculatorBlock',
  'inflationCalculatorBlock',
  'investmentCalculatorBlock',
  'savingsChartBlock',
  'timelineBlock',
  'teamGridBlock',
  'contactPersonsBlock',
  'logoCarouselBlock',
  'appPromoBlock',
  'youTubeEmbedBlock',
  'contactFormBlock',
];

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

// ─── Step 1: Reconnaissance ────────────────────────────────────────────────

async function recon(): Promise<void> {
  console.log('Step 1: Reconnaissance — loading preview page...');
  const browser = await launchBrowser();
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  await page.goto(PREVIEW_URL, { waitUntil: 'networkidle', timeout: 60_000 });
  await scrollFullPage(page);

  // Extract top-level DOM structure of the main content area
  const domStructure = await page.evaluate(`(() => {
    const selectors = [
      'main',
      '[role="main"]',
      '#content',
      '.page-content',
      '#main',
      'article',
      '.content',
      'body > div > div',
    ];

    let container = null;
    let usedSelector = '';

    for (const sel of selectors) {
      const el = document.querySelector(sel);
      if (el && el.children.length > 3) {
        container = el;
        usedSelector = sel;
        break;
      }
    }

    if (!container) {
      const all = document.querySelectorAll('*');
      let best = null;
      let bestCount = 0;
      for (const el of all) {
        if (el.children.length > bestCount && el.tagName !== 'HTML' && el.tagName !== 'BODY') {
          best = el;
          bestCount = el.children.length;
        }
      }
      container = best;
      usedSelector = best
        ? best.tagName.toLowerCase() + (best.className ? '.' + best.className.split(' ')[0] : '')
        : 'NONE';
    }

    if (!container) return { usedSelector: 'NONE', children: [], raw: '' };

    const children = [];

    for (let i = 0; i < container.children.length; i++) {
      const child = container.children[i];
      const headingEl = child.querySelector('h1,h2,h3,h4,h5,h6');
      const heading = headingEl ? headingEl.textContent.trim().slice(0, 80) : '';
      const dataAttrs = {};
      for (const attr of child.attributes) {
        if (attr.name.startsWith('data-')) {
          dataAttrs[attr.name] = attr.value;
        }
      }

      children.push({
        index: i,
        tag: child.tagName.toLowerCase(),
        classes: (child.className || '').toString().slice(0, 200),
        dataAttrs: dataAttrs,
        heading: heading,
        childCount: child.children.length,
        outerHTMLPreview: child.outerHTML.slice(0, 300),
      });
    }

    const raw = container.innerHTML
      .replace(/<!--[\\s\\S]*?-->/g, '')
      .slice(0, 20000);

    return { usedSelector: usedSelector, children: children, raw: raw };
  })()`) as { usedSelector: string; children: Array<{ index: number; tag: string; classes: string; dataAttrs: Record<string, string>; heading: string; childCount: number; outerHTMLPreview: string }>; raw: string };

  // Build catalog
  const catalog = domStructure.children.map((child, i) => ({
    order: i,
    tag: child.tag,
    classes: child.classes,
    dataAttrs: child.dataAttrs,
    heading: child.heading,
    childCount: child.childCount,
    preview: child.outerHTMLPreview,
    suggestedType: guessBlockType(child),
    mappedCmsBlock: null as string | null, // will be filled manually or heuristically
  }));

  // Heuristic mapping based on class names, headings, structure
  for (const item of catalog) {
    const match = KNOWN_SLUGS.find((slug) => {
      const lower = slug.toLowerCase();
      const classes = item.classes.toLowerCase();
      const heading = item.heading.toLowerCase();
      return classes.includes(lower) || heading.includes(lower);
    });
    item.mappedCmsBlock = match || null;
  }

  // Write outputs
  fs.mkdirSync(REF_DIR, { recursive: true });

  // dom-structure.txt
  const structureTxt = [
    `Preview URL: ${PREVIEW_URL}`,
    `Detected container selector: ${domStructure.usedSelector}`,
    `Total top-level children: ${domStructure.children.length}`,
    '',
    '=== TOP-LEVEL CHILDREN ===',
    '',
    ...domStructure.children.map(
      (c) =>
        `[${c.index}] <${c.tag}> classes="${c.classes}" children=${c.childCount}\n` +
        `    heading: "${c.heading}"\n` +
        `    data-attrs: ${JSON.stringify(c.dataAttrs)}\n` +
        `    preview: ${c.outerHTMLPreview.slice(0, 200)}...\n`,
    ),
    '',
    '=== RAW HTML (truncated) ===',
    domStructure.raw.slice(0, 10_000),
  ].join('\n');

  fs.writeFileSync(path.join(REF_DIR, 'dom-structure.txt'), structureTxt);
  fs.writeFileSync(path.join(REF_DIR, 'catalog.json'), JSON.stringify(catalog, null, 2));

  console.log(`\nResults written to:`);
  console.log(`  ${path.join(REF_DIR, 'dom-structure.txt')}`);
  console.log(`  ${path.join(REF_DIR, 'catalog.json')}`);
  console.log(`\nDetected container selector: "${domStructure.usedSelector}"`);
  console.log(`Total components found: ${domStructure.children.length}`);
  console.log(`\nMapped to CMS blocks:`);
  for (const item of catalog) {
    const status = item.mappedCmsBlock ? `✓ ${item.mappedCmsBlock}` : '✗ UNMAPPED';
    console.log(`  [${item.order}] "${item.heading || '(no heading)'}" → ${status}`);
  }

  const unmapped = catalog.filter((c) => !c.mappedCmsBlock);
  if (unmapped.length > 0) {
    console.log(`\n⚠ ${unmapped.length} components not mapped to any CMS block.`);
    console.log('Review catalog.json and update mappings before running full scrape.');
  }

  // Take full-page screenshot for reference
  await page.screenshot({
    path: path.join(REF_DIR, 'full-page.png'),
    fullPage: true,
  });
  console.log(`\nFull-page screenshot saved.`);

  await browser.close();
}

function guessBlockType(child: {
  tag: string;
  classes: string;
  heading: string;
  childCount: number;
}): string {
  const classes = child.classes.toLowerCase();
  const heading = child.heading.toLowerCase();

  if (classes.includes('hero') || child.tag === 'header') return 'hero';
  if (classes.includes('accordion') || classes.includes('faq')) return 'accordion/faq';
  if (classes.includes('calculator') || heading.includes('kalkulačka')) return 'calculator';
  if (classes.includes('table') || classes.includes('tariff')) return 'table';
  if (classes.includes('carousel') || classes.includes('slider')) return 'carousel/slider';
  if (classes.includes('card')) return 'cards';
  if (classes.includes('benefit') || classes.includes('výhod')) return 'benefits';
  if (classes.includes('cta') || classes.includes('call-to-action')) return 'cta';
  if (classes.includes('form') || classes.includes('contact')) return 'form';
  if (classes.includes('video') || classes.includes('youtube')) return 'video';
  if (classes.includes('team') || classes.includes('person')) return 'team/persons';
  if (classes.includes('timeline')) return 'timeline';
  if (classes.includes('tab')) return 'tabs';
  if (classes.includes('strip') || classes.includes('info')) return 'info-strip';
  if (child.childCount <= 2) return 'simple-content';
  return 'unknown';
}

// ─── Step 2: Full Scraping ─────────────────────────────────────────────────

async function fullScrape(componentSelector?: string): Promise<void> {
  console.log('Step 2: Full scraping — loading preview page...');
  const browser = await launchBrowser();
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  await page.goto(PREVIEW_URL, { waitUntil: 'networkidle', timeout: 60_000 });
  await scrollFullPage(page);

  // Load catalog to know component names
  const catalogPath = path.join(REF_DIR, 'catalog.json');
  if (!fs.existsSync(catalogPath)) {
    console.error('catalog.json not found. Run recon step first.');
    await browser.close();
    process.exit(1);
  }
  const catalog = JSON.parse(fs.readFileSync(catalogPath, 'utf-8')) as Array<{
    order: number;
    heading: string;
    suggestedType: string;
    mappedCmsBlock: string | null;
    classes: string;
    tag: string;
  }>;

  // Determine the selector for component boundaries
  const selector = componentSelector || await detectComponentSelector(page);
  console.log(`Using component selector: "${selector}"`);

  const components = await page.evaluate(`(() => {
    const elements = document.querySelectorAll('${selector.replace(/'/g, "\\'")}');
    return Array.from(elements).map((el, i) => ({
      index: i,
      outerHTML: el.outerHTML,
      heading: (() => {
        const h = el.querySelector('h1,h2,h3,h4,h5,h6');
        return h ? h.textContent.trim().slice(0, 80) : '';
      })(),
    }));
  })()`) as Array<{ index: number; outerHTML: string; heading: string }>;

  console.log(`Found ${components.length} components on page.`);

  // Extract HTML structure, screenshot, and schema suggestion per component
  const componentMap: Array<{
    index: number;
    name: string;
    slug: string | null;
    heading: string;
    hasScreenshot: boolean;
    hasStructure: boolean;
    hasSchemaSuggestion: boolean;
    hasFixture: boolean;
  }> = [];

  const handles = await page.$$(selector);

  for (let i = 0; i < handles.length; i++) {
    const handle = handles[i]!;
    const comp = components[i]!;
    const catalogEntry = catalog[i];
    const slug = catalogEntry?.mappedCmsBlock || null;
    const name =
      slug ||
      `unknown-${i}-${comp.heading.replace(/[^a-zA-Z0-9]/g, '-').slice(0, 30).toLowerCase()}`;

    const compDir = path.join(REF_DIR, name);
    fs.mkdirSync(compDir, { recursive: true });

    console.log(`[${i + 1}/${handles.length}] Processing "${name}" — "${comp.heading}"...`);

    // Screenshot
    try {
      await handle.scrollIntoViewIfNeeded();
      await page.waitForTimeout(500);
      await handle.screenshot({ path: path.join(compDir, 'screenshot.png') });
    } catch {
      console.warn(`  Could not screenshot component ${i}`);
    }

    // HTML structure
    const html = comp.outerHTML;
    fs.writeFileSync(path.join(compDir, 'structure.html'), html);

    // Schema suggestion from HTML heuristics
    const schemaSuggestion = generateSchemaSuggestion(html);
    fs.writeFileSync(
      path.join(compDir, 'schema-suggestion.json'),
      JSON.stringify(schemaSuggestion, null, 2),
    );

    // Generate fixture data
    const fixture = generateFixtureFromSchema(schemaSuggestion, slug || name);
    fs.writeFileSync(path.join(compDir, 'fixture.json'), JSON.stringify(fixture, null, 2));

    componentMap.push({
      index: i,
      name,
      slug,
      heading: comp.heading,
      hasScreenshot: true,
      hasStructure: true,
      hasSchemaSuggestion: true,
      hasFixture: true,
    });
  }

  // Extract CSS interactions
  console.log('\nExtracting CSS interactions...');
  const interactions = await page.evaluate(`(() => {
    const results = {};
    for (const sheet of document.styleSheets) {
      try {
        for (const rule of sheet.cssRules) {
          if (rule instanceof CSSStyleRule) {
            const sel = rule.selectorText;
            if (sel.includes(':hover')) {
              const baseSelector = sel.replace(/:hover/g, '');
              if (!results[baseSelector]) {
                results[baseSelector] = { hover: [], transitions: [] };
              }
              results[baseSelector].hover.push(rule.cssText);
            }
            if (rule.style.transition || rule.style.transitionProperty) {
              if (!results[sel]) {
                results[sel] = { hover: [], transitions: [] };
              }
              results[sel].transitions.push(
                'transition: ' + (rule.style.transition || rule.style.transitionProperty)
              );
            }
          }
        }
      } catch (e) {
        // Cross-origin stylesheet, skip
      }
    }
    return results;
  })()`) as Record<string, { hover: string[]; transitions: string[] }>;

  fs.writeFileSync(
    path.join(REF_DIR, 'interactions.json'),
    JSON.stringify(interactions, null, 2),
  );

  // Write component map
  fs.writeFileSync(
    path.join(REF_DIR, 'component-map.json'),
    JSON.stringify(componentMap, null, 2),
  );

  console.log(`\nResults written to ${REF_DIR}/`);
  console.log(`  component-map.json — ${componentMap.length} components mapped`);
  console.log(`  interactions.json — CSS hover/transition data`);
  console.log(`  Per-component: structure.html, screenshot.png, schema-suggestion.json, fixture.json`);

  await browser.close();
}

async function detectComponentSelector(page: Page): Promise<string> {
  // Try common patterns for component wrappers on the Airbank page
  const candidates = [
    'main > section',
    'main > div',
    '[class*="component"]',
    '[class*="block"]',
    '[class*="section"]',
    '[data-component]',
    'main > *',
    '#content > *',
    '.page-content > *',
  ];

  for (const sel of candidates) {
    const count = await page.evaluate(`document.querySelectorAll('${sel.replace(/'/g, "\\'")}').length`) as number;
    if (count >= 5) {
      console.log(`  Auto-detected selector "${sel}" with ${count} matches`);
      return sel;
    }
  }

  // Fallback: direct children of the main content container
  return 'main > *';
}

// ─── Schema Suggestion Heuristics ──────────────────────────────────────────

interface SchemaSuggestionField {
  name: string;
  type: string;
  children?: SchemaSuggestionField[];
  options?: string[];
  required?: boolean;
}

interface SchemaSuggestion {
  fields: SchemaSuggestionField[];
  notes: string[];
}

function generateSchemaSuggestion(html: string): SchemaSuggestion {
  const fields: SchemaSuggestionField[] = [];
  const notes: string[] = [];

  // Title detection: <h*> tags
  const headingMatch = html.match(/<h([1-6])[^>]*>([\s\S]*?)<\/h\1>/gi);
  if (headingMatch) {
    fields.push({ name: 'title', type: 'text', required: true });
    if (headingMatch.length > 1) {
      fields.push({ name: 'subtitle', type: 'text' });
    }
  }

  // Paragraphs
  const paragraphs = html.match(/<p[^>]*>([\s\S]*?)<\/p>/gi) || [];
  const hasFormatting = paragraphs.some(
    (p) => /<(strong|em|b|i|a|span|br)\b/i.test(p),
  );
  if (paragraphs.length > 0) {
    if (hasFormatting) {
      fields.push({ name: 'description', type: 'richText' });
    } else {
      fields.push({ name: 'description', type: 'textarea' });
    }
  }

  // Images
  const images = html.match(/<img[^>]*>/gi) || [];
  if (images.length === 1) {
    fields.push({ name: 'image', type: 'upload' });
  } else if (images.length > 1) {
    fields.push({
      name: 'images',
      type: 'array',
      children: [{ name: 'image', type: 'upload' }],
    });
  }

  // Links/buttons
  const links = html.match(/<a[^>]*>([\s\S]*?)<\/a>/gi) || [];
  const buttonLinks = links.filter(
    (l) =>
      /class="[^"]*btn/i.test(l) ||
      /class="[^"]*button/i.test(l) ||
      /class="[^"]*cta/i.test(l),
  );
  if (buttonLinks.length === 1) {
    fields.push({
      name: 'link',
      type: 'link',
      children: [
        { name: 'label', type: 'text' },
        { name: 'url', type: 'text' },
        {
          name: 'appearance',
          type: 'select',
          options: ['default', 'primary', 'outline', 'link'],
        },
      ],
    });
  } else if (buttonLinks.length > 1) {
    fields.push({
      name: 'links',
      type: 'array',
      children: [
        { name: 'label', type: 'text' },
        { name: 'url', type: 'text' },
        {
          name: 'appearance',
          type: 'select',
          options: ['default', 'primary', 'outline', 'link'],
        },
      ],
    });
  }

  // Repeated sibling patterns (cards, items)
  const repeatedPattern = detectRepeatedSiblings(html);
  if (repeatedPattern) {
    fields.push(repeatedPattern);
    notes.push(
      `Detected ${repeatedPattern.children?.length || 0} fields in repeated items`,
    );
  }

  // SVG icons
  const svgCount = (html.match(/<svg[\s\S]*?<\/svg>/gi) || []).length;
  if (svgCount > 0) {
    notes.push(`Found ${svgCount} inline SVGs — may need icon select field`);
  }

  // Video embeds
  if (/<(video|iframe)[^>]*(youtube|vimeo)/i.test(html)) {
    fields.push({ name: 'videoUrl', type: 'text' });
    notes.push('Video embed detected');
  }

  // Form elements
  if (/<(form|input|select|textarea)\b/i.test(html)) {
    notes.push('Form elements detected — may need special handling');
  }

  return { fields, notes };
}

function detectRepeatedSiblings(html: string): SchemaSuggestionField | null {
  // Look for repeated list items or card patterns
  const listItems = html.match(/<li[^>]*>([\s\S]*?)<\/li>/gi) || [];

  if (listItems.length >= 3) {
    const childFields: SchemaSuggestionField[] = [];
    const sample = listItems[0]!;

    if (/<h[1-6]/i.test(sample)) childFields.push({ name: 'title', type: 'text' });
    if (/<p/i.test(sample)) childFields.push({ name: 'description', type: 'textarea' });
    if (/<img/i.test(sample)) childFields.push({ name: 'image', type: 'upload' });
    if (/<a/i.test(sample)) {
      childFields.push({ name: 'linkLabel', type: 'text' });
      childFields.push({ name: 'linkUrl', type: 'text' });
    }
    if (/<svg/i.test(sample)) childFields.push({ name: 'icon', type: 'select' });

    if (childFields.length > 0) {
      return { name: 'items', type: 'array', children: childFields };
    }
  }

  return null;
}

// ─── Fixture Generation ────────────────────────────────────────────────────

function generateFixtureFromSchema(
  schema: SchemaSuggestion,
  blockType: string,
): Record<string, unknown> {
  const fixture: Record<string, unknown> = {
    id: `fixture-${blockType}`,
    blockType,
  };

  for (const field of schema.fields) {
    fixture[field.name] = generateFieldValue(field);
  }

  return fixture;
}

function generateFieldValue(field: SchemaSuggestionField): unknown {
  switch (field.type) {
    case 'text':
      return `Sample ${field.name}`;
    case 'textarea':
      return `Sample ${field.name} text content. This is a placeholder for the actual content.`;
    case 'richText':
      return {
        root: {
          type: 'root',
          children: [
            {
              type: 'paragraph',
              children: [
                {
                  type: 'text',
                  text: `Sample ${field.name} rich text content.`,
                  format: 0,
                },
              ],
            },
          ],
        },
      };
    case 'upload':
      return { url: '/placeholder.jpg', alt: `${field.name} placeholder`, width: 800, height: 600 };
    case 'number':
      return 42;
    case 'select':
      return field.options?.[0] || 'default';
    case 'link':
      return {
        label: 'Learn more',
        url: '#',
        appearance: 'primary',
      };
    case 'array':
      return Array.from({ length: 3 }, (_, i) => {
        const item: Record<string, unknown> = { id: `item-${i}` };
        for (const child of field.children || []) {
          item[child.name] = generateFieldValue(child);
        }
        return item;
      });
    default:
      return null;
  }
}

// ─── CLI ───────────────────────────────────────────────────────────────────

async function main(): Promise<void> {
  const args = process.argv.slice(2);
  const command = args[0];

  if (command === 'recon') {
    await recon();
  } else if (command === 'full') {
    const selectorArg = args.find((a) => a.startsWith('--selector='));
    const selector = selectorArg?.split('=').slice(1).join('=');
    await fullScrape(selector);
  } else {
    console.log('Usage:');
    console.log('  npx tsx scripts/scrape-components.ts recon');
    console.log('  npx tsx scripts/scrape-components.ts full [--selector=".css-selector"]');
    process.exit(1);
  }
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
