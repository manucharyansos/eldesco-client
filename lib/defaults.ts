import type { Locale } from './config';
import type { NavItem, SiteData } from './cms-types';

type Tri = Record<Locale, string>;
const t = (hy: string, en: string, ru: string): Tri => ({ hy, en, ru });

/**
 * Interface labels. Every one of them can be overridden from the admin panel
 * (Settings -> Interface labels); these are the defaults and the fallback
 * that keeps the site readable if the API is temporarily unreachable.
 */
export const UI_DEFAULTS = {
  learn_more: t('Մանրամասն', 'Learn more', 'Подробнее'),
  contact_us: t('Կապ մեզ հետ', 'Contact us', 'Связаться с нами'),
  call_us: t('Զանգահարել', 'Call us', 'Позвонить'),
  email_us: t('Գրել մեզ', 'Email us', 'Написать'),
  areas_of_activity: t('Գործունեության ոլորտները', 'Areas of activity', 'Направления деятельности'),
  navigation: t('Նավարկում', 'Navigation', 'Навигация'),
  services: t('Ծառայություններ', 'Services', 'Услуги'),
  contact: t('Կապ', 'Contact', 'Контакты'),
  company: t('Կազմակերպություն', 'Company', 'Организация'),
  bank: t('Բանկ', 'Bank', 'Банк'),
  bank_accounts: t('Հաշվարկային հաշիվներ', 'Bank accounts', 'Расчетные счета'),
  business_address: t('Գործ. հասցե', 'Business address', 'Фактический адрес'),
  legal_address: t('Իրավ. հասցե', 'Legal address', 'Юридический адрес'),
  phone: t('Հեռախոս', 'Phone', 'Телефон'),
  email: t('Էլ. փոստ', 'Email', 'Эл. почта'),
  director: t('Տնօրեն', 'Director', 'Директор'),
  chief_accountant: t('Գլխավոր հաշվապահ', 'Chief accountant', 'Главный бухгалтер'),
  tax_id: t('ՀՎՀՀ', 'Tax ID', 'ИНН'),
  registration: t('Պետ. ռեգ. գրանցման N', 'State registration no.', 'Гос. регистрация №'),
  all_projects: t('Բոլոր նախագծերը', 'All projects', 'Все проекты'),
  discuss_project: t('Քննարկել նախագիծը', 'Discuss a project', 'Обсудить проект'),
  projects_title: t('Նախագծեր', 'Projects', 'Проекты'),
  projects_subtitle: t(
    'Իրականացված ինժեներական լուծումներ՝ էներգետիկայից մինչև արտադրական ենթակառուցվածքներ։',
    'Delivered engineering solutions, from power infrastructure to industrial systems.',
    'Реализованные инженерные решения - от энергетики до производственной инфраструктуры.'
  ),
  team_title: t('Թիմ', 'Team', 'Команда'),
  news_title: t('Նորություններ', 'News', 'Новости'),
  read_more: t('Կարդալ ավելին', 'Read more', 'Читать далее'),
  skip_to_content: t('Անցնել բովանդակությանը', 'Skip to content', 'Перейти к содержимому'),
  open_menu: t('Բացել մենյուն', 'Open menu', 'Открыть меню'),
  close_menu: t('Փակել մենյուն', 'Close menu', 'Закрыть меню'),
  language: t('Լեզու', 'Language', 'Язык'),
  home: t('Գլխավոր էջ', 'Home', 'Главная'),
  next: t('Հաջորդը', 'Next', 'Далее'),
  previous: t('Նախորդը', 'Previous', 'Назад'),
  close: t('Փակել', 'Close', 'Закрыть'),
  gallery: t('Պատկերասրահ', 'Gallery', 'Галерея'),
  not_found_title: t('Էջը չի գտնվել', 'Page not found', 'Страница не найдена'),
  not_found_text: t('Հասցեն սխալ է, կամ էջը հեռացվել է։', 'The address is wrong or the page has been removed.', 'Адрес неверен или страница удалена.'),
  go_home: t('Անցնել գլխավոր էջ', 'Go to the home page', 'Перейти на главную'),
  content_unavailable: t('Բովանդակությունը ժամանակավորապես հասանելի չէ։', 'Content is temporarily unavailable.', 'Содержимое временно недоступно.'),
  no_items: t('Այս բաժնում դեռ նյութեր չկան։', 'There is nothing here yet.', 'Пока здесь ничего нет.'),
  rights: t('Բոլոր իրավունքները պաշտպանված են', 'All rights reserved', 'Все права защищены'),
} as const;

export type UiKey = keyof typeof UI_DEFAULTS;

export function makeUi(settings: Record<string, unknown> | undefined, locale: Locale) {
  return (key: UiKey): string => {
    const override = settings?.[`ui.${key}`];
    if (typeof override === 'string' && override.trim()) return override;
    return UI_DEFAULTS[key][locale];
  };
}

export type Ui = ReturnType<typeof makeUi>;

const nav = (label: Tri, locale: Locale, page: string, children?: NavItem[]): NavItem => ({
  label: label[locale],
  page_slug: page,
  children,
});

/** Used only when the API cannot be reached. */
export function fallbackSite(locale: Locale): SiteData {
  const ui = (k: UiKey) => UI_DEFAULTS[k][locale];
  const links: NavItem[] = [
    nav(t('Մեր մասին', 'About', 'О нас'), locale, 'about'),
    nav(UI_DEFAULTS.services, locale, 'services'),
    nav(t('Նախագծեր', 'Projects', 'Проекты'), locale, 'projects'),
    nav(t('Պատվիրատուներ', 'Customers', 'Заказчики'), locale, 'customers'),
    nav(UI_DEFAULTS.contact, locale, 'contact'),
  ];

  return {
    settings: {
      'company.name': t('ԷԼԴԵՍՔՈ ՍՊԸ', 'ELDESCO LLC', 'ELDESCO LLC')[locale],
      'company.tagline': t(
        'Էներգետիկ ենթակառուցվածքների և ինժեներական համակարգերի նախագծում և պատրաստում։',
        'Design and production of energy infrastructure and engineering systems.',
        'Проектирование и производство энергетической инфраструктуры и инженерных систем.'
      )[locale],
      'contact.phone': '+37499694569',
      'contact.email': 'eldesco@eldesco.am',
      'contact.business_address': t('ՀՀ, ք․ Երևան, Թբիլիսյան 35/9', '35/9 Tbilisyan Hwy, Yerevan, Armenia', 'Армения, Ереван, Тбилисское шоссе 35/9')[locale],
      'brand.logo': '/images/brand/eldesco-logo.png',
      'brand.logo_light': '/images/brand/eldesco-logo-white.png',
      'footer.bottom_text': ui('rights'),
    },
    navigation: { header: links, footer: links },
  };
}
