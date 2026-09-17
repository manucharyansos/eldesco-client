'use client';

import { useEffect, useMemo, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { apiClient } from '@/lib/api';

type Localized = { hy: string; en: string; ru: string };
type Lang = keyof Localized;

type EditableSection = {
  id?: number;
  type: string;
  key: string;
  contentText: string;
  is_enabled: boolean;
  sort_order: number;
};

type AdminPage = {
  id: number;
  slug: string;
  title?: Partial<Localized>;
  seo_title?: Partial<Localized>;
  seo_description?: Partial<Localized>;
  is_published: boolean;
  sort_order: number;
  sections?: Array<{
    id: number;
    type: string;
    key?: string | null;
    content?: Record<string, unknown>;
    is_enabled: boolean;
    sort_order: number;
  }>;
};

const emptyLocalized = (): Localized => ({ hy: '', en: '', ru: '' });
const langLabel: Record<Lang, string> = { hy: 'Հայերեն', en: 'English', ru: 'Русский' };

export default function PageEditor() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const isNew = params.id === 'new';
  const pageId = isNew ? null : Number(params.id);

  const [slug, setSlug] = useState('');
  const [title, setTitle] = useState<Localized>(emptyLocalized());
  const [seoTitle, setSeoTitle] = useState<Localized>(emptyLocalized());
  const [seoDescription, setSeoDescription] = useState<Localized>(emptyLocalized());
  const [published, setPublished] = useState(true);
  const [sortOrder, setSortOrder] = useState(0);
  const [sections, setSections] = useState<EditableSection[]>([]);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const heading = useMemo(() => (isNew ? 'Նոր էջ' : `Էջ #${pageId}`), [isNew, pageId]);

  useEffect(() => {
    if (isNew || !pageId) return;

    const load = async () => {
      try {
        setLoading(true);
        const response = await apiClient.getAdminPage(pageId);
        const page: AdminPage = response.data?.data ?? response.data;
        if (!page) throw new Error('Page not found');

        setSlug(page.slug ?? '');
        setTitle({ ...emptyLocalized(), ...(page.title ?? {}) });
        setSeoTitle({ ...emptyLocalized(), ...(page.seo_title ?? {}) });
        setSeoDescription({ ...emptyLocalized(), ...(page.seo_description ?? {}) });
        setPublished(Boolean(page.is_published));
        setSortOrder(page.sort_order ?? 0);
        setSections((page.sections ?? []).map((section) => ({
          id: section.id,
          type: section.type,
          key: section.key ?? '',
          contentText: JSON.stringify(section.content ?? {}, null, 2),
          is_enabled: section.is_enabled,
          sort_order: section.sort_order,
        })));
      } catch {
        setError('Չհաջողվեց բեռնել էջը։');
      } finally {
        setLoading(false);
      }
    };

    void load();
  }, [isNew, pageId]);

  const updateLocalized = (setter: React.Dispatch<React.SetStateAction<Localized>>, lang: Lang, value: string) =>
    setter((current) => ({ ...current, [lang]: value }));

  const updateSection = (index: number, patch: Partial<EditableSection>) => {
    setSections((current) => current.map((section, i) => (i === index ? { ...section, ...patch } : section)));
  };

  const addSection = () => {
    setSections((current) => [
      ...current,
      {
        type: 'intro',
        key: `section-${current.length + 1}`,
        contentText: '{\n  "title": {\n    "hy": "",\n    "en": "",\n    "ru": ""\n  }\n}',
        is_enabled: true,
        sort_order: current.length,
      },
    ]);
  };

  const save = async () => {
    setError('');
    setSaving(true);
    try {
      const parsedSections = sections.map((section, index) => {
        let content: Record<string, unknown> = {};
        try {
          content = JSON.parse(section.contentText || '{}');
        } catch {
          throw new Error(`Բաժին ${index + 1}-ի JSON-ը սխալ է։`);
        }
        return {
          type: section.type,
          key: section.key || null,
          content,
          settings: {},
          is_enabled: section.is_enabled,
          sort_order: section.sort_order,
        };
      });

      const payload = { slug: slug.trim(), title, seo_title: seoTitle, seo_description: seoDescription, is_published: published, sort_order: sortOrder, sections: parsedSections };
      if (!payload.slug) throw new Error('Slug-ը պարտադիր է։');

      if (isNew) await apiClient.createPage(payload);
      else if (pageId) await apiClient.updatePage(pageId, payload);

      router.push('/admin/pages');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Չհաջողվեց պահպանել էջը։');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="rounded-3xl border border-slate-200 bg-white p-10 text-sm text-slate-500">Բեռնվում է…</div>;

  return (
    <div className="space-y-7">
      <div className="flex flex-wrap items-end justify-between gap-5">
        <div>
          <p className="text-[11px] font-extrabold uppercase tracking-[.24em] text-orange-600">CMS խմբագրիչ</p>
          <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">{heading}</h2>
          <p className="mt-3 text-sm text-slate-500">Կառավարիր էջի բովանդակությունը, լեզուները, SEO-ն և բաժինները։</p>
        </div>
        <div className="flex gap-3">
          <button onClick={() => router.push('/admin/pages')} className="rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-50">Չեղարկել</button>
          <button onClick={() => void save()} disabled={saving} className="rounded-2xl bg-slate-950 px-5 py-3 text-sm font-extrabold text-white shadow-lg transition hover:bg-orange-500 disabled:opacity-50">
            {saving ? 'Պահպանվում է…' : 'Պահպանել փոփոխությունները'}
          </button>
        </div>
      </div>

      {error && <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700">{error}</div>}

      <div className="grid gap-6 xl:grid-cols-[1fr_.42fr]">
        <section className="rounded-[26px] border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-[10px] font-extrabold uppercase tracking-[.2em] text-slate-400">Հիմնական կարգավորումներ</p>
          <div className="mt-5 grid gap-5 md:grid-cols-3">
            <label className="md:col-span-2">
              <span className="mb-2 block text-sm font-bold text-slate-700">Slug / URL</span>
              <input value={slug} onChange={(e) => setSlug(e.target.value)} placeholder="about" className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-orange-400 focus:bg-white focus:ring-4 focus:ring-orange-100" />
            </label>
            <label>
              <span className="mb-2 block text-sm font-bold text-slate-700">Դասավորություն</span>
              <input type="number" value={sortOrder} onChange={(e) => setSortOrder(Number(e.target.value))} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-orange-400" />
            </label>
          </div>
          <label className="mt-5 inline-flex items-center gap-3 rounded-xl bg-slate-50 px-4 py-3">
            <input type="checkbox" checked={published} onChange={(e) => setPublished(e.target.checked)} className="h-4 w-4 accent-orange-500" />
            <span className="text-sm font-bold text-slate-700">Հրապարակված է</span>
          </label>
        </section>

        <MediaUploader />
      </div>

      <LocalizedFields title="Էջի վերնագիր" value={title} onChange={(lang, value) => updateLocalized(setTitle, lang, value)} />
      <LocalizedFields title="SEO վերնագիր" value={seoTitle} onChange={(lang, value) => updateLocalized(setSeoTitle, lang, value)} />
      <LocalizedFields title="SEO նկարագրություն" value={seoDescription} multiline onChange={(lang, value) => updateLocalized(setSeoDescription, lang, value)} />

      <section className="space-y-4">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-[10px] font-extrabold uppercase tracking-[.2em] text-orange-600">Էջի կառուցվածք</p>
            <h3 className="mt-2 text-2xl font-black text-slate-950">Բովանդակության բաժիններ</h3>
            <p className="mt-2 text-sm text-slate-500">Միացրու, անջատիր և դասավորիր էջի յուրաքանչյուր բլոկը։</p>
          </div>
          <button onClick={addSection} className="rounded-2xl bg-orange-500 px-4 py-3 text-sm font-extrabold text-white transition hover:bg-orange-600">+ Ավելացնել բաժին</button>
        </div>

        {sections.map((section, index) => (
          <div key={section.id ?? `${section.key}-${index}`} className="rounded-[26px] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-5 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-950 text-xs font-black text-white">{String(index + 1).padStart(2, '0')}</span>
                <div><p className="font-extrabold text-slate-900">{section.key || 'Նոր բաժին'}</p><p className="text-xs text-slate-400">{section.type}</p></div>
              </div>
              <label className="flex items-center gap-2 text-xs font-bold text-slate-600"><input type="checkbox" checked={section.is_enabled} onChange={(e) => updateSection(index, { is_enabled: e.target.checked })} className="accent-orange-500" /> Միացված</label>
            </div>

            <div className="grid gap-4 md:grid-cols-4">
              <label>
                <span className="mb-2 block text-xs font-bold text-slate-500">Տեսակ</span>
                <select value={section.type} onChange={(e) => updateSection(index, { type: e.target.value })} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm outline-none focus:border-orange-400">
                  <option value="hero">Hero</option><option value="intro">Intro</option><option value="rich_text">Rich text</option><option value="services">Services</option><option value="bullets">Bullets</option><option value="stats">Stats</option><option value="customers">Customers</option><option value="timeline">Timeline</option><option value="feature_split">Feature + image</option><option value="company_details">Company details</option><option value="cta">CTA</option><option value="contact">Contact</option>
                </select>
              </label>
              <label className="md:col-span-2"><span className="mb-2 block text-xs font-bold text-slate-500">Key</span><input value={section.key} onChange={(e) => updateSection(index, { key: e.target.value })} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm outline-none focus:border-orange-400" /></label>
              <label><span className="mb-2 block text-xs font-bold text-slate-500">Հերթականություն</span><input type="number" value={section.sort_order} onChange={(e) => updateSection(index, { sort_order: Number(e.target.value) })} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm outline-none focus:border-orange-400" /></label>
            </div>

            <label className="mt-5 block">
              <span className="mb-2 flex items-center justify-between text-xs font-bold text-slate-500"><span>Բովանդակություն (JSON)</span><span className="font-medium text-slate-400">HY / EN / RU</span></span>
              <textarea value={section.contentText} onChange={(e) => updateSection(index, { contentText: e.target.value })} rows={14} spellCheck={false} className="w-full rounded-2xl border border-slate-800 bg-[#08111f] p-4 font-mono text-xs leading-6 text-slate-200 outline-none focus:border-orange-500" />
            </label>

            <button onClick={() => setSections((current) => current.filter((_, i) => i !== index))} className="mt-4 rounded-xl border border-red-100 px-4 py-2.5 text-xs font-bold text-red-500 transition hover:bg-red-50">Ջնջել բաժինը</button>
          </div>
        ))}
      </section>
    </div>
  );
}

function MediaUploader() {
  const [uploading, setUploading] = useState(false);
  const [url, setUrl] = useState('');
  const [error, setError] = useState('');

  const upload = async (file?: File) => {
    if (!file) return;
    setUploading(true); setError(''); setUrl('');
    try {
      const response = await apiClient.uploadMedia(file);
      setUrl(response.data?.url ?? '');
    } catch {
      setError('Նկարի վերբեռնումը չհաջողվեց։');
    } finally {
      setUploading(false);
    }
  };

  return (
    <section className="rounded-[26px] border border-slate-200 bg-[#08111f] p-6 text-white shadow-sm">
      <p className="text-[10px] font-extrabold uppercase tracking-[.2em] text-orange-400">Մեդիա</p>
      <h3 className="mt-2 text-lg font-extrabold">Վերբեռնել նկար</h3>
      <p className="mt-2 text-xs leading-5 text-slate-400">JPG, PNG կամ WEBP · մինչև 10MB</p>
      <label className="mt-5 flex cursor-pointer items-center justify-center rounded-2xl border border-dashed border-white/20 bg-white/[.05] px-4 py-5 text-sm font-bold transition hover:border-orange-400/60 hover:bg-orange-500/10">
        {uploading ? 'Վերբեռնվում է…' : 'Ընտրել նկար'}
        <input type="file" accept="image/png,image/jpeg,image/webp,image/gif" className="hidden" disabled={uploading} onChange={(e) => void upload(e.target.files?.[0])} />
      </label>
      {url && <div className="mt-4 rounded-xl bg-white/[.07] p-3"><p className="break-all text-xs text-emerald-300">{url}</p><button type="button" onClick={() => navigator.clipboard?.writeText(url)} className="mt-2 text-xs font-bold text-white underline decoration-orange-500 underline-offset-4">Պատճենել URL-ը</button></div>}
      {error && <p className="mt-3 text-xs font-medium text-red-300">{error}</p>}
    </section>
  );
}

function LocalizedFields({ title, value, multiline = false, onChange }: { title: string; value: Localized; multiline?: boolean; onChange: (lang: Lang, value: string) => void }) {
  const [active, setActive] = useState<Lang>('hy');
  return (
    <section className="rounded-[26px] border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h3 className="text-lg font-extrabold text-slate-950">{title}</h3>
        <div className="flex rounded-xl bg-slate-100 p-1">
          {(['hy', 'en', 'ru'] as Lang[]).map((lang) => <button key={lang} type="button" onClick={() => setActive(lang)} className={`rounded-lg px-3 py-2 text-xs font-bold transition ${active === lang ? 'bg-white text-slate-950 shadow-sm' : 'text-slate-500'}`}>{langLabel[lang]}</button>)}
        </div>
      </div>
      <div className="mt-5">
        <label><span className="mb-2 block text-[10px] font-extrabold uppercase tracking-[.18em] text-slate-400">{langLabel[active]}</span>{multiline ? <textarea value={value[active]} onChange={(e) => onChange(active, e.target.value)} rows={4} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-orange-400 focus:bg-white focus:ring-4 focus:ring-orange-100" /> : <input value={value[active]} onChange={(e) => onChange(active, e.target.value)} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-orange-400 focus:bg-white focus:ring-4 focus:ring-orange-100" />}</label>
      </div>
    </section>
  );
}
