'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { apiClient } from '@/lib/api';

type Lang = 'hy' | 'en' | 'ru';
const langLabel: Record<Lang, string> = { hy: 'Հայերեն', en: 'English', ru: 'Русский' };
const API_ORIGIN = (process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api').replace(/\/api\/?$/, '');
const displayImage = (url?: string | null) => url?.startsWith('/storage/') ? `${API_ORIGIN}${url}` : (url || '');

export default function AdminProjectEditPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const projectId = searchParams.get('id') || 'new';
  const isEditMode = projectId !== 'new';

  const [loading, setLoading] = useState(isEditMode);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [preview, setPreview] = useState<string | null>(null);
  const [lang, setLang] = useState<Lang>('hy');
  const [image, setImage] = useState<File | null>(null);
  const [form, setForm] = useState({
    title_hy: '', title_en: '', title_ru: '',
    description_hy: '', description_en: '', description_ru: '',
    category: '', featured: false, order_index: 0,
  });

  useEffect(() => {
    if (!isEditMode) return;
    const load = async () => {
      try {
        setLoading(true);
        const response = await apiClient.getAdminProject(Number(projectId));
        const p = response.data;
        setForm({
          title_hy: p.title_hy || '', title_en: p.title_en || '', title_ru: p.title_ru || '',
          description_hy: p.description_hy || '', description_en: p.description_en || '', description_ru: p.description_ru || '',
          category: p.category || '', featured: Boolean(p.featured), order_index: p.order_index || 0,
        });
        if (p.image_url) setPreview(displayImage(p.image_url));
      } catch { setError('Նախագիծը չհաջողվեց բեռնել։'); }
      finally { setLoading(false); }
    };
    void load();
  }, [isEditMode, projectId]);

  const chooseImage = (file?: File) => {
    if (!file) return;
    setImage(file);
    const reader = new FileReader();
    reader.onload = () => setPreview(String(reader.result || ''));
    reader.readAsDataURL(file);
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); setError('');
    if (!form.title_hy.trim() || !form.title_en.trim()) { setError('Հայերեն և անգլերեն վերնագրերը պարտադիր են։'); return; }
    setSubmitting(true);
    try {
      const data = new FormData();
      data.append('title_hy', form.title_hy); data.append('title_en', form.title_en); data.append('title_ru', form.title_ru);
      data.append('description_hy', form.description_hy); data.append('description_en', form.description_en); data.append('description_ru', form.description_ru);
      data.append('category', form.category); data.append('featured', form.featured ? '1' : '0'); data.append('order_index', String(form.order_index));
      if (image) data.append('image', image);
      if (isEditMode) await apiClient.updateProject(Number(projectId), data); else await apiClient.createProject(data);
      router.push('/admin/projects'); router.refresh();
    } catch (err: any) { setError(err.response?.data?.message || 'Նախագիծը չհաջողվեց պահպանել։'); }
    finally { setSubmitting(false); }
  };

  if (loading) return <div className="rounded-[28px] border border-slate-200 bg-white p-10 text-sm text-slate-500">Բեռնվում է…</div>;

  return (
    <div className="mx-auto max-w-6xl space-y-7">
      <div className="flex flex-wrap items-end justify-between gap-5">
        <div><p className="text-[11px] font-extrabold uppercase tracking-[.24em] text-orange-600">Նախագծերի կառավարում</p><h2 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">{isEditMode ? 'Խմբագրել նախագիծը' : 'Նոր նախագիծ'}</h2></div>
        <button onClick={() => router.push('/admin/projects')} className="rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-700">← Վերադառնալ</button>
      </div>

      {error && <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700">{error}</div>}

      <form onSubmit={submit} className="grid gap-6 xl:grid-cols-[.68fr_1.32fr]">
        <aside className="space-y-6">
          <section className="overflow-hidden rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
            <div className="overflow-hidden rounded-2xl bg-slate-100">
              {preview ? <img src={preview} alt="Preview" className="h-64 w-full object-cover" /> : <div className="flex h-64 items-center justify-center bg-[#08111f] text-center text-sm font-bold text-slate-400">Նախագծի նկար<br/>չի ընտրված</div>}
            </div>
            <label className="mt-4 flex cursor-pointer items-center justify-center rounded-2xl border border-dashed border-slate-300 px-4 py-4 text-sm font-extrabold text-slate-700 transition hover:border-orange-400 hover:bg-orange-50"><span>{image ? image.name : 'Ընտրել / փոխել նկարը'}</span><input type="file" accept="image/*" className="hidden" onChange={(e) => chooseImage(e.target.files?.[0])} /></label>
            <p className="mt-3 text-center text-[11px] text-slate-400">JPG, PNG, WEBP · մինչև 10MB</p>
          </section>

          <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
            <label className="block"><span className="mb-2 block text-sm font-bold text-slate-700">Կատեգորիա</span><input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-orange-400" placeholder="Power Infrastructure" /></label>
            <label className="mt-5 block"><span className="mb-2 block text-sm font-bold text-slate-700">Հերթականություն</span><input type="number" value={form.order_index} onChange={(e) => setForm({ ...form, order_index: Number(e.target.value) })} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-orange-400" /></label>
            <label className="mt-5 flex items-center gap-3 rounded-2xl bg-orange-50 px-4 py-3"><input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} className="h-4 w-4 accent-orange-500"/><span className="text-sm font-bold text-slate-700">Ցուցադրել որպես առաջարկվող նախագիծ</span></label>
          </section>
        </aside>

        <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="flex rounded-xl bg-slate-100 p-1">{(['hy','en','ru'] as Lang[]).map((item) => <button key={item} type="button" onClick={() => setLang(item)} className={`flex-1 rounded-lg px-3 py-2.5 text-xs font-bold transition ${lang === item ? 'bg-white text-slate-950 shadow-sm' : 'text-slate-500'}`}>{langLabel[item]}</button>)}</div>
          <div className="mt-7 space-y-6">
            <label className="block"><span className="mb-2 block text-sm font-bold text-slate-700">Վերնագիր · {langLabel[lang]}</span><input value={form[`title_${lang}`]} onChange={(e) => setForm({ ...form, [`title_${lang}`]: e.target.value })} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 outline-none focus:border-orange-400 focus:bg-white focus:ring-4 focus:ring-orange-100" /></label>
            <label className="block"><span className="mb-2 block text-sm font-bold text-slate-700">Մանրամասն նկարագրություն · {langLabel[lang]}</span><textarea value={form[`description_${lang}`]} onChange={(e) => setForm({ ...form, [`description_${lang}`]: e.target.value })} rows={14} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm leading-7 outline-none focus:border-orange-400 focus:bg-white focus:ring-4 focus:ring-orange-100" /></label>
          </div>
          <div className="mt-8 flex gap-3 border-t border-slate-100 pt-6"><button type="button" onClick={() => router.push('/admin/projects')} className="flex-1 rounded-2xl border border-slate-200 px-5 py-3.5 text-sm font-bold text-slate-700">Չեղարկել</button><button type="submit" disabled={submitting} className="flex-1 rounded-2xl bg-slate-950 px-5 py-3.5 text-sm font-extrabold text-white transition hover:bg-orange-500 disabled:opacity-50">{submitting ? 'Պահպանվում է…' : 'Պահպանել նախագիծը'}</button></div>
        </section>
      </form>
    </div>
  );
}
