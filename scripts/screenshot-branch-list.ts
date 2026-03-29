import { chromium } from '@playwright/test';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUTPUT_DIR = path.resolve(__dirname, '../apps/cms/public/block-thumbnails');
const executablePath = `${process.env.HOME}/.cache/ms-playwright/chromium-1210/chrome-linux64/chrome`;

const browser = await chromium.launch({ headless: true, executablePath });
const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
const page = await context.newPage();

console.log('Načítám stránku poboček...');
await page.goto('http://localhost:3000/mapa-pobocek-a-bankomatu/nase-pobocky', { waitUntil: 'networkidle', timeout: 60_000 });
await page.waitForTimeout(1500);

// Close cookies
for (const sel of ['button:has-text("Odmítnout vše")', 'button:has-text("ODMÍTNOUT VŠE")']) {
  const btn = await page.$(sel);
  if (btn) { await btn.click(); await page.waitForTimeout(500); break; }
}

const selector = '[data-testid="branch-list-block"]';
const el = await page.$(selector);
if (!el) { console.error('✗ element nenalezen'); process.exit(1); }

// Scroll to element top
const box = await el.boundingBox();
if (!box) { console.error('✗ no bounding box'); process.exit(1); }

await page.evaluate((y: number) => window.scrollTo({ top: Math.max(0, y - 80), behavior: 'instant' }), box.y);
await page.waitForTimeout(2000); // wait for images in viewport to load

// Screenshot only the first 700px of the element (loaded images)
const fresh = await page.$(selector);
if (!fresh) { console.error('✗ element ztracen'); process.exit(1); }

const freshBox = await fresh.boundingBox();
if (!freshBox) { console.error('✗ no bounding box'); process.exit(1); }

// Clip to first 700px height
await page.screenshot({
  path: path.join(OUTPUT_DIR, 'branchListBlock.png'),
  clip: {
    x: freshBox.x,
    y: freshBox.y,
    width: freshBox.width,
    height: Math.min(freshBox.height, 700),
  },
});

console.log('✓ branchListBlock');
await browser.close();
