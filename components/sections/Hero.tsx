'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';

export function Hero() {
  const t = useTranslations('hero');
  const params = useParams();
  const locale = params.locale as string;

  return (
    <section className="hero">
      <div className="container">
        <h1 className="text-5xl md:text-6xl font-bold mb-6 animate-fade-in">
          {t('title')}
        </h1>
        <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto">
          {t('subtitle')}
        </p>
        <Link href={`/${locale}/services`} className="btn btn-primary text-lg px-8 py-3">
          {t('cta')}
        </Link>
      </div>
    </section>
  );
}
