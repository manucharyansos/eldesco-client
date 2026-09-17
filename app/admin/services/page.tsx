'use client';

import { useEffect, useState } from 'react';
import { apiClient } from '@/lib/api';

type RawService = {
  id: number;
  title_hy: string;
  title_en: string;
  title_ru?: string | null;
  description_hy?: string | null;
  description_en?: string | null;
  description_ru?: string | null;
  icon?: string | null;
  order_index?: number | null;
};

type FormState = {
  title_hy: string; title_en: string; title_ru: string;
  description_hy: string; description_en: string; description_ru: string;
  icon: string; order_index: number;
};

type Lang = 'hy' | 'en' | 'ru';
const emptyForm = (): FormState => ({ title_hy: '', title_en: '', title_ru: '', description_hy: '', description_en: '', description_ru: '', icon: '', order_index: 0 });
const langLabel: Record<Lang, string> = { hy: 'Հայերեն', en: 'English', ru: 'Русский' };

export default function AdminServicesPage() {
  const [services, setServices] = useState<RawService[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | 'new' | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm());
  const [lang, setLang] = useState<Lang>('hy');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const load = async () => {
    try {
      setLoading(true);
      const response = await apiClient.getAdminServices();
      setServices(response.data ?? []);
    } catch {
      setError('Չհաջողվեց բեռնել ծառայությունները։');
    } finally { setLoading(false); }
  };

  useEffect(() => { void load(); }, []);

  const edit = (service: RawService) => {
    setEditingId(service.id);
    setForm({
      title_hy: service.title_hy || '', title_en: service.title_en || '', title_ru: service.title_ru || '',
      description_hy: service.description_hy || '', description_en: service.description_en || '', description_ru: service.description_ru || '',
      icon: service.icon || '', order_index: service.order_index || 0,
    });
    setLang('hy'); setError('');
  };

  const startNew = () => { setEditingId('new'); setForm({ ...emptyForm(), order_index: services.length + 1 }); setLang('hy'); setError(''); };

  const save = async () => {
    if (!form.title_hy.trim() || !form.title_en.trim()) { setError('Հայերեն և անգլերեն վերնագրերը պարտադիր են։'); return; }
    setSaving(true); setError('');
    try {
      if (editingId === 'new') await apiClient.createService(form);
      else if (typeof editingId === 'number') await apiClient.updateService(editingId, form);
      setEditingId(null); setForm(emptyForm()); await load();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Պահպանումը չհաջողվեց։');
    } finally { setSaving(false); }
  };

  const remove = async (id: number) => {
    if (!confirm('Ջնջե՞լ այս ծառայությունը։')) return;
    try { await apiClient.deleteService(id); setServices((current) => current.filter((item) => item.id !== id)); }
    catch { setError('Ծառայությունը չհաջողվեց ջնջել։'); }
  };

  return (
    <div className="space-y-7">
      <div className="flex flex-wrap items-end justify-between gap-5">
        <div><p className="text-[11px] font-extrabold uppercase tracking-[.24em] text-orange-600">Կատալոգ</p><h2 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">Ծառայություններ</h2><p className="mt-3 text-sm text-slate-500">Կառավարիր ծառայությունների երեք լեզուները, հերթականությունը և նկարագրությունները։</p></div>
        <button onClick={startNew} className="rounded-2xl bg-slate-950 px-5 py-3.5 text-sm font-extrabold text-white shadow-xl transition hover:bg-orange-500">+ Նոր ծառայություն</button>
      </div>

      {error && <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700">{error}</div>}

      <div className={`grid gap-6 ${editingId !== null ? 'xl:grid-cols-[.9fr_1.1fr]' : ''}`}>
        <section className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm">
          {loading ? <div className="p-10 text-sm text-slate-500">Բեռնվում է…</div> : services.map((service, index) => (
            <div key={service.id} className={`group flex items-center gap-4 border-b border-slate-100 p-5 last:border-0 transition ${editingId === service.id ? 'bg-orange-50/60' : 'hover:bg-slate-50/60'}`}>
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-slate-950 text-lg text-white">{service.icon || String(index + 1).padStart(2, '0')}</div>
              <div className="min-w-0 flex-1"><h3 className="truncate font-extrabold text-slate-950">{service.title_hy}</h3><p className="mt-1 line-clamp-1 text-xs text-slate-500">{service.description_hy || 'Նկարագրություն չկա'}</p></div>
              <div className="hidden text-xs font-bold text-slate-400 sm:block">#{service.order_index ?? index + 1}</div>
              <div className="flex gap-2"><button onClick={() => edit(service)} className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-bold text-slate-700 hover:border-orange-200 hover:text-orange-600">Խմբագրել</button><button onClick={() => void remove(service.id)} className="rounded-xl border border-red-100 px-3 py-2 text-xs font-bold text-red-500 hover:bg-red-50">Ջնջել</button></div>
            </div>
          ))}
          {!loading && !services.length && <div className="p-10 text-center text-sm text-slate-500">Ծառայություններ դեռ չկան։</div>}
        </section>

        {editingId !== null && (
          <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm sm:p-7">
            <div className="flex items-start justify-between gap-4"><div><p className="text-[10px] font-extrabold uppercase tracking-[.2em] text-orange-600">{editingId === 'new' ? 'Նոր գրառում' : 'Խմբագրում'}</p><h3 className="mt-2 text-2xl font-black">{editingId === 'new' ? 'Նոր ծառայություն' : 'Ծառայության տվյալներ'}</h3></div><button onClick={() => setEditingId(null)} className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-lg text-slate-500 hover:bg-slate-200">×</button></div>

            <div className="mt-6 flex rounded-xl bg-slate-100 p-1">{(['hy','en','ru'] as Lang[]).map((item) => <button key={item} onClick={() => setLang(item)} className={`flex-1 rounded-lg px-3 py-2 text-xs font-bold transition ${lang === item ? 'bg-white text-slate-950 shadow-sm' : 'text-slate-500'}`}>{langLabel[item]}</button>)}</div>

            <div className="mt-6 space-y-5">
              <label className="block"><span className="mb-2 block text-sm font-bold text-slate-700">Վերնագիր · {langLabel[lang]}</span><input value={form[`title_${lang}`]} onChange={(e) => setForm({ ...form, [`title_${lang}`]: e.target.value })} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-orange-400 focus:bg-white focus:ring-4 focus:ring-orange-100" /></label>
              <label className="block"><span className="mb-2 block text-sm font-bold text-slate-700">Նկարագրություն · {langLabel[lang]}</span><textarea value={form[`description_${lang}`]} onChange={(e) => setForm({ ...form, [`description_${lang}`]: e.target.value })} rows={7} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-6 outline-none focus:border-orange-400 focus:bg-white focus:ring-4 focus:ring-orange-100" /></label>
              <div className="grid gap-4 sm:grid-cols-2"><label><span className="mb-2 block text-sm font-bold text-slate-700">Icon / նշան</span><input value={form.icon} onChange={(e) => setForm({ ...form, icon: e.target.value })} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3" placeholder="⚡" /></label><label><span className="mb-2 block text-sm font-bold text-slate-700">Հերթականություն</span><input type="number" value={form.order_index} onChange={(e) => setForm({ ...form, order_index: Number(e.target.value) })} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3" /></label></div>
            </div>

            <div className="mt-7 flex gap-3 border-t border-slate-100 pt-5"><button onClick={() => setEditingId(null)} className="flex-1 rounded-2xl border border-slate-200 px-5 py-3 text-sm font-bold text-slate-700">Չեղարկել</button><button onClick={() => void save()} disabled={saving} className="flex-1 rounded-2xl bg-slate-950 px-5 py-3 text-sm font-extrabold text-white transition hover:bg-orange-500 disabled:opacity-50">{saving ? 'Պահպանվում է…' : 'Պահպանել'}</button></div>
          </section>
        )}
      </div>
    </div>
  );
}
