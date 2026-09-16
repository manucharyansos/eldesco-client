'use client';

import Link from 'next/link';
import { FormEvent, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { adminApi } from '@/lib/cms';
import type { CmsPage } from '@/types/cms';

export default function AdminPagesPage() {
  const router = useRouter();
  const [pages, setPages] = useState<CmsPage[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [error, setError] = useState('');

  const load = () => adminApi.pages().then(setPages).finally(() => setLoading(false));
  useEffect(() => { load().catch((e) => setError(String(e))); }, []);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setError('');
    try {
      const page = await adminApi.createPage({
        slug,
        title: { hy: title, en: title, ru: '' },
        is_published: false,
        show_in_nav: false,
        sort_order: pages.length + 20,
        sections: [],
      } as any);
      router.push(`/admin/pages/${page.id}`);
    } catch (e) { setError(e instanceof Error ? e.message : 'Could not create page'); }
  };

  return (
    <div>
      <div className="admin-page-head">
        <div><span className="admin-kicker">Content</span><h1>Pages</h1><p>Edit every page, section, text and image from one place.</p></div>
        <button className="admin-button admin-button--primary" onClick={() => setCreating(!creating)}>+ New page</button>
      </div>

      {creating && (
        <form className="admin-create-bar" onSubmit={submit}>
          <label>Page name<input value={title} onChange={(e) => setTitle(e.target.value)} required placeholder="New page" /></label>
          <label>Slug<input value={slug} onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]+/g, '-'))} required placeholder="new-page" /></label>
          <button className="admin-button admin-button--primary">Create</button>
        </form>
      )}

      {error && <div className="admin-alert admin-alert--error">{error}</div>}

      <section className="admin-panel admin-panel--table">
        <div className="admin-table-head"><span>Page</span><span>Status</span><span>Navigation</span><span>Order</span><span/></div>
        {loading ? <div className="admin-empty">Loading pages…</div> : pages.map((page) => (
          <div className="admin-table-row" key={page.id}>
            <div><strong>{page.title?.hy || page.title?.en || page.slug}</strong><small>/{page.slug} · {(page as any).sections_count ?? page.sections?.length ?? 0} sections</small></div>
            <span className={`admin-pill ${page.is_published ? 'admin-pill--live' : ''}`}>{page.is_published ? 'Published' : 'Draft'}</span>
            <span>{page.show_in_nav ? 'Visible' : 'Hidden'}</span>
            <span>{page.sort_order}</span>
            <Link href={`/admin/pages/${page.id}`} className="admin-row-link">Edit →</Link>
          </div>
        ))}
      </section>
    </div>
  );
}
