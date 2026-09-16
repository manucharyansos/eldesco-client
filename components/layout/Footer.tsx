'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

export function Footer({ locale }: { locale: string }) {
  const [settings, setSettings] = useState<any>({});

  useEffect(() => {
    fetch(`${API_URL}/site-settings`)
      .then((r) => r.ok ? r.json() : {})
      .then(setSettings)
      .catch(() => undefined);
  }, []);

  const local = (value: any) => typeof value === 'string' ? value : value?.[locale] || value?.en || value?.hy || value?.ru || '';
  const contact = settings.contact || {};
  const navigation = Array.isArray(settings.navigation) ? settings.navigation : [];

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="grid lg:grid-cols-[1.25fr_.75fr_.75fr] gap-12">
          <div>
            <div className="text-xs font-bold tracking-[.25em] text-orange-400 mb-4">ELDESCO</div>
            <h3 className="text-4xl md:text-5xl font-serif max-w-xl leading-tight">
              {locale === 'hy' ? 'Էներգետիկ ենթակառուցվածքներ և ինժեներական համակարգեր' : locale === 'ru' ? 'Энергетическая инфраструктура и инженерные системы' : 'Energy infrastructure & engineering systems'}
            </h3>
          </div>

          <div>
            <div className="text-xs uppercase tracking-[.2em] text-slate-500 mb-5">Navigation</div>
            <div className="space-y-3 text-slate-300">
              {navigation.slice(0, 6).map((item: any) => <Link key={item.slug} className="block hover:text-orange-400" href={`/${locale}/${item.slug}`}>{local(item.label)}</Link>)}
            </div>
          </div>

          <div>
            <div className="text-xs uppercase tracking-[.2em] text-slate-500 mb-5">Contact</div>
            <div className="space-y-3 text-slate-300">
              <a className="block hover:text-orange-400" href={`tel:${contact.phone || '+37499694569'}`}>{contact.phone || '+374 99 694 569'}</a>
              <a className="block hover:text-orange-400" href={`mailto:${contact.email || 'eldesco@eldesco.am'}`}>{contact.email || 'eldesco@eldesco.am'}</a>
              <div>{local(contact.address) || 'Yerevan, Armenia'}</div>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 mt-14 pt-6 flex flex-wrap gap-4 items-center justify-between text-xs text-slate-500">
          <span>© {new Date().getFullYear()} ELDESCO LLC</span>
          <Link href="/admin/login" className="hover:text-slate-300">Admin</Link>
        </div>
      </div>
    </footer>
  );
}
