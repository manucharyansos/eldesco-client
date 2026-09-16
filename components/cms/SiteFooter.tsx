import Link from 'next/link';
import type { SitePayload, TranslatedText } from '@/types/cms';
import { tx } from '@/types/cms';

function setting(value: unknown, locale: string): string {
  if (typeof value === 'string' || typeof value === 'number') return String(value);
  if (value && typeof value === 'object') return tx(value as TranslatedText, locale);
  return '';
}

export function SiteFooter({ site, locale }: { site: SitePayload; locale: string }) {
  const name = setting(site.settings['site.name'], locale) || 'ELDESCO';
  const tagline = setting(site.settings['site.tagline'], locale);
  const address = setting(site.settings['contact.address'], locale);
  const phone = setting(site.settings['contact.phone'], locale);
  const email = setting(site.settings['contact.email'], locale);

  return (
    <footer className="site-footer">
      <div className="shell site-footer__grid">
        <div>
          <div className="site-footer__brand">{name}</div>
          {tagline && <p>{tagline}</p>}
        </div>
        <div>
          <h3>{locale === 'hy' ? 'Բաժիններ' : locale === 'ru' ? 'Разделы' : 'Navigation'}</h3>
          <div className="site-footer__links">
            {site.navigation.map((item) => (
              <Link key={item.id} href={item.slug === 'home' ? `/${locale}` : `/${locale}/${item.slug}`}>{item.title}</Link>
            ))}
          </div>
        </div>
        <div>
          <h3>{locale === 'hy' ? 'Կապ' : locale === 'ru' ? 'Контакты' : 'Contact'}</h3>
          <div className="site-footer__links">
            {address && <span>{address}</span>}
            {phone && <a href={`tel:${phone.replace(/\s/g, '')}`}>{phone}</a>}
            {email && <a href={`mailto:${email}`}>{email}</a>}
          </div>
        </div>
      </div>
      <div className="shell site-footer__bottom">© {new Date().getFullYear()} {name}. All rights reserved.</div>
    </footer>
  );
}
