'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { apiClient } from '@/lib/api';

type PageRow = { id: number; slug: string; title: string; is_published: boolean; sections_count?: number };

export default function PagesManager() {
  const [pages, setPages] = useState<PageRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = async () => {
    try {
      const response = await apiClient.getAdminPages();
      setPages(response.data.data ?? response.data ?? []);
    } catch { setError('Չհաջողվեց բեռնել էջերը։'); }
    finally { setLoading(false); }
  };

  useEffect(() => { void load(); }, []);

  const remove = async (id: number) => {
    if (!confirm('Ջնջե՞լ այս էջը։')) return;
    await apiClient.deletePage(id);
    setPages((current) => current.filter((page) => page.id !== id));
  };

  return <div className="space-y-6">
    <div className="flex items-center justify-between gap-4">
      <div><p className="text-sm font-semibold uppercase tracking-[.2em] text-orange-600">ELDESCO CMS</p><h1 className="text-3xl font-bold">Կայքի էջեր</h1><p className="mt-2 text-gray-500">Կառավարիր էջերը, SEO-ն և բոլոր content section-ները մեկ տեղից։</p></div>
      <Link href="/admin/pages/new" className="rounded-xl bg-slate-950 px-5 py-3 font-semibold text-white">+ Նոր էջ</Link>
    </div>
    {error && <div className="rounded-xl bg-red-50 p-4 text-red-700">{error}</div>}
    <div className="overflow-hidden rounded-2xl border bg-white shadow-sm">
      {loading ? <div className="p-8">Բեռնվում է…</div> : pages.map((page) => <div key={page.id} className="flex flex-wrap items-center justify-between gap-4 border-b p-5 last:border-0">
        <div><div className="flex items-center gap-3"><strong>{page.title}</strong><span className={`rounded-full px-2.5 py-1 text-xs ${page.is_published ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-100 text-gray-600'}`}>{page.is_published ? 'Հրապարակված' : 'Draft'}</span></div><div className="mt-1 text-sm text-gray-500">/{page.slug} · {page.sections_count ?? 0} section</div></div>
        <div className="flex gap-2"><Link href={`/admin/pages/${page.id}`} className="rounded-lg border px-4 py-2">Խմբագրել</Link><button onClick={() => void remove(page.id)} className="rounded-lg border border-red-200 px-4 py-2 text-red-600">Ջնջել</button></div>
      </div>)}
      {!loading && !pages.length && <div className="p-8 text-gray-500">Դեռ էջ չկա։ Ստեղծիր առաջին էջը։</div>}
    </div>
  </div>;
}
