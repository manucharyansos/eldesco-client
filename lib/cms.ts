import { cache } from 'react';
import { API_URL, type Locale } from './config';
import type { CmsPage, ProjectItem, ServiceItem, SiteData } from './cms-types';
import { fallbackSite } from './defaults';

/** Public content loader. Static deploys resolve this during build; dev/SSR uses the same API source. */
export const CMS_TAG = 'cms';

async function get<T>(path: string): Promise<T | null> {
  try {
    const response = await fetch(`${API_URL}${path}`, {
      headers: { Accept: 'application/json' }
    });
    if (!response.ok) return null;
    return (await response.json()) as T;
  } catch {
    return null;
  }
}

export const getSite = cache(async (locale: Locale): Promise<SiteData> => {
  const fallback = fallbackSite(locale);
  const data = await get<SiteData>(`/site?lang=${locale}`);
  if (!data) return fallback;

  return {
    // Anything the admin has not filled in yet falls back to the built-in default.
    settings: { ...fallback.settings, ...(data.settings ?? {}) },
    navigation: {
      header: data.navigation?.header?.length ? data.navigation.header : fallback.navigation.header,
      footer: data.navigation?.footer?.length ? data.navigation.footer : fallback.navigation.footer,
    },
  };
});

export const getPage = cache(async (slug: string, locale: Locale): Promise<CmsPage | null> => {
  return get<CmsPage>(`/pages/${encodeURIComponent(slug)}?lang=${locale}`);
});

export const getServices = cache(async (locale: Locale): Promise<ServiceItem[]> => {
  return (await get<ServiceItem[]>(`/services?lang=${locale}`)) ?? [];
});

export const getProjects = cache(async (locale: Locale): Promise<ProjectItem[]> => {
  return (await get<ProjectItem[]>(`/projects?lang=${locale}`)) ?? [];
});

export const getProject = cache(async (id: string, locale: Locale): Promise<ProjectItem | null> => {
  return get<ProjectItem>(`/projects/${encodeURIComponent(id)}?lang=${locale}`);
});

export const str = (value: unknown): string => (typeof value === 'string' ? value : typeof value === 'number' ? String(value) : '');
