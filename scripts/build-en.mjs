import { mkdir, readFile, writeFile } from 'node:fs/promises';

const cssVersion = 'college-subpages-20260630';
const scriptVersion = 'college-subpages-20260630';
const sectionFiles = ['college.html', 'admissions.html', 'students.html', 'alumni.html', 'science.html', 'library.html'];
const shellOnlyFiles = ['index.html', 'news.html'];
const allFiles = [...shellOnlyFiles, ...sectionFiles];
const siteBaseUrl = 'https://yakovliev.github.io/kkibp-college-demo';

const pageMeta = {
  'index.html': {
    page: 'home',
    title: 'Home - Professional College of Economics and Law of the Kyiv Cooperative Institute of Business and Law',
    socialTitle: 'Professional College of Economics and Law, KCIBL'
  },
  'college.html': {
    page: 'college',
    title: 'College - Professional College of Economics and Law of the Kyiv Cooperative Institute of Business and Law',
    socialTitle: 'College - Professional College of Economics and Law, KCIBL'
  },
  'admissions.html': {
    page: 'admissions',
    title: 'Admissions - Professional College of Economics and Law of the Kyiv Cooperative Institute of Business and Law',
    socialTitle: 'Admissions - Professional College of Economics and Law, KCIBL'
  },
  'students.html': {
    page: 'students',
    title: 'Students - Professional College of Economics and Law of the Kyiv Cooperative Institute of Business and Law',
    socialTitle: 'Students - Professional College of Economics and Law, KCIBL'
  },
  'alumni.html': {
    page: 'alumni',
    title: 'Alumni - Professional College of Economics and Law of the Kyiv Cooperative Institute of Business and Law',
    socialTitle: 'Alumni - Professional College of Economics and Law, KCIBL'
  },
  'science.html': {
    page: 'science',
    title: 'Research - Professional College of Economics and Law of the Kyiv Cooperative Institute of Business and Law',
    socialTitle: 'Research - Professional College of Economics and Law, KCIBL'
  },
  'library.html': {
    page: 'library',
    title: 'Library - Professional College of Economics and Law of the Kyiv Cooperative Institute of Business and Law',
    socialTitle: 'Library - Professional College of Economics and Law, KCIBL'
  },
  'news.html': {
    page: 'news',
    title: 'News - Professional College of Economics and Law of the Kyiv Cooperative Institute of Business and Law',
    socialTitle: 'News - Professional College of Economics and Law, KCIBL'
  }
};

