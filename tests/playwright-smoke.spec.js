const { test, expect } = require('@playwright/test');

test('home page renders without horizontal overflow', async ({ page }) => {
  await page.goto('/index.html');
  await expect(page).toHaveTitle(/Економіко-правовий фаховий коледж/);

  const metrics = await page.evaluate(() => ({
    clientWidth: document.documentElement.clientWidth,
    scrollWidth: document.documentElement.scrollWidth,
    title: document.title,
    touch: 'ontouchstart' in window,
    viewport: `${window.innerWidth}x${window.innerHeight}`,
    dpr: window.devicePixelRatio
  }));

  expect(metrics.scrollWidth).toBeLessThanOrEqual(metrics.clientWidth);
});

test('home about-college carousel renders and can be controlled', async ({ page }) => {
  await page.goto('/index.html');

  const section = page.locator('#college-about');
  const carousel = section.locator('[data-college-carousel]');
  const slides = carousel.locator('.college-photo-track img');
  const dots = carousel.locator('[data-carousel-dot]');

  await expect(section.getByRole('heading', { name: 'Коледж для впевненого професійного старту' })).toBeVisible();
  await section.scrollIntoViewIfNeeded();
  await expect(slides).toHaveCount(4);
  await expect(dots).toHaveCount(4);
  await expect(section.locator('.college-combo-more')).toHaveAttribute('href', 'college/general-info/about-college.html');

  const imageSources = await slides.evaluateAll((images) => images.map((image) => new URL(image.getAttribute('src'), window.location.href).href));
  for (const src of imageSources) {
    const response = await page.request.get(src);
    expect(response.ok(), `${src} should be available`).toBe(true);
  }

  const activeBefore = await dots.evaluateAll((buttons) => buttons.findIndex((button) => button.classList.contains('is-active')));
  await carousel.getByRole('button', { name: 'Наступне фото' }).click();
  const activeAfter = await dots.evaluateAll((buttons) => buttons.findIndex((button) => button.classList.contains('is-active')));
  const trackTransform = await carousel.locator('.college-photo-track').evaluate((track) => track.style.transform);
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);

  expect(activeAfter).toBe((activeBefore + 1) % 4);
  expect(trackTransform).toBe(`translateX(-${activeAfter * 100}%)`);
  expect(overflow).toBe(false);
});

test('home main sections expose accepted navigation structure', async ({ page }) => {
  await page.goto('/index.html');

  const section = page.locator('.main-sections#about');
  await section.scrollIntoViewIfNeeded();

  await expect(section.getByRole('heading', { name: 'Усе важливе поруч' })).toBeVisible();
  await expect(section.locator('.main-sections-heading p')).toHaveText('Для вступників, студентів, випускників і гостей сайту: основні розділи, з яких починається знайомство з коледжем.');

  const contact = section.getByRole('link', { name: /Контакти/ });
  await expect(contact).toHaveAttribute('href', 'college/general-info/contacts.html');

  const cards = section.locator('.main-section-card');
  await expect(cards).toHaveCount(6);
  await expect(cards.locator('h3')).toHaveText(['Коледж', 'Абітурієнту', 'Студенту', 'Випускнику', 'Наука', 'Бібліотека']);
  await expect(cards.locator('.section-card-a__marker')).toHaveText(['Про коледж', 'Вступ', 'Навчання', 'Спільнота', 'Дослідження', 'Ресурси']);

  const links = await cards.locator('a.text-link').evaluateAll((items) => items.map((item) => item.getAttribute('href')));
  expect(links).toEqual(['college.html', 'admissions.html', 'students.html', 'alumni.html', 'science.html', 'library.html']);
  await expect(section.locator('.feature-icon')).toHaveCount(0);
  await expect(section.getByRole('heading', { name: 'Публічна інформація' })).toHaveCount(0);

  const layout = await section.evaluate((element) => {
    const grid = element.querySelector('.main-section-grid');
    const heading = element.querySelector('.main-sections-heading');
    const paragraph = element.querySelector('.main-sections-heading p');
    const title = element.querySelector('.main-sections-heading h2');
    const contactLink = element.querySelector('.main-sections-contact');
    const gridColumns = getComputedStyle(grid).gridTemplateColumns.split(' ').filter(Boolean).length;
    const headingRect = heading.getBoundingClientRect();
    const paragraphRect = paragraph.getBoundingClientRect();
    const titleRect = title.getBoundingClientRect();
    const contactRect = contactLink.getBoundingClientRect();

    return {
      contactTop: contactRect.top,
      contactBottom: contactRect.bottom,
      contactWidth: contactRect.width,
      gridColumns,
      headingWidth: headingRect.width,
      paragraphBottom: paragraphRect.bottom,
      titleBottom: titleRect.bottom,
      viewportWidth: window.innerWidth
    };
  });

  if (layout.viewportWidth < 720) {
    expect(layout.gridColumns).toBe(1);
    expect(layout.contactWidth).toBeGreaterThanOrEqual(layout.headingWidth - 1);
    expect(layout.contactTop).toBeGreaterThan(layout.paragraphBottom);
  } else if (layout.viewportWidth < 1100) {
    expect(layout.gridColumns).toBe(2);
  } else {
    expect(layout.gridColumns).toBe(3);
    expect(layout.contactTop).toBeGreaterThanOrEqual(layout.titleBottom - 1);
    expect(layout.contactTop).toBeLessThan(layout.paragraphBottom);
    expect(layout.contactBottom).toBeGreaterThan(layout.contactTop);
  }
});

