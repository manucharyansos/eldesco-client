'use client';

import { useEffect, useState } from 'react';
import { adminApi } from '@/lib/cms';
import type { CmsPage } from '@/types/cms';
import { PageEditor } from '@/components/admin/PageEditor';

export default function AdminPageEditorRoute({ params }: { params: { id: string } }) {
  const [page, setPage] = useState<CmsPage | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    adminApi.page(params.id).then(setPage).catch((e) => setError(e instanceof Error ? e.message : 'Could not load page'));
  }, [params.id]);

  if (error) return <div className="admin-alert admin-alert--error">{error}</div>;
  if (!page) return <div className="admin-loading admin-loading--inline"><div className="admin-spinner"/><span>Loading page…</span></div>;
  return <PageEditor initialPage={page} />;
}
