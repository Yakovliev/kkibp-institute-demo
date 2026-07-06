const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const tmp = '/tmp';
const sourceHost = 'https://kkibp.edu.ua';
const publicBase = 'https://yakovliev.github.io/kkibp-college-demo/';

const articles = [
  {
    file: 'news-4875.html',
    pub: '2026-06-29T10:47:51+03:00',
    source: 'https://kkibp.edu.ua/uk/news/4875-k-i-n-dotsent-yuliya-rudenko-vzyala-uchast-u-vebinari-do-dnya-konstytutsiyi-ukrayiny'
  },
  {
    file: 'news-4874.html',
    pub: '2026-06-29T10:46:07+03:00',
    source: 'https://kkibp.edu.ua/uk/news/4874-den-vidkrytykh-dverey-krok-do-maybutnoyi-profesiyi'
  },
  {
    file: 'news-4873.html',
    pub: '2026-06-29T10:42:04+03:00',
    source: 'https://kkibp.edu.ua/uk/news/4873-rozvytok-tsyfrovykh-kompetentnostei-vykladachi-ta-zdobuvachi-osvity-mahisterskoi-opp-komertsiia-ta-torhivlia-uspishno-zavershyly-pidvyshchennia-kvalifikatsii-u-mezhakh-proiektu-prof2it'
  },
  {
    file: 'news-4872.html',
    pub: '2026-06-29T08:38:11+03:00',
    source: 'https://kkibp.edu.ua/uk/news/4872-predstavnyky-instytutu-vzialy-uchast-u-mizhnarodnii-naukovo-praktychnii-konferentsii-z-pytan-ievropeiskoi-zelenoi-polityky-ta-stalykh-finansiv'
  },
  {
    file: 'news-4871.html',
    pub: '2026-06-29T06:40:31+03:00',
    source: 'https://kkibp.edu.ua/uk/news/4871-akademichna-dobrochesnist-i-shi-prorektorka-z-navchalno-metodychnoi-ta-naukovoi-roboty-inna-raikovska-doluchylysia-do-onlain-kursu-shchodo-novykh-vymoh-zakonodavstva'
  },
  {
    file: 'news-4870.html',
    pub: '2026-06-29T06:34:10+03:00',
    source: 'https://kkibp.edu.ua/uk/news/4870-prorektorka-inna-raikovska-vziala-uchast-u-naukovo-praktychnomu-seminari-z-pytan-tsyfrovoi-transformatsii-sfery-ntiw2'
  },
  {
    file: 'news-4868.html',
    pub: '2026-06-25T08:42:43+03:00',
    source: 'https://kkibp.edu.ua/uk/news/4868-kruhlyy-stil-30-rokiv-konstytutsiyi-ukrayiny-istorychni-vytoky-suchasnist-i-maybutnye'
  },
  {
    file: 'news-4867.html',
    pub: '2026-06-25T08:37:54+03:00',
    source: 'https://kkibp.edu.ua/uk/news/4867-skrynka-doviry-zabezpechennia-zvorotnoho-zv-iazku-ta-zakhyst-prav-studentiv'
  },
  {
    file: 'news-4866.html',
    pub: '2026-06-25T08:30:00+03:00',
    source: 'https://kkibp.edu.ua/uk/news/4866-vid-teorii-do-maisternosti-start-navchalnoi-praktyky-kharchovykiv-tekhnolohiv'
  },
  {
    file: 'news-4865.html',
    pub: '2026-06-25T08:20:00+03:00',
    source: 'https://kkibp.edu.ua/uk/news/4865-zdobuvachi-osvity-spetsialnosti-hotelno-restoranna-sprava-prokhodiat-navchalnu-praktyku'
  },
  {
    file: 'news-4863.html',
    pub: '2026-06-24T12:00:00+03:00',
    source: 'https://kkibp.edu.ua/uk/news/4863-k-i-n-dotsent-yuliya-rudenko-vzyala-uchast-v-osvitnomu-treninhu-znovu-vidnovlyuyemos-2026'
  },
  {
    file: 'news-4862.html',
    pub: '2026-06-24T11:45:00+03:00',
    source: 'https://kkibp.edu.ua/uk/news/4862-pershokursnyky-rik-po-tomu-tvorchyi-zvit-studentiv'
  }
];

