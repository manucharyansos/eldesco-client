import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getPage, getServices } from '@/lib/cms';
import { LOCALES, isLocale } from '@/lib/config';
import { firstImage, pageMetadata } from '@/lib/seo';
import { LiveCmsPage } from '@/components/live/LivePages';

type Props = { params: { locale: string; slug: string } };

const SERVICE_SLUGS = [
  'power-infrastructure',
  'industrial-infrastructure',
  'led-displays',
  'refrigeration',
  'sheet-metal-processing',
] as const;

export async function generateStaticParams() {
  const servicesByLocale = await Promise.all(LOCALES.map(async (locale) => ({ locale, services: await getServices(locale) })));
  const params = servicesByLocale.flatMap(({ locale, services }) => services
    .map((service) => service.slug)
    .filter((slug): slug is string => Boolean(slug))
    .map((slug) => ({ locale, slug })));

  return params.length ? params : LOCALES.flatMap((locale) => SERVICE_SLUGS.map((slug) => ({ locale, slug })));
}

/** A service detail page is the CMS page with the same slug as the service. */
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  if (!isLocale(params.locale)) return {};
  const page = await getPage(params.slug, params.locale);
  if (!page) return {};
  return pageMetadata({ locale: params.locale, path: `services/${params.slug}`, title: page.meta_title || page.title, description: page.meta_description, image: firstImage(page) });
}

export default async function ServiceDetailPage({ params }: Props) {
  if (!isLocale(params.locale)) notFound();
  const [page, services] = await Promise.all([getPage(params.slug, params.locale), getServices(params.locale)]);
  if (!page) notFound();
  return <LiveCmsPage locale={params.locale} slug={params.slug} initialPage={page} initialServices={services} />;
}
