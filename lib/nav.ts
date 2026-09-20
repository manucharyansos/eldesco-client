import type { Locale } from './config';
import type { NavItem } from './cms-types';

const EXTERNAL = /^(https?:|mailto:|tel:|#)/i;

/** Absolute path inside the site for a CMS link ("/services", "services/led-displays", "https://...") */
export function localizedHref(target: string | null | undefined, locale: Locale): string {
  const value = (target || '').trim();
  if (!value) return `/${locale}`;
  if (EXTERNAL.test(value)) return value;
  if (new RegExp(`^/${locale}(/|$)`).test(value)) return value;
  const clean = value.replace(/^\/+/, '');
  if (clean === 'home') return `/${locale}`;
  return `/${locale}/${clean}`;
}

export function navHref(item: NavItem, locale: Locale): string {
  if (item.url) return localizedHref(item.url, locale);
  return localizedHref(item.page_slug, locale);
}

export const isExternalHref = (href: string) => /^(https?:|mailto:|tel:)/i.test(href);

export const telHref = (phone: unknown) => `tel:${String(phone ?? '').replace(/[^\d+]/g, '')}`;

/** +37499694569 -> +374 99 694 569 (Armenian mobile format), otherwise untouched. */
export function formatPhone(phone: unknown): string {
  const raw = String(phone ?? '').trim();
  const digits = raw.replace(/[^\d+]/g, '');
  const match = digits.match(/^\+374(\d{2})(\d{3})(\d{3})$/);
  return match ? `+374 ${match[1]} ${match[2]} ${match[3]}` : raw;
}