test('home latest news renders exactly three newest shared cards', async ({ page }) => {
  await page.goto('/index.html');

  const section = page.locator('[data-news-list]').first();
  const cards = section.locator('.news-card');

  await expect(cards).toHaveCount(3);
  await expect(cards.locator('h3')).toHaveText([
    'К.І.Н., ДОЦЕНТ ЮЛІЯ РУДЕНКО ВЗЯЛА УЧАСТЬ У ВЕБІНАРІ ДО ДНЯ КОНСТИТУЦІЇ УКРАЇНИ',
    'ДЕНЬ ВІДКРИТИХ ДВЕРЕЙ – КРОК ДО МАЙБУТНЬОЇ ПРОФЕСІЇ',
    'Розвиток цифрових компетентностей: викладачі та здобувачі освіти магістерської ОПП «Комерція та торгівля» успішно завершили підвищення кваліфікації у межах проєкту «Prof2IT»'
  ]);
  await expect(section.locator('.news-media img')).toHaveCount(3);
  await expect(section.locator('.news-meta')).toHaveCount(3);
  await expect(section.locator('.text-link')).toHaveCount(3);
  await expect(section.locator('.news-media-label')).toHaveCount(0);

  const allNews = page.getByRole('link', { name: /Усі новини/ });
  await expect(allNews).toHaveAttribute('href', 'news.html');
});

test('news page paginates the latest twelve materials as nine plus three', async ({ page }) => {
  await page.goto('/news.html');

  const grid = page.locator('[data-news-list]');
  const cards = grid.locator('.news-card');

  await expect(page.locator('.filter-bar')).toHaveCount(0);
  await expect(cards).toHaveCount(9);
  await expect(cards.locator('h3')).toHaveText([
    'К.І.Н., ДОЦЕНТ ЮЛІЯ РУДЕНКО ВЗЯЛА УЧАСТЬ У ВЕБІНАРІ ДО ДНЯ КОНСТИТУЦІЇ УКРАЇНИ',
    'ДЕНЬ ВІДКРИТИХ ДВЕРЕЙ – КРОК ДО МАЙБУТНЬОЇ ПРОФЕСІЇ',
    'Розвиток цифрових компетентностей: викладачі та здобувачі освіти магістерської ОПП «Комерція та торгівля» успішно завершили підвищення кваліфікації у межах проєкту «Prof2IT»',
    'Представники Інституту взяли участь у Міжнародній науково-практичній конференції з питань європейської зеленої політики та сталих фінансів',
    'Академічна доброчесність і ШІ: проректорка з навчально-методичної та наукової роботи Інна Райковська долучилися до онлайн-курсу щодо нових вимог законодавства',
    'Проректорка Інна Райковська взяла участь у науково-практичному семінарі з питань цифрової трансформації сфери НТІ',
    'КРУГЛИЙ СТІЛ «30 РОКІВ КОНСТИТУЦІЇ УКРАЇНИ: ІСТОРИЧНІ ВИТОКИ, СУЧАСНІСТЬ І МАЙБУТНЄ»',
    '«Скринька довіри»: забезпечення зворотного зв’язку та захист прав студентів',
    'Від теорії до майстерності: старт навчальної практики харчовиків-технологів'
  ]);
  await expect(grid.locator('.news-media img')).toHaveCount(9);
  await expect(grid.locator('.news-meta')).toHaveCount(9);
  await expect(grid.locator('.text-link')).toHaveCount(9);
  await expect(grid.locator('.news-media-label')).toHaveCount(0);
  await expect(page.locator('[data-news-pagination] a')).toHaveText(['1', '2']);
  await expect(page.locator('[data-news-pagination] a[aria-current="page"]')).toHaveText('1');

  const firstLink = grid.locator('.text-link').first();
  await expect(firstLink).toHaveAttribute('href', /news-4875-.*\.html$/);

  await page.goto('/news.html?page=2');
  const secondPageCards = page.locator('[data-news-list] .news-card');
  await expect(secondPageCards).toHaveCount(3);
  await expect(secondPageCards.locator('h3')).toHaveText([
    'Здобувачі освіти спеціальності «Готельно-ресторанна справа» проходять навчальну практику',
    'К.І.Н., ДОЦЕНТ ЮЛІЯ РУДЕНКО ВЗЯЛА УЧАСТЬ В ОСВІТНЬОМУ ТРЕНІНГУ «ЗНОВУ ВІДНОВЛЮЄМОСЬ 2026»',
    '«Першокурсники: рік по тому»: творчий звіт студентів'
  ]);
  await expect(page.locator('[data-news-pagination] a[aria-current="page"]')).toHaveText('2');
});

