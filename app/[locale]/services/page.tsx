import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getPage, getSite } from '@/lib/cms';
import { isLocale } from '@/lib/config';
import { firstImage, pageMetadata } from '@/lib/seo';
import { PageView } from '@/components/cms/PageView';

type Props = { params: { locale: string } };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  if (!isLocale(params.locale)) return {};
  const page = await getPage('services', params.locale);
  return pageMetadata({ locale: params.locale, path: 'services', title: page?.meta_title || page?.title, description: page?.meta_description, image: firstImage(page) });
}

export default async function ServicesPage({ params }: Props) {
  if (!isLocale(params.locale)) notFound();
  const [page, site] = await Promise.all([getPage('services', params.locale), getSite(params.locale)]);
  if (!page) notFound();
  return <PageView page={page} locale={params.locale} site={site} />;
}
