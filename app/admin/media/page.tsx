'use client';

import { ChangeEvent, useEffect, useState } from 'react';
import { adminApi } from '@/lib/cms';
import type { MediaAsset } from '@/types/cms';

export default function AdminMediaPage() {
  const [items, setItems] = useState<MediaAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const load = () => adminApi.media().then((result) => setItems(result.data)).finally(() => setLoading(false));
  useEffect(() => { load().catch((e) => setError(String(e))); }, []);

  const upload = async (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (!files.length) return;
    setUploading(true); setError('');
    try {
      for (const file of files) await adminApi.uploadMedia(file);
      await load();
    } catch (e) { setError(e instanceof Error ? e.message : 'Upload failed'); }
    finally { setUploading(false); event.target.value = ''; }
  };

  const remove = async (item: MediaAsset) => {
    if (!confirm(`Delete ${item.file_name}?`)) return;
    setError('');
    try { await adminApi.deleteMedia(item.id); setItems((current) => current.filter((row) => row.id !== item.id)); }
    catch (e) { setError(e instanceof Error ? e.message : 'Could not delete image'); }
  };

  const copy = async (url: string) => {
    await navigator.clipboard.writeText(url);
  };

  return (
    <div>
      <div className="admin-page-head">
        <div><span className="admin-kicker">Assets</span><h1>Media library</h1><p>Upload project photography, customer logos and section images.</p></div>
        <label className="admin-button admin-button--primary">{uploading ? 'Uploading…' : '+ Upload images'}<input type="file" multiple accept="image/*" onChange={upload} hidden disabled={uploading} /></label>
      </div>
      {error && <div className="admin-alert admin-alert--error">{error}</div>}
      {loading ? <div className="admin-loading admin-loading--inline"><div className="admin-spinner"/>Loading media…</div> : (
        <div className="media-library">
          {items.map((item) => (
            <article className="media-card" key={item.id}>
              <div className="media-card__image"><img src={item.url} alt={item.file_name}/><span>#{item.id}</span></div>
              <div className="media-card__body"><strong title={item.file_name}>{item.file_name}</strong><small>{item.mime_type || 'image'}</small><div><button onClick={() => copy(item.url)}>Copy URL</button><button className="is-danger" onClick={() => remove(item)}>Delete</button></div></div>
            </article>
          ))}
          {!items.length && <label className="media-library__empty"><input type="file" multiple accept="image/*" onChange={upload} hidden/><span>+</span><strong>Upload your first images</strong><small>They will be available inside the page editor.</small></label>}
        </div>
      )}
    </div>
  );
}
