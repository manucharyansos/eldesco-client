'use client';

import Link from 'next/link';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { apiClient } from '@/lib/api';
import { SECTION_SCHEMAS, emptyContent, schemaFor, type FieldDef } from '@/lib/adminSchemas';
import { FieldRenderer, FieldsForm, LangFilterContext, LanguageSwitch, asLocalized, inputCls, type Lang } from '@/components/admin/fields';

type Content = Record<string, unknown>;
type EditableSection = { uid: string; id?: number; type: string; key: string; content: Content; is_enabled: boolean; open: boolean; json: boolean; jsonText: string };
type ApiSection = { id: number; type: string; key?: string | null; content?: Content; is_enabled: boolean; sort_order: number };

let counter = 0;
const uid = () => `s${Date.now()}-${counter++}`;

const META_FIELDS: FieldDef[] = [
  { type: 'localized', key: 'title', label: 'Էջի անվանումը', help: 'Ցուցադրվում է դիտարկչի ներդիրում և որպես էջի վերնագիր, եթե էջում վերնագրի բաժին չկա' },
  { type: 'localized', key: 'seo_title', label: 'SEO վերնագիր (ըստ ցանկության)' },
  { type: 'localized_textarea', key: 'seo_description', label: 'SEO նկարագրություն', help: 'Ցուցադրվում է Google-ի արդյունքներում և հղումը կիսելիս (մինչև 160 նիշ)' },
];

const toEditable = (s: ApiSection, index: number): EditableSection => ({
  uid: uid(), id: s.id, type: s.type, key: s.key ?? '', content: (s.content ?? {}) as Content, is_enabled: s.is_enabled, open: index < 2, json: false, jsonText: '',
});

const summarize = (content: Content): string => {
  const t = content.title;
  const v = asLocalized(t);
  return v.hy || v.en || v.ru || '';
};

