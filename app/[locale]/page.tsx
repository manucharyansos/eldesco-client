import type { Metadata } from 'next';
import { getPage, getServices } from '@/lib/cms';
import { isLocale } from '@/lib/config';
import { firstImage, pageMetadata } from '@/lib/seo';
import { LiveCmsPage } from '@/components/live/LivePages';
import { notFound } from 'next/navigation';

type Props = { params: { locale: string } };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  if (!isLocale(params.locale)) return {};
  const page = await getPage('home', params.locale);
  return pageMetadata({ locale: params.locale, path: '', title: page?.meta_title, absoluteTitle: true, description: page?.meta_description, image: firstImage(page) });
}

export default async function HomePage({ params }: Props) {
  if (!isLocale(params.locale)) notFound();
  const locale = params.locale;
  const [page, services] = await Promise.all([getPage('home', locale), getServices(locale)]);
  return <LiveCmsPage locale={locale} slug="home" initialPage={page} initialServices={services} home />;
}
