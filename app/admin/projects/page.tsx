'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { apiClient } from '@/lib/api';

type RawProject = {
  id: number;
  title_hy: string;
  title_en: string;
  title_ru?: string | null;
  description_hy?: string | null;
  image_url?: string | null;
  category?: string | null;
  featured: boolean;
  order_index?: number | null;
};

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<RawProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<number | null>(null);
  const [error, setError] = useState('');

  const load = async () => {
    try { setLoading(true); const response = await apiClient.getAdminProjects(); setProjects(response.data ?? []); }
    catch { setError('Չհաջողվեց բեռնել նախագծերը։'); }
    finally { setLoading(false); }
  };

  useEffect(() => { void load(); }, []);

  const remove = async (id: number) => {
    if (!confirm('Ջնջե՞լ այս նախագիծը։')) return;
    try { setDeleting(id); await apiClient.deleteProject(id); setProjects((current) => current.filter((item) => item.id !== id)); }
    catch { setError('Նախագիծը չհաջողվեց ջնջել։'); }
    finally { setDeleting(null); }
  };

  return (
    <div className="space-y-7">
      <div className="flex flex-wrap items-end justify-between gap-5">
        <div><p className="text-[11px] font-extrabold uppercase tracking-[.24em] text-orange-600">Պորտֆոլիո</p><h2 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">Նախագծեր</h2><p className="mt-3 text-sm text-slate-500">Ավելացրու իրականացված աշխատանքները, նկարները, կատեգորիաները և երեք լեզուների նկարագրությունները։</p></div>
        <Link href="/admin/projects/edit" className="rounded-2xl bg-slate-950 px-5 py-3.5 text-sm font-extrabold text-white shadow-xl transition hover:bg-orange-500">+ Նոր նախագիծ</Link>
      </div>

      {error && <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700">{error}</div>}

      {loading ? <div className="rounded-[28px] border border-slate-200 bg-white p-10 text-sm text-slate-500">Բեռնվում է…</div> : (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {projects.map((project, index) => (
            <article key={project.id} className="group overflow-hidden rounded-[26px] border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl">
              <div className="relative h-48 overflow-hidden bg-slate-900">
                {project.image_url ? <img src={project.image_url} alt="" className="h-full w-full object-cover transition duration-700 group-hover:scale-105" /> : <div className="flex h-full items-center justify-center bg-[radial-gradient(circle_at_70%_30%,rgba(249,115,22,.22),transparent_35%)] text-4xl font-black text-white/20">{String(index + 1).padStart(2, '0')}</div>}
                <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-slate-950/80 to-transparent" />
                <div className="absolute left-4 top-4 flex gap-2">{project.featured && <span className="rounded-full bg-orange-500 px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider text-white">Առաջարկվող</span>}{project.category && <span className="rounded-full bg-white/90 px-3 py-1 text-[10px] font-bold text-slate-800 backdrop-blur">{project.category}</span>}</div>
              </div>
              <div className="p-5">
                <div className="flex items-start justify-between gap-3"><h3 className="text-lg font-extrabold leading-6 text-slate-950">{project.title_hy || project.title_en}</h3><span className="text-[10px] font-bold text-slate-400">#{project.order_index ?? index + 1}</span></div>
                <p className="mt-2 line-clamp-2 min-h-10 text-xs leading-5 text-slate-500">{project.description_hy || 'Նկարագրություն չկա'}</p>
                <div className="mt-5 flex gap-2 border-t border-slate-100 pt-4"><Link href={`/admin/projects/edit?id=${project.id}`} className="flex-1 rounded-xl border border-slate-200 px-3 py-2.5 text-center text-xs font-bold text-slate-700 transition hover:border-orange-200 hover:text-orange-600">Խմբագրել</Link><button onClick={() => void remove(project.id)} disabled={deleting === project.id} className="rounded-xl border border-red-100 px-3 py-2.5 text-xs font-bold text-red-500 transition hover:bg-red-50 disabled:opacity-50">{deleting === project.id ? '…' : 'Ջնջել'}</button></div>
              </div>
            </article>
          ))}
          {!projects.length && <div className="rounded-[26px] border border-dashed border-slate-300 bg-white p-10 text-center text-sm text-slate-500 md:col-span-2 xl:col-span-3">Դեռ նախագիծ չկա։</div>}
        </div>
      )}
    </div>
  );
}