test('header actions and news article metadata keep the updated layout', async ({ page }) => {
  await page.goto('/news-4873-rozvytok-tsyfrovykh-kompetentnostei-vykladachi-ta-zdobuvachi-osvity-mahisterskoi-opp-komertsiia-ta-torhivlia-uspishno-zavershyly-pidvyshchennia-kvalifikatsii-u-mezhakh-proiektu-prof2it.html');
  await page.locator('.header-theme').waitFor();

  const boxes = await page.evaluate(() => {
    const rect = (selector) => {
      const element = document.querySelector(selector);
      if (!element) return null;
      const { width, height, top } = element.getBoundingClientRect();
      return {
        width: Math.round(width),
        height: Math.round(height),
        top: Math.round(top)
      };
    };

    return {
      search: rect('.header-search'),
      theme: rect('.header-theme'),
      language: rect('.header-language .language'),
      time: rect('.news-article-meta time'),
      tags: rect('.news-article-tags'),
      languageVisible: getComputedStyle(document.querySelector('.header-language')).display !== 'none',
      overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth
    };
  });

  expect(boxes.theme).toEqual(boxes.search);
  if (boxes.languageVisible) expect(boxes.language).toEqual(boxes.search);
  await expect(page.locator('.news-article-tags .news-tag')).toHaveCount(3);
  expect(boxes.tags.top).toBeGreaterThan(boxes.time.top);
  expect(boxes.overflow).toBe(false);
  await expect(page.locator('.news-article-neighbors span')).toHaveText(['Наступна новина', 'Попередня новина']);
});

test('english home mirrors the accepted home structure', async ({ page }) => {
  await page.goto('/en/index.html');

  const about = page.locator('#college-about');
  await expect(about.getByRole('heading', { name: 'A college for a confident professional start' })).toBeVisible();
  await expect(about.locator('.college-photo-track img')).toHaveCount(4);

  const mainSections = page.locator('.main-sections#about');
  const cards = mainSections.locator('.main-section-card');
  await expect(cards).toHaveCount(6);
  await expect(cards.locator('h3')).toHaveText(['College', 'Applicants', 'Students', 'Alumni', 'Research', 'Library']);
  await expect(mainSections.locator('.feature-icon')).toHaveCount(0);
  await expect(mainSections.getByRole('heading', { name: 'Public Information' })).toHaveCount(0);
  await expect(mainSections.getByRole('link', { name: /Contacts/ })).toHaveAttribute('href', 'college.html#contacts');

  const allSpecialties = page.getByRole('link', { name: /All specialties/ });
  await expect(allSpecialties).toHaveClass(/main-sections-contact--filled/);
  await expect(page.locator('.program-card .program-meta')).toHaveCount(0);

  const news = page.locator('[data-news-list]').first();
  await expect(news.locator('.news-card')).toHaveCount(3);
  await expect(news.locator('.news-media-label')).toHaveCount(0);
  await expect(news.locator('.news-meta')).toHaveCount(3);
  await expect(page.getByRole('link', { name: /All news/ })).toHaveClass(/main-sections-contact--filled/);
});

