'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { apiClient } from '@/lib/api';

type Localized = { hy?: string; en?: string; ru?: string };
type PageRow = {
  id: number;
  slug: string;
  title?: string | Localized;
  is_published: boolean;
  sections?: unknown[];
};

function displayTitle(title: PageRow['title']) {
  if (typeof title === 'string') return title;
  return title?.hy || title?.en || title?.ru || 'Առանց վերնագրի';
}

export default function PagesManager() {
  const [pages, setPages] = useState<PageRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = async () => {
    try {
      const response = await apiClient.getAdminPages();
      setPages(response.data?.data ?? response.data ?? []);
    } catch {
      setError('Չհաջողվեց բեռնել էջերը։');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { void load(); }, []);

  const remove = async (id: number) => {
    if (!confirm('Վստա՞հ ես, որ ուզում ես ջնջել այս էջը։')) return;
    await apiClient.deletePage(id);
    setPages((current) => current.filter((page) => page.id !== id));
  };

  return (
    <div className="space-y-7">
      <div className="flex flex-wrap items-end justify-between gap-5">
        <div>
          <p className="text-[11px] font-extrabold uppercase tracking-[.24em] text-orange-600">Բովանդակության կառավարում</p>
          <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">Կայքի էջեր</h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500">Կառավարիր էջերի վերնագրերը, SEO-ն, բաժինները և երեք լեզուների բովանդակությունը մեկ տեղից։</p>
        </div>
        <Link href="/admin/pages/edit" className="inline-flex items-center gap-2 rounded-2xl bg-slate-950 px-5 py-3.5 text-sm font-extrabold text-white shadow-xl shadow-slate-950/10 transition hover:bg-orange-500">
          <span className="text-lg leading-none">+</span> Նոր էջ
        </Link>
      </div>

      {error && <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700">{error}</div>}

      <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm">
        <div className="hidden grid-cols-[1.4fr_.7fr_.45fr_.55fr] gap-4 border-b border-slate-100 bg-slate-50/70 px-6 py-3.5 text-[10px] font-extrabold uppercase tracking-[.18em] text-slate-400 md:grid">
          <span>Էջ</span><span>Հասցե</span><span>Վիճակ</span><span className="text-right">Գործողություն</span>
        </div>

        {loading ? (
          <div className="p-10 text-sm text-slate-500">Բեռնվում է…</div>
        ) : pages.length ? (
          pages.map((page) => (
            <div key={page.id} className="group grid gap-4 border-b border-slate-100 px-6 py-5 transition last:border-0 hover:bg-slate-50/60 md:grid-cols-[1.4fr_.7fr_.45fr_.55fr] md:items-center">
              <div>
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-950 text-xs font-black text-white transition group-hover:bg-orange-500">{String(page.id).padStart(2, '0')}</span>
                  <div>
                    <strong className="block text-sm text-slate-950">{displayTitle(page.title)}</strong>
                    <span className="mt-1 block text-xs text-slate-400">{page.sections?.length ?? 0} բաժին</span>
                  </div>
                </div>
              </div>
              <div className="text-sm font-medium text-slate-600">{page.slug === 'home' ? '/' : `/${page.slug}`}</div>
              <div>
                <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold ${page.is_published ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                  <span className={`h-1.5 w-1.5 rounded-full ${page.is_published ? 'bg-emerald-500' : 'bg-slate-400'}`} />
                  {page.is_published ? 'Հրապարակված' : 'Սևագիր'}
                </span>
              </div>
              <div className="flex gap-2 md:justify-end">
                <Link href={`/admin/pages/edit?id=${page.id}`} className="rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 transition hover:border-orange-200 hover:text-orange-600">Խմբագրել</Link>
                {page.slug !== 'home' && <button onClick={() => void remove(page.id)} className="rounded-xl border border-red-100 bg-white px-3.5 py-2 text-xs font-bold text-red-500 transition hover:bg-red-50">Ջնջել</button>}
              </div>
            </div>
          ))
        ) : (
          <div className="p-10 text-center">
            <p className="font-bold text-slate-800">Դեռ էջ չկա</p>
            <p className="mt-2 text-sm text-slate-500">Ստեղծիր առաջին CMS էջը։</p>
          </div>
        )}
      </div>
    </div>
  );
}
