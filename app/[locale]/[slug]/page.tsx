import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getPage, getPages, getServices } from '@/lib/cms';
import { LOCALES, isLocale } from '@/lib/config';
import { firstImage, pageMetadata } from '@/lib/seo';
import { LiveCmsPage } from '@/components/live/LivePages';

type Props = { params: { locale: string; slug: string } };

const STATIC_PAGES = ['about', 'customers', 'contact'] as const;
const RESERVED_SLUGS = new Set(['home', 'services', 'projects', 'team', 'news']);

export async function generateStaticParams() {
  const pagesByLocale = await Promise.all(LOCALES.map(async (locale) => ({ locale, pages: await getPages(locale) })));
  const params = pagesByLocale.flatMap(({ locale, pages }) => pages
    .filter((page) => !RESERVED_SLUGS.has(page.slug))
    .map((page) => ({ locale, slug: page.slug })));

  return params.length ? params : LOCALES.flatMap((locale) => STATIC_PAGES.map((slug) => ({ locale, slug })));
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
  const [page, services] = await Promise.all([getPage(params.slug, params.locale), getServices(params.locale)]);
  if (!page) notFound();
  return <LiveCmsPage locale={params.locale} slug={params.slug} initialPage={page} initialServices={services} />;
}