test('english news page uses the shared card feed without legacy filters', async ({ page }) => {
  await page.goto('/en/news.html');

  const grid = page.locator('[data-news-list]');
  await expect(page.locator('[data-news-count]')).toHaveText('12');
  await expect(page.locator('.filter-bar')).toHaveCount(0);
  await expect(grid.locator('.news-card')).toHaveCount(9);
  await expect(grid.locator('.news-media img')).toHaveCount(9);
  await expect(grid.locator('.news-media-label')).toHaveCount(0);
  await expect(grid.locator('.news-meta')).toHaveCount(9);
  await expect(page.locator('[data-news-pagination] a')).toHaveText(['1', '2']);
  await expect(page.locator('[data-news-pagination] a[aria-current="page"]')).toHaveText('1');
  await expect(grid.locator('.text-link').first()).toContainText('Read in full');
  await expect(grid.locator('.text-link').first()).toHaveAttribute('href', /\.\.\/news-4875-.*\.html$/);

  await page.goto('/en/news.html?page=2');
  const secondPageCards = page.locator('[data-news-list] .news-card');
  await expect(secondPageCards).toHaveCount(3);
  await expect(page.locator('[data-news-pagination] a[aria-current="page"]')).toHaveText('2');
});

test('english section pages use the current hub template', async ({ page }) => {
  const pages = [
    'college.html',
    'admissions.html',
    'students.html',
    'alumni.html',
    'science.html',
    'library.html'
  ];

  for (const pageName of pages) {
    await page.goto(`/en/${pageName}`);

    await expect(page.locator('.page-hero.page-hero--guide')).toHaveCount(1);
    await expect(page.locator('.page-hero-guide')).toBeVisible();
    await expect(page.locator('main .page-hero-card')).toHaveCount(0);
    await expect(page.locator('#apply, #timeline, #tuition, #faq')).toHaveCount(0);
    await expect(page.locator('.subpage-link-card').first()).toBeVisible();

    const mainText = await page.locator('main').innerText();
    expect(mainText).not.toMatch(/[А-Яа-яІіЇїЄєҐґ]/);
  }
});

test('primary menu toggles submenus without navigating', async ({ page }) => {
  await page.goto('/index.html');

  const navToggle = page.locator('.nav-toggle');
  if (await navToggle.isVisible()) await navToggle.click();

  const startUrl = page.url();
  const collegeToggle = page.getByRole('button', { name: /Коледж/ }).first();
  const applicantsToggle = page.getByRole('button', { name: /Абітурієнту/ }).first();
  const collegeMenu = page.locator('#menu-0');
  const applicantsMenu = page.locator('#menu-1');

  await collegeToggle.click();
  await expect(page).toHaveURL(startUrl);
  await expect(collegeToggle).toHaveAttribute('aria-expanded', 'true');
  await expect(collegeMenu).toBeVisible();
  await expect(collegeMenu.locator('a[href*="college/"]')).toHaveCount(24);
  await expect(collegeMenu.getByRole('link', { name: 'Про коледж' })).toHaveAttribute('href', 'college/general-info/about-college.html');
  await expect(collegeMenu.getByRole('link', { name: 'Статут коледжу' })).toHaveAttribute('href', 'college/main-info/statute.html');
  await expect(collegeMenu.getByRole('link', { name: 'Центр кар’єри' })).toHaveAttribute('href', 'college/activity/career-center.html');

  await applicantsToggle.click();
  await expect(collegeToggle).toHaveAttribute('aria-expanded', 'false');
  await expect(collegeMenu).toBeHidden();
  await expect(applicantsToggle).toHaveAttribute('aria-expanded', 'true');
  await expect(applicantsMenu).toBeVisible();

  await applicantsToggle.click();
  await expect(applicantsToggle).toHaveAttribute('aria-expanded', 'false');
  await expect(applicantsMenu).toBeHidden();
  await expect(page.locator('body')).not.toHaveClass(/mega-open/);

  await expect(page.getByRole('link', { name: 'Новини' }).first()).toHaveAttribute('href', 'news.html');
});

