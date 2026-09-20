import type { Locale } from '@/lib/config';
import type { NavItem, SiteData } from '@/lib/cms-types';
import { makeUi } from '@/lib/defaults';
import { formatPhone, isExternalHref, navHref, telHref } from '@/lib/nav';
import { mediaUrl } from '@/lib/media';
import { str } from '@/lib/cms';
import { HeaderClient, type HeaderLink } from './HeaderClient';

export function toLinks(items: NavItem[], locale: Locale): HeaderLink[] {
  return items.map((item) => {
    const href = navHref(item, locale);
    return {
      label: item.label,
      href,
      external: isExternalHref(href),
      newTab: item.target === '_blank',
      children: item.children?.length ? toLinks(item.children, locale) : undefined,
    };
  });
}

export function Header({ site, locale }: { site: SiteData; locale: Locale }) {
  const s = site.settings;
  const ui = makeUi(s, locale);
  const phone = str(s['contact.phone']);

  return (
    <HeaderClient
      locale={locale}
      logo={mediaUrl(str(s['brand.logo']) || '/images/brand/eldesco-logo.png')}
      companyName={str(s['company.name']) || 'ELDESCO'}
      items={toLinks(site.navigation.header, locale)}
      phone={phone ? formatPhone(phone) : ''}
      phoneHref={telHref(phone)}
      labels={{ openMenu: ui('open_menu'), closeMenu: ui('close_menu'), language: ui('language'), home: ui('home') }}
    />
  );
}
