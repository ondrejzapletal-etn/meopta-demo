import { chromium } from '@playwright/test';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUTPUT_DIR = path.resolve(__dirname, '../apps/cms/public/block-thumbnails');
const executablePath = `${process.env.HOME}/.cache/ms-playwright/chromium-1210/chrome-linux64/chrome`;

const browser = await chromium.launch({ headless: true, executablePath });
const context = await browser.newContext({
  viewport: { width: 1280, height: 900 },
  reducedMotion: 'reduce',
});

await context.addInitScript(() => {
  const style = document.createElement('style');
  style.textContent = `* { animation: none !important; transition: none !important; opacity: 1 !important; transform: none !important; }`;
  document.addEventListener('DOMContentLoaded', () => document.head.appendChild(style));
});

const page = await context.newPage();
console.log('Načítám preview stránku...');
await page.goto('https://www.airbank.cz/page-preview/?idPage=506&rev=1-fmxfs4qn419axbna1s', { waitUntil: 'networkidle', timeout: 120_000 });
await page.waitForTimeout(2000);

const btn = await page.$('button:has-text("ODMÍTNOUT VŠE")');
if (btn) { await btn.click(); await page.waitForTimeout(600); }

const selector = '[id^="TopManagementCards-"]';
const el = await page.$(selector);
if (!el) { console.error('✗ element nenalezen'); process.exit(1); }

const box = await el.boundingBox();
if (box) {
  await page.evaluate((y: number) => window.scrollTo({ top: Math.max(0, y - 80), behavior: 'instant' }), box.y);
}
await page.waitForTimeout(1500);

const fresh = await page.$(selector);
if (!fresh) { console.error('✗ element ztracen'); process.exit(1); }
await fresh.screenshot({ path: path.join(OUTPUT_DIR, 'topManagementCardsBlock.png') });
console.log('✓ topManagementCardsBlock');
await browser.close();
