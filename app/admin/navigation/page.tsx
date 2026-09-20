'use client';

import { useEffect, useState } from 'react';
import { apiClient, type AdminNavItem } from '@/lib/api';
import { LangFilterContext, LanguageSwitch, LocalizedInput, asLocalized, inputCls, type Lang } from '@/components/admin/fields';

type Row = { uid: string; label: Record<Lang, string>; link: string; newTab: boolean; enabled: boolean; children: Row[] };
type MenuId = 'header' | 'footer';

let n = 0;
const uid = () => `n${Date.now()}-${n++}`;
const EXTERNAL = /^(https?:|mailto:|tel:)/i;

const toRow = (item: AdminNavItem): Row => ({
  uid: uid(), label: asLocalized(item.label), link: item.url || item.page_slug || '', newTab: item.target === '_blank', enabled: item.is_enabled !== false,
  children: (item.children ?? []).map(toRow),
});

const toApi = (row: Row): AdminNavItem => {
  const link = row.link.trim();
  const external = EXTERNAL.test(link);
  return {
    label: row.label, url: external ? link : null, page_slug: external ? null : link.replace(/^\/+/, '') || null,
    target: row.newTab ? '_blank' : '_self', is_enabled: row.enabled, children: row.children.map(toApi),
  };
};

const blank = (): Row => ({ uid: uid(), label: { hy: '', en: '', ru: '' }, link: '', newTab: false, enabled: true, children: [] });

