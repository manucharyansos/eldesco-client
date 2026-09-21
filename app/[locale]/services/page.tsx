import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getPage, getServices } from '@/lib/cms';
import { isLocale } from '@/lib/config';
import { firstImage, pageMetadata } from '@/lib/seo';
import { LiveCmsPage } from '@/components/live/LivePages';

type Props = { params: { locale: string } };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  if (!isLocale(params.locale)) return {};
  const page = await getPage('services', params.locale);
  return pageMetadata({ locale: params.locale, path: 'services', title: page?.meta_title || page?.title, description: page?.meta_description, image: firstImage(page) });
}

export default async function ServicesPage({ params }: Props) {
  if (!isLocale(params.locale)) notFound();
  const [page, services] = await Promise.all([getPage('services', params.locale), getServices(params.locale)]);
  if (!page) notFound();
  return <LiveCmsPage locale={params.locale} slug="services" initialPage={page} initialServices={services} />;
}
