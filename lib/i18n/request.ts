import { getRequestConfig } from 'next-intl/server';

const locales = ['en', 'hy', 'ru'] as const;

export default getRequestConfig(async ({ locale }) => {
  const resolvedLocale = locales.includes(locale as (typeof locales)[number]) ? locale : 'hy';

  return {
    locale: resolvedLocale,
    messages: (await import(`../messages/${resolvedLocale}.json`)).default,
    timeZone: 'Asia/Yerevan',
  };
});
