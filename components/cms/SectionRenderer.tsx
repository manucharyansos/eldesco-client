import Link from 'next/link';
import type { CmsSection } from '@/lib/api';

const text = (value: unknown) => typeof value === 'string' ? value : '';
const list = (value: unknown) => Array.isArray(value) ? value : [];

export function SectionRenderer({ section, locale }: { section: CmsSection; locale: string }) {
  const c = section.content ?? {};
  if (!section.is_active) return null;

  if (section.type === 'hero') return <section className="relative overflow-hidden bg-slate-950 py-28 text-white"><div className="container relative z-10"><p className="mb-4 font-semibold uppercase tracking-[.25em] text-orange-400">{text(c.eyebrow)}</p><h1 className="max-w-5xl text-5xl font-bold leading-tight md:text-7xl">{text(c.title)}</h1><p className="mt-7 max-w-3xl text-xl text-slate-300">{text(c.subtitle)}</p>{text(c.cta_label) && <Link className="mt-9 inline-flex rounded-xl bg-orange-600 px-6 py-3 font-semibold" href={text(c.cta_url) || `/${locale}/services`}>{text(c.cta_label)}</Link>}</div></section>;

  if (section.type === 'intro') return <section className="py-20"><div className="container grid gap-10 md:grid-cols-[.7fr_1.3fr]"><h2 className="text-4xl font-bold">{text(c.title)}</h2><div className="space-y-5 text-lg leading-8 text-slate-600">{list(c.paragraphs).map((p, i) => <p key={i}>{text(p)}</p>)}</div></div></section>;

  if (section.type === 'services') return <section className="bg-slate-50 py-20"><div className="container"><p className="font-semibold uppercase tracking-[.2em] text-orange-600">{text(c.eyebrow)}</p><h2 className="mt-3 text-4xl font-bold">{text(c.title)}</h2><div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">{list(c.items).map((item, i) => { const x = item as Record<string, unknown>; return <article key={i} className="rounded-2xl border bg-white p-7"><span className="text-sm font-bold text-orange-600">0{i + 1}</span><h3 className="mt-5 text-xl font-bold">{text(x.title)}</h3><p className="mt-3 text-slate-600">{text(x.description)}</p></article>; })}</div></div></section>;

  if (section.type === 'stats') return <section className="bg-orange-600 py-12 text-white"><div className="container grid gap-8 sm:grid-cols-2 lg:grid-cols-4">{list(c.items).map((item, i) => { const x = item as Record<string, unknown>; return <div key={i}><div className="text-4xl font-bold">{text(x.value)}</div><div className="mt-2 text-orange-100">{text(x.label)}</div></div>; })}</div></section>;

  if (section.type === 'contact') return <section className="py-20"><div className="container rounded-3xl bg-slate-950 p-10 text-white md:p-16"><h2 className="text-4xl font-bold">{text(c.title)}</h2><p className="mt-4 max-w-2xl text-slate-300">{text(c.description)}</p><div className="mt-8 flex flex-wrap gap-5 text-lg"><a href={`tel:${text(c.phone)}`}>{text(c.phone)}</a><a href={`mailto:${text(c.email)}`}>{text(c.email)}</a><span>{text(c.address)}</span></div></div></section>;

  return null;
}
