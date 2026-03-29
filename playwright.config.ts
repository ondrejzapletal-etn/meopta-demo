import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './scripts',
  timeout: 120_000,
  use: {
    headless: true,
    viewport: { width: 1440, height: 900 },
    launchOptions: {
      executablePath:
        process.env.PLAYWRIGHT_CHROMIUM_PATH ||
        `${process.env.HOME}/.cache/ms-playwright/chromium-1210/chrome-linux64/chrome`,
    },
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
