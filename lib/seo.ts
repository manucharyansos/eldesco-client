import type { Metadata } from 'next';
import { LOCALES, OG_LOCALE, SITE_URL, type Locale } from './config';
import { mediaUrl } from './media';

/** Canonical + hreflang alternates for a path such as "services/led-displays" ("" = home). */
export function pageMetadata(opts: { locale: Locale; path?: string; title?: string | null; description?: string | null; image?: string | null }): Metadata {
  const path = (opts.path || '').replace(/^\/+|\/+$/g, '');
  const suffix = path ? `/${path}` : '';
  const languages: Record<string, string> = {};
  for (const l of LOCALES) languages[l] = `/${l}${suffix}`;
  languages['x-default'] = `/hy${suffix}`;
  const image = mediaUrl(opts.image);

  return {
    title: opts.title || undefined,
    description: opts.description || undefined,
    alternates: { canonical: `/${opts.locale}${suffix}`, languages },
    openGraph: {
      locale: OG_LOCALE[opts.locale],
      url: `${SITE_URL}/${opts.locale}${suffix}`,
      title: opts.title || undefined,
      description: opts.description || undefined,
      images: image ? [{ url: image.startsWith('http') ? image : `${SITE_URL}${image}` }] : undefined,
    },
  };
}

export const firstImage = (page: { sections: Array<{ type: string; content: Record<string, any> }> } | null): string | null => {
  const hero = page?.sections.find((s) => (s.type === 'page_hero' || s.type === 'hero') && typeof s.content?.image === 'string');
  return hero ? (hero.content.image as string) : null;
};
