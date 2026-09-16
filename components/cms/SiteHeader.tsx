'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { SitePayload } from '@/types/cms';
import { tx } from '@/types/cms';

export function SiteHeader({ site, locale }: { site: SitePayload; locale: string }) {
  const pathname = usePathname();
  const brand = site.settings['site.name'] || 'ELDESCO';
  const logoUrl = site.settings['site.logo_url'];

  const localePath = (nextLocale: string) => {
    const parts = (pathname || '/').split('/').filter(Boolean);
    if (parts.length && ['hy', 'en', 'ru'].includes(parts[0])) parts[0] = nextLocale;
    else parts.unshift(nextLocale);
    return `/${parts.join('/')}`;
  };

  const labels: Record<string, string> = {
    hy: 'ՀՅ', en: 'EN', ru: 'RU',
  };

  return (
    <header className="site-header">
      <div className="site-header__bar">
        <Link href={`/${locale}`} className="brand" aria-label="ELDESCO home">
          {logoUrl ? (
            <img src={logoUrl} alt={String(brand)} className="brand__image" />
          ) : (
            <span className="brand__mark" aria-hidden="true">
              <svg viewBox="0 0 64 58" role="img"><path d="M32 3 59 53H5L32 3Z"/><circle cx="32" cy="32" r="4"/><path d="M32 7v21M9 49l19-14M55 49 36 35"/></svg>
            </span>
          )}
          <span className="brand__text">{String(brand)}</span>
        </Link>

        <nav className="desktop-nav" aria-label="Primary navigation">
          {site.navigation.map((item) => (
            <Link key={item.id} href={item.slug === 'home' ? `/${locale}` : `/${locale}/${item.slug}`}>
              {item.title}
            </Link>
          ))}
        </nav>

        <div className="language-switch" aria-label="Language">
          {site.supported_locales.map((code) => (
            <Link key={code} href={localePath(code)} className={code === locale ? 'is-active' : ''}>
              {labels[code] || code.toUpperCase()}
            </Link>
          ))}
        </div>

        <details className="mobile-menu">
          <summary aria-label="Open navigation"><span/><span/><span/></summary>
          <div className="mobile-menu__panel">
            {site.navigation.map((item) => (
              <Link key={item.id} href={item.slug === 'home' ? `/${locale}` : `/${locale}/${item.slug}`}>
                {item.title}
              </Link>
            ))}
            <div className="mobile-menu__languages">
              {site.supported_locales.map((code) => <Link key={code} href={localePath(code)}>{labels[code] || code}</Link>)}
            </div>
          </div>
        </details>
      </div>
    </header>
  );
}
