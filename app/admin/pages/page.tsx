'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { cmsAdmin } from '@/lib/admin-cms';
import type { CmsPage } from '@/types/cms';

export default function AdminPagesPage() {
  const router = useRouter();
  const [pages, setPages] = useState<CmsPage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = async () => {
    try {
      setLoading(true);
      setPages(await cmsAdmin.pages());
    } catch (e: any) {
      setError(e.message || 'Failed to load pages');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const createPage = async () => {
    const name = window.prompt('Page name');
    if (!name) return;
    const suggested = name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    const slug = window.prompt('URL slug', suggested);
    if (!slug) return;

    try {
      const page = await cmsAdmin.createPage({
        name,
        slug,
        published: false,
        seo_title: { hy: name, en: name, ru: name },
        seo_description: { hy: '', en: '', ru: '' },
        sections: [{
          key: 'hero',
          type: 'page-hero',
          enabled: true,
          sort_order: 1,
          content: { title: { hy: name, en: name, ru: name } },
        }],
      });
      router.push(`/admin/pages/${page.slug}`);
    } catch (e: any) {
      setError(e.message || 'Failed to create page');
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex flex-wrap items-start justify-between gap-4 mb-8">
        <div>
          <p className="text-xs uppercase tracking-[.22em] text-orange-600 font-bold mb-2">Website CMS</p>
          <h1 className="text-4xl font-semibold">Pages</h1>
          <p className="text-gray-500 mt-2">Every public page is built from editable sections.</p>
        </div>
        <div className="flex gap-2">
          <Link href="/admin/settings" className="px-4 py-2 rounded-lg border bg-white">Global settings</Link>
          <button onClick={createPage} className="px-4 py-2 rounded-lg bg-slate-900 text-white">+ New page</button>
        </div>
      </div>

      {error && <div className="mb-5 p-4 rounded-lg bg-red-50 text-red-700 whitespace-pre-wrap">{error}</div>}
      {loading ? <div className="p-10 text-gray-500">Loading…</div> : (
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          {pages.map((page) => (
            <Link key={page.id} href={`/admin/pages/${page.slug}`} className="flex items-center justify-between gap-4 p-5 border-b last:border-b-0 hover:bg-gray-50">
              <div>
                <div className="font-semibold text-lg">{page.name}</div>
                <div className="text-sm text-gray-500">/{page.slug} · {page.sections?.length || 0} sections</div>
              </div>
              <div className="flex items-center gap-3">
                <span className={`text-xs px-2.5 py-1 rounded-full ${page.published ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-100 text-gray-600'}`}>{page.published ? 'Published' : 'Draft'}</span>
                <span className="text-xl">→</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
