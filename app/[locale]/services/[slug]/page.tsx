import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getPage, getSite } from '@/lib/cms';
import { isLocale } from '@/lib/config';
import { firstImage, pageMetadata } from '@/lib/seo';
import { PageView } from '@/components/cms/PageView';

type Props = { params: { locale: string; slug: string } };

/** A service detail page is the CMS page with the same slug as the service. */
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  if (!isLocale(params.locale)) return {};
  const page = await getPage(params.slug, params.locale);
  if (!page) return {};
  return pageMetadata({ locale: params.locale, path: `services/${params.slug}`, title: page.meta_title || page.title, description: page.meta_description, image: firstImage(page) });
}

export default async function ServiceDetailPage({ params }: Props) {
  if (!isLocale(params.locale)) notFound();
  const [page, site] = await Promise.all([getPage(params.slug, params.locale), getSite(params.locale)]);
  if (!page) notFound();
  return <PageView page={page} locale={params.locale} site={site} />;
}
