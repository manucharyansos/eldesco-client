export const LOCALES = ['hy', 'en', 'ru'] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = 'hy';

export const LOCALE_NAMES: Record<Locale, string> = { hy: 'Հայերեն', en: 'English', ru: 'Русский' };
export const HTML_LANG: Record<Locale, string> = { hy: 'hy', en: 'en', ru: 'ru' };
export const OG_LOCALE: Record<Locale, string> = { hy: 'hy_AM', en: 'en_US', ru: 'ru_RU' };

const PROD = process.env.NODE_ENV === 'production';

// Production defaults point at the real domains so a missing env var can never leave the site talking to localhost.
export const API_URL = (process.env.NEXT_PUBLIC_API_URL || (PROD ? 'https://api.eldesco.am/api' : 'http://127.0.0.1:8000/api')).replace(/\/+$/, '');
export const API_ORIGIN = API_URL.replace(/\/api$/, '');
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || (PROD ? 'https://eldesco.am' : 'http://localhost:3000')).replace(/\/+$/, '');

export const isLocale = (value: string): value is Locale => (LOCALES as readonly string[]).includes(value);
