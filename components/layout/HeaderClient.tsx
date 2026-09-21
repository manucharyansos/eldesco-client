'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { LOCALES, type Locale } from '@/lib/config';

export type HeaderLink = { label: string; href: string; external?: boolean; newTab?: boolean; children?: HeaderLink[] };

type Props = {
  locale: Locale;
  logo: string;
  companyName: string;
  items: HeaderLink[];
  phone: string;
  phoneHref: string;
  labels: { openMenu: string; closeMenu: string; language: string; home: string };
};

const ChevronDown = () => (
  <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
    <path d="M1.5 3.5 5 7l3.5-3.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

function ItemLink({ item, className, onClick, pathname }: { item: HeaderLink; className?: string; onClick?: () => void; pathname: string }) {
  const current = !item.external && (pathname === item.href || (item.href.split('/').length > 2 && pathname.startsWith(`${item.href}/`)));
  const props = { className, onClick, 'aria-current': current ? ('page' as const) : undefined };
  if (item.external) return <a href={item.href} {...(item.newTab ? { target: '_blank', rel: 'noopener noreferrer' } : {})} {...props}>{item.label}</a>;
  return <Link href={item.href} {...props}>{item.label}</Link>;
}

export function HeaderClient({ locale, logo, companyName, items, phone, phoneHref, labels }: Props) {
  const pathname = usePathname() || `/${locale}`;
  const [open, setOpen] = useState(false);

  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  const switchTo = (lang: Locale) => {
    const segments = pathname.split('/').filter(Boolean);
    if ((LOCALES as readonly string[]).includes(segments[0])) segments[0] = lang;
    else segments.unshift(lang);
    return `/${segments.join('/')}`;
  };

  const langSwitch = (extra = '') => (
    <div className={`flex items-center gap-1 ${extra}`} role="group" aria-label={labels.language}>
      {LOCALES.map((lang) => (
        <Link
          key={lang}
          href={switchTo(lang)}
          hrefLang={lang}
          lang={lang}
          aria-current={lang === locale ? 'true' : undefined}
          className={`rounded px-2 py-1 text-xs font-bold tracking-wide transition ${lang === locale ? 'bg-navy-800 text-white' : 'text-steel-500 hover:text-navy-800'}`}
        >
          {lang.toUpperCase()}
        </Link>
      ))}
    </div>
  );

  return (
    <header className="sticky top-0 z-50 border-b border-steel-200 bg-white/95 backdrop-blur-md" style={{ height: 'var(--header-h)' }}>
      <div className="container flex h-full items-center justify-between gap-6">
        <Link href={`/${locale}`} className="flex shrink-0 items-center" aria-label={`${companyName} - ${labels.home}`}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={logo} alt={companyName} className="h-[46px] w-auto" width={46} height={46} />
        </Link>

        <nav className="hidden items-center gap-8 lg:flex" aria-label="Main">
          {items.map((item) =>
            item.children?.length ? (
              <div key={item.href + item.label} className="group relative">
                <ItemLink item={item} pathname={pathname} className="nav-link" />
                <span className="pointer-events-none absolute -right-4 top-1/2 -translate-y-1/2 text-steel-400"><ChevronDown /></span>
                <div className="invisible absolute left-1/2 top-full z-10 w-[22rem] -translate-x-1/2 pt-3 opacity-0 transition duration-150 group-focus-within:visible group-focus-within:opacity-100 group-hover:visible group-hover:opacity-100">
                  <ul className="rounded-md border border-steel-200 bg-white p-2 shadow-[0_18px_40px_-12px_rgba(7,26,51,.25)]">
                    {item.children.map((child) => (
                      <li key={child.href + child.label}>
                        <ItemLink item={child} pathname={pathname} className="block rounded px-3.5 py-2.5 text-sm font-semibold leading-snug text-steel-700 transition hover:bg-steel-50 hover:text-navy-800 aria-[current=page]:text-rust-600" />
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : (
              <ItemLink key={item.href + item.label} item={item} pathname={pathname} className="nav-link" />
            )
          )}
        </nav>

        <div className="flex items-center gap-3">
          {langSwitch('hidden sm:flex')}
          {phone && (
            <a href={phoneHref} className="btn btn-primary hidden !min-h-[2.6rem] !px-4 !py-2 text-sm xl:inline-flex">{phone}</a>
          )}
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? labels.closeMenu : labels.openMenu}
            className="flex h-11 w-11 items-center justify-center rounded border border-steel-200 text-navy-800 lg:hidden"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
              {open ? <path d="M4 4l12 12M16 4 4 16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /> : <path d="M3 5.5h14M3 10h14M3 14.5h14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />}
            </svg>
          </button>
        </div>
      </div>

      {open && (
        <div id="mobile-menu" className="absolute inset-x-0 top-full h-[calc(100dvh-var(--header-h))] overflow-y-auto border-t border-steel-200 bg-white shadow-2xl lg:hidden">
          <div className="container py-6">
            <ul className="divide-y divide-steel-200">
              {items.map((item) => (
                <li key={item.href + item.label} className="py-1">
                  <ItemLink item={item} pathname={pathname} onClick={() => setOpen(false)} className="block py-3 text-lg font-bold text-navy-800 aria-[current=page]:text-rust-600" />
                  {item.children?.length ? (
                    <ul className="mb-2 ml-1 border-l-2 border-steel-200 pl-4">
                      {item.children.map((child) => (
                        <li key={child.href + child.label}>
                          <ItemLink item={child} pathname={pathname} onClick={() => setOpen(false)} className="block py-2 text-[.95rem] font-medium text-steel-600 aria-[current=page]:text-rust-600" />
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </li>
              ))}
            </ul>
            <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
              {langSwitch()}
              {phone && <a href={phoneHref} className="btn btn-primary">{phone}</a>}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