const monthNames = [
  'січня',
  'лютого',
  'березня',
  'квітня',
  'травня',
  'червня',
  'липня',
  'серпня',
  'вересня',
  'жовтня',
  'листопада',
  'грудня'
];

function decodeHtml(value) {
  return String(value || '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&laquo;/g, '«')
    .replace(/&raquo;/g, '»')
    .replace(/&ldquo;/g, '“')
    .replace(/&rdquo;/g, '”')
    .replace(/&lsquo;/g, '‘')
    .replace(/&rsquo;/g, '’')
    .replace(/&ndash;/g, '–')
    .replace(/&mdash;/g, '—')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)))
    .replace(/&#x([0-9a-f]+);/gi, (_, code) => String.fromCharCode(parseInt(code, 16)));
}

function escapeHtml(value) {
  return String(value || '').replace(/[&<>"']/g, (char) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  }[char]));
}

function textFromHtml(value) {
  return decodeHtml(String(value || '')
    .replace(/<script\b[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style\b[\s\S]*?<\/style>/gi, ' ')
    .replace(/<br\s*\/?>/gi, ' ')
    .replace(/<\/p>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim());
}

function truncate(value, maxLength) {
  const text = String(value || '').replace(/\s+/g, ' ').trim();
  if (text.length <= maxLength) return text;
  const slice = text.slice(0, maxLength + 1);
  const lastSpace = slice.lastIndexOf(' ');
  const end = lastSpace > maxLength * 0.65 ? lastSpace : maxLength;
  return `${text.slice(0, end).replace(/[.,;:!?…]+$/, '')}...`;
}

function formatDate(value) {
  const date = new Date(value);
  return `${date.getDate()} ${monthNames[date.getMonth()]} ${date.getFullYear()}`;
}

function removeFirstDivByClass(html, className) {
  const start = html.search(new RegExp(`<div\\s+class=["'][^"']*${className}[^"']*["']`, 'i'));
  if (start < 0) return html;

  const tagRe = /<\/?div\b[^>]*>/gi;
  tagRe.lastIndex = start;
  let depth = 0;
  let seenStart = false;

  for (let match = tagRe.exec(html); match; match = tagRe.exec(html)) {
    const tag = match[0];
    if (!tag.startsWith('</')) {
      depth += 1;
      seenStart = true;
    } else if (seenStart) {
      depth -= 1;
      if (depth === 0) {
        return `${html.slice(0, start)}${html.slice(tagRe.lastIndex)}`;
      }
    }
  }

  return html;
}

function absoluteImageUrl(src) {
  const clean = decodeHtml(src || '').trim();
  if (!clean) return '';
  if (/^https?:\/\//i.test(clean)) return clean;
  if (clean.startsWith('//')) return `https:${clean}`;
  if (clean.startsWith('/')) return `${sourceHost}${clean}`;
  return `${sourceHost}/${clean.replace(/^\.?\//, '')}`;
}

function imageExtension(url) {
  const clean = decodeURIComponent(url.split('?')[0].split('#')[0]);
  const ext = path.extname(clean).toLowerCase();
  return ext && ext.length <= 6 ? ext : '.jpg';
}

function localArticleFile(sourceUrl) {
  const slug = sourceUrl.split('/').pop();
  return `news-${slug}.html`;
}

function articleId(sourceUrl) {
  return sourceUrl.split('/').pop();
}

function extractArticle(entry) {
  const raw = fs.readFileSync(path.join(tmp, entry.file), 'utf8');
  const itemStart = raw.indexOf('<div class="item-page">');
  const componentEnd = raw.indexOf('<!--End Component Area-->', itemStart);
  if (itemStart < 0 || componentEnd < 0) {
    throw new Error(`Cannot find article body in ${entry.file}`);
  }

  let block = raw.slice(itemStart, componentEnd);
  const titleMatch = block.match(/<h2>\s*<a\b[^>]*>([\s\S]*?)<\/a>\s*<\/h2>/i);
  const title = textFromHtml(titleMatch ? titleMatch[1] : '');
  const id = articleId(entry.source);
  const localFile = localArticleFile(entry.source);

  block = block.replace(/<div class="item-page">\s*/i, '');
  block = block.replace(/<h2>[\s\S]*?<\/h2>/i, '');
  block = block.replace(/<div class='spshare'>[\s\S]*?<div style='clear:both'><\/div><\/div>/i, '');
  block = removeFirstDivByClass(block, 'article-tools');

  const hiddenIndex = block.lastIndexOf('<div style="display:none;">');
  if (hiddenIndex >= 0) block = block.slice(0, hiddenIndex);

  block = block
    .replace(/\r/g, '')
    .replace(/<\/?span\b[^>]*>/gi, '')
    .replace(/\s+(style|class|width|height)="[^"]*"/gi, '')
    .replace(/\s+(style|class|width|height)='[^']*'/gi, '')
    .replace(/<p>\s*(?:&nbsp;|\s)*<\/p>/gi, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim();

  const images = [];
  let imageIndex = 0;
  block = block.replace(/<img\b([^>]*?)>/gi, (tag, attrs) => {
    const srcMatch = attrs.match(/\bsrc=(["'])(.*?)\1/i);
    if (!srcMatch) return '';
    imageIndex += 1;
    const remoteUrl = absoluteImageUrl(srcMatch[2]);
    const ext = imageExtension(remoteUrl);
    const localPath = `assets/news/latest/${id}-${String(imageIndex).padStart(2, '0')}${ext}`;
    const altMatch = attrs.match(/\balt=(["'])(.*?)\1/i);
    const alt = decodeHtml(altMatch ? altMatch[2] : title).trim();
    images.push({ remoteUrl, localPath, alt });
    return `<img src="${localPath}" alt="${escapeHtml(alt || title)}" loading="lazy">`;
  });

  const text = textFromHtml(block);
  const description = truncate(text, 170);

  return {
    id,
    title,
    loadedAt: entry.pub,
    publishedLabel: formatDate(entry.pub),
    excerpt: description,
    image: images[0] ? images[0].localPath : '',
    alt: images[0] ? images[0].alt : title,
    url: localFile,
    source: entry.source,
    body: block,
    text,
    images
  };
}

function updateMeta(html, article) {
  const description = escapeHtml(article.excerpt);
  const pageTitle = escapeHtml(`${article.title} – Новини – Економіко-правовий фаховий коледж ККІБП`);
  const absoluteUrl = `${publicBase}${article.url}`;
  const absoluteImage = article.image ? `${publicBase}${article.image}` : `${publicBase}assets/logo_small.gif`;
  const imageType = article.image?.endsWith('.png') ? 'image/png' : 'image/jpeg';
  const imageAlt = escapeHtml(article.alt || article.title);

  return html
    .replace(/<title>[\s\S]*?<\/title>/, `<title>${pageTitle}</title>`)
    .replace(/<meta name="description" content="[^"]*">/, `<meta name="description" content="${description}">`)
    .replace(/<meta property="og:title" content="[^"]*">/, `<meta property="og:title" content="${escapeHtml(article.title)}">`)
    .replace(/<meta property="og:description" content="[^"]*">/, `<meta property="og:description" content="${description}">`)
    .replace(/<meta property="og:url" content="[^"]*">/, `<meta property="og:url" content="${absoluteUrl}">`)
    .replace(/<meta property="og:image" content="[^"]*">/, `<meta property="og:image" content="${absoluteImage}">`)
    .replace(/<meta property="og:image:type" content="[^"]*">/, `<meta property="og:image:type" content="${imageType}">`)
    .replace(/<meta property="og:image:alt" content="[^"]*">/, `<meta property="og:image:alt" content="${imageAlt}">`)
    .replace(/<meta name="twitter:title" content="[^"]*">/, `<meta name="twitter:title" content="${escapeHtml(article.title)}">`)
    .replace(/<meta name="twitter:description" content="[^"]*">/, `<meta name="twitter:description" content="${description}">`)
    .replace(/<meta name="twitter:image" content="[^"]*">/, `<meta name="twitter:image" content="${absoluteImage}">`)
    .replace(/<meta name="twitter:image:alt" content="[^"]*">/, `<meta name="twitter:image:alt" content="${imageAlt}">`);
}

function buildArticleMain(article, allArticles) {
  const currentIndex = allArticles.findIndex((item) => item.id === article.id);
  const newer = allArticles[currentIndex - 1];
  const older = allArticles[currentIndex + 1];
  const articleNav = [
    newer ? `<a href="${newer.url}"><span>Наступна новина</span><strong>${escapeHtml(newer.title)}</strong></a>` : '',
    older ? `<a href="${older.url}"><span>Попередня новина</span><strong>${escapeHtml(older.title)}</strong></a>` : ''
  ].filter(Boolean).join('');

  return `<main id="main"><section class="page-hero page-hero--solo news-article-hero"><div class="container"><nav class="breadcrumbs" aria-label="Хлібні крихти"><a href="index.html">Головна</a><a href="news.html">Новини</a><span>${escapeHtml(article.title)}</span></nav><div class="page-hero-grid"><div class="page-hero-copy"><span class="eyebrow eyebrow--light">Новина</span><h1>${escapeHtml(article.title)}</h1><p>${escapeHtml(article.excerpt)}</p></div></div></div></section>
<section class="section news-article-section"><div class="container news-article-layout"><article class="news-article-card"><div class="news-article-meta"><span>Новини коледжу</span><time datetime="${escapeHtml(article.loadedAt)}">${escapeHtml(article.publishedLabel)}</time></div><div class="news-article-body">${article.body}</div></article><aside class="news-article-aside" aria-label="Навігація новиною"><a class="news-article-back" href="news.html">Усі новини</a>${articleNav ? `<div class="news-article-neighbors">${articleNav}</div>` : ''}</aside></div></section>
</main>`;
}

const template = fs.readFileSync(path.join(root, 'news.html'), 'utf8');
const articlesData = articles.map(extractArticle);

const newsData = `window.COLLEGE_NEWS = ${JSON.stringify(articlesData.map((article) => ({
  id: article.id,
  loadedAt: article.loadedAt,
  publishedLabel: article.publishedLabel,
  title: article.title,
  excerpt: article.excerpt,
  image: article.image,
  alt: article.alt,
  url: article.url
})), null, 2)};\n`;

fs.writeFileSync(path.join(root, 'js/news-data.js'), newsData);

for (const article of articlesData) {
  const main = buildArticleMain(article, articlesData);
  const page = updateMeta(template.replace(/<main id="main">[\s\S]*?<\/main>/, main), article);
  fs.writeFileSync(path.join(root, article.url), page);
}

const curlConfig = [
  'location',
  'compressed',
  'create-dirs',
  ...articlesData.flatMap((article) => article.images.flatMap((image) => [
    `url = "${image.remoteUrl}"`,
    `output = "${image.localPath}"`
  ]))
].join('\n');
fs.writeFileSync('/tmp/kkibp-news-images.curl', `${curlConfig}\n`);

console.log(`Imported ${articlesData.length} articles.`);
console.log(`Prepared ${articlesData.reduce((total, article) => total + article.images.length, 0)} image downloads in /tmp/kkibp-news-images.curl.`);
