import type { ReactNode } from 'react';
import { notFound } from 'next/navigation';
import { getSite } from '@/lib/cms';
import { SiteHeader } from '@/components/cms/SiteHeader';
import { SiteFooter } from '@/components/cms/SiteFooter';
import type { SitePayload } from '@/types/cms';

const supported = ['hy', 'en', 'ru'] as const;

export default async function LocaleLayout({ children, params }: { children: ReactNode; params: { locale: string } }) {
  if (!supported.includes(params.locale as any)) notFound();

  let site: SitePayload;
  try {
    site = await getSite(params.locale);
  } catch {
    site = {
      locale: params.locale as SitePayload['locale'],
      supported_locales: ['hy', 'en', 'ru'],
      settings: { 'site.name': 'ELDESCO' },
      navigation: [
        { id: 1, slug: 'home', title: params.locale === 'hy' ? 'Գլխավոր' : 'Home' },
        { id: 2, slug: 'about', title: params.locale === 'hy' ? 'Մեր մասին' : 'About' },
        { id: 3, slug: 'activities', title: params.locale === 'hy' ? 'Գործունեություն' : 'Activities' },
        { id: 4, slug: 'contact', title: params.locale === 'hy' ? 'Կապ' : 'Contact' },
      ],
    };
  }

  return (
    <div className="site-frame">
      <SiteHeader site={site} locale={params.locale} />
      <main>{children}</main>
      <SiteFooter site={site} locale={params.locale} />
    </div>
  );
}
