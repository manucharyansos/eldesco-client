'use client';

import { useCallback, useEffect, useState } from 'react';
import { mediaUrl } from '@/lib/media';

export type GalleryImage = { image: string; alt: string; caption?: string; w?: number; h?: number };

export function GalleryClient({ images, labels }: { images: GalleryImage[]; labels: { close: string; next: string; previous: string } }) {
  const [current, setCurrent] = useState<number | null>(null);
  const count = images.length;

  const step = useCallback((delta: number) => setCurrent((c) => (c === null ? c : (c + delta + count) % count)), [count]);

  useEffect(() => {
    if (current === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setCurrent(null);
      if (e.key === 'ArrowRight') step(1);
      if (e.key === 'ArrowLeft') step(-1);
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = ''; };
  }, [current, step]);

  const active = current === null ? null : images[current];

  return (
    <>
      <div className="gallery-grid">
        {images.map((img, i) => (
          <button key={img.image + i} type="button" className="gallery-item" onClick={() => setCurrent(i)} aria-label={img.caption || img.alt || String(i + 1)}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={mediaUrl(img.image)} alt={img.alt} loading="lazy" decoding="async" width={img.w} height={img.h} style={img.w && img.h ? { aspectRatio: `${img.w} / ${img.h}` } : undefined} />
            {img.caption && <span className="gallery-caption">{img.caption}</span>}
          </button>
        ))}
      </div>

      {active && (
        <div className="lightbox" role="dialog" aria-modal="true" aria-label={active.caption || active.alt} onClick={() => setCurrent(null)}>
          <button type="button" className="lightbox-btn right-4 top-4" onClick={() => setCurrent(null)} aria-label={labels.close}>×</button>
          {count > 1 && <button type="button" className="lightbox-btn left-3 top-1/2 -translate-y-1/2" onClick={(e) => { e.stopPropagation(); step(-1); }} aria-label={labels.previous}>‹</button>}
          <figure className="flex flex-col items-center gap-3" onClick={(e) => e.stopPropagation()}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={mediaUrl(active.image)} alt={active.alt} />
            {active.caption && <figcaption className="max-w-2xl text-center text-sm font-medium text-white/85">{active.caption}</figcaption>}
          </figure>
          {count > 1 && <button type="button" className="lightbox-btn right-3 top-1/2 -translate-y-1/2" onClick={(e) => { e.stopPropagation(); step(1); }} aria-label={labels.next}>›</button>}
        </div>
      )}
    </>
  );
}
