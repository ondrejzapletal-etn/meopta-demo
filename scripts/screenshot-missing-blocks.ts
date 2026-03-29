import { chromium, type Page } from '@playwright/test';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const BASE_URL = 'http://localhost:3000';
const OUTPUT_DIR = path.resolve(__dirname, '../apps/cms/public/block-thumbnails');

const MISSING: Array<{ slug: string; page: string; testId: string }> = [
  { slug: 'productBannerBlock',      page: '/',                                       testId: 'product-banner-block' },
  { slug: 'benefitsColumnsBlock',    page: '/',                                       testId: 'benefits-columns-block' },
  { slug: 'ctaCardsBlock',           page: '/',                                       testId: 'cta-cards-block' },
  { slug: 'homepageBottomBlock',     page: '/',                                       testId: 'homepage-bottom-block' },
  { slug: 'productDetailCardsBlock', page: '/produkty/investice-a-sporeni',           testId: 'product-detail-cards-block' },
  { slug: 'branchListBlock',         page: '/mapa-pobocek-a-bankomatu/nase-pobocky',  testId: 'branch-list-block' },
  { slug: 'branchMapBlock',          page: '/mapa-pobocek-a-bankomatu/nase-pobocky',  testId: 'branch-map-block' },
];

async function closeCookies(page: Page) {
  for (const sel of [
    'button:has-text("Odmítnout vše")',
    'button:has-text("ODMÍTNOUT VŠE")',
    'button:has-text("Povolit vše")',
  ]) {
    try {
      const btn = await page.$(sel);
      if (btn) { await btn.click(); await page.waitForTimeout(600); return; }
    } catch {}
  }
}

async function main() {
  const executablePath = `${process.env.HOME}/.cache/ms-playwright/chromium-1210/chrome-linux64/chrome`;
  const browser = await chromium.launch({ headless: true, executablePath });
  const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const page = await context.newPage();

  let currentPage = '';

  for (const { slug, page: pagePath, testId } of MISSING) {
    const url = BASE_URL + pagePath;

    if (pagePath !== currentPage) {
      console.log(`\nNačítám ${url}...`);
      await page.goto(url, { waitUntil: 'networkidle', timeout: 60_000 });
      await page.waitForTimeout(1500);
      await closeCookies(page);
      await page.waitForTimeout(800);
      currentPage = pagePath;
    }

    const selector = `[data-testid="${testId}"]`;
    const el = await page.$(selector);
    if (!el) {
      console.log(`  ✗ ${slug} — [data-testid="${testId}"] nenalezen`);
      continue;
    }

    const box = await el.boundingBox();
    if (box) {
      await page.evaluate((y) => window.scrollTo({ top: Math.max(0, y - 80), behavior: 'instant' }), box.y);
    }
    await page.waitForTimeout(1800);

    const fresh = await page.$(`[data-testid="${testId}"]`);
    if (!fresh) { console.log(`  ✗ ${slug} — element ztracen po scrollu`); continue; }

    const outPath = path.join(OUTPUT_DIR, `${slug}.png`);
    await fresh.screenshot({ path: outPath });
    console.log(`  ✓ ${slug}`);
  }

  await browser.close();
  console.log('\nHotovo.');
}

main().catch(console.error);
