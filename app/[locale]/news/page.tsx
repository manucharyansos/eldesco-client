import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { API_URL, isLocale } from '@/lib/config';
import { getSite } from '@/lib/cms';
import { makeUi } from '@/lib/defaults';
import { pageMetadata } from '@/lib/seo';
import { LiveNewsPage } from '@/components/live/LivePages';
import type { NewsItem } from '@/types';

type Props = { params: { locale: string } };

async function loadNews(locale: string): Promise<NewsItem[]> {
  try {
    const r = await fetch(`${API_URL}/news?lang=${locale}&limit=30`, { next: { revalidate: 60, tags: ['cms'] } });
    if (!r.ok) return [];
    const body = await r.json();
    return Array.isArray(body) ? body : body?.data ?? [];
  } catch { return []; }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  if (!isLocale(params.locale)) return {};
  const site = await getSite(params.locale);
  return pageMetadata({ locale: params.locale, path: 'news', title: makeUi(site.settings, params.locale)('news_title') });
}

export default async function NewsPage({ params }: Props) {
  if (!isLocale(params.locale)) notFound();
  const items = await loadNews(params.locale);
  return <LiveNewsPage locale={params.locale} initialItems={items} />;
}
