# Рішення щодо інтерфейсу і вимог

## Статус
Це активний набір DDR-рішень для демоверсії сайту інституту, створений 2026-07-07 на основі архіву `docs/college-docs/decisions/`. Нумерацію оновлено, бо не всі коледжні рішення перенесені в активну документацію.

## Як користуватися
- `docs/technical-spec.md` є головним джерелом вимог.
- Файли в цій папці пояснюють, чому окремі UX, дизайн або технічні рішення були прийняті.
- Якщо під час адаптації сайту під інститут рішення змінюється, оновлюємо і відповідний DDR, і розділ у `docs/technical-spec.md`.
- Коледжно-специфічні формулювання в перенесених DDR поки лишаються видимими навмисно: вони показують місця, які треба перевірити під час наступних точкових правок.

## Перенесені рішення
| Новий файл | Джерело | Примітка |
|---|---|---|
| `docs/decisions/DDR-001-mobile-header-footer-ux.md` | `docs/college-docs/decisions/DDR-001-mobile-header-footer-ux.md` | Перенесено як робочу вимогу для адаптації інституту. |
| `docs/decisions/DDR-002-click-disclosure-navigation.md` | `docs/college-docs/decisions/DDR-002-click-disclosure-navigation.md` | Перенесено як робочу вимогу для адаптації інституту. |
| `docs/decisions/DDR-003-global-header-footer-static-demo.md` | `docs/college-docs/decisions/DDR-004-global-header-footer-static-demo.md` | Перенесено як робочу вимогу для адаптації інституту. |
| `docs/decisions/DDR-004-home-about-institution-carousel.md` | `docs/college-docs/decisions/DDR-005-home-about-college-carousel.md` | Перенесено як робочу вимогу для адаптації інституту. |
| `docs/decisions/DDR-005-partial-english-language-model.md` | `docs/college-docs/decisions/DDR-006-partial-english-language-model.md` | Перенесено як робочу вимогу для адаптації інституту. |
| `docs/decisions/DDR-006-home-main-sections.md` | `docs/college-docs/decisions/DDR-007-home-main-sections.md` | Перенесено як робочу вимогу для адаптації інституту. |
| `docs/decisions/DDR-007-home-educational-programs.md` | `docs/college-docs/decisions/DDR-008-home-educational-programs.md` | Перенесено як робочу вимогу для адаптації інституту. |
| `docs/decisions/DDR-008-home-and-news-feed-cards.md` | `docs/college-docs/decisions/DDR-009-home-and-news-feed-cards.md` | Перенесено як робочу вимогу для адаптації інституту. |
| `docs/decisions/DDR-009-news-archive-and-article-pages.md` | `docs/college-docs/decisions/DDR-010-news-archive-and-article-pages.md` | Перенесено як робочу вимогу для адаптації інституту. |
| `docs/decisions/DDR-010-section-landing-pages.md` | `docs/college-docs/decisions/DDR-011-section-landing-pages.md` | Перенесено як робочу вимогу для адаптації інституту. |
| `docs/decisions/DDR-011-day-night-theme-toggle.md` | `docs/college-docs/decisions/DDR-012-day-night-theme-toggle.md` | Перенесено як робочу вимогу для адаптації інституту. |
| `docs/decisions/DDR-012-sdg-icons-on-news.md` | `docs/college-docs/decisions/DDR-013-sdg-icons-on-news.md` | Перенесено як робочу вимогу для адаптації інституту. |
| `docs/decisions/DDR-013-news-department-tags-and-filter.md` | `docs/college-docs/decisions/DDR-014-news-department-tags-and-filter.md` | Перенесено як робочу вимогу для адаптації інституту. |
| `docs/decisions/DDR-014-local-inter-typography.md` | `docs/college-docs/decisions/DDR-016-local-inter-typography.md` | Перенесено як робочу вимогу для адаптації інституту. |
| `docs/decisions/DDR-015-standard-social-preview.md` | `docs/college-docs/decisions/DDR-017-standard-social-preview.md` | Перенесено як робочу вимогу для адаптації інституту. |
| `docs/decisions/DDR-016-institute-brand-name.md` | Нова вимога від 2026-07-07, оновлена 2026-07-24 | Прийнято як активне рішення щодо повної англійської назви, двомовного бренду й адаптивної типографіки. |
| `docs/decisions/DDR-017-institute-navigation-and-hero-logo.md` | Нова вимога від 2026-07-07 | Прийнято як активне рішення для навігації, зовнішнього переходу до коледжу і великого hero-логотипа. |
| `docs/decisions/DDR-018-navigation-taxonomy-update.md` | Нова вимога від 2026-07-07 | Прийнято як активну структуру header/footer і hub-сторінок. |

## Не перенесено як активні рішення
- `docs/college-docs/decisions/DDR-003-home-footer-quick-links.md` - у самому архіві має статус "Замінено DDR-004", тому його зміст покривається новим `DDR-003-global-header-footer-static-demo.md`.
- `docs/college-docs/decisions/DDR-015-institute-link-in-main-nav.md` - рішення було потрібне для сайту коледжу як зовнішній перехід на сайт інституту. Для сайту інституту це не можна автоматично вважати активною вимогою; структуру головного меню потрібно переглянути окремо.
