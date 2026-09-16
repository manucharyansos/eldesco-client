import { getRequestConfig } from 'next-intl/server';

const locales = ['en', 'hy', 'ru'];

export default getRequestConfig(async ({ locale }) => {
  if (!locales.includes(locale as any)) {
    throw new Error('Unknown locale');
  }

  return {
    messages: (await import(`./messages/${locale}.json`)).default,
    timeZone: 'UTC'
  };
});
