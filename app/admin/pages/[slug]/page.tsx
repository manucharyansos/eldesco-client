'use client';

import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'next/navigation';
import { cmsAdmin } from '@/lib/admin-cms';
import type { CmsPage, CmsSection } from '@/types/cms';

const langs = ['hy', 'en', 'ru'];

function pretty(value: any) {
  return JSON.stringify(value ?? {}, null, 2);
}

function LocalizedField({ label, value, onChange, multiline = false }: { label: string; value: any; onChange: (next: any) => void; multiline?: boolean }) {
  const object = value && typeof value === 'object' && !Array.isArray(value) ? value : {};
  return (
    <div>
      <label className="block text-sm font-semibold mb-2">{label}</label>
      <div className="grid md:grid-cols-3 gap-3">
        {langs.map((lang) => multiline ? (
          <textarea key={lang} value={object[lang] || ''} onChange={(e) => onChange({ ...object, [lang]: e.target.value })} rows={4} placeholder={`${label} · ${lang.toUpperCase()}`} className="w-full border rounded-lg px-3 py-2" />
        ) : (
          <input key={lang} value={object[lang] || ''} onChange={(e) => onChange({ ...object, [lang]: e.target.value })} placeholder={`${label} · ${lang.toUpperCase()}`} className="w-full border rounded-lg px-3 py-2" />
        ))}
      </div>
    </div>
  );
}

