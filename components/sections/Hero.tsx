'use client';

import Link from 'next/link';
import { useState } from 'react';
import { mediaUrl } from '@/lib/media';
import { localizedHref } from '@/lib/nav';
import type { Locale } from '@/lib/config';

type Slide = { label?: string; image?: string; url?: string };
type Content = {
  eyebrow?: string; title?: string; subtitle?: string;
  cta_label?: string; cta_url?: string; cta2_label?: string; cta2_url?: string;
  image?: string; slides?: Slide[];
};

const s = (v: unknown) => (typeof v === 'string' ? v : '');

export function Hero({ content, locale, areasLabel }: { content: Content; locale: Locale; areasLabel: string }) {
  const slides = (Array.isArray(content.slides) ? content.slides : []).filter((x) => s(x?.image));
  const [active, setActive] = useState(0);
  const backdrop = slides.length ? slides.map((x) => s(x.image)) : [s(content.image)].filter(Boolean);

  return (
    <section className="hero flex flex-col" style={{ minHeight: 'min(46rem, calc(100svh - var(--header-h)))' }}>
      <div className="hero-media" aria-hidden="true">
        {backdrop.map((src, i) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img key={src + i} src={mediaUrl(src)} alt="" className={i === active ? 'is-active' : ''} loading={i === 0 ? 'eager' : 'lazy'} fetchPriority={i === 0 ? 'high' : 'low'} decoding="async" />
        ))}
      </div>
      <div className="hero-shade" />

      <div className="container flex flex-1 flex-col justify-center py-16 md:py-24">
        {s(content.eyebrow) && <p className="hero-rise text-sm font-bold text-amber-400">{s(content.eyebrow)}</p>}
        <h1 className="h-display hero-rise hero-rise-2 mt-4 max-w-5xl">{s(content.title)}</h1>
        {s(content.subtitle) && <p className="lead hero-rise hero-rise-3 mt-6 max-w-2xl !text-navy-100">{s(content.subtitle)}</p>}
        <div className="hero-rise hero-rise-3 mt-9 flex flex-wrap gap-3">
          {s(content.cta_label) && <Link href={localizedHref(s(content.cta_url) || '/services', locale)} className="btn btn-primary">{s(content.cta_label)}</Link>}
          {s(content.cta2_label) && <Link href={localizedHref(s(content.cta2_url) || '/contact', locale)} className="btn btn-outline-light">{s(content.cta2_label)}</Link>}
        </div>
      </div>

      {slides.length > 1 && (
        <nav className="hero-areas" aria-label={areasLabel}>
          <ul className="container flex snap-x snap-mandatory overflow-x-auto lg:grid lg:grid-cols-5 lg:overflow-visible" style={{ scrollbarWidth: 'none' }}>
            {slides.map((slide, i) => (
              <li key={i} className="min-w-[15.5rem] flex-1 snap-start lg:min-w-0 [&:first-child>a]:border-l-0 lg:[&:first-child>a]:border-l">
                <Link
                  href={localizedHref(s(slide.url) || '/services', locale)}
                  className="hero-area h-full"
                  data-active={i === active}
                  onMouseEnter={() => setActive(i)}
                  onFocus={() => setActive(i)}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={mediaUrl(s(slide.image))} alt="" loading="lazy" decoding="async" />
                  <span>{s(slide.label)}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </section>
  );
}
