import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';
import { notFound } from 'next/navigation';
import '@fontsource-variable/manrope';
import '@fontsource-variable/noto-sans-armenian';
import '../globals.css';
import { HTML_LANG, LOCALES, OG_LOCALE, SITE_URL, isLocale } from '@/lib/config';
import { getSite, str } from '@/lib/cms';
import { mediaUrl } from '@/lib/media';
import { LiveSiteShell } from '@/components/live/LiveSiteShell';


export const viewport: Viewport = { width: 'device-width', initialScale: 1, themeColor: '#0B2545' };

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  if (!isLocale(params.locale)) return {};
  const locale = params.locale;
  const site = await getSite(locale);
  const name = str(site.settings['seo.site_name']) || str(site.settings['company.name']) || 'ELDESCO';
  const description = str(site.settings['seo.default_description']) || str(site.settings['company.tagline']);
  const og = mediaUrl(str(site.settings['seo.og_image']));

  return {
    metadataBase: new URL(SITE_URL),
    title: { default: name, template: `%s | ${name}` },
    description,
    openGraph: {
      type: 'website',
      siteName: name,
      locale: OG_LOCALE[locale],
      title: name,
      description,
      images: og ? [{ url: og.startsWith('http') ? og : `${SITE_URL}${og}` }] : undefined,
    },
    twitter: { card: 'summary_large_image' },
  };
}

export default async function LocaleLayout({ children, params }: { children: ReactNode; params: { locale: string } }) {
  if (!isLocale(params.locale)) notFound();
  const locale = params.locale;
  const site = await getSite(locale);

  return (
    <html lang={HTML_LANG[locale]}>
      <body className="flex min-h-screen flex-col">
        <LiveSiteShell initialSite={site} locale={locale}>{children}</LiveSiteShell>
      </body>
    </html>
  );
}
