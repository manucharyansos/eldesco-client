'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';

interface FooterProps {
  locale: string;
}

export function Footer({ locale }: FooterProps) {
  const t = useTranslations('common');

  return (
    <footer className="footer bg-primary-500 text-white mt-auto">
      <div className="footer-container">
        <div>
          <h3 className="font-serif text-lg font-bold mb-4">{t('appName')}</h3>
          <p className="text-sm text-gray-300">{t('tagline')}</p>
        </div>

        <div>
          <h4 className="font-bold mb-4">{t('contact')}</h4>
          <p className="text-sm text-gray-300 mb-2">
            <strong>{t('phone')}:</strong> +374 (10) 599-694-569
          </p>
          <p className="text-sm text-gray-300 mb-2">
            <strong>{t('email')}:</strong> eldesco@eldesco.am
          </p>
          <p className="text-sm text-gray-300">
            <strong>{t('address')}:</strong> Yerevan, Tbilisyan 35/9
          </p>
        </div>

        <div>
          <h4 className="font-bold mb-4">Quick Links</h4>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href={`/${locale}/services`} className="hover:text-accent-500">
                {t('services')}
              </Link>
            </li>
            <li>
              <Link href={`/${locale}/projects`} className="hover:text-accent-500">
                {t('projects')}
              </Link>
            </li>
            <li>
              <Link href={`/${locale}/team`} className="hover:text-accent-500">
                {t('team')}
              </Link>
            </li>
            <li>
              <Link href={`/${locale}/news`} className="hover:text-accent-500">
                {t('news')}
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-primary-400 mt-8 pt-8 text-center text-sm text-gray-300">
        <p>&copy; 2024 ELDESCO LLC. {t('footer.rights')}</p>
      </div>
    </footer>
  );
}