test('mobile submenu uses measured accordion motion', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'chromium-mobile', 'mobile accordion motion is specific to the drawer layout');

  await page.goto('/index.html');
  await page.locator('.nav-toggle').click();

  const collegeToggle = page.getByRole('button', { name: /Коледж/ }).first();
  const applicantsToggle = page.getByRole('button', { name: /Абітурієнту/ }).first();
  const collegeMenu = page.locator('#menu-0');
  const applicantsMenu = page.locator('#menu-1');

  await collegeToggle.click();
  await expect(collegeToggle).toHaveAttribute('aria-expanded', 'true');
  await expect(collegeMenu).toBeVisible();
  await page.waitForTimeout(320);

  const openMetrics = await collegeMenu.evaluate((menu) => {
    const style = getComputedStyle(menu);
    return {
      ariaHidden: menu.getAttribute('aria-hidden'),
      customHeight: style.getPropertyValue('--accordion-height').trim(),
      inert: menu.inert,
      maxHeight: style.maxHeight,
      overflowY: style.overflowY,
      pointerEvents: style.pointerEvents,
      settled: menu.closest('.has-menu').classList.contains('menu-settled'),
      scrollHeight: menu.scrollHeight,
      transitionProperty: style.transitionProperty
    };
  });

  expect(openMetrics.ariaHidden).toBe('false');
  expect(openMetrics.inert).toBe(false);
  expect(openMetrics.maxHeight).toBe('none');
  expect(openMetrics.overflowY).toBe('visible');
  expect(openMetrics.pointerEvents).toBe('auto');
  expect(openMetrics.settled).toBe(true);
  expect(openMetrics.transitionProperty).toContain('max-height');
  expect(Math.abs(parseFloat(openMetrics.customHeight) - openMetrics.scrollHeight)).toBeLessThanOrEqual(2);

  await applicantsToggle.click();
  await expect(collegeToggle).toHaveAttribute('aria-expanded', 'false');
  await expect(collegeMenu).toBeHidden();
  await expect(applicantsToggle).toHaveAttribute('aria-expanded', 'true');
  await expect(applicantsMenu).toBeVisible();

  const closedMetrics = await collegeMenu.evaluate((menu) => ({
    ariaHidden: menu.getAttribute('aria-hidden'),
    inert: menu.inert,
    maxHeight: getComputedStyle(menu).maxHeight,
    pointerEvents: getComputedStyle(menu).pointerEvents,
    settled: menu.closest('.has-menu').classList.contains('menu-settled')
  }));

  expect(closedMetrics.ariaHidden).toBe('true');
  expect(closedMetrics.inert).toBe(true);
  expect(parseFloat(closedMetrics.maxHeight)).toBeLessThanOrEqual(1);
  expect(closedMetrics.pointerEvents).toBe('none');
  expect(closedMetrics.settled).toBe(false);
});

test('mobile drawer remains scrollable with a long submenu open', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'chromium-mobile', 'mobile drawer scroll regression runs on the drawer layout');

  await page.goto('/index.html');
  await page.locator('.nav-toggle').click();

  const libraryToggle = page.getByRole('button', { name: /Бібліотека/ }).first();
  const libraryMenu = page.locator('#menu-5');
  const navShell = page.locator('.nav-shell');

  await libraryToggle.click();
  await expect(libraryToggle).toHaveAttribute('aria-expanded', 'true');
  await expect(libraryMenu).toBeVisible();
  await page.waitForTimeout(320);

  const metrics = await navShell.evaluate((shell) => ({
    clientHeight: shell.clientHeight,
    overflowY: getComputedStyle(shell).overflowY,
    panelMaxHeight: getComputedStyle(shell.querySelector('#menu-5')).maxHeight,
    panelOverflowY: getComputedStyle(shell.querySelector('#menu-5')).overflowY,
    scrollHeight: shell.scrollHeight,
    scrollTop: shell.scrollTop
  }));

  expect(metrics.overflowY).toMatch(/auto|scroll/);
  expect(metrics.panelMaxHeight).toBe('none');
  expect(metrics.panelOverflowY).toBe('visible');
  expect(metrics.scrollHeight).toBeGreaterThan(metrics.clientHeight);

  const touchMove = await navShell.evaluate((shell) => {
    const target = shell.querySelector('#menu-5 a') || shell;
    const createTouchEvent = (type, clientY) => {
      const event = new Event(type, {
        bubbles: true,
        cancelable: true
      });
      Object.defineProperty(event, 'touches', {
        value: [{ clientY }],
        configurable: true
      });
      return event;
    };

    target.dispatchEvent(createTouchEvent('touchstart', 520));

    const moveEvent = createTouchEvent('touchmove', 220);
    target.dispatchEvent(moveEvent);

    return {
      defaultPrevented: moveEvent.defaultPrevented,
      supported: true
    };
  });

  expect(touchMove.supported).toBe(true);
  expect(touchMove.defaultPrevented).toBe(false);

  const afterScroll = await navShell.evaluate((shell) => {
    shell.scrollTop = 0;
    shell.scrollBy(0, 420);
    return shell.scrollTop;
  });
  expect(afterScroll).toBeGreaterThan(metrics.scrollTop);
});

