'use client';

import { useEffect, useMemo, useState } from 'react';
import { apiClient } from '@/lib/api';
import { SETTINGS_GROUPS, UI_KEYS, UI_LABEL_HELP } from '@/lib/adminSchemas';
import { UI_DEFAULTS } from '@/lib/defaults';
import { FieldsForm, LangFilterContext, LanguageSwitch, LocalizedInput, asLocalized, type Lang } from '@/components/admin/fields';

type Values = Record<string, unknown>;
type UiValues = Record<string, Record<Lang, string>>;

const UI_TAB = 'ui';

export default function SettingsPage() {
  const [tab, setTab] = useState<string>(SETTINGS_GROUPS[0].id);
  const [values, setValues] = useState<Values>({});
  const [ui, setUi] = useState<UiValues>({});
  const [stored, setStored] = useState<Set<string>>(new Set());
  const [lang, setLang] = useState<'all' | Lang>('all');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const { data } = await apiClient.getAdminSite();
        const v: Values = {};
        for (const [key, row] of Object.entries(data.settings ?? {})) v[key] = row.value;
        setValues(v);
        const labels: UiValues = {};
        const have = new Set<string>();
        for (const key of UI_KEYS) {
          const raw = v[`ui.${key}`];
          const d = UI_DEFAULTS[key];
          const s = raw ? asLocalized(raw) : { hy: '', en: '', ru: '' };
          if (raw) have.add(key);
          labels[key] = { hy: s.hy || d.hy, en: s.en || d.en, ru: s.ru || d.ru };
        }
        setUi(labels); setStored(have);
      } catch { setError('Չհաջողվեց բեռնել կարգավորումները։'); }
      finally { setLoading(false); }
    })();
  }, []);

  useEffect(() => {
    if (!dirty) return;
    const h = (e: BeforeUnloadEvent) => { e.preventDefault(); e.returnValue = ''; };
    window.addEventListener('beforeunload', h);
    return () => window.removeEventListener('beforeunload', h);
  }, [dirty]);

  const group = useMemo(() => SETTINGS_GROUPS.find((g) => g.id === tab), [tab]);

  const save = async () => {
    setSaving(true); setError(''); setNotice('');
    try {
      const payload: Values = {};
      for (const g of SETTINGS_GROUPS) for (const f of g.fields) if (values[f.key] !== undefined) payload[f.key] = values[f.key];
      for (const key of UI_KEYS) {
        const d = UI_DEFAULTS[key];
        const v = ui[key];
        if (!v) continue;
        const changed = v.hy !== d.hy || v.en !== d.en || v.ru !== d.ru;
        if (changed || stored.has(key)) payload[`ui.${key}`] = { hy: v.hy || d.hy, en: v.en || d.en, ru: v.ru || d.ru };
      }
      await apiClient.updateSiteSettings(payload);
      setDirty(false);
      setNotice('Պահպանված է։ Փոփոխությունները արդեն երևում են կայքում։');
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Չհաջողվեց պահպանել կարգավորումները։');
    } finally { setSaving(false); }
  };

  if (loading) return <div className="rounded-3xl border border-slate-200 bg-white p-10 text-sm text-slate-500">Բեռնվում է…</div>;

  return (
    <LangFilterContext.Provider value={lang}>
      <div className="mx-auto max-w-4xl space-y-7 pb-28">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-[11px] font-extrabold uppercase tracking-[.24em] text-orange-600">Ամբողջ կայքի համար</p>
            <h2 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">Կայքի կարգավորումներ</h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500">Ընկերության տվյալներ, կոնտակտներ, լոգո, footer և կայքի բոլոր կրկնվող տեքստերը։ Այստեղ փոխածը փոխվում է բոլոր էջերում։</p>
          </div>
          <LanguageSwitch value={lang} onChange={setLang} />
        </div>

        {error && <div role="alert" className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700">{error}</div>}
        {notice && <div role="status" className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm font-bold text-emerald-700">{notice}</div>}

        <div className="flex gap-1 overflow-x-auto rounded-2xl bg-white p-1.5 shadow-sm ring-1 ring-slate-200" role="tablist">
          {[...SETTINGS_GROUPS.map((g) => ({ id: g.id, label: g.label })), { id: UI_TAB, label: 'Ինտերֆեյսի տեքստեր' }].map((t) => (
            <button key={t.id} role="tab" aria-selected={tab === t.id} type="button" onClick={() => setTab(t.id)} className={`whitespace-nowrap rounded-xl px-4 py-2.5 text-sm font-bold transition ${tab === t.id ? 'bg-slate-950 text-white' : 'text-slate-500 hover:bg-slate-100'}`}>{t.label}</button>
          ))}
        </div>

        <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          {group && <FieldsForm fields={group.fields} value={values} onChange={(v) => { setValues(v); setDirty(true); setNotice(''); }} />}

          {tab === UI_TAB && (
            <div className="space-y-6">
              <p className="rounded-xl bg-slate-50 px-4 py-3 text-xs leading-5 text-slate-500">Կոճակների, մենյուների և համակարգային հաղորդագրությունների տեքստերը։ Լռելյայն արժեքները արդեն լրացված են՝ փոխեք միայն անհրաժեշտները։</p>
              {UI_KEYS.map((key) => (
                <div key={key} className="border-t border-slate-100 pt-5 first:border-0 first:pt-0">
                  <p className="mb-2 text-[13px] font-bold text-slate-700">{UI_LABEL_HELP[key] ?? key.replace(/_/g, ' ')}</p>
                  <LocalizedInput value={ui[key]} onChange={(v) => { setUi((cur) => ({ ...cur, [key]: v })); setDirty(true); setNotice(''); }} />
                </div>
              ))}
            </div>
          )}
        </section>
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
