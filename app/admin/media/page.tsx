'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { apiClient, type MediaItem } from '@/lib/api';
import { mediaUrl } from '@/lib/media';

export default function MediaPage() {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState<number | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const load = useCallback(async () => {
    try { const r = await apiClient.getAdminMedia(); setItems(Array.isArray(r.data) ? r.data : []); }
    catch { setError('Չհաջողվեց բեռնել նկարները։'); }
    finally { setLoading(false); }
  }, []);
  useEffect(() => { void load(); }, [load]);

  const upload = async (files: FileList | null) => {
    if (!files?.length) return;
    setBusy(true); setError('');
    try { for (const f of Array.from(files)) await apiClient.uploadMedia(f); await load(); }
    catch (err: any) { setError(err?.response?.data?.message || 'Վերբեռնումը չհաջողվեց։ Թույլատրվում են JPG, PNG, WEBP, GIF՝ մինչև 10 ՄԲ։'); }
    finally { setBusy(false); if (fileRef.current) fileRef.current.value = ''; }
  };

  const remove = async (id: number) => {
    if (!confirm('Ջնջե՞լ նկարը։ Եթե այն օգտագործվում է որևէ էջում, այնտեղ այլևս չի երևա։')) return;
    try { await apiClient.deleteMedia(id); setItems((c) => c.filter((x) => x.id !== id)); }
    catch { setError('Չհաջողվեց ջնջել նկարը։'); }
  };

  const copy = async (item: MediaItem) => { try { await navigator.clipboard.writeText(mediaUrl(item.path || item.url)); setCopied(item.id); setTimeout(() => setCopied(null), 1500); } catch { /* ignore */ } };

  return (
    <div className="mx-auto max-w-6xl space-y-7">
      <div className="flex flex-wrap items-end justify-between gap-5">
        <div>
          <p className="text-[11px] font-extrabold uppercase tracking-[.24em] text-orange-600">Ֆայլեր</p>
          <h2 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">Նկարների գրադարան</h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500">Այստեղ վերբեռնված նկարները հասանելի են բոլոր էջերում՝ «Ընտրել նկար» պատուհանից։ Ներկայացման նկարները արդեն ներառված են այնտեղ։</p>
        </div>
        <div>
          <input ref={fileRef} type="file" accept="image/*" multiple className="hidden" onChange={(e) => void upload(e.target.files)} />
          <button type="button" disabled={busy} onClick={() => fileRef.current?.click()} className="rounded-2xl bg-slate-950 px-5 py-3.5 text-sm font-extrabold text-white shadow-xl transition hover:bg-orange-500 disabled:opacity-50">{busy ? 'Վերբեռնվում է…' : '+ Վերբեռնել նկարներ'}</button>
        </div>
      </div>

      {error && <div role="alert" className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700">{error}</div>}

      {loading ? <div className="rounded-3xl border border-slate-200 bg-white p-10 text-sm text-slate-500">Բեռնվում է…</div> : items.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center text-sm text-slate-500">Դեռ վերբեռնված նկարներ չկան։</div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {items.map((item) => (
            <figure key={item.id} className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={mediaUrl(item.path || item.url)} alt="" loading="lazy" className="aspect-[4/3] w-full bg-slate-100 object-cover" />
              <figcaption className="space-y-2 p-3">
                <p className="truncate text-xs font-bold text-slate-700" title={item.filename ?? ''}>{item.filename || `#${item.id}`}</p>
                <div className="flex gap-2">
                  <button type="button" onClick={() => void copy(item)} className="flex-1 rounded-lg border border-slate-200 px-2 py-1.5 text-xs font-bold text-slate-600 hover:border-orange-300 hover:text-orange-600">{copied === item.id ? 'Պատճենվեց ✓' : 'Պատճենել հղումը'}</button>
                  <button type="button" onClick={() => void remove(item.id)} className="rounded-lg border border-red-100 px-2.5 py-1.5 text-xs font-bold text-red-500 hover:bg-red-50" aria-label="Ջնջել">×</button>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      )}
    </div>
  );
}