test('navigation remains visible when opened after page scroll', async ({ page }) => {
  await page.goto('/index.html');
  await page.evaluate(() => window.scrollTo(0, 900));
  await page.waitForFunction(() => window.scrollY > 400);

  const navToggle = page.locator('.nav-toggle');
  if (await navToggle.isVisible()) {
    await navToggle.click();

    const navShell = page.locator('.nav-shell');
    await expect(navShell).toBeVisible();

    const shellMetrics = await navShell.evaluate((shell) => {
      const rect = shell.getBoundingClientRect();
      return {
        bottom: rect.bottom,
        top: rect.top,
        viewportHeight: window.innerHeight
      };
    });

    expect(shellMetrics.bottom).toBeGreaterThan(0);
    expect(shellMetrics.top).toBeLessThan(shellMetrics.viewportHeight);

    const collegeToggle = page.getByRole('button', { name: /Коледж/ }).first();
    await collegeToggle.click();
    await expect(page.locator('#menu-0')).toBeVisible();
    return;
  }

  const collegeToggle = page.getByRole('button', { name: /Коледж/ }).first();
  const collegeMenu = page.locator('#menu-0');

  await collegeToggle.click();
  await expect(collegeMenu).toBeVisible();

  const menuMetrics = await collegeMenu.evaluate((menu) => {
    const rect = menu.getBoundingClientRect();
    return {
      bottom: rect.bottom,
      top: rect.top,
      viewportHeight: window.innerHeight
    };
  });

  expect(menuMetrics.bottom).toBeGreaterThan(0);
  expect(menuMetrics.top).toBeGreaterThanOrEqual(0);
  expect(menuMetrics.top).toBeLessThan(menuMetrics.viewportHeight);
});

test('mega menu scrolls inside a compact laptop viewport', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'chromium-laptop', 'compact laptop scroll check runs once');

  await page.setViewportSize({ width: 1280, height: 480 });
  await page.goto('/index.html');

  const libraryToggle = page.getByRole('button', { name: /Бібліотека/ }).first();
  const libraryMenu = page.locator('#menu-5');

  await libraryToggle.click();
  await expect(libraryToggle).toHaveAttribute('aria-expanded', 'true');
  await expect(libraryMenu).toBeVisible();

  const metrics = await libraryMenu.evaluate((menu) => {
    const rect = menu.getBoundingClientRect();
    const style = getComputedStyle(menu);
    return {
      bottom: rect.bottom,
      clientHeight: menu.clientHeight,
      overflowY: style.overflowY,
      scrollHeight: menu.scrollHeight,
      viewportHeight: window.innerHeight
    };
  });

  expect(metrics.bottom).toBeLessThanOrEqual(metrics.viewportHeight + 1);
  expect(metrics.overflowY).toMatch(/auto|scroll/);
  expect(metrics.scrollHeight).toBeGreaterThan(metrics.clientHeight);

  const box = await libraryMenu.boundingBox();
  expect(box).not.toBeNull();
  await page.mouse.move(box.x + box.width / 2, box.y + Math.min(80, box.height - 10));
  const beforeScroll = await libraryMenu.evaluate((menu) => menu.scrollTop);
  await page.mouse.wheel(0, 260);
  await page.waitForTimeout(100);
  const afterScroll = await libraryMenu.evaluate((menu) => menu.scrollTop);
  expect(afterScroll).toBeGreaterThan(beforeScroll);

  await libraryToggle.click();
  await expect(libraryToggle).toHaveAttribute('aria-expanded', 'false');
  await expect(libraryMenu).toBeHidden();
});
