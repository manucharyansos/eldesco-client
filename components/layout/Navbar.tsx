'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface NavbarProps {
  locale: string;
}

export function Navbar({ locale }: NavbarProps) {
  const t = useTranslations('common');
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'hy', name: 'Հայերեն' },
    { code: 'ru', name: 'Русский' },
  ];

  const switchLanguage = (lang: string) => {
    router.push(`/${lang}`);
  };

  return (
    <nav className="navbar sticky top-0 z-40 bg-white border-b border-gray-200">
      <div className="navbar-container">
        <div className="flex items-center gap-8">
          <Link href={`/${locale}`} className="font-serif text-2xl font-bold text-primary-500">
            {t('appName')}
          </Link>

          <div className="hidden md:flex gap-6">
            <Link href={`/${locale}/services`} className="hover:text-accent-500">
              {t('services')}
            </Link>
            <Link href={`/${locale}/projects`} className="hover:text-accent-500">
              {t('projects')}
            </Link>
            <Link href={`/${locale}/team`} className="hover:text-accent-500">
              {t('team')}
            </Link>
            <Link href={`/${locale}/news`} className="hover:text-accent-500">
              {t('news')}
            </Link>
            <Link href={`/${locale}/gallery`} className="hover:text-accent-500">
              Gallery
            </Link>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex gap-2">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => switchLanguage(lang.code)}
                className={`px-2 py-1 text-sm rounded ${
                  locale === lang.code
                    ? 'bg-accent-500 text-white'
                    : 'bg-gray-100 hover:bg-gray-200'
                }`}
              >
                {lang.code.toUpperCase()}
              </button>
            ))}
          </div>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-2xl"
            aria-label="Toggle navigation"
          >
            ☰
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 p-4 space-y-2">
          <Link href={`/${locale}/services`} className="block py-2 hover:text-accent-500" onClick={() => setMobileMenuOpen(false)}>
            {t('services')}
          </Link>
          <Link href={`/${locale}/projects`} className="block py-2 hover:text-accent-500" onClick={() => setMobileMenuOpen(false)}>
            {t('projects')}
          </Link>
          <Link href={`/${locale}/team`} className="block py-2 hover:text-accent-500" onClick={() => setMobileMenuOpen(false)}>
            {t('team')}
          </Link>
          <Link href={`/${locale}/news`} className="block py-2 hover:text-accent-500" onClick={() => setMobileMenuOpen(false)}>
            {t('news')}
          </Link>
          <Link href={`/${locale}/gallery`} className="block py-2 hover:text-accent-500" onClick={() => setMobileMenuOpen(false)}>
            Gallery
          </Link>
        </div>
      )}
    </nav>
  );
}