const translations = {
  'Економіко-правовий фаховий коледж Київського кооперативного інституту бізнесу і права': 'Professional College of Economics and Law of the Kyiv Cooperative Institute of Business and Law',
  'Економіко-правовий фаховий коледж': 'Professional College of Economics and Law',
  'Київського кооперативного інституту бізнесу і права': 'of the Kyiv Cooperative Institute of Business and Law',
  'Офіційний сайт коледжу: вступ, навчання, студентське життя, новини та корисні сервіси.': 'Official college website: admissions, studies, student life, news and useful services.',
  'Логотип Економіко-правового фахового коледжу': 'Professional College of Economics and Law logo',
  'Головна – Економіко-правовий фаховий коледж Київського кооперативного інституту бізнесу і права': pageMeta['index.html'].title,
  'Про коледж – Економіко-правовий фаховий коледж Київського кооперативного інституту бізнесу і права': pageMeta['college.html'].title,
  'Абітурієнту – Економіко-правовий фаховий коледж Київського кооперативного інституту бізнесу і права': pageMeta['admissions.html'].title,
  'Студенту – Економіко-правовий фаховий коледж Київського кооперативного інституту бізнесу і права': pageMeta['students.html'].title,
  'Випускнику – Економіко-правовий фаховий коледж Київського кооперативного інституту бізнесу і права': pageMeta['alumni.html'].title,
  'Наука – Економіко-правовий фаховий коледж Київського кооперативного інституту бізнесу і права': pageMeta['science.html'].title,
  'Бібліотека – Економіко-правовий фаховий коледж Київського кооперативного інституту бізнесу і права': pageMeta['library.html'].title,
  'Новини – Економіко-правовий фаховий коледж Київського кооперативного інституту бізнесу і права': pageMeta['news.html'].title,
  'Про коледж – Економіко-правовий фаховий коледж ККІБП': pageMeta['college.html'].socialTitle,
  'Абітурієнту – Економіко-правовий фаховий коледж ККІБП': pageMeta['admissions.html'].socialTitle,
  'Студенту – Економіко-правовий фаховий коледж ККІБП': pageMeta['students.html'].socialTitle,
  'Випускнику – Економіко-правовий фаховий коледж ККІБП': pageMeta['alumni.html'].socialTitle,
  'Наука – Економіко-правовий фаховий коледж ККІБП': pageMeta['science.html'].socialTitle,
  'Бібліотека – Економіко-правовий фаховий коледж ККІБП': pageMeta['library.html'].socialTitle,
  'Новини – Економіко-правовий фаховий коледж ККІБП': pageMeta['news.html'].socialTitle,
  'Економіко-правовий фаховий коледж ККІБП': pageMeta['index.html'].socialTitle,

  'Перейти до основного вмісту': 'Skip to main content',
  'Електронна пошта та телефон': 'Email and phone',
  'Instagram коледжу': 'College Instagram',
  'Facebook коледжу': 'College Facebook',
  'Пошук по сайту': 'Search the site',
  'Змінити мову': 'Change language',
  'Зміна мови': 'Change language',
  'Мова сайту': 'Site language',
  'Відкрити меню': 'Open menu',
  'Основна навігація': 'Primary navigation',
  'Хлібні крихти': 'Breadcrumbs',
  'Навігація сторінкою': 'Page navigation',
  'Швидкі переходи': 'Quick links',
  'Закрити пошук': 'Close search',
  'Пошук': 'Search',
  'Що ви шукаєте?': 'What are you looking for?',
  'Пошуковий запит': 'Search query',
  'Наприклад, розклад або правила прийому': 'For example, schedule or admission rules',
  'Популярне:': 'Popular:',
  'правила прийому': 'admission rules',
  'розклад занять': 'class schedule',
  'електронний каталог': 'electronic catalog',
  'Навігація': 'Navigation',
  'Політика конфіденційності': 'Privacy policy',
  'Повернутися вгору': 'Back to top',
  'Підсторінки:': 'Subpages:',
  '– головна': '- home',
  'Відкрити на Google Maps': 'Open in Google Maps',
  'Пн-Пт, 08:00–17:00': 'Mon-Fri, 08:00-17:00',
  'вул. Юлії Здановської, 18, м. Київ, 03022': '18 Yulii Zdanovskoi St., Kyiv, 03022',
  'Карта розташування Економіко-правового фахового коледжу': 'Map showing the location of the Professional College of Economics and Law',
  'Карта розташування приймальної комісії': 'Map showing the admissions office location',

  'Корисні матеріали, документи та сервіси розділу.': 'Useful materials, documents and services for this section.',
  'На цій сторінці': 'On this page',
  'Перейти': 'Open',
  'Головна': 'Home',
  'Розділ': 'Section',
  'Коледж': 'College',
  'Абітурієнту': 'Applicants',
  'Студенту': 'Students',
  'Випускнику': 'Alumni',
  'Наука': 'Research',
  'Бібліотека': 'Library',
  'Новини': 'News',
  'Вступ': 'Admissions',
  'Контакти': 'Contacts',

  'Загальна інформація': 'General information',
  'Про коледж': 'About the college',
  'Керівництво коледжу': 'College leadership',
  'Керівництво': 'Leadership',
  'Відділення': 'Departments',
  'Циклові комісії': 'Subject commissions',
  'Органи управління та органи самоврядування': 'Governance and self-government bodies',
  'Основна інформація': 'Key information',
  'Статут коледжу': 'College charter',
  'Концепція діяльності': 'Development concept',
  'Колективний договір': 'Collective agreement',
  'Документи локального нормотворення': 'Local regulatory documents',
  'Доступ до публічної інформації': 'Access to public information',
  'Ліцензії на провадження освітньої діяльності': 'Educational activity licenses',
  'Сертифікати про акредитацію спеціальностей та освітніх програм': 'Accreditation certificates for specialties and programs',
  'План роботи': 'Work plan',
  'Звіт': 'Report',
  'Громадське обговорення': 'Public discussion',
  'Вакансії': 'Vacancies',
  'Діяльність': 'Activities',
  'Цілі сталого розвитку': 'Sustainable Development Goals',
  'Інклюзивне освітнє середовище': 'Inclusive learning environment',
  'Антикорупційна діяльність': 'Anti-corruption activity',
  'Психологічна служба': 'Psychological service',
  'Міжнародна діяльність': 'International activity',
  'Практична підготовка': 'Practical training',
  'Центр кар’єри': 'Career Center',

  'Місце, де формується професійне майбутнє': 'A place where professional futures are shaped',
  'Ми поєднуємо сильну академічну базу, практичне навчання та культуру взаємної підтримки.': 'We combine a strong academic foundation, practical learning and a culture of mutual support.',
  'Коротка сторінка для базового опису коледжу, місії, історії та освітнього середовища.': 'A short page for the basic description of the college, its mission, history and learning environment.',
  'Сторінка для актуальної інформації про адміністрацію та напрями відповідальності.': 'A page for current information about administration and areas of responsibility.',
  'Перелік відділень, освітніх напрямів і контактів для подальшого наповнення.': 'A list of departments, educational areas and contacts for further content.',
  'Місце для складу комісій, напрямів роботи та методичних матеріалів.': 'A place for commission membership, areas of work and methodological materials.',
  'Структура управління, колегіальні органи та органи студентського самоврядування.': 'Governance structure, collegial bodies and student self-government bodies.',
  'Адреса, телефони, електронна пошта та службові контакти коледжу.': 'Address, phone numbers, email and service contacts of the college.',
  'Сторінка для чинного статуту, супровідних матеріалів і короткого пояснення документа.': 'A page for the current charter, supporting materials and a brief explanation of the document.',
  'Напрями розвитку, стратегічні орієнтири та принципи діяльності коледжу.': 'Development directions, strategic guidelines and principles of college activity.',
  'Матеріали щодо домовленостей між адміністрацією та трудовим колективом.': 'Materials on agreements between the administration and the staff team.',
  'Положення, правила, регламенти та інші внутрішні документи коледжу.': 'Policies, rules, regulations and other internal college documents.',
  'Порядок подання запитів, відкриті дані та матеріали для публічного доступу.': 'Request procedures, open data and materials for public access.',
  'Сторінка для ліцензій, додатків і документів щодо освітньої діяльності.': 'A page for licenses, appendices and documents on educational activity.',
  'Акредитаційні матеріали за спеціальностями та освітніми програмами.': 'Accreditation materials for specialties and educational programs.',
  'Поточні плани роботи коледжу та ключові організаційні пріоритети.': 'Current college work plans and key organizational priorities.',
  'Звітні матеріали про роботу коледжу, результати та виконані завдання.': 'Reporting materials on college work, results and completed tasks.',
  'Оголошення, проєкти документів та матеріали для відкритого обговорення.': 'Announcements, draft documents and materials for open discussion.',
  'Відкриті позиції, умови участі в конкурсі та контактна інформація.': 'Open positions, competition conditions and contact information.',
  'Ініціативи коледжу, пов’язані зі сталим розвитком, відповідальністю та спільнотами.': 'College initiatives related to sustainable development, responsibility and communities.',
  'Доступність, підтримка студентів і принципи інклюзивної взаємодії.': 'Accessibility, student support and principles of inclusive interaction.',
  'Політики доброчесності, повідомлення, профілактика та відповідальні особи.': 'Integrity policies, reporting, prevention and responsible persons.',
  'Підтримка студентів, консультації, профілактичні матеріали та контакти служби.': 'Student support, consultations, prevention materials and service contacts.',
  'Партнерства, міжнародні проєкти, академічні можливості та співпраця.': 'Partnerships, international projects, academic opportunities and cooperation.',
  'Практики, бази практичної підготовки, роботодавці та супровід студентів.': 'Practical training, practice bases, employers and student support.',
  'Кар’єрні консультації, вакансії для студентів, партнерства та події.': 'Career consultations, student vacancies, partnerships and events.',
  'Адміністрація': 'Administration',
  'Керівництво відповідає за стратегічний розвиток коледжу, якість освітнього процесу та організацію навчально-методичної роботи.': 'The leadership team is responsible for strategic development, educational quality and academic-methodological work.',
  'Гіджеліцький Віталій Миколайович': 'Vitalii Hidzhelitskyi',
  'Директор, кандидат технічних наук, доцент': 'Director, Candidate of Technical Sciences, Associate Professor',
  'Райковська Інна Тадеушівна': 'Inna Raikovska',
  'Заступниця директора з навчально-методичної роботи, кандидат економічних наук, доцент': 'Deputy Director for Academic and Methodological Work, Candidate of Economic Sciences, Associate Professor',
  'Завітайте до нас': 'Visit us',

  'Вступ 2026: твій наступний крок': 'Admissions 2026: your next step',
  'Зрозумілий маршрут від вибору програми до першого студентського дня.': 'A clear route from choosing a program to your first student day.',
  'Вступна інформація': 'Admissions information',
  'Освітні програми': 'Educational programs',
  'Приймальна комісія': 'Admissions office',
  'Офіційні документи': 'Official documents',
  'Правила прийому': 'Admission rules',
  'Рейтингові списки': 'Ranking lists',
  'Накази про зарахування': 'Enrollment orders',
  'Вартість навчання': 'Tuition fees',
  'Важливі дати': 'Important dates',
  'Документи для вступу': 'Application documents',
  'Контактна інформація': 'Contact information',
  'Сторінка для офіційних документів вступної кампанії, витягів, додатків і супровідних матеріалів.': 'A page for official admissions campaign documents, extracts, appendices and supporting materials.',
  'Окреме місце для правил прийому, умов вступу та документів, які визначають порядок зарахування.': 'A dedicated place for admission rules, entry conditions and documents that define enrollment procedures.',
  'Майбутня сторінка для рейтингових списків, статусів заяв і оновлень під час вступної кампанії.': 'A future page for ranking lists, application statuses and updates during the admissions campaign.',
  'Сторінка для наказів про зарахування та пов’язаних із ними оголошень.': 'A page for enrollment orders and related announcements.',
  'Інформація про вартість навчання, фінансові умови та можливі формати оплати.': 'Information about tuition fees, financial terms and possible payment formats.',
  'Календар вступника з ключовими строками, дедлайнами та етапами кампанії.': 'An applicant calendar with key dates, deadlines and campaign stages.',
  'Перелік документів, вимоги до подання та підказки для вступника.': 'A list of documents, submission requirements and tips for applicants.',
  'Контакти, графік роботи та інформація про консультації приймальної комісії.': 'Contacts, working hours and information about admissions office consultations.',
  'Канали зв’язку для вступників, адреси, телефони та електронна пошта.': 'Communication channels for applicants, addresses, phone numbers and email.',
  'Сторінка для переліку освітніх програм, описів спеціальностей і документів ОПП.': 'A page for the list of educational programs, specialty descriptions and program documents.',
  'Поставте запитання': 'Ask a question',
  'Контакти приймальної комісії': 'Admissions office contacts',
  'Зателефонуйте до приймальної комісії у робочий час або напишіть на email у зручний для вас час.': 'Call the admissions office during working hours or email whenever convenient.',

  'Навчання, можливості та підтримка': 'Learning, opportunities and support',
  'Швидкий доступ до розкладу, освітніх сервісів, студентського життя й кар’єрних ресурсів.': 'Quick access to schedules, learning services, student life and career resources.',
  'Можливості': 'Opportunities',
  'Соціально-правова підтримка': 'Social and legal support',
  'Графік навчального процесу': 'Academic calendar',
  'Розклад занять': 'Class schedule',
  'Контакти викладачів': 'Teacher contacts',
  'Каталог вибіркових освітніх компонентів': 'Elective components catalog',
  'Правила внутрішнього розпорядку': 'Internal regulations',
  'Гуртожиток': 'Dormitory',
  'Мистецькі студії': 'Art studios',
  'Спортивні секції': 'Sports sections',
  'Курси вивчення іноземних мов': 'Foreign language courses',
  'Юридична клініка': 'Legal clinic',
  'Студентський омбудсмен': 'Student ombudsperson',
  'Сторінка для навчальних програм, освітніх компонентів і матеріалів для студентів.': 'A page for study programs, educational components and materials for students.',
  'Календар семестрів, сесій, практик, канікул та інших етапів навчального року.': 'Calendar of semesters, exam sessions, practical training, holidays and other stages of the academic year.',
  'Окрема сторінка для розкладу занять, замін і навчальних аудиторій.': 'A dedicated page for class schedules, substitutions and classrooms.',
  'Контактна інформація викладачів і правила освітньої комунікації.': 'Teacher contact information and rules for academic communication.',
  'Добірка вибіркових дисциплін, описів компонентів і правил вибору.': 'A selection of electives, component descriptions and selection rules.',
  'Сторінка для правил поведінки, навчального режиму й організації освітнього процесу.': 'A page for conduct rules, study mode and organization of the educational process.',
  'Інформація про поселення, умови проживання та контакти щодо гуртожитку.': 'Information about accommodation, living conditions and dormitory contacts.',
  'Сторінка для творчих студій, подій, гуртків і студентських мистецьких ініціатив.': 'A page for creative studios, events, clubs and student art initiatives.',
  'Інформація про спортивні секції, тренування, змагання та команди коледжу.': 'Information about sports sections, training, competitions and college teams.',
  'Можливості мовного навчання, розмовні клуби та додаткові курси.': 'Language learning opportunities, speaking clubs and additional courses.',
  'Сторінка для правової підтримки, консультацій і студентських юридичних ініціатив.': 'A page for legal support, consultations and student legal initiatives.',
  'Матеріали про доброчесність, повідомлення, політики та відповідальних осіб.': 'Materials about integrity, reporting, policies and responsible persons.',
  'Канал звернень щодо прав студентів, безпечного середовища й вирішення конфліктів.': 'A contact channel for student rights, a safe environment and conflict resolution.',

  'Спільнота, яка залишається поруч': 'A community that stays close',
  'Зберігайте зв’язок із коледжем, діліться досвідом і підтримуйте нове покоління студентів.': 'Stay connected with the college, share experience and support the next generation of students.',
  'Спільнота': 'Community',
  'Асоціація випускників': 'Alumni association',
  'Успішні випускники': 'Successful alumni',
  'Зустрічі випускників': 'Alumni meetings',
  'Сторінка для асоціації випускників, форм участі та контактів спільноти.': 'A page for the alumni association, participation formats and community contacts.',
  'Місце для історій випускників, професійних траєкторій і прикладів кар’єрного зростання.': 'A place for alumni stories, professional paths and career growth examples.',
  'Оголошення, архів подій і матеріали для зустрічей випускників різних років.': 'Announcements, event archive and materials for alumni meetings from different years.',

  'Дослідження, що переходять у практику': 'Research that turns into practice',
  'Підтримуємо викладацькі та студентські проєкти, відкриту науку й міжнародну співпрацю.': 'We support faculty and student projects, open science and international cooperation.',
  'Можливості для науковців': 'Opportunities for researchers',
  'Студентська наука': 'Student research',
  'Академічна доброчесність': 'Academic integrity',
  'Напрями наукової діяльності': 'Research areas',
  'Наукові профілі працівників': 'Staff research profiles',
  'Наукові видання': 'Scientific publications',
  'Державні премії та нагороди, стипендії': 'State awards, honors and scholarships',
  'Міжнародні наукові проєкти та гранти': 'International research projects and grants',
  'Конкурси на отримання фінансування': 'Funding competitions',
  'Наукові гуртки': 'Research clubs',
  'Всеукраїнські та міжнародні конкурси студентських наукових робіт': 'Ukrainian and international student research contests',
  'Офіційні документи та рекомендації з питань академічної доброчесності': 'Official documents and recommendations on academic integrity',
  'Документи коледжу з питань академічної доброчесності': 'College documents on academic integrity',
  'Розвиток культури академічної доброчесності': 'Developing a culture of academic integrity',
  'Анкетування': 'Surveys',
  'Перевірка на плагіат': 'Plagiarism check',
  'Пріоритети наукової роботи, тематичні напрями та прикладні дослідження.': 'Research priorities, thematic areas and applied studies.',
  'Сторінка для профілів науково-педагогічних працівників, ідентифікаторів і публікацій.': 'A page for academic staff profiles, identifiers and publications.',
  'План наукової роботи, ключові заходи, етапи та відповідальні особи.': 'Research work plan, key events, stages and responsible persons.',
  'Звітні матеріали про результати наукової діяльності та виконані завдання.': 'Reporting materials on research results and completed work.',
  'Добірка наукових видань, вимог до публікацій та редакційної інформації.': 'A selection of scientific journals, publication requirements and editorial information.',
  'Інформація про премії, нагороди, стипендії та умови участі.': 'Information about awards, honors, scholarships and participation conditions.',
  'Міжнародні проєкти, грантові програми, партнерства й можливості співпраці.': 'International projects, grant programs, partnerships and cooperation opportunities.',
  'Оголошення про конкурси, дедлайни, вимоги та корисні матеріали для заявок.': 'Competition announcements, deadlines, requirements and useful application materials.',
  'Гуртки, дослідницькі команди, графік зустрічей і напрями роботи студентів.': 'Clubs, research teams, meeting schedules and student work areas.',
  'Конкурси студентських наукових робіт, вимоги, дедлайни й результати.': 'Student research contests, requirements, deadlines and results.',
  'Офіційні документи, методичні рекомендації та корисні матеріали з доброчесності.': 'Official documents, methodological recommendations and useful integrity materials.',
  'Внутрішні документи, положення та процедури коледжу щодо академічної доброчесності.': 'Internal college documents, policies and procedures on academic integrity.',
  'План заходів із розвитку академічної доброчесності та відповідальної освітньої культури.': 'Action plan for developing academic integrity and a responsible educational culture.',
  'Звітні матеріали щодо виконаних заходів і результатів роботи з доброчесності.': 'Reports on completed activities and integrity work results.',
  'Матеріали, ініціативи та події для формування культури академічної доброчесності.': 'Materials, initiatives and events for building a culture of academic integrity.',
  'Опитування, аналітика та результати з питань академічної доброчесності.': 'Surveys, analytics and results on academic integrity.',
  'Інформація про процедури перевірки робіт, інструменти та порядок звернення.': 'Information about work-checking procedures, tools and request process.',

  'Знання у зручному форматі': 'Knowledge in a convenient format',
  'Навчальна література, електронні ресурси, дослідницька підтримка та простір для спільної роботи.': 'Learning literature, electronic resources, research support and space for collaboration.',
  'Про бібліотеку': 'About the library',
  'Інформація для користувачів': 'User information',
  'Бібліотечний простір': 'Library space',
  'Науковцям': 'For researchers',
  'Склад': 'Staff',
  'Презентація бібліотеки': 'Library presentation',
  'Соціальні мережі': 'Social media',
  'Правила користування': 'Library rules',
  'Читачам': 'For readers',
  'Анкета читача': 'Reader form',
  'Книжковий фонд': 'Book collection',
  'Репозитарій': 'Repository',
  'Нові надходження': 'New acquisitions',
  'Книжкові виставки': 'Book exhibitions',
  'Електронна бібліотека навчальної літератури': 'Electronic library of textbooks',
  'Настільні ігри': 'Board games',
  'Бібліотечний кіноклуб': 'Library film club',
  'Волонтерство «Здорова бібліотека»': 'Healthy Library volunteering',
  'Авторам наукових публікацій': 'For authors of scientific publications',
  'Наукометричні показники': 'Scientometric indicators',
  'Наукові ресурси відкритого доступу': 'Open-access research resources',
  'Наукові фахові видання України': 'Specialized scientific journals of Ukraine',
  'Визначення індексів УДК/ББК': 'UDC/LBC indexes',
  'Сторінка для команди бібліотеки, зон відповідальності та контактної інформації.': 'A page for the library team, areas of responsibility and contact information.',
  'Базовий опис бібліотеки, фонду, сервісів і формату роботи.': 'A basic description of the library, collection, services and work format.',
  'Матеріали презентації бібліотеки, її можливостей, простору та сервісів.': 'Library presentation materials, opportunities, space and services.',
  'План роботи бібліотеки, події, завдання та ключові напрями розвитку.': 'Library work plan, events, tasks and key development areas.',
  'Звітні матеріали про роботу бібліотеки, фонд, сервіси та заходи.': 'Reporting materials on library work, collection, services and events.',
  'Посилання на соціальні мережі, рубрики та комунікаційні канали бібліотеки.': 'Links to social media, sections and communication channels of the library.',
  'Правила користування бібліотекою, ресурсами, просторами та сервісами.': 'Rules for using the library, resources, spaces and services.',
  'Корисна інформація для читачів, послуги, консультації та порядок звернення.': 'Useful information for readers, services, consultations and request process.',
  'Форма або опис анкети читача для зворотного зв’язку та уточнення потреб.': 'A reader form or description for feedback and clarifying needs.',
  'Інформація про настільні ігри, клубні зустрічі й неформальне навчання.': 'Information about board games, club meetings and informal learning.',
  'Сторінка для кіноклубу, анонсів переглядів, обговорень і тематичних добірок.': 'A page for the film club, screening announcements, discussions and thematic selections.',
  'Волонтерські ініціативи бібліотеки, події та можливості долучитися.': 'Library volunteer initiatives, events and opportunities to join.',
  'Матеріали для авторів, вимоги до публікацій, оформлення й добір журналів.': 'Materials for authors, publication requirements, formatting and journal selection.',
  'Пояснення наукометричних показників, профілів, баз і аналітики цитувань.': 'Explanation of scientometric indicators, profiles, databases and citation analytics.',
  'Добірка відкритих наукових ресурсів, баз даних і корисних платформ.': 'A selection of open research resources, databases and useful platforms.',
  'Перелік і пояснення щодо наукових фахових видань України.': 'A list and explanation of specialized scientific journals of Ukraine.',
  'Сторінка для консультацій щодо індексів УДК/ББК та правил класифікації.': 'A page for consultations on UDC/LBC indexes and classification rules.',
  'Підтримка створення й оновлення наукових профілів працівників.': 'Support for creating and updating staff research profiles.',

  'Дозвілля': 'Leisure',
  'Студентське самоврядування': 'Student self-government',
  'Волонтерська діяльність': 'Volunteering',
  'Музей історії споживчої кооперації Київщини': 'Museum of Consumer Cooperation History of Kyiv Region'
};

