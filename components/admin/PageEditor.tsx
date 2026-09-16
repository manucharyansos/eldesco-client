'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { adminApi } from '@/lib/cms';
import type { CmsPage, CmsSection, Locale, MediaAsset, SectionItem, SectionType, TranslatedText } from '@/types/cms';
import { MediaUpload } from './MediaUpload';

const languages: { code: Locale; label: string }[] = [
  { code: 'hy', label: 'Հայերեն' },
  { code: 'en', label: 'English' },
  { code: 'ru', label: 'Русский' },
];
const types: SectionType[] = ['hero', 'rich_text', 'cards', 'list', 'gallery', 'logos', 'contact', 'cta', 'stats'];
const itemTypes = new Set<SectionType>(['cards', 'list', 'gallery', 'logos', 'stats']);

function translated(value?: TranslatedText | null): TranslatedText {
  return { hy: value?.hy || '', en: value?.en || '', ru: value?.ru || '' };
}

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value));
}

export function PageEditor({ initialPage }: { initialPage: CmsPage }) {
  const router = useRouter();
  const [page, setPage] = useState<CmsPage>(() => clone(initialPage));
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [activeLanguage, setActiveLanguage] = useState<Locale>('hy');

  const publicPath = useMemo(() => page.slug === 'home' ? '/hy' : `/hy/${page.slug}`, [page.slug]);

  const patchPage = (patch: Partial<CmsPage>) => setPage((current) => ({ ...current, ...patch }));
  const patchSection = (index: number, patch: Partial<CmsSection>) => setPage((current) => {
    const sections = [...current.sections];
    sections[index] = { ...sections[index], ...patch };
    return { ...current, sections };
  });
  const patchItem = (sectionIndex: number, itemIndex: number, patch: Partial<SectionItem>) => setPage((current) => {
    const sections = [...current.sections];
    const items = [...(sections[sectionIndex].items || [])];
    items[itemIndex] = { ...items[itemIndex], ...patch };
    sections[sectionIndex] = { ...sections[sectionIndex], items };
    return { ...current, sections };
  });

  const setPageText = (language: Locale, value: string) => patchPage({ title: { ...translated(page.title), [language]: value } });
  const setSectionText = (index: number, field: 'title' | 'subtitle' | 'body', language: Locale, value: string) => {
    const section = page.sections[index];
    patchSection(index, { [field]: { ...translated(section[field]), [language]: value } } as any);
  };
  const setItemText = (sectionIndex: number, itemIndex: number, field: 'title' | 'subtitle' | 'body', language: Locale, value: string) => {
    const item = (page.sections[sectionIndex].items || [])[itemIndex];
    patchItem(sectionIndex, itemIndex, { [field]: { ...translated(item?.[field]), [language]: value } } as any);
  };

  const addSection = () => {
    const index = page.sections.length;
    const section: CmsSection = {
      key: `section-${Date.now()}`,
      type: 'rich_text',
      title: { hy: 'Նոր բաժին', en: 'New section', ru: '' },
      subtitle: { hy: '', en: '', ru: '' },
      body: { hy: '', en: '', ru: '' },
      settings: {},
      is_enabled: true,
      sort_order: index,
      items: [],
    };
    patchPage({ sections: [...page.sections, section] });
  };

  const removeSection = (index: number) => {
    if (!confirm('Delete this section?')) return;
    patchPage({ sections: page.sections.filter((_, i) => i !== index).map((section, i) => ({ ...section, sort_order: i })) });
  };

  const moveSection = (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= page.sections.length) return;
    const sections = [...page.sections];
    [sections[index], sections[target]] = [sections[target], sections[index]];
    patchPage({ sections: sections.map((section, i) => ({ ...section, sort_order: i })) });
  };

  const addItem = (sectionIndex: number) => {
    const section = page.sections[sectionIndex];
    const items = [...(section.items || [])];
    items.push({
      key: `item-${Date.now()}`,
      title: { hy: '', en: '', ru: '' },
      subtitle: { hy: '', en: '', ru: '' },
      body: { hy: '', en: '', ru: '' },
      link_url: '',
      is_enabled: true,
      sort_order: items.length,
    });
    patchSection(sectionIndex, { items });
  };

  const removeItem = (sectionIndex: number, itemIndex: number) => {
    const items = (page.sections[sectionIndex].items || []).filter((_, i) => i !== itemIndex).map((item, i) => ({ ...item, sort_order: i }));
    patchSection(sectionIndex, { items });
  };

  const save = async () => {
    setSaving(true); setMessage(''); setError('');
    try {
      const saved = await adminApi.savePage(page.id, page);
      setPage(clone(saved));
      setMessage('Saved successfully');
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Save failed');
    } finally { setSaving(false); }
  };

  const deletePage = async () => {
    if (page.slug === 'home' || !confirm(`Delete page /${page.slug}?`)) return;
    try {
      await adminApi.deletePage(page.id);
      router.push('/admin/pages');
    } catch (e) { setError(e instanceof Error ? e.message : 'Delete failed'); }
  };

  return (
    <div className="page-editor">
      <div className="admin-page-head admin-page-head--sticky">
        <div><span className="admin-kicker">Page editor</span><h1>{page.title?.hy || page.title?.en || page.slug}</h1><p>/{page.slug}</p></div>
        <div className="admin-head-actions"><a href={publicPath} target="_blank" className="admin-button admin-button--ghost">Preview ↗</a><button className="admin-button admin-button--primary" onClick={save} disabled={saving}>{saving ? 'Saving…' : 'Save changes'}</button></div>
      </div>
      {message && <div className="admin-alert admin-alert--success">{message}</div>}
      {error && <div className="admin-alert admin-alert--error">{error}</div>}

      <div className="editor-layout">
        <aside className="editor-sidebar">
          <div className="admin-panel editor-settings">
            <h3>Page settings</h3>
            <label>Slug<input value={page.slug} onChange={(e) => patchPage({ slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]+/g, '-') })} /></label>
            <label>Order<input type="number" min="0" value={page.sort_order} onChange={(e) => patchPage({ sort_order: Number(e.target.value) })} /></label>
            <label className="admin-check"><input type="checkbox" checked={page.is_published} onChange={(e) => patchPage({ is_published: e.target.checked })}/><span>Published</span></label>
            <label className="admin-check"><input type="checkbox" checked={page.show_in_nav} onChange={(e) => patchPage({ show_in_nav: e.target.checked })}/><span>Show in navigation</span></label>
          </div>
          <div className="admin-panel editor-outline">
            <h3>Sections</h3>
            {page.sections.map((section, index) => <a key={section.id || `${section.key}-${index}`} href={`#section-${index}`}><span>{String(index + 1).padStart(2, '0')}</span><div><strong>{translated(section.title)[activeLanguage] || section.key}</strong><small>{section.type}</small></div></a>)}
            <button className="admin-button admin-button--ghost admin-button--full" onClick={addSection}>+ Add section</button>
          </div>
          {page.slug !== 'home' && <button className="admin-button admin-button--danger admin-button--full" onClick={deletePage}>Delete page</button>}
        </aside>

        <div className="editor-canvas">
          <div className="language-tabs">
            {languages.map((language) => <button key={language.code} className={activeLanguage === language.code ? 'is-active' : ''} onClick={() => setActiveLanguage(language.code)}>{language.label}</button>)}
          </div>

          <section className="admin-panel editor-page-title">
            <span className="admin-field-label">Page title · {languages.find((l) => l.code === activeLanguage)?.label}</span>
            <input className="admin-input admin-input--title" value={translated(page.title)[activeLanguage] || ''} onChange={(e) => setPageText(activeLanguage, e.target.value)} />
          </section>

          {page.sections.map((section, sectionIndex) => (
            <section className="admin-panel section-editor" id={`section-${sectionIndex}`} key={section.id || `${section.key}-${sectionIndex}`}>
              <div className="section-editor__head">
                <div><span className="section-editor__index">{String(sectionIndex + 1).padStart(2, '0')}</span><div><strong>{translated(section.title)[activeLanguage] || 'Untitled section'}</strong><small>{section.key}</small></div></div>
                <div><button onClick={() => moveSection(sectionIndex, -1)} disabled={sectionIndex === 0}>↑</button><button onClick={() => moveSection(sectionIndex, 1)} disabled={sectionIndex === page.sections.length - 1}>↓</button><button className="is-danger" onClick={() => removeSection(sectionIndex)}>Delete</button></div>
              </div>

              <div className="editor-fields editor-fields--2">
                <label>Section type<select value={section.type} onChange={(e) => patchSection(sectionIndex, { type: e.target.value as SectionType })}>{types.map((type) => <option key={type} value={type}>{type}</option>)}</select></label>
                <label>Internal key<input value={section.key} onChange={(e) => patchSection(sectionIndex, { key: e.target.value.toLowerCase().replace(/[^a-z0-9-]+/g, '-') })} /></label>
              </div>
              <label className="admin-check admin-check--inline"><input type="checkbox" checked={section.is_enabled !== false} onChange={(e) => patchSection(sectionIndex, { is_enabled: e.target.checked })}/><span>Section enabled</span></label>

              <div className="editor-divider" />
              <div className="editor-fields">
                <label>Title · {activeLanguage.toUpperCase()}<input value={translated(section.title)[activeLanguage] || ''} onChange={(e) => setSectionText(sectionIndex, 'title', activeLanguage, e.target.value)} /></label>
                <label>Subtitle / eyebrow · {activeLanguage.toUpperCase()}<input value={translated(section.subtitle)[activeLanguage] || ''} onChange={(e) => setSectionText(sectionIndex, 'subtitle', activeLanguage, e.target.value)} /></label>
                <label>Body · {activeLanguage.toUpperCase()}<textarea rows={5} value={translated(section.body)[activeLanguage] || ''} onChange={(e) => setSectionText(sectionIndex, 'body', activeLanguage, e.target.value)} /></label>
              </div>

              <MediaUpload label="Section image / background" value={section.media || null} onChange={(media: MediaAsset | null) => patchSection(sectionIndex, { media, media_id: media?.id || null })} />

              {section.type === 'cta' && (
                <div className="editor-special">
                  <h4>CTA button</h4>
                  <div className="editor-fields editor-fields--2">
                    <label>Button · {activeLanguage.toUpperCase()}<input value={translated(section.settings?.button as TranslatedText)[activeLanguage] || ''} onChange={(e) => patchSection(sectionIndex, { settings: { ...(section.settings || {}), button: { ...translated(section.settings?.button as TranslatedText), [activeLanguage]: e.target.value } } })} /></label>
                    <label>Button link<input value={String(section.settings?.href || '')} onChange={(e) => patchSection(sectionIndex, { settings: { ...(section.settings || {}), href: e.target.value } })} /></label>
                  </div>
                </div>
              )}

              {itemTypes.has(section.type) && (
                <div className="items-editor">
                  <div className="items-editor__head"><div><h4>Items</h4><p>Cards, list entries, gallery images or logos.</p></div><button className="admin-button admin-button--small admin-button--ghost" onClick={() => addItem(sectionIndex)}>+ Add item</button></div>
                  {(section.items || []).map((item, itemIndex) => (
                    <div className="item-editor" key={item.id || `${item.key}-${itemIndex}`}>
                      <div className="item-editor__head"><strong>Item {itemIndex + 1}</strong><button onClick={() => removeItem(sectionIndex, itemIndex)}>Remove</button></div>
                      <div className="editor-fields editor-fields--2">
                        <label>Title · {activeLanguage.toUpperCase()}<input value={translated(item.title)[activeLanguage] || ''} onChange={(e) => setItemText(sectionIndex, itemIndex, 'title', activeLanguage, e.target.value)} /></label>
                        <label>Subtitle · {activeLanguage.toUpperCase()}<input value={translated(item.subtitle)[activeLanguage] || ''} onChange={(e) => setItemText(sectionIndex, itemIndex, 'subtitle', activeLanguage, e.target.value)} /></label>
                      </div>
                      <label>Body · {activeLanguage.toUpperCase()}<textarea rows={3} value={translated(item.body)[activeLanguage] || ''} onChange={(e) => setItemText(sectionIndex, itemIndex, 'body', activeLanguage, e.target.value)} /></label>
                      <label>Link<input value={item.link_url || ''} onChange={(e) => patchItem(sectionIndex, itemIndex, { link_url: e.target.value })} placeholder="/contact or https://…" /></label>
                      <MediaUpload label="Item image / logo" value={item.media || null} onChange={(media: MediaAsset | null) => patchItem(sectionIndex, itemIndex, { media, media_id: media?.id || null })} />
                    </div>
                  ))}
                  {!(section.items || []).length && <div className="admin-empty">No items yet. Add the first one.</div>}
                </div>
              )}
            </section>
          ))}
          <button className="add-section-card" onClick={addSection}><span>+</span><strong>Add another section</strong><small>Hero, text, cards, gallery, logos, CTA and more</small></button>
        </div>
      </div>
    </div>
  );
}