export default function PageEditor() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const isNew = params.id === 'new';
  const pageId = isNew ? null : Number(params.id);

  const [slug, setSlug] = useState('');
  const [meta, setMeta] = useState<Content>({ title: { hy: '', en: '', ru: '' }, seo_title: { hy: '', en: '', ru: '' }, seo_description: { hy: '', en: '', ru: '' } });
  const [published, setPublished] = useState(true);
  const [sortOrder, setSortOrder] = useState(0);
  const [sections, setSections] = useState<EditableSection[]>([]);
  const [serviceSlugs, setServiceSlugs] = useState<string[]>([]);
  const [lang, setLang] = useState<'all' | Lang>('all');
  const [addType, setAddType] = useState('text');
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  const apply = useCallback((page: any) => {
    setSlug(page.slug ?? '');
    setMeta({ title: asLocalized(page.title), seo_title: asLocalized(page.seo_title), seo_description: asLocalized(page.seo_description) });
    setPublished(Boolean(page.is_published));
    setSortOrder(page.sort_order ?? 0);
    setSections(([...(page.sections ?? [])] as ApiSection[]).sort((a, b) => a.sort_order - b.sort_order).map(toEditable));
  }, []);

  useEffect(() => {
    apiClient.getAdminServices().then((r) => setServiceSlugs((r.data ?? []).map((s: { slug?: string }) => s.slug).filter(Boolean))).catch(() => undefined);
    if (isNew || !pageId) return;
    (async () => {
      try {
        setLoading(true);
        const response = await apiClient.getAdminPage(pageId);
        apply(response.data?.data ?? response.data);
      } catch { setError('Չհաջողվեց բեռնել էջը։'); }
      finally { setLoading(false); }
    })();
  }, [isNew, pageId, apply]);

  useEffect(() => {
    if (!dirty) return;
    const handler = (e: BeforeUnloadEvent) => { e.preventDefault(); e.returnValue = ''; };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [dirty]);

  const touch = () => { setDirty(true); setNotice(''); };
  const patchSection = (u: string, patch: Partial<EditableSection>) => { touch(); setSections((cur) => cur.map((s) => (s.uid === u ? { ...s, ...patch } : s))); };

  const move = (index: number, delta: number) => {
    const j = index + delta;
    if (j < 0 || j >= sections.length) return;
    touch();
    setSections((cur) => { const next = [...cur]; [next[index], next[j]] = [next[j], next[index]]; return next; });
  };

  const addSection = () => {
    touch();
    setSections((cur) => [...cur, { uid: uid(), type: addType, key: `${addType}-${cur.length + 1}`, content: emptyContent(addType), is_enabled: true, open: true, json: false, jsonText: '' }]);
  };

  const duplicate = (s: EditableSection) => {
    touch();
    setSections((cur) => { const i = cur.findIndex((x) => x.uid === s.uid); const copy = { ...s, uid: uid(), id: undefined, key: `${s.key}-copy`, content: JSON.parse(JSON.stringify(s.content)) }; return [...cur.slice(0, i + 1), copy, ...cur.slice(i + 1)]; });
  };

  const remove = (s: EditableSection) => {
    if (!confirm('Հեռացնե՞լ այս բաժինը էջից։')) return;
    touch();
    setSections((cur) => cur.filter((x) => x.uid !== s.uid));
  };

  const publicPath = useMemo(() => {
    if (!slug) return '';
    if (slug === 'home') return '/hy';
    return serviceSlugs.includes(slug) ? `/hy/services/${slug}` : `/hy/${slug}`;
  }, [slug, serviceSlugs]);

  const save = async () => {
    setError(''); setNotice('');
    const cleanSlug = slug.trim().toLowerCase();
    if (!cleanSlug) { setError('Էջի հասցեն (slug) պարտադիր է։'); return; }
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(cleanSlug)) { setError('Հասցեն կարող է պարունակել միայն լատինական փոքրատառեր, թվեր և գծիկներ (օր.՝ our-team)։'); return; }
    setSaving(true);
    try {
      const payload = {
        slug: cleanSlug, title: meta.title, seo_title: meta.seo_title, seo_description: meta.seo_description,
        is_published: published, sort_order: sortOrder,
        sections: sections.map((s, i) => ({ type: s.type, key: s.key || null, content: s.content, settings: {}, is_enabled: s.is_enabled, sort_order: i })),
      };
      const response = isNew ? await apiClient.createPage(payload) : await apiClient.updatePage(pageId as number, payload);
      const saved = response.data?.data ?? response.data;
      setDirty(false);
      if (isNew && saved?.id) { router.replace(`/admin/pages/${saved.id}`); return; }
      apply(saved);
      setNotice('Պահպանված է։ Փոփոխությունները արդեն երևում են կայքում։');
    } catch (err: any) {
      const errors = err?.response?.data?.errors;
      setError(errors ? Object.values(errors).flat().join(' ') : err?.response?.data?.message || 'Չհաջողվեց պահպանել էջը։');
    } finally { setSaving(false); }
  };

  if (loading) return <div className="rounded-3xl border border-slate-200 bg-white p-10 text-sm text-slate-500">Բեռնվում է…</div>;

  return (
    <LangFilterContext.Provider value={lang}>
      <div className="mx-auto max-w-4xl space-y-7 pb-28">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <Link href="/admin/pages" className="text-sm font-bold text-slate-500 hover:text-orange-600">← Բոլոր էջերը</Link>
            <h2 className="mt-2 text-3xl font-black tracking-tight">{isNew ? 'Նոր էջ' : asLocalized(meta.title).hy || slug}</h2>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <LanguageSwitch value={lang} onChange={setLang} />
            {publicPath && <a href={publicPath} target="_blank" rel="noreferrer" className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 hover:border-orange-300 hover:text-orange-600">Բացել էջը ↗</a>}
          </div>
        </div>

        {error && <div role="alert" className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700">{error}</div>}
        {notice && <div role="status" className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm font-bold text-emerald-700">{notice}</div>}

        <section className="space-y-5 rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <h3 className="text-lg font-black">Էջի տվյալներ</h3>
          <FieldsForm fields={META_FIELDS} value={meta} onChange={(v) => { touch(); setMeta(v); }} />
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="mb-1.5 block text-[13px] font-bold text-slate-700">Էջի հասցե (slug)</span>
              <input value={slug} onChange={(e) => { touch(); setSlug(e.target.value); }} disabled={slug === 'home'} className={`${inputCls} disabled:opacity-60`} placeholder="about" />
              <span className="mt-1.5 block text-xs text-slate-400">{publicPath ? `Հասցեն կայքում՝ ${publicPath}` : 'Միայն լատինական տառեր, թվեր և գծիկներ'}</span>
            </label>
            <label className="block">
              <span className="mb-1.5 block text-[13px] font-bold text-slate-700">Հերթականություն</span>
              <input type="number" value={sortOrder} onChange={(e) => { touch(); setSortOrder(Number(e.target.value)); }} className={inputCls} />
            </label>
          </div>
          <label className="flex cursor-pointer items-center gap-3 rounded-xl bg-slate-50 px-4 py-3">
            <input type="checkbox" checked={published} onChange={(e) => { touch(); setPublished(e.target.checked); }} className="h-4 w-4 accent-orange-500" />
            <span className="text-sm font-bold text-slate-700">Էջը հրապարակված է (երևում է կայքում)</span>
          </label>
        </section>

        <div className="space-y-4">
          <div className="flex items-end justify-between"><h3 className="text-lg font-black">Էջի բաժինները <span className="font-semibold text-slate-400">({sections.length})</span></h3><p className="text-xs text-slate-400">Բաժինները կայքում երևում են այս հերթականությամբ</p></div>

          {sections.map((section, index) => {
            const schema = schemaFor(section.type);
            return (
              <article key={section.uid} className={`rounded-[24px] border bg-white shadow-sm transition ${section.is_enabled ? 'border-slate-200' : 'border-dashed border-slate-300 opacity-70'}`}>
                <div className="flex flex-wrap items-center gap-2 px-4 py-3 sm:px-5">
                  <button type="button" onClick={() => patchSection(section.uid, { open: !section.open })} aria-expanded={section.open} className="flex min-w-0 flex-1 items-center gap-3 text-left">
                    <span className={`text-xs text-slate-400 transition ${section.open ? 'rotate-90' : ''}`}>▶</span>
                    <span className="min-w-0">
                      <span className="block truncate text-[15px] font-extrabold text-slate-900">{schema?.label ?? section.type}</span>
                      <span className="block truncate text-xs text-slate-400">{summarize(section.content) || schema?.description || section.key}</span>
                    </span>
                  </button>
                  <label className="flex cursor-pointer items-center gap-2 rounded-lg px-2 py-1.5 text-xs font-bold text-slate-500" title="Անջատված բաժինը կայքում չի երևա">
                    <input type="checkbox" checked={section.is_enabled} onChange={(e) => patchSection(section.uid, { is_enabled: e.target.checked })} className="h-4 w-4 accent-orange-500" />Երևում է
                  </label>
                  <div className="flex gap-1">
                    <button type="button" onClick={() => move(index, -1)} disabled={index === 0} className="h-9 w-9 rounded-lg text-slate-500 hover:bg-slate-100 disabled:opacity-25" aria-label="Բարձրացնել">↑</button>
                    <button type="button" onClick={() => move(index, 1)} disabled={index === sections.length - 1} className="h-9 w-9 rounded-lg text-slate-500 hover:bg-slate-100 disabled:opacity-25" aria-label="Իջեցնել">↓</button>
                    <button type="button" onClick={() => duplicate(section)} className="h-9 rounded-lg px-2.5 text-xs font-bold text-slate-500 hover:bg-slate-100">Կրկնօրինակել</button>
                    <button type="button" onClick={() => remove(section)} className="h-9 rounded-lg px-2.5 text-xs font-bold text-red-500 hover:bg-red-50">Հեռացնել</button>
                  </div>
                </div>

                {section.open && (
                  <div className="space-y-5 border-t border-slate-100 p-5 sm:p-7">
                    {schema && !section.json ? (
                      <>
                        {schema.description && <p className="rounded-xl bg-slate-50 px-4 py-3 text-xs leading-5 text-slate-500">{schema.description}</p>}
                        <FieldsForm fields={schema.fields} value={section.content} onChange={(next) => patchSection(section.uid, { content: next })} />
                      </>
                    ) : (
                      <label className="block">
                        <span className="mb-1.5 block text-[13px] font-bold text-slate-700">{schema ? 'Բովանդակություն (JSON)' : `«${section.type}» տեսակի բաժինը խմբագրվում է JSON-ով`}</span>
                        <textarea
                          rows={14}
                          spellCheck={false}
                          value={section.jsonText || JSON.stringify(section.content, null, 2)}
                          onChange={(e) => {
                            const text = e.target.value;
                            try { patchSection(section.uid, { jsonText: text, content: JSON.parse(text || '{}') }); setError(''); }
                            catch { patchSection(section.uid, { jsonText: text }); }
                          }}
                          className={`${inputCls} font-mono text-xs leading-5`}
                        />
                      </label>
                    )}
                    <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4">
                      <label className="flex items-center gap-2 text-xs font-bold text-slate-400">Բաժնի ներքին անուն
                        <input value={section.key} onChange={(e) => patchSection(section.uid, { key: e.target.value })} className="w-44 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs font-medium text-slate-600" />
                      </label>
                      {schema && <button type="button" onClick={() => patchSection(section.uid, { json: !section.json, jsonText: '' })} className="text-xs font-bold text-slate-400 hover:text-orange-600">{section.json ? '← Վերադառնալ ձևին' : 'Ընդլայնված՝ JSON'}</button>}
                    </div>
                  </div>
                )}
              </article>
            );
          })}

          <div className="flex flex-wrap items-center gap-3 rounded-[24px] border border-dashed border-slate-300 bg-white/60 p-5">
            <select value={addType} onChange={(e) => setAddType(e.target.value)} className={`${inputCls} !w-auto min-w-[16rem]`} aria-label="Բաժնի տեսակ">
              {SECTION_SCHEMAS.map((s) => <option key={s.type} value={s.type}>{s.label}</option>)}
            </select>
            <button type="button" onClick={addSection} className="rounded-xl bg-slate-950 px-5 py-3 text-sm font-extrabold text-white transition hover:bg-orange-500">+ Ավելացնել բաժին</button>
            <p className="basis-full text-xs text-slate-400 sm:basis-auto">{SECTION_SCHEMAS.find((s) => s.type === addType)?.description}</p>
          </div>
        </div>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-slate-200 bg-white/95 backdrop-blur lg:left-[288px]">
        <div className="mx-auto flex max-w-4xl items-center justify-between gap-4 px-5 py-3.5 sm:px-8">
          <p className="text-sm font-semibold text-slate-500">{dirty ? 'Կան չպահպանված փոփոխություններ' : 'Բոլոր փոփոխությունները պահպանված են'}</p>
          <button type="button" onClick={() => void save()} disabled={saving || (!dirty && !isNew)} className="rounded-2xl bg-slate-950 px-7 py-3 text-sm font-extrabold text-white shadow-xl transition hover:bg-orange-500 disabled:opacity-40">{saving ? 'Պահպանվում է…' : 'Պահպանել'}</button>
        </div>
      </div>
    </LangFilterContext.Provider>
  );
}