const orderedTranslations = Object.entries(translations).sort((a, b) => b[0].length - a[0].length);

const replaceText = (html) => orderedTranslations.reduce(
  (result, [source, target]) => result.split(source).join(target),
  html
);

const prefixRootPaths = (html) => html
  .replace(/(href|src)="(assets|css|js|college|admissions|students|alumni|science|library)\//g, '$1="../$2/')
  .replace(/srcset="(assets)\//g, 'srcset="../$1/');

const extractMain = (html) => html.match(/<main[\s\S]*?<\/main>/)?.[0] || '';

const patchHead = (html, file) => {
  const meta = pageMeta[file];
  const socialUrl = file === 'index.html' ? `${siteBaseUrl}/en/` : `${siteBaseUrl}/en/${file}`;
  return html
    .replace(/<html lang="uk" data-page="[^"]+">/, `<html lang="en" data-page="${meta.page}">`)
    .replace(/<title>[\s\S]*?<\/title>/, `<title>${meta.title}</title>`)
    .replace(/<meta property="og:site_name" content="[^"]+">/, '<meta property="og:site_name" content="Professional College of Economics and Law, KCIBL">')
    .replace(/<meta property="og:title" content="[^"]+">/, `<meta property="og:title" content="${meta.socialTitle}">`)
    .replace(/<meta property="og:description" content="[^"]+">/, '<meta property="og:description" content="Official college website: admissions, studies, student life, news and useful services.">')
    .replace(/<meta property="og:url" content="[^"]+">/, `<meta property="og:url" content="${socialUrl}">`)
    .replace(/<meta property="og:image:alt" content="[^"]+">/, '<meta property="og:image:alt" content="Professional College of Economics and Law logo">')
    .replace(/<meta property="og:locale" content="uk_UA">/, '<meta property="og:locale" content="en_US">')
    .replace(/<meta name="twitter:title" content="[^"]+">/, `<meta name="twitter:title" content="${meta.socialTitle}">`)
    .replace(/<meta name="twitter:description" content="[^"]+">/, '<meta name="twitter:description" content="Official college website: admissions, studies, student life, news and useful services.">')
    .replace(/<meta name="twitter:image:alt" content="[^"]+">/, '<meta name="twitter:image:alt" content="Professional College of Economics and Law logo">')
    .replace(/<link rel="alternate" hreflang="uk" href="[^"]+">/, `<link rel="alternate" hreflang="uk" href="../${file}">`)
    .replace(/<link rel="alternate" hreflang="en" href="[^"]+">/, `<link rel="alternate" hreflang="en" href="${file}">`)
    .replace(/(\.\.\/)?css\/styles\.css\?v=[^"]+/g, `../css/styles.css?v=${cssVersion}`)
    .replace(/(\.\.\/)?js\/main\.js\?v=[^"]+/g, `../js/main.js?v=${scriptVersion}`);
};

const patchLanguageSwitches = (html, file) => html
  .replace(/aria-label="Змінити мову">UA/g, 'aria-label="Change language">EN')
  .replace(/aria-label="Зміна мови"/g, 'aria-label="Change language"')
  .replace(
    new RegExp(`<a class="language-option is-active" href="${file}" hreflang="uk" role="menuitem" aria-current="true">UA<\\/a>\\s*<a class="language-option" href="en\\/${file}" hreflang="en" role="menuitem">EN<\\/a>`, 'g'),
    `<a class="language-option" href="../${file}" hreflang="uk" role="menuitem">UA</a>\n            <a class="language-option is-active" href="${file}" hreflang="en" role="menuitem" aria-current="true">EN</a>`
  )
  .replace(
    new RegExp(`<a class="mobile-language-option is-active" href="${file}" hreflang="uk" aria-current="true">UA<\\/a>\\s*<a class="mobile-language-option" href="en\\/${file}" hreflang="en">EN<\\/a>`, 'g'),
    `<a class="mobile-language-option" href="../${file}" hreflang="uk">UA</a>\n              <a class="mobile-language-option is-active" href="${file}" hreflang="en" aria-current="true">EN</a>`
  );

const translateFromUkrainian = async (file) => {
  let html = await readFile(file, 'utf8');
  html = patchHead(html, file);
  html = prefixRootPaths(html);
  html = patchLanguageSwitches(html, file);
  html = html.replace(/&hl=uk/g, '&hl=en');
  html = replaceText(html);
  return html;
};

const updateNewsArchiveUi = (html) => html.replace(
  '<div class="news-grid" data-news-list data-news-excerpt-length="185"></div>',
  '<div class="news-grid" data-news-list data-news-excerpt-length="185" data-news-page-size="9"></div><nav class="news-pagination" data-news-pagination aria-label="News pages" hidden></nav>'
);

const updateHomeLinks = (html) => html
  .replace(/href="admissions\.html#apply"/g, 'href="admissions.html"')
  .replace(/href="admissions\.html#programs"/g, 'href="admissions.html#educational-programs"')
  .replace(/href="admissions\.html#documents"/g, 'href="admissions.html#admission-info"');

await mkdir('en', { recursive: true });

for (const file of sectionFiles) {
  const html = await translateFromUkrainian(file);
  await writeFile(`en/${file}`, html);
}

for (const file of shellOnlyFiles) {
  const translatedShell = await translateFromUkrainian(file);
  const existing = await readFile(`en/${file}`, 'utf8');
  let main = extractMain(existing);
  if (file === 'index.html') main = updateHomeLinks(main);
  if (file === 'news.html') main = updateNewsArchiveUi(main);
  const html = translatedShell.replace(/<main[\s\S]*?<\/main>/, main);
  await writeFile(`en/${file}`, html);
}

console.log(`Updated English pages: ${allFiles.map((file) => `en/${file}`).join(', ')}`);
