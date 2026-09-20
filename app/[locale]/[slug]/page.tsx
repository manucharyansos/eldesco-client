import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getPage, getSite } from '@/lib/cms';
import { LOCALES, isLocale } from '@/lib/config';
import { firstImage, pageMetadata } from '@/lib/seo';
import { PageView } from '@/components/cms/PageView';

type Props = { params: { locale: string; slug: string } };

const STATIC_PAGES = ['about', 'customers', 'contact'] as const;

export function generateStaticParams() {
  return LOCALES.flatMap((locale) => STATIC_PAGES.map((slug) => ({ locale, slug })));
}

/** Any page created in the admin panel is served here (about, customers, contact, ...). */
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  if (!isLocale(params.locale)) return {};
  const page = await getPage(params.slug, params.locale);
  if (!page) return {};
  return pageMetadata({ locale: params.locale, path: params.slug, title: page.meta_title || page.title, description: page.meta_description, image: firstImage(page) });
}

export default async function CmsPageRoute({ params }: Props) {
  if (!isLocale(params.locale)) notFound();
  const [page, site] = await Promise.all([getPage(params.slug, params.locale), getSite(params.locale)]);
  if (!page) notFound();
  return <PageView page={page} locale={params.locale} site={site} />;
}
