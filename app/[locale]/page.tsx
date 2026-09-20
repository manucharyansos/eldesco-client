import type { Metadata } from 'next';
import Link from 'next/link';
import { getPage, getSite, str } from '@/lib/cms';
import { isLocale } from '@/lib/config';
import { makeUi } from '@/lib/defaults';
import { firstImage, pageMetadata } from '@/lib/seo';
import { PageView } from '@/components/cms/PageView';
import { notFound } from 'next/navigation';

type Props = { params: { locale: string } };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  if (!isLocale(params.locale)) return {};
  const page = await getPage('home', params.locale);
  return pageMetadata({ locale: params.locale, path: '', title: null, description: page?.meta_description, image: firstImage(page) });
}

export default async function HomePage({ params }: Props) {
  if (!isLocale(params.locale)) notFound();
  const locale = params.locale;
  const [page, site] = await Promise.all([getPage('home', locale), getSite(locale)]);

  if (!page) {
    // API unreachable: still show a useful landing screen instead of an error.
    const ui = makeUi(site.settings, locale);
    return (
      <section className="page-hero">
        <div className="page-hero-shade" />
        <div className="container py-24 md:py-32">
          <h1 className="h-display max-w-4xl">{str(site.settings['company.name'])}</h1>
          <p className="lead mt-6 max-w-2xl !text-navy-100">{str(site.settings['company.tagline'])}</p>
          <Link href={`/${locale}/contact`} className="btn btn-primary mt-9">{ui('contact_us')}</Link>
        </div>
      </section>
    );
  }

  return <PageView page={page} locale={locale} site={site} />;
}