function RowEditor({ row, index, count, depth, onChange, onMove, onRemove }: { row: Row; index: number; count: number; depth: number; onChange: (r: Row) => void; onMove: (d: number) => void; onRemove: () => void }) {
  const [open, setOpen] = useState(!row.label.hy);
  return (
    <div className={`rounded-2xl border bg-white ${row.enabled ? 'border-slate-200' : 'border-dashed border-slate-300 opacity-70'}`}>
      <div className="flex items-center gap-2 px-3 py-2.5">
        <button type="button" onClick={() => setOpen(!open)} aria-expanded={open} className="flex min-w-0 flex-1 items-center gap-3 text-left">
          <span className={`text-xs text-slate-400 transition ${open ? 'rotate-90' : ''}`}>▶</span>
          <span className="min-w-0 truncate text-sm font-extrabold text-slate-900">{row.label.hy || row.label.en || 'Նոր կետ'}</span>
          <span className="hidden truncate text-xs text-slate-400 sm:block">{row.link}</span>
        </button>
        <label className="flex cursor-pointer items-center gap-1.5 text-xs font-bold text-slate-500"><input type="checkbox" checked={row.enabled} onChange={(e) => onChange({ ...row, enabled: e.target.checked })} className="h-4 w-4 accent-orange-500" />Երևում է</label>
        <button type="button" onClick={() => onMove(-1)} disabled={index === 0} className="h-8 w-8 rounded-lg text-slate-500 hover:bg-slate-100 disabled:opacity-25" aria-label="Վերև">↑</button>
        <button type="button" onClick={() => onMove(1)} disabled={index === count - 1} className="h-8 w-8 rounded-lg text-slate-500 hover:bg-slate-100 disabled:opacity-25" aria-label="Ներքև">↓</button>
        <button type="button" onClick={() => { if (confirm('Հեռացնե՞լ մենյուի այս կետը։')) onRemove(); }} className="h-8 w-8 rounded-lg text-red-400 hover:bg-red-50" aria-label="Հեռացնել">×</button>
      </div>
      {open && (
        <div className="space-y-4 border-t border-slate-100 p-4">
          <div><span className="mb-1.5 block text-[13px] font-bold text-slate-700">Անվանում</span><LocalizedInput value={row.label} onChange={(label) => onChange({ ...row, label })} /></div>
          <label className="block">
            <span className="mb-1.5 block text-[13px] font-bold text-slate-700">Հղում</span>
            <input value={row.link} list="nav-links" onChange={(e) => onChange({ ...row, link: e.target.value })} className={inputCls} placeholder="about, services/led-displays, https://…" />
            <span className="mt-1.5 block text-xs text-slate-400">Կայքի էջի հասցեն (առանց լեզվի) կամ ամբողջական հղում։ Գլխավոր էջի համար՝ home։</span>
          </label>
          <label className="flex cursor-pointer items-center gap-3 text-sm font-bold text-slate-700"><input type="checkbox" checked={row.newTab} onChange={(e) => onChange({ ...row, newTab: e.target.checked })} className="h-4 w-4 accent-orange-500" />Բացել նոր ներդիրում</label>
          {depth === 0 && (
            <div className="rounded-xl bg-slate-50 p-3">
              <p className="mb-2 text-xs font-bold text-slate-500">Ենթամենյու (բացվող ցանկ)</p>
              <div className="space-y-2">
                {row.children.map((child, i) => (
                  <RowEditor key={child.uid} row={child} index={i} count={row.children.length} depth={1}
                    onChange={(r) => onChange({ ...row, children: row.children.map((c) => (c.uid === child.uid ? r : c)) })}
                    onMove={(d) => { const j = i + d; if (j < 0 || j >= row.children.length) return; const next = [...row.children]; [next[i], next[j]] = [next[j], next[i]]; onChange({ ...row, children: next }); }}
                    onRemove={() => onChange({ ...row, children: row.children.filter((c) => c.uid !== child.uid) })} />
                ))}
              </div>
              <button type="button" onClick={() => onChange({ ...row, children: [...row.children, blank()] })} className="mt-2 text-xs font-bold text-slate-500 hover:text-orange-600">+ Ենթակետ</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function NavigationPage() {
  const [menus, setMenus] = useState<Record<MenuId, Row[]>>({ header: [], footer: [] });
  const [menu, setMenu] = useState<MenuId>('header');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [lang, setLang] = useState<'all' | Lang>('all');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const [site, pages, services] = await Promise.all([apiClient.getAdminSite(), apiClient.getAdminPages(), apiClient.getAdminServices().catch(() => ({ data: [] }))]);
        setMenus({ header: (site.data.navigation.header ?? []).map(toRow), footer: (site.data.navigation.footer ?? []).map(toRow) });
        const svc = new Set<string>((services.data ?? []).map((s: { slug?: string }) => s.slug).filter(Boolean));
        const list = ((pages.data?.data ?? pages.data ?? []) as Array<{ slug: string }>).map((p) => (svc.has(p.slug) ? `services/${p.slug}` : p.slug));
        setSuggestions(Array.from(new Set([...list, 'projects', 'team', 'news'])));
      } catch { setError('Չհաջողվեց բեռնել մենյուն։'); }
      finally { setLoading(false); }
    })();
  }, []);

  useEffect(() => {
    if (!dirty) return;
    const h = (e: BeforeUnloadEvent) => { e.preventDefault(); e.returnValue = ''; };
    window.addEventListener('beforeunload', h);
    return () => window.removeEventListener('beforeunload', h);
  }, [dirty]);

  const rows = menus[menu];
  const setRows = (next: Row[]) => { setMenus({ ...menus, [menu]: next }); setDirty(true); setNotice(''); };

  const save = async () => {
    setError(''); setNotice('');
    for (const key of ['header', 'footer'] as MenuId[]) {
      for (const r of menus[key]) {
        if (!r.label.hy.trim() && !r.label.en.trim() && !r.label.ru.trim()) { setError('Մենյուի բոլոր կետերը պետք է ունենան անվանում։'); return; }
      }
    }
    setSaving(true);
    try {
      await apiClient.updateNavigation({ header: menus.header.map(toApi), footer: menus.footer.map(toApi) });
      setDirty(false);
      setNotice('Պահպանված է։ Մենյուն արդեն թարմացվել է կայքում։');
    } catch (err: any) {
      const errors = err?.response?.data?.errors;
      setError(errors ? Object.values(errors).flat().join(' ') : 'Չհաջողվեց պահպանել մենյուն։');
    } finally { setSaving(false); }
  };

  if (loading) return <div className="rounded-3xl border border-slate-200 bg-white p-10 text-sm text-slate-500">Բեռնվում է…</div>;

  return (
    <LangFilterContext.Provider value={lang}>
      <div className="mx-auto max-w-4xl space-y-7 pb-28">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-[11px] font-extrabold uppercase tracking-[.24em] text-orange-600">Կայքի կառուցվածք</p>
            <h2 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">Մենյու</h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500">Վերևի մենյուն և footer-ի հղումները։ Կարելի է ավելացնել, տեղափոխել, թաքցնել և ստեղծել բացվող ենթամենյու։</p>
          </div>
          <LanguageSwitch value={lang} onChange={setLang} />
        </div>

        {error && <div role="alert" className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700">{error}</div>}
        {notice && <div role="status" className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm font-bold text-emerald-700">{notice}</div>}

        <div className="inline-flex rounded-2xl bg-white p-1.5 shadow-sm ring-1 ring-slate-200" role="tablist">
          {([['header', 'Վերևի մենյու'], ['footer', 'Footer-ի մենյու']] as Array<[MenuId, string]>).map(([id, label]) => (
            <button key={id} role="tab" aria-selected={menu === id} type="button" onClick={() => setMenu(id)} className={`rounded-xl px-5 py-2.5 text-sm font-bold transition ${menu === id ? 'bg-slate-950 text-white' : 'text-slate-500 hover:bg-slate-100'}`}>{label}</button>
          ))}
        </div>

        <datalist id="nav-links">{suggestions.map((s) => <option key={s} value={s} />)}</datalist>

        <div className="space-y-3">
          {rows.map((row, i) => (
            <RowEditor key={row.uid} row={row} index={i} count={rows.length} depth={menu === 'header' ? 0 : 1}
              onChange={(r) => setRows(rows.map((x) => (x.uid === row.uid ? r : x)))}
              onMove={(d) => { const j = i + d; if (j < 0 || j >= rows.length) return; const next = [...rows]; [next[i], next[j]] = [next[j], next[i]]; setRows(next); }}
              onRemove={() => setRows(rows.filter((x) => x.uid !== row.uid))} />
          ))}
          <button type="button" onClick={() => setRows([...rows, blank()])} className="rounded-xl border border-dashed border-slate-300 px-5 py-3 text-sm font-bold text-slate-600 transition hover:border-orange-400 hover:bg-orange-50 hover:text-orange-600">+ Ավելացնել կետ</button>
        </div>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-slate-200 bg-white/95 backdrop-blur lg:left-[288px]">
        <div className="mx-auto flex max-w-4xl items-center justify-between gap-4 px-5 py-3.5 sm:px-8">
          <p className="text-sm font-semibold text-slate-500">{dirty ? 'Կան չպահպանված փոփոխություններ' : 'Բոլոր փոփոխությունները պահպանված են'}</p>
          <button type="button" onClick={() => void save()} disabled={saving || !dirty} className="rounded-2xl bg-slate-950 px-7 py-3 text-sm font-extrabold text-white shadow-xl transition hover:bg-orange-500 disabled:opacity-40">{saving ? 'Պահպանվում է…' : 'Պահպանել'}</button>
        </div>
      </div>
    </LangFilterContext.Provider>
  );
}