function SectionEditor({ pageId, section, onSaved, onDeleted }: { pageId: number; section: CmsSection; onSaved: (s: CmsSection) => void; onDeleted: () => void }) {
  const [draft, setDraft] = useState(section);
  const [raw, setRaw] = useState(pretty(section.content));
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    setDraft(section);
    setRaw(pretty(section.content));
  }, [section]);

  const content = (draft.content || {}) as Record<string, any>;
  const setContent = (key: string, value: any) => {
    const next = { ...content, [key]: value };
    setDraft({ ...draft, content: next });
    setRaw(pretty(next));
  };

  const save = async () => {
    try {
      setSaving(true);
      let parsed = draft.content || {};
      try { parsed = JSON.parse(raw); } catch { setMessage('Content JSON is invalid.'); setSaving(false); return; }
      const result = await cmsAdmin.updateSection(pageId, draft.id, {
        key: draft.key,
        type: draft.type,
        content: parsed,
        image_url: draft.image_url,
        gallery: draft.gallery,
        settings: draft.settings,
        sort_order: draft.sort_order,
        enabled: draft.enabled,
      });
      setMessage('Saved ✓');
      onSaved(result);
    } catch (e: any) {
      setMessage(e.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const upload = async (file?: File) => {
    if (!file) return;
    try {
      const uploaded = await cmsAdmin.upload(file, draft.key || 'section');
      setDraft({ ...draft, image_url: uploaded.url });
      setMessage('Image uploaded. Save section to apply it.');
    } catch (e: any) {
      setMessage(e.message || 'Upload failed');
    }
  };

  return (
    <article className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
      <div className="p-5 border-b bg-gray-50 flex flex-wrap gap-3 items-center justify-between">
        <div className="flex items-center gap-3">
          <input value={draft.key} onChange={(e) => setDraft({ ...draft, key: e.target.value })} className="border rounded-lg px-3 py-2 font-semibold w-48" />
          <select value={draft.type} onChange={(e) => setDraft({ ...draft, type: e.target.value })} className="border rounded-lg px-3 py-2">
            {['hero','page-hero','split','feature','richtext','cards','feature-list','stat','gallery','logos','contact'].map((type) => <option key={type}>{type}</option>)}
          </select>
        </div>
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={draft.enabled} onChange={(e) => setDraft({ ...draft, enabled: e.target.checked })} /> Enabled</label>
      </div>

      <div className="p-5 space-y-6">
        {'title' in content && <LocalizedField label="Title" value={content.title} onChange={(v) => setContent('title', v)} />}
        {'text' in content && <LocalizedField label="Text" value={content.text} multiline onChange={(v) => setContent('text', v)} />}
        {'eyebrow' in content && <LocalizedField label="Eyebrow" value={content.eyebrow} onChange={(v) => setContent('eyebrow', v)} />}
        {'primary_cta' in content && <LocalizedField label="Primary button" value={content.primary_cta} onChange={(v) => setContent('primary_cta', v)} />}
        {'secondary_cta' in content && <LocalizedField label="Secondary button" value={content.secondary_cta} onChange={(v) => setContent('secondary_cta', v)} />}

        <div>
          <label className="block text-sm font-semibold mb-2">Section image</label>
          <div className="flex flex-wrap items-center gap-3">
            <input value={draft.image_url || ''} onChange={(e) => setDraft({ ...draft, image_url: e.target.value })} className="flex-1 min-w-[250px] border rounded-lg px-3 py-2" placeholder="/storage/... or https://..." />
            <label className="px-4 py-2 rounded-lg border bg-white cursor-pointer hover:bg-gray-50">Upload image<input type="file" accept="image/*" className="hidden" onChange={(e) => upload(e.target.files?.[0])} /></label>
          </div>
        </div>

        <details>
          <summary className="cursor-pointer font-semibold text-sm">Advanced content JSON (cards, lists, galleries, etc.)</summary>
          <textarea value={raw} onChange={(e) => setRaw(e.target.value)} rows={16} className="mt-3 w-full border rounded-xl p-3 font-mono text-xs bg-slate-950 text-slate-100" />
        </details>

        <div className="flex items-center justify-between gap-4">
          <div className="text-sm text-gray-500">{message}</div>
          <div className="flex gap-2">
            <button onClick={async () => { if (!confirm('Delete this section?')) return; await cmsAdmin.deleteSection(pageId, draft.id); onDeleted(); }} className="px-4 py-2 rounded-lg border text-red-600">Delete</button>
            <button onClick={save} disabled={saving} className="px-5 py-2 rounded-lg bg-slate-900 text-white disabled:opacity-50">{saving ? 'Saving…' : 'Save section'}</button>
          </div>
        </div>
      </div>
    </article>
  );
}

export default function AdminPageEditor() {
  const params = useParams<{ slug: string }>();
  const slug = decodeURIComponent(params.slug);
  const [page, setPage] = useState<CmsPage | null>(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try { setPage(await cmsAdmin.page(slug)); }
    catch (e: any) { setMessage(e.message || 'Failed to load page'); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, [slug]);

  const ordered = useMemo(() => [...(page?.sections || [])].sort((a, b) => a.sort_order - b.sort_order), [page]);

  if (loading) return <div>Loading…</div>;
  if (!page) return <div className="text-red-600">{message || 'Page not found'}</div>;

  const savePage = async () => {
    try {
      const result = await cmsAdmin.updatePage(page.id, {
        name: page.name,
        slug: page.slug,
        seo_title: page.seo_title,
        seo_description: page.seo_description,
        published: page.published,
        sort_order: page.sort_order,
      });
      setPage({ ...page, ...result });
      setMessage('Page settings saved ✓');
    } catch (e: any) { setMessage(e.message || 'Save failed'); }
  };

  const addSection = async () => {
    const result = await cmsAdmin.createSection(page.id, {
      key: `section-${Date.now()}`,
      type: 'richtext',
      content: { title: { hy: 'Նոր բաժին', en: 'New section', ru: 'Новый раздел' }, text: { hy: '', en: '', ru: '' } },
      enabled: true,
      sort_order: ordered.length + 1,
    });
    setPage({ ...page, sections: [...page.sections, result] });
  };

  return (
    <div className="max-w-6xl mx-auto space-y-7">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div><p className="text-xs uppercase tracking-[.2em] text-orange-600 font-bold">Edit page</p><h1 className="text-4xl font-semibold mt-2">{page.name}</h1><p className="text-gray-500 mt-2">/{page.slug}</p></div>
        <a href={`/hy/${page.slug === 'home' ? '' : page.slug}`} target="_blank" className="px-4 py-2 rounded-lg border bg-white">Preview ↗</a>
      </div>

      <section className="bg-white rounded-2xl border p-5 space-y-5">
        <div className="grid md:grid-cols-2 gap-4">
          <div><label className="block text-sm font-semibold mb-2">Internal page name</label><input value={page.name} onChange={(e) => setPage({ ...page, name: e.target.value })} className="w-full border rounded-lg px-3 py-2" /></div>
          <div><label className="block text-sm font-semibold mb-2">Slug</label><input value={page.slug} onChange={(e) => setPage({ ...page, slug: e.target.value })} className="w-full border rounded-lg px-3 py-2" /></div>
        </div>
        <LocalizedField label="SEO title" value={page.seo_title || {}} onChange={(v) => setPage({ ...page, seo_title: v })} />
        <LocalizedField label="SEO description" value={page.seo_description || {}} multiline onChange={(v) => setPage({ ...page, seo_description: v })} />
        <div className="flex items-center justify-between"><label className="flex gap-2 items-center"><input type="checkbox" checked={page.published} onChange={(e) => setPage({ ...page, published: e.target.checked })} /> Published</label><button onClick={savePage} className="px-5 py-2 rounded-lg bg-slate-900 text-white">Save page</button></div>
        {message && <div className="text-sm text-gray-500">{message}</div>}
      </section>

      <div className="flex items-center justify-between"><div><h2 className="text-2xl font-semibold">Sections</h2><p className="text-gray-500 text-sm mt-1">Edit text, image, order and advanced section content.</p></div><button onClick={addSection} className="px-4 py-2 rounded-lg bg-orange-600 text-white">+ Add section</button></div>

      <div className="space-y-5">
        {ordered.map((section) => <SectionEditor key={section.id} pageId={page.id} section={section} onSaved={(saved) => setPage({ ...page, sections: page.sections.map((s) => s.id === saved.id ? saved : s) })} onDeleted={() => setPage({ ...page, sections: page.sections.filter((s) => s.id !== section.id) })} />)}
      </div>
    </div>
  );
}
