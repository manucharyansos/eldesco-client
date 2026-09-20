import type { Metadata } from 'next';
import { LOCALES, OG_LOCALE, SITE_URL, type Locale } from './config';
import { mediaUrl } from './media';

/**
 * Canonical + hreflang alternates for a path such as "services/led-displays" ("" = home).
 * Keys without a value are left out on purpose: an explicit `title: undefined` would wipe the layout default.
 * `absoluteTitle` skips the "| Site name" suffix (used for the home page).
 */
export function pageMetadata(opts: { locale: Locale; path?: string; title?: string | null; absoluteTitle?: boolean; description?: string | null; image?: string | null }): Metadata {
  const path = (opts.path || '').replace(/^\/+|\/+$/g, '');
  const suffix = path ? `/${path}` : '';
  const languages: Record<string, string> = {};
  for (const l of LOCALES) languages[l] = `/${l}${suffix}`;
  languages['x-default'] = `/hy${suffix}`;
  const image = mediaUrl(opts.image);

  const openGraph: NonNullable<Metadata['openGraph']> = { locale: OG_LOCALE[opts.locale], url: `${SITE_URL}/${opts.locale}${suffix}` };
  const meta: Metadata = { alternates: { canonical: `/${opts.locale}${suffix}`, languages }, openGraph };

  if (opts.title) {
    meta.title = opts.absoluteTitle ? { absolute: opts.title } : opts.title;
    openGraph.title = opts.title;
  }
  if (opts.description) {
    meta.description = opts.description;
    openGraph.description = opts.description;
  }
  if (image) openGraph.images = [{ url: image.startsWith('http') ? image : `${SITE_URL}${image}` }];

  return meta;
}

export const firstImage = (page: { sections: Array<{ type: string; content: Record<string, any> }> } | null): string | null => {
  const hero = page?.sections.find((s) => (s.type === 'page_hero' || s.type === 'hero') && typeof s.content?.image === 'string');
  return hero ? (hero.content.image as string) : null;
};
