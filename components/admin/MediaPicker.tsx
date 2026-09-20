'use client';

import { useEffect, useRef, useState } from 'react';
import { apiClient, type MediaItem } from '@/lib/api';
import { mediaUrl } from '@/lib/media';

type Picked = { path: string; w?: number; h?: number };
type Photo = { src: string; name?: string; area?: string; w?: number; h?: number };

const TABS = [
  { id: 'uploads', label: 'Վերբեռնված' },
  { id: 'deck', label: 'Ներկայացման նկարներ' },
  { id: 'logos', label: 'Պատվիրատուների լոգոներ' },
] as const;
type Tab = (typeof TABS)[number]['id'];

function measure(url: string): Promise<{ w?: number; h?: number }> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve({ w: img.naturalWidth, h: img.naturalHeight });
    img.onerror = () => resolve({});
    img.src = mediaUrl(url);
  });
}

async function json<T>(url: string): Promise<T | null> {
  try { const r = await fetch(url); return r.ok ? ((await r.json()) as T) : null; } catch { return null; }
}

export function MediaPicker({ open, onClose, onPick }: { open: boolean; onClose: () => void; onPick: (picked: Picked) => void }) {
  const [tab, setTab] = useState<Tab>('deck');
  const [uploads, setUploads] = useState<MediaItem[]>([]);
  const [deck, setDeck] = useState<Photo[]>([]);
  const [logos, setLogos] = useState<Photo[]>([]);
  const [area, setArea] = useState('all');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) return;
    setError('');
    apiClient.getAdminMedia().then((r) => setUploads(Array.isArray(r.data) ? r.data : [])).catch(() => setUploads([]));
    void json<Photo[]>('/images/deck/manifest.json').then((d) => setDeck(d ?? []));
    void json<Array<{ src: string; name: string }>>('/images/customers/manifest.json').then((d) => setLogos((d ?? []).map((x) => ({ src: x.src, name: x.name }))));
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  const upload = async (files: FileList | null) => {
    const file = files?.[0];
    if (!file) return;
    setBusy(true); setError('');
    try {
      const response = await apiClient.uploadMedia(file);
      const path: string = response.data.path || response.data.url;
      const dims = await measure(path);
      onPick({ path, ...dims });
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Վերբեռնումը չհաջողվեց։ Թույլատրվում են JPG, PNG, WEBP, GIF՝ մինչև 10 ՄԲ։');
    } finally { setBusy(false); if (fileRef.current) fileRef.current.value = ''; }
  };

  const pick = async (path: string, known?: { w?: number; h?: number }) => onPick({ path, ...(known?.w ? known : await measure(path)) });

  const areas = Array.from(new Set(deck.map((d) => d.area).filter(Boolean))) as string[];
  const shownDeck = area === 'all' ? deck : deck.filter((d) => d.area === area);

  const Grid = ({ items, contain }: { items: Photo[]; contain?: boolean }) => (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
      {items.map((item) => (
        <button key={item.src} type="button" onClick={() => void pick(item.src, item)} title={item.name}
          className="group overflow-hidden rounded-xl border border-slate-200 bg-slate-100 text-left transition hover:border-orange-400 hover:shadow-md focus:outline-none focus:ring-4 focus:ring-orange-100">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={mediaUrl(item.src)} alt={item.name || ''} loading="lazy" className={`aspect-[4/3] w-full ${contain ? 'bg-white object-contain p-2' : 'object-cover'}`} />
        </button>
      ))}
    </div>
  );

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-slate-950/70 p-3 sm:p-6" role="dialog" aria-modal="true" aria-label="Ընտրել նկար" onClick={onClose}>
      <div className="flex max-h-full w-full max-w-5xl flex-col overflow-hidden rounded-3xl bg-white shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex shrink-0 items-center justify-between gap-4 border-b border-slate-100 px-5 py-4 sm:px-7">
          <h3 className="text-lg font-black">Ընտրել նկար</h3>
          <div className="flex items-center gap-2">
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => void upload(e.target.files)} />
            <button type="button" disabled={busy} onClick={() => fileRef.current?.click()} className="rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-extrabold text-white transition hover:bg-orange-500 disabled:opacity-50">
              {busy ? 'Վերբեռնվում է…' : '+ Վերբեռնել նոր նկար'}
            </button>
            <button type="button" onClick={onClose} className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-xl text-slate-500 hover:bg-slate-200" aria-label="Փակել">×</button>
          </div>
        </div>

        <div className="flex shrink-0 gap-1 overflow-x-auto border-b border-slate-100 px-5 pt-3 sm:px-7">
          {TABS.map((t) => (
            <button key={t.id} type="button" onClick={() => setTab(t.id)} className={`whitespace-nowrap rounded-t-lg px-4 py-2.5 text-sm font-bold transition ${tab === t.id ? 'border-b-2 border-orange-500 text-slate-950' : 'text-slate-500 hover:text-slate-900'}`}>{t.label}</button>
          ))}
        </div>

        {error && <div className="mx-5 mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm font-medium text-red-700 sm:mx-7">{error}</div>}

        <div className="overflow-y-auto p-5 sm:p-7">
          {tab === 'uploads' && (uploads.length ? <Grid items={uploads.map((u) => ({ src: u.path || u.url, name: u.filename ?? undefined }))} /> : <p className="py-10 text-center text-sm text-slate-500">Դեռ վերբեռնված նկարներ չկան։ Օգտագործեք «Վերբեռնել նոր նկար» կոճակը։</p>)}
          {tab === 'deck' && (
            <>
              <div className="mb-4 flex flex-wrap gap-2">
                {['all', ...areas].map((a) => (
                  <button key={a} type="button" onClick={() => setArea(a)} className={`rounded-full px-3.5 py-1.5 text-xs font-bold transition ${area === a ? 'bg-slate-950 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>{a === 'all' ? 'Բոլորը' : a}</button>
                ))}
              </div>
              <Grid items={shownDeck} />
            </>
          )}
          {tab === 'logos' && <Grid items={logos} contain />}
        </div>
      </div>
    </div>
  );
}
