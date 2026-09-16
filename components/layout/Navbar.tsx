'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

const fallbackNavigation = [
  { slug: 'about', label: { hy: 'Մեր մասին', en: 'About', ru: 'О нас' } },
  { slug: 'power-infrastructure', label: { hy: 'Էներգետիկա', en: 'Power', ru: 'Энергетика' } },
  { slug: 'industrial-infrastructure', label: { hy: 'Արտադրություն', en: 'Industrial', ru: 'Промышленность' } },
  { slug: 'metal-processing', label: { hy: 'Մետաղամշակում', en: 'Metalworks', ru: 'Металлообработка' } },
  { slug: 'contact', label: { hy: 'Կապ', en: 'Contact', ru: 'Контакты' } },
];

export function Navbar({ locale }: { locale: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [navigation, setNavigation] = useState(fallbackNavigation as any[]);

  useEffect(() => {
    fetch(`${API_URL}/site-settings`)
      .then((r) => r.ok ? r.json() : {})
      .then((settings) => {
        if (Array.isArray(settings.navigation) && settings.navigation.length) setNavigation(settings.navigation);
      })
      .catch(() => undefined);
  }, []);

  const text = (value: any) => typeof value === 'string' ? value : value?.[locale] || value?.en || value?.hy || value?.ru || '';

  const switchLanguage = (nextLocale: string) => {
    const parts = pathname.split('/').filter(Boolean);
    if (parts.length && ['hy', 'en', 'ru'].includes(parts[0])) parts[0] = nextLocale;
    else parts.unshift(nextLocale);
    router.push('/' + parts.join('/'));
  };

  return (
    <header className="navbar">
      <div className="navbar-container">
        <Link href={`/${locale}`} className="flex items-center gap-3 group">
          <span className="w-9 h-9 rounded-full border border-slate-300 grid place-items-center text-orange-600 font-serif text-lg group-hover:border-orange-500 transition">E</span>
          <span className="font-bold tracking-[.18em] text-[15px] text-slate-900">ELDESCO</span>
        </Link>

        <nav className="hidden xl:flex items-center gap-7">
          {navigation.map((item: any) => (
            <Link key={item.slug} href={`/${locale}/${item.slug}`} className="text-sm font-semibold text-slate-600 hover:text-orange-600 transition">
              {text(item.label)}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <div className="hidden sm:flex items-center rounded-full border border-slate-200 p-1">
            {['hy', 'en', 'ru'].map((lang) => (
              <button key={lang} onClick={() => switchLanguage(lang)} className={`text-[11px] font-bold w-9 h-8 rounded-full transition ${locale === lang ? 'bg-slate-900 text-white' : 'text-slate-500 hover:bg-slate-100'}`}>
                {lang.toUpperCase()}
              </button>
            ))}
          </div>
          <Link href={`/${locale}/contact`} className="hidden md:inline-flex px-4 py-2.5 rounded-full bg-orange-600 text-white text-sm font-bold hover:bg-orange-700 transition">{locale === 'hy' ? 'Կապ մեզ հետ' : locale === 'ru' ? 'Связаться' : 'Contact us'}</Link>
          <button className="xl:hidden w-10 h-10 rounded-full border text-xl" onClick={() => setOpen(!open)} aria-label="Menu">{open ? '×' : '≡'}</button>
        </div>
      </div>

      {open && (
        <div className="xl:hidden border-t bg-white px-5 py-5 shadow-lg">
          <div className="grid gap-1">
            {navigation.map((item: any) => (
              <Link key={item.slug} href={`/${locale}/${item.slug}`} onClick={() => setOpen(false)} className="py-3 text-lg font-semibold border-b border-slate-100">{text(item.label)}</Link>
            ))}
            <div className="flex gap-2 pt-4 sm:hidden">
              {['hy', 'en', 'ru'].map((lang) => <button key={lang} onClick={() => switchLanguage(lang)} className={`px-3 py-2 rounded-lg text-xs font-bold ${locale === lang ? 'bg-slate-900 text-white' : 'bg-slate-100'}`}>{lang.toUpperCase()}</button>)}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
