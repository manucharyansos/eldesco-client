'use client';

import { useEffect, useMemo, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { apiClient } from '@/lib/api';

type Localized = { hy: string; en: string; ru: string };

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
        const response = await apiClient.getAdminPages();
        const list: AdminPage[] = response.data?.data ?? response.data ?? [];
        const page = list.find((item) => item.id === pageId);
        if (!page) throw new Error('Page not found');

        setSlug(page.slug ?? '');
        setTitle({ ...emptyLocalized(), ...(page.title ?? {}) });
        setSeoTitle({ ...emptyLocalized(), ...(page.seo_title ?? {}) });
        setSeoDescription({ ...emptyLocalized(), ...(page.seo_description ?? {}) });
        setPublished(Boolean(page.is_published));
        setSortOrder(page.sort_order ?? 0);
        setSections(
          (page.sections ?? []).map((section) => ({
            id: section.id,
            type: section.type,
            key: section.key ?? '',
            contentText: JSON.stringify(section.content ?? {}, null, 2),
            is_enabled: section.is_enabled,
            sort_order: section.sort_order,
          }))
        );
      } catch {
        setError('Չհաջողվեց բեռնել էջը։');
      } finally {
        setLoading(false);
      }
    };

    void load();
  }, [isNew, pageId]);

  const updateLocalized = (
    setter: React.Dispatch<React.SetStateAction<Localized>>,
    lang: keyof Localized,
    value: string
  ) => setter((current) => ({ ...current, [lang]: value }));

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
          throw new Error(`Section ${index + 1}-ի JSON-ը սխալ է։`);
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

      const payload = {
        slug: slug.trim(),
        title,
        seo_title: seoTitle,
        seo_description: seoDescription,
        is_published: published,
        sort_order: sortOrder,
        sections: parsedSections,
      };

      if (!payload.slug) throw new Error('Slug-ը պարտադիր է։');

      if (isNew) {
        await apiClient.createPage(payload);
      } else if (pageId) {
        await apiClient.updatePage(pageId, payload);
      }

      router.push('/admin/pages');
      router.refresh();
    } catch (err) {
      const message = err instanceof Error
        ? err.message
        : 'Չհաջողվեց պահպանել էջը։';
      setError(message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-8">Բեռնվում է…</div>;

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[.2em] text-orange-600">ELDESCO CMS</p>
          <h1 className="text-3xl font-bold">{heading}</h1>
        </div>
        <div className="flex gap-3">
          <button onClick={() => router.push('/admin/pages')} className="rounded-xl border px-5 py-3">Չեղարկել</button>
          <button onClick={() => void save()} disabled={saving} className="rounded-xl bg-slate-950 px-5 py-3 font-semibold text-white disabled:opacity-50">
            {saving ? 'Պահպանվում է…' : 'Պահպանել'}
          </button>
        </div>
      </div>

      {error && <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">{error}</div>}

      <section className="rounded-2xl border bg-white p-6 shadow-sm">
        <div className="grid gap-5 md:grid-cols-3">
          <label className="md:col-span-2">
            <span className="mb-2 block text-sm font-semibold">Slug</span>
            <input value={slug} onChange={(e) => setSlug(e.target.value)} placeholder="home" className="w-full rounded-xl border px-4 py-3" />
          </label>
          <label>
            <span className="mb-2 block text-sm font-semibold">Դասավորություն</span>
            <input type="number" value={sortOrder} onChange={(e) => setSortOrder(Number(e.target.value))} className="w-full rounded-xl border px-4 py-3" />
          </label>
        </div>
        <label className="mt-5 flex items-center gap-3">
          <input type="checkbox" checked={published} onChange={(e) => setPublished(e.target.checked)} />
          <span className="font-medium">Հրապարակված</span>
        </label>
      </section>

      <LocalizedFields title="Էջի վերնագիր" value={title} onChange={(lang, value) => updateLocalized(setTitle, lang, value)} />
      <LocalizedFields title="SEO title" value={seoTitle} onChange={(lang, value) => updateLocalized(setSeoTitle, lang, value)} />
      <LocalizedFields title="SEO description" value={seoDescription} multiline onChange={(lang, value) => updateLocalized(setSeoDescription, lang, value)} />

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Sections</h2>
            <p className="text-sm text-gray-500">Hero, intro, services, stats, contact և հետագայում նոր section type-եր։</p>
          </div>
          <button onClick={addSection} className="rounded-xl bg-orange-600 px-4 py-2 font-semibold text-white">+ Section</button>
        </div>

        {sections.map((section, index) => (
          <div key={section.id ?? `${section.key}-${index}`} className="rounded-2xl border bg-white p-6 shadow-sm">
            <div className="grid gap-4 md:grid-cols-4">
              <label>
                <span className="mb-2 block text-sm font-semibold">Type</span>
                <select value={section.type} onChange={(e) => updateSection(index, { type: e.target.value })} className="w-full rounded-xl border px-3 py-3">
                  <option value="hero">hero</option>
                  <option value="intro">intro</option>
                  <option value="services">services</option>
                  <option value="stats">stats</option>
                  <option value="contact">contact</option>
                </select>
              </label>
              <label className="md:col-span-2">
                <span className="mb-2 block text-sm font-semibold">Key</span>
                <input value={section.key} onChange={(e) => updateSection(index, { key: e.target.value })} className="w-full rounded-xl border px-3 py-3" />
              </label>
              <label>
                <span className="mb-2 block text-sm font-semibold">Order</span>
                <input type="number" value={section.sort_order} onChange={(e) => updateSection(index, { sort_order: Number(e.target.value) })} className="w-full rounded-xl border px-3 py-3" />
              </label>
            </div>

            <label className="mt-4 flex items-center gap-3">
              <input type="checkbox" checked={section.is_enabled} onChange={(e) => updateSection(index, { is_enabled: e.target.checked })} />
              <span>Միացված է</span>
            </label>

            <label className="mt-4 block">
              <span className="mb-2 block text-sm font-semibold">Content JSON</span>
              <textarea value={section.contentText} onChange={(e) => updateSection(index, { contentText: e.target.value })} rows={14} spellCheck={false} className="w-full rounded-xl border bg-slate-950 p-4 font-mono text-sm text-slate-100" />
            </label>

            <button onClick={() => setSections((current) => current.filter((_, i) => i !== index))} className="mt-4 rounded-lg border border-red-200 px-4 py-2 text-red-600">
              Ջնջել section-ը
            </button>
          </div>
        ))}
      </section>
    </div>
  );
}

function LocalizedFields({
  title,
  value,
  multiline = false,
  onChange,
}: {
  title: string;
  value: Localized;
  multiline?: boolean;
  onChange: (lang: keyof Localized, value: string) => void;
}) {
  return (
    <section className="rounded-2xl border bg-white p-6 shadow-sm">
      <h2 className="mb-4 text-lg font-bold">{title}</h2>
      <div className="grid gap-4 md:grid-cols-3">
        {(['hy', 'en', 'ru'] as const).map((lang) => (
          <label key={lang}>
            <span className="mb-2 block text-xs font-bold uppercase tracking-wider text-gray-500">{lang}</span>
            {multiline ? (
              <textarea value={value[lang]} onChange={(e) => onChange(lang, e.target.value)} rows={4} className="w-full rounded-xl border px-4 py-3" />
            ) : (
              <input value={value[lang]} onChange={(e) => onChange(lang, e.target.value)} className="w-full rounded-xl border px-4 py-3" />
            )}
          </label>
        ))}
      </div>
    </section>
  );
}
