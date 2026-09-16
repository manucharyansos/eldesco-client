import type { CmsPage, SiteSettings, Localized } from '@/types/cms';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

export function localize(value: any, locale: string): any {
  if (value == null) return value;

  if (Array.isArray(value)) {
    return value.map((item) => localize(item, locale));
  }

  if (typeof value !== 'object') return value;

  const keys = Object.keys(value);
  const looksLocalized = keys.some((key) => ['hy', 'en', 'ru'].includes(key));

  if (looksLocalized) {
    return value[locale] ?? value.en ?? value.hy ?? value.ru ?? '';
  }

  return Object.fromEntries(
    Object.entries(value).map(([key, child]) => [key, localize(child, locale)])
  );
}

export function localizedText(value: Localized | string | null | undefined, locale: string) {
  if (!value) return '';
  if (typeof value === 'string') return value;
  return value[locale] || value.en || value.hy || value.ru || '';
}

export async function getPage(slug: string): Promise<CmsPage | null> {
  try {
    const response = await fetch(`${API_URL}/pages/${slug}`, {
      next: { revalidate: 60 },
    });

    if (!response.ok) return null;
    return response.json();
  } catch {
    return null;
  }
}

export async function getSiteSettings(): Promise<SiteSettings> {
  try {
    const response = await fetch(`${API_URL}/site-settings`, {
      next: { revalidate: 60 },
    });
    if (!response.ok) return {};
    return response.json();
  } catch {
    return {};
  }
}
