'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';

interface FooterProps {
  locale: string;
}

const addresses: Record<string, string> = {
  hy: 'ՀՀ, ք․ Երևան, Թբիլիսյան 35/9',
  en: '35/9 Tbilisyan Hwy, Yerevan, Armenia',
  ru: 'Армения, Ереван, Тбилисское шоссе 35/9',
};

export function Footer({ locale }: FooterProps) {
  const common = useTranslations('common');
  const footer = useTranslations('footer');
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto bg-primary-500 text-white">
      <div className="footer-container grid gap-10 py-12 md:grid-cols-3">
        <div>
          <h3 className="mb-4 font-serif text-xl font-bold">{common('appName')}</h3>
          <p className="max-w-sm text-sm leading-6 text-gray-300">{common('tagline')}</p>
        </div>

        <div>
          <h4 className="mb-4 font-bold">{common('contact')}</h4>
          <div className="space-y-2 text-sm text-gray-300">
            <p>
              <strong>{footer('phone')}:</strong>{' '}
              <a className="hover:text-accent-500" href="tel:+37499694569">+374 99 694 569</a>
            </p>
            <p>
              <strong>{footer('email')}:</strong>{' '}
              <a className="hover:text-accent-500" href="mailto:eldesco@eldesco.am">eldesco@eldesco.am</a>
            </p>
            <p><strong>{footer('address')}:</strong> {addresses[locale] ?? addresses.hy}</p>
          </div>
        </div>

        <div>
          <h4 className="mb-4 font-bold">{locale === 'hy' ? 'Արագ հղումներ' : locale === 'ru' ? 'Быстрые ссылки' : 'Quick links'}</h4>
          <ul className="space-y-2 text-sm text-gray-300">
            <li><Link href={`/${locale}/services`} className="hover:text-accent-500">{common('services')}</Link></li>
            <li><Link href={`/${locale}/projects`} className="hover:text-accent-500">{common('projects')}</Link></li>
            <li><Link href={`/${locale}/team`} className="hover:text-accent-500">{common('team')}</Link></li>
            <li><Link href={`/${locale}/news`} className="hover:text-accent-500">{common('news')}</Link></li>
            <li><Link href={`/${locale}/gallery`} className="hover:text-accent-500">{locale === 'hy' ? 'Պատկերասրահ' : locale === 'ru' ? 'Галерея' : 'Gallery'}</Link></li>
          </ul>
        </div>
      </div>

      <div className="border-t border-primary-400 py-6 text-center text-sm text-gray-300">
        <p>&copy; {year} ELDESCO LLC. {footer('rights')}</p>
      </div>
    </footer>
  );
}
