const { defineConfig, devices } = require('@playwright/test');

const PORT = process.env.PLAYWRIGHT_PORT || 8010;
const BASE_URL = `http://127.0.0.1:${PORT}`;

module.exports = defineConfig({
  testDir: './tests',
  outputDir: './test-results/playwright',
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: BASE_URL,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure'
  },
  webServer: {
    command: `python3 -m http.server ${PORT}`,
    url: `${BASE_URL}/index.html`,
    reuseExistingServer: !process.env.CI,
    timeout: 10_000
  },
  projects: [
    {
      name: 'chromium-mobile',
      use: { ...devices['iPhone 13'], locale: 'uk-UA' }
    },
    {
      name: 'chromium-tablet',
      use: {
        ...devices['iPad Pro 11'],
        locale: 'uk-UA'
      }
    },
    {
      name: 'chromium-laptop',
      use: {
        ...devices['Desktop Chrome'],
        locale: 'uk-UA',
        viewport: { width: 1440, height: 900 }
      }
    },
    {
      name: 'chromium-wide',
      use: {
        ...devices['Desktop Chrome'],
        locale: 'uk-UA',
        viewport: { width: 1920, height: 1080 }
      }
    }
  ]
});
