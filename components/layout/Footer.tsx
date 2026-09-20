import Link from 'next/link';
import type { Locale } from '@/lib/config';
import type { SiteData } from '@/lib/cms-types';
import { makeUi } from '@/lib/defaults';
import { formatPhone, navHref, telHref } from '@/lib/nav';
import { mediaUrl } from '@/lib/media';
import { str } from '@/lib/cms';

export function Footer({ site, locale }: { site: SiteData; locale: Locale }) {
  const s = site.settings;
  const ui = makeUi(s, locale);
  const phone = str(s['contact.phone']);
  const email = str(s['contact.email']);
  const address = str(s['contact.business_address']);
  const name = str(s['company.name']) || 'ELDESCO';
  const logo = mediaUrl(str(s['brand.logo_light']) || '/images/brand/eldesco-logo-white.png');
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto bg-navy-900 text-white">
      <div className="container grid gap-12 py-16 lg:grid-cols-[1.3fr_.8fr_1fr] lg:py-20">
        <div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={logo} alt={name} className="h-24 w-auto" width={96} height={96} loading="lazy" />
          <p className="mt-6 max-w-md text-[.95rem] leading-7 text-navy-200">{str(s['company.tagline'])}</p>
        </div>

        <nav aria-label={ui('navigation')}>
          <h2 className="text-sm font-bold text-white">{ui('navigation')}</h2>
          <ul className="mt-5 space-y-3">
            {site.navigation.footer.map((item) => (
              <li key={(item.page_slug || item.url || '') + item.label}>
                <Link href={navHref(item, locale)} className="text-[.95rem] text-navy-200 transition hover:text-white">{item.label}</Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h2 className="text-sm font-bold text-white">{name}</h2>
          <address className="mt-5 space-y-3 text-[.95rem] not-italic leading-7 text-navy-200">
            {phone && <a className="block font-semibold text-white transition hover:text-amber-400" href={telHref(phone)}>{formatPhone(phone)}</a>}
            {email && <a className="block transition hover:text-white" href={`mailto:${email}`}>{email}</a>}
            {address && <p>{address}</p>}
          </address>
        </div>
      </div>

      <div className="deck-stripe">
        <div className="container flex flex-col gap-2 py-4 text-xs text-white/90 sm:flex-row sm:items-center sm:justify-between">
          <p>© {year} {name}. {ui('rights')}.</p>
          <p>{str(s['footer.bottom_text'])}</p>
        </div>
      </div>
    </footer>
  );
}
