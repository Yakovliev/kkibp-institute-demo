const fs = require('fs');
const http = require('http');
const path = require('path');
const { spawn } = require('child_process');
const { chromium, devices } = require('@playwright/test');

const root = path.resolve(__dirname, '..');
const outputDir = path.join(root, 'docs', 'spec-screenshots');
const port = Number(process.env.SPEC_SCREENSHOT_PORT || 8036);
const baseUrl = `http://127.0.0.1:${port}`;

const viewports = {
  mobile: { ...devices['iPhone 13'], locale: 'uk-UA', reducedMotion: 'reduce' },
  tablet: { ...devices['iPad Pro 11'], locale: 'uk-UA', reducedMotion: 'reduce' },
  laptop: { viewport: { width: 1440, height: 900 }, locale: 'uk-UA', deviceScaleFactor: 1, reducedMotion: 'reduce' },
  wide: { viewport: { width: 1920, height: 1080 }, locale: 'uk-UA', deviceScaleFactor: 1, reducedMotion: 'reduce' }
};

const scenarios = [
  { file: 'home-hero-laptop.png', viewport: 'laptop', url: '/index.html', screenshot: 'viewport' },
  { file: 'home-hero-tablet.png', viewport: 'tablet', url: '/index.html', screenshot: 'viewport' },
  { file: 'home-hero-mobile.png', viewport: 'mobile', url: '/index.html', screenshot: 'viewport' },
  {
    file: 'navigation-mega-menu-laptop.png',
    viewport: 'laptop',
    url: '/index.html',
    screenshot: 'viewport',
    prepare: async (page) => {
      await page.getByRole('button', { name: /Коледж/ }).first().click();
      await page.locator('#menu-0').waitFor({ state: 'visible' });
    }
  },
  {
    file: 'navigation-mobile-drawer-library.png',
    viewport: 'mobile',
    url: '/index.html',
    screenshot: 'viewport',
    prepare: async (page) => {
      await page.locator('.nav-toggle').click();
      await page.getByRole('button', { name: /Бібліотека/ }).first().click();
      await page.locator('#menu-5').waitFor({ state: 'visible' });
      await page.waitForTimeout(350);
    }
  },
  {
    file: 'search-dialog-laptop.png',
    viewport: 'laptop',
    url: '/index.html',
    selector: '.search-dialog',
    prepare: async (page) => {
      await page.locator('.header-search').click();
      await page.locator('.search-dialog').waitFor({ state: 'visible' });
    }
  },
  { file: 'theme-night-laptop.png', viewport: 'laptop', url: '/index.html', screenshot: 'viewport', theme: 'night' },
  { file: 'home-about-laptop.png', viewport: 'laptop', url: '/index.html', selector: '#college-about' },
  { file: 'home-main-sections-mobile.png', viewport: 'mobile', url: '/index.html', selector: '.main-sections#about' },
  { file: 'home-programs-laptop.png', viewport: 'laptop', url: '/index.html', selector: '#programs' },
  {
    file: 'home-latest-news-laptop.png',
    viewport: 'laptop',
    url: '/index.html',
    locator: (page) => page.locator('[data-news-list]').first().locator('xpath=ancestor::section[1]')
  },
  {
    file: 'news-archive-laptop.png',
    viewport: 'laptop',
    url: '/news.html',
    locator: (page) => page.locator('[data-news-filter]').locator('xpath=ancestor::section[1]')
  },
  {
    file: 'news-archive-mobile-filtered.png',
    viewport: 'mobile',
    url: '/news.html?tag=it-science',
    screenshot: 'viewport',
    prepare: async (page) => {
      await page.locator('[data-news-filter]').scrollIntoViewIfNeeded();
      await page.waitForTimeout(150);
    }
  },
  {
    file: 'news-article-tags-laptop.png',
    viewport: 'laptop',
    url: '/news-4873-rozvytok-tsyfrovykh-kompetentnostei-vykladachi-ta-zdobuvachi-osvity-mahisterskoi-opp-komertsiia-ta-torhivlia-uspishno-zavershyly-pidvyshchennia-kvalifikatsii-u-mezhakh-proiektu-prof2it.html',
    selector: '.news-article-meta'
  },
  {
    file: 'news-article-sdg-laptop.png',
    viewport: 'laptop',
    url: '/news-4873-rozvytok-tsyfrovykh-kompetentnostei-vykladachi-ta-zdobuvachi-osvity-mahisterskoi-opp-komertsiia-ta-torhivlia-uspishno-zavershyly-pidvyshchennia-kvalifikatsii-u-mezhakh-proiektu-prof2it.html',
    selector: '.news-article-sdg'
  },
  { file: 'section-hero-guide-laptop.png', viewport: 'laptop', url: '/college.html', selector: '.page-hero' },
  { file: 'section-admissions-hero-laptop.png', viewport: 'laptop', url: '/admissions.html', selector: '.page-hero' },
  { file: 'section-students-hero-laptop.png', viewport: 'laptop', url: '/students.html', selector: '.page-hero' },
  { file: 'section-alumni-hero-laptop.png', viewport: 'laptop', url: '/alumni.html', selector: '.page-hero' },
  { file: 'section-science-hero-laptop.png', viewport: 'laptop', url: '/science.html', selector: '.page-hero' },
  { file: 'section-library-hero-laptop.png', viewport: 'laptop', url: '/library.html', selector: '.page-hero' },
  { file: 'section-admissions-cards-mobile.png', viewport: 'mobile', url: '/admissions.html', selector: '#admission-info' },
  { file: 'section-students-cards-mobile.png', viewport: 'mobile', url: '/students.html', selector: '#general-info' },
  { file: 'section-alumni-cards-mobile.png', viewport: 'mobile', url: '/alumni.html', selector: '#community' },
  { file: 'section-science-cards-mobile.png', viewport: 'mobile', url: '/science.html', selector: '#academic-integrity' },
  { file: 'section-cards-mobile.png', viewport: 'mobile', url: '/library.html', selector: '#library-about' },
  { file: 'section-college-contact-laptop.png', viewport: 'laptop', url: '/college.html', selector: '#contacts .contact-card' },
  { file: 'section-admissions-contact-mobile.png', viewport: 'mobile', url: '/admissions.html', selector: '#contacts .contact-card' },
  { file: 'footer-laptop.png', viewport: 'laptop', url: '/index.html', selector: '.site-footer', isolateComponent: true },
  { file: 'footer-mobile.png', viewport: 'mobile', url: '/index.html', selector: '.site-footer', isolateComponent: true }
];

