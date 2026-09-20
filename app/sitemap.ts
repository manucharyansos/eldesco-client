import type { MetadataRoute } from 'next';
import { API_URL, LOCALES, SITE_URL } from '@/lib/config';

export const revalidate = 3600;

type PageRow = { slug: string };

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  let slugs: string[] = ['about', 'services', 'customers', 'contact'];
  try {
    const r = await fetch(`${API_URL}/pages?lang=hy`, { next: { revalidate: 3600 } });
    if (r.ok) slugs = ((await r.json()) as PageRow[]).map((p) => p.slug).filter((s) => s !== 'home');
  } catch { /* keep the defaults */ }

  const serviceSlugs = new Set(['power-infrastructure', 'industrial-infrastructure', 'led-displays', 'refrigeration', 'sheet-metal-processing']);
  const paths = ['', ...slugs.map((s) => (serviceSlugs.has(s) ? `services/${s}` : s)), 'projects'];
  const unique = Array.from(new Set(paths));

  return unique.flatMap((path) =>
    LOCALES.map((locale) => ({
      url: `${SITE_URL}/${locale}${path ? `/${path}` : ''}`,
      changeFrequency: 'monthly' as const,
      priority: path === '' ? 1 : 0.7,
      alternates: { languages: Object.fromEntries(LOCALES.map((l) => [l, `${SITE_URL}/${l}${path ? `/${path}` : ''}`])) },
    }))
  );
}
