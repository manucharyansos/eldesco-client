'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';

interface NavbarProps {
  locale: string;
}

const label = (locale: string, hy: string, en: string, ru: string) =>
  locale === 'hy' ? hy : locale === 'ru' ? ru : en;

export function Navbar({ locale }: NavbarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const nav = [
    { href: 'about', text: label(locale, 'Մեր մասին', 'About', 'О нас') },
    { href: 'services', text: label(locale, 'Ծառայություններ', 'Services', 'Услуги') },
    { href: 'projects', text: label(locale, 'Նախագծեր', 'Projects', 'Проекты') },
    { href: 'contact', text: label(locale, 'Կապ մեզ հետ', 'Contact', 'Контакты') },
  ];

  const switchLanguage = (lang: string) => {
    const segments = pathname.split('/').filter(Boolean);
    if (['hy', 'en', 'ru'].includes(segments[0])) segments[0] = lang;
    else segments.unshift(lang);
    router.push(`/${segments.join('/')}`);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/70 bg-white/95 backdrop-blur-xl">
      <div className="container flex h-[86px] items-center justify-between gap-6">
        <Link
          href={`/${locale}`}
          className="group flex items-center rounded-2xl bg-[#0b1f33] px-3 py-2 shadow-[0_10px_30px_rgba(11,31,51,.16)] transition hover:-translate-y-0.5 hover:shadow-[0_16px_38px_rgba(11,31,51,.22)]"
          aria-label="ELDESCO home"
        >
          <img
            src="/images/brand/eldesco-logo.png"
            alt="ELDESCO"
            className="h-12 w-auto max-w-[170px] object-contain brightness-[1.7] contrast-125 transition duration-300 group-hover:scale-[1.02]"
          />
        </Link>

        <nav className="hidden items-center gap-7 lg:flex">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={`/${locale}/${item.href}`}
              className="relative py-2 text-sm font-semibold text-slate-700 transition hover:text-slate-950 after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-orange-500 after:transition-all hover:after:w-full"
            >
              {item.text}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <div className="hidden rounded-full border border-slate-200 bg-slate-50 p-1 sm:flex">
            {['hy', 'en', 'ru'].map((lang) => (
              <button
                key={lang}
                onClick={() => switchLanguage(lang)}
                className={`rounded-full px-3 py-1.5 text-xs font-bold transition ${
                  locale === lang ? 'bg-slate-950 text-white shadow' : 'text-slate-500 hover:text-slate-950'
                }`}
              >
                {lang.toUpperCase()}
              </button>
            ))}
          </div>

          <button
            onClick={() => setMobileMenuOpen((value) => !value)}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 text-xl text-slate-900 lg:hidden"
            aria-label="Toggle navigation"
          >
            {mobileMenuOpen ? '×' : '☰'}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="border-t border-slate-200 bg-white px-4 py-5 shadow-xl lg:hidden">
          <div className="container space-y-1">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={`/${locale}/${item.href}`}
                onClick={() => setMobileMenuOpen(false)}
                className="block rounded-xl px-4 py-3 font-semibold text-slate-800 transition hover:bg-slate-50 hover:text-orange-600"
              >
                {item.text}
              </Link>
            ))}
            <div className="flex gap-2 px-4 pt-4 sm:hidden">
              {['hy', 'en', 'ru'].map((lang) => (
                <button
                  key={lang}
                  onClick={() => switchLanguage(lang)}
                  className={`rounded-full px-4 py-2 text-xs font-bold ${locale === lang ? 'bg-slate-950 text-white' : 'bg-slate-100 text-slate-600'}`}
                >
                  {lang.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
