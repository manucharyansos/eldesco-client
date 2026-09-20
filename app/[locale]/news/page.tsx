import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { API_URL, isLocale } from '@/lib/config';
import { getSite } from '@/lib/cms';
import { makeUi } from '@/lib/defaults';
import { pageMetadata } from '@/lib/seo';
import { formatDate } from '@/lib/utils';
import { Img } from '@/components/common/Img';
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
  const [items, site] = await Promise.all([loadNews(params.locale), getSite(params.locale)]);
  const ui = makeUi(site.settings, params.locale);

  return (
    <>
      <section className="page-hero"><div className="page-hero-shade" /><div className="container py-16 md:py-24"><h1 className="h-page">{ui('news_title')}</h1></div></section>
      <section className="section">
        <div className="container">
          {items.length === 0 ? <p className="lead">{ui('no_items')}</p> : (
            <ul className="grid gap-x-8 gap-y-12 md:grid-cols-2 lg:grid-cols-3">
              {items.map((n) => (
                <li key={n.id}>
                  {n.image && <div className="aspect-[16/10] overflow-hidden rounded-md bg-steel-100"><Img src={n.image} alt="" className="h-full w-full object-cover" /></div>}
                  <p className="mt-5 text-sm font-semibold text-steel-500">{formatDate(n.createdAt, params.locale)}</p>
                  <h2 className="h-item mt-1">{n.title}</h2>
                  {n.excerpt && <p className="mt-3 line-clamp-4 leading-7 text-steel-600">{n.excerpt}</p>}
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </>
  );
}
