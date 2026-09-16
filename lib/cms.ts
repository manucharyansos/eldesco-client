import type { CmsPage, MediaAsset, SettingRow, SitePayload } from '@/types/cms';

export const API_BASE = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1').replace(/\/$/, '');

async function publicFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: {
      Accept: 'application/json',
      ...(init?.headers || {}),
    },
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error(`ELDESCO API ${response.status}: ${path}`);
  }

  return response.json();
}

export async function getSite(locale: string): Promise<SitePayload> {
  return publicFetch<SitePayload>(`/site?locale=${encodeURIComponent(locale)}`);
}

export async function getPublicPage(slug: string): Promise<CmsPage> {
  return publicFetch<CmsPage>(`/pages/${encodeURIComponent(slug)}`);
}

function token(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('eldesco_admin_token');
}

async function adminFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const authToken = token();
  const isForm = typeof FormData !== 'undefined' && init?.body instanceof FormData;
  const response = await fetch(`${API_BASE}/admin${path}`, {
    ...init,
    headers: {
      Accept: 'application/json',
      ...(isForm ? {} : { 'Content-Type': 'application/json' }),
      ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
      ...(init?.headers || {}),
    },
  });

  if (response.status === 401) {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('eldesco_admin_token');
      if (!window.location.pathname.includes('/admin/login')) window.location.href = '/admin/login';
    }
    throw new Error('Unauthorized');
  }

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const message = data?.message || Object.values(data?.errors || {}).flat().join('\n') || `Request failed (${response.status})`;
    throw new Error(String(message));
  }
  return data as T;
}

export const adminApi = {
  async login(email: string, password: string) {
    const response = await fetch(`${API_BASE}/admin/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(data?.message || 'Login failed');
    if (typeof window !== 'undefined') localStorage.setItem('eldesco_admin_token', data.token);
    return data;
  },
  logout: () => adminFetch('/logout', { method: 'POST' }),
  me: () => adminFetch('/me'),
  pages: () => adminFetch<CmsPage[]>('/pages'),
  page: (id: number | string) => adminFetch<CmsPage>(`/pages/${id}`),
  createPage: (page: Partial<CmsPage>) => adminFetch<CmsPage>('/pages', { method: 'POST', body: JSON.stringify(page) }),
  savePage: (id: number, page: Partial<CmsPage>) => adminFetch<CmsPage>(`/pages/${id}`, { method: 'PUT', body: JSON.stringify(page) }),
  deletePage: (id: number) => adminFetch(`/pages/${id}`, { method: 'DELETE' }),
  settings: () => adminFetch<SettingRow[]>('/settings'),
  saveSettings: (settings: SettingRow[]) => adminFetch<SettingRow[]>('/settings', { method: 'PUT', body: JSON.stringify({ settings }) }),
  media: (page = 1) => adminFetch<{ data: MediaAsset[]; current_page: number; last_page: number }>(`/media?page=${page}`),
  uploadMedia: async (file: File, alt?: { hy?: string; en?: string; ru?: string }) => {
    const form = new FormData();
    form.append('file', file);
    if (alt?.hy) form.append('alt_hy', alt.hy);
    if (alt?.en) form.append('alt_en', alt.en);
    if (alt?.ru) form.append('alt_ru', alt.ru);
    return adminFetch<MediaAsset>('/media', { method: 'POST', body: form });
  },
  deleteMedia: (id: number) => adminFetch(`/media/${id}`, { method: 'DELETE' }),
};

export function hasAdminToken(): boolean {
  return typeof window !== 'undefined' && Boolean(localStorage.getItem('eldesco_admin_token'));
}