function waitForServer() {
  return new Promise((resolve, reject) => {
    const startedAt = Date.now();
    const check = () => {
      const request = http.get(`${baseUrl}/index.html`, (response) => {
        response.resume();
        if (response.statusCode && response.statusCode < 500) {
          resolve();
        } else {
          retry();
        }
      });
      request.on('error', retry);
      request.setTimeout(500, () => {
        request.destroy();
        retry();
      });
    };
    const retry = () => {
      if (Date.now() - startedAt > 10000) {
        reject(new Error(`Local server did not become ready at ${baseUrl}`));
      } else {
        setTimeout(check, 250);
      }
    };
    check();
  });
}

async function settlePage(page) {
  await page.waitForLoadState('load');
  await page.evaluate(() => document.fonts && document.fonts.ready);
  await page.waitForTimeout(250);
}

async function captureScenario(browser, scenario) {
  const context = await browser.newContext(viewports[scenario.viewport]);
  await context.addInitScript((theme) => {
    if (theme === 'night') localStorage.setItem('site-theme', 'night');
    else localStorage.removeItem('site-theme');
  }, scenario.theme || '');

  const page = await context.newPage();
  await page.goto(`${baseUrl}${scenario.url}`, { waitUntil: 'domcontentloaded' });
  await settlePage(page);
  if (scenario.prepare) {
    await scenario.prepare(page);
    await settlePage(page);
  }
  if (scenario.isolateComponent) {
    await page.addStyleTag({
      content: '.site-header,.skip-link,.back-to-top{display:none!important}'
    });
  }

  const outputPath = path.join(outputDir, scenario.file);
  const screenshotOptions = { path: outputPath, animations: 'disabled', scale: 'css' };

  if (scenario.screenshot === 'viewport') {
    await page.screenshot(screenshotOptions);
  } else {
    const locator = scenario.locator ? scenario.locator(page) : page.locator(scenario.selector);
    await locator.first().scrollIntoViewIfNeeded();
    await page.waitForTimeout(150);
    await locator.first().screenshot(screenshotOptions);
  }

  await context.close();
  return outputPath;
}

async function main() {
  fs.mkdirSync(outputDir, { recursive: true });
  const server = spawn('python3', ['-m', 'http.server', String(port)], {
    cwd: root,
    stdio: ['ignore', 'ignore', 'pipe']
  });

  let browser;
  try {
    await waitForServer();
    browser = await chromium.launch();
    const captured = [];
    for (const scenario of scenarios) {
      captured.push(await captureScenario(browser, scenario));
    }
    console.log(captured.map((file) => path.relative(root, file)).join('\n'));
  } finally {
    if (browser) await browser.close();
    server.kill();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
