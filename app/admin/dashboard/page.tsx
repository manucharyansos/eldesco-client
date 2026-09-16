'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { adminApi } from '@/lib/cms';
import type { CmsPage } from '@/types/cms';

export default function AdminDashboardPage() {
  const [pages, setPages] = useState<CmsPage[]>([]);
  const [mediaCount, setMediaCount] = useState<number | null>(null);

  useEffect(() => {
    adminApi.pages().then(setPages).catch(() => undefined);
    adminApi.media(1).then((result: any) => setMediaCount(result.total ?? result.data?.length ?? 0)).catch(() => undefined);
  }, []);

  const published = pages.filter((page) => page.is_published).length;
  const sections = pages.reduce((sum, page: any) => sum + Number(page.sections_count || page.sections?.length || 0), 0);

  return (
    <div>
      <div className="admin-page-head">
        <div><span className="admin-kicker">Overview</span><h1>Website dashboard</h1><p>Everything shown on the public site can be maintained from this CMS.</p></div>
        <Link href="/hy" target="_blank" className="admin-button admin-button--ghost">Open website ↗</Link>
      </div>

      <div className="admin-stats-grid">
        <div className="admin-stat"><span>Pages</span><strong>{pages.length || '—'}</strong><small>{published} published</small></div>
        <div className="admin-stat"><span>Content sections</span><strong>{sections || '—'}</strong><small>Reusable page blocks</small></div>
        <div className="admin-stat"><span>Media assets</span><strong>{mediaCount ?? '—'}</strong><small>Images in library</small></div>
        <div className="admin-stat"><span>Languages</span><strong>3</strong><small>HY · EN · RU</small></div>
      </div>

      <div className="admin-grid-2">
        <section className="admin-panel">
          <div className="admin-panel__head"><div><h2>Pages</h2><p>Edit content and structure.</p></div><Link href="/admin/pages">Manage all →</Link></div>
          <div className="admin-compact-list">
            {pages.slice(0, 6).map((page) => <Link key={page.id} href={`/admin/pages/${page.id}`}><div><strong>{page.title?.hy || page.title?.en || page.slug}</strong><span>/{page.slug}</span></div><i className={page.is_published ? 'is-live' : ''}/></Link>)}
          </div>
        </section>
        <section className="admin-panel">
          <div className="admin-panel__head"><div><h2>Quick actions</h2><p>Common content tasks.</p></div></div>
          <div className="admin-actions">
            <Link href="/admin/pages"><span>01</span><div><strong>Edit page content</strong><p>Text, sections, images, navigation.</p></div>↗</Link>
            <Link href="/admin/media"><span>02</span><div><strong>Upload images</strong><p>Manage project photos and logos.</p></div>↗</Link>
            <Link href="/admin/settings"><span>03</span><div><strong>Company settings</strong><p>Contact details, brand and global data.</p></div>↗</Link>
          </div>
        </section>
      </div>
    </div>
  );
}
