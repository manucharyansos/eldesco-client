'use client';

import type { CmsPage, CmsSection } from '@/types/cms';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

function token() {
  return typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const auth = token();
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      ...(options.body instanceof FormData ? {} : { 'Content-Type': 'application/json' }),
      ...(auth ? { Authorization: `Bearer ${auth}` } : {}),
      ...(options.headers || {}),
    },
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(body || `Request failed: ${response.status}`);
  }

  if (response.status === 204) return undefined as T;
  return response.json();
}

export const cmsAdmin = {
  pages: () => request<CmsPage[]>('/admin/pages'),
  page: (slug: string) => request<CmsPage>(`/admin/pages/${slug}`),
  updatePage: (id: number, data: Partial<CmsPage>) => request<CmsPage>(`/admin/pages/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  createPage: (data: any) => request<CmsPage>('/admin/pages', { method: 'POST', body: JSON.stringify(data) }),
  deletePage: (id: number) => request<void>(`/admin/pages/${id}`, { method: 'DELETE' }),
  createSection: (pageId: number, data: Partial<CmsSection>) => request<CmsSection>(`/admin/pages/${pageId}/sections`, { method: 'POST', body: JSON.stringify(data) }),
  updateSection: (pageId: number, sectionId: number, data: Partial<CmsSection>) => request<CmsSection>(`/admin/pages/${pageId}/sections/${sectionId}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteSection: (pageId: number, sectionId: number) => request<void>(`/admin/pages/${pageId}/sections/${sectionId}`, { method: 'DELETE' }),
  settings: () => request<any[]>('/admin/site-settings'),
  updateSetting: (key: string, group: string, value: any) => request<any>(`/admin/site-settings/${key}`, { method: 'PUT', body: JSON.stringify({ group, value }) }),
  upload: async (file: File, folder = 'general') => {
    const form = new FormData();
    form.append('image', file);
    form.append('folder', folder);
    return request<{ url: string }>('/admin/media', { method: 'POST', body: form });
  },
};
