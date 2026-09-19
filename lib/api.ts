import axios, { AxiosInstance } from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';

export interface CmsSection {
  id: number;
  type: string;
  key?: string | null;
  content: Record<string, unknown>;
  settings?: Record<string, unknown>;
  sort_order: number;
  is_enabled: boolean;
}

export interface CmsPage {
  id: number;
  slug: string;
  title: string;
  meta_title?: string | null;
  meta_description?: string | null;
  is_published: boolean;
  sections: CmsSection[];
}

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({ baseURL: API_URL, timeout: 10000 });

    this.client.interceptors.request.use((config) => {
      const token = this.getToken();
      if (token) config.headers.Authorization = `Bearer ${token}`;

      if (typeof FormData !== 'undefined' && config.data instanceof FormData) {
        delete config.headers['Content-Type'];
      } else if (!config.headers['Content-Type']) {
        config.headers['Content-Type'] = 'application/json';
      }
      return config;
    });

    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401 && typeof window !== 'undefined') {
          this.clearToken();
          if (window.location.pathname.startsWith('/admin')) window.location.href = '/admin/login';
        }
        return Promise.reject(error);
      }
    );
  }

  private getToken() {
    return typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
  }

  private setToken(token: string) {
    if (typeof window !== 'undefined') localStorage.setItem('auth_token', token);
  }

  private clearToken() {
    if (typeof window !== 'undefined') localStorage.removeItem('auth_token');
  }

  async login(email: string, password: string) {
    const response = await this.client.post('/auth/login', { email, password });
    if (response.data.token) this.setToken(response.data.token);
    return response.data;
  }

  async logout() {
    try { await this.client.post('/auth/logout'); } finally { this.clearToken(); }
  }

  getCurrentUser() { return this.client.get('/auth/me'); }

  getPage(slug: string, lang = 'hy') { return this.client.get<CmsPage>(`/pages/${slug}`, { params: { lang } }); }
  getAdminPages() { return this.client.get('/admin/pages'); }
  getAdminPage(id: number) { return this.client.get(`/admin/pages/${id}`); }
  createPage(data: unknown) { return this.client.post('/admin/pages', data); }
  updatePage(id: number, data: unknown) { return this.client.put(`/admin/pages/${id}`, data); }
  deletePage(id: number) { return this.client.delete(`/admin/pages/${id}`); }
  createSection(pageId: number, data: unknown) { return this.client.post(`/admin/pages/${pageId}/sections`, data); }
  updateSection(id: number, data: unknown) { return this.client.put(`/admin/sections/${id}`, data); }
  deleteSection(id: number) { return this.client.delete(`/admin/sections/${id}`); }

  uploadMedia(file: File, alt?: { hy?: string; en?: string; ru?: string }) {
    const form = new FormData();
    form.append('image', file);
    if (alt?.hy) form.append('alt_hy', alt.hy);
    if (alt?.en) form.append('alt_en', alt.en);
    if (alt?.ru) form.append('alt_ru', alt.ru);
    return this.client.post('/admin/media', form);
  }

  getServices(lang = 'hy') { return this.client.get('/services', { params: { lang } }); }
  getService(id: number, lang = 'hy') { return this.client.get(`/services/${id}`, { params: { lang } }); }
  getAdminServices() { return this.client.get('/admin/services'); }
  getAdminService(id: number) { return this.client.get(`/admin/services/${id}`); }
  createService(data: unknown) { return this.client.post('/services', data); }
  updateService(id: number, data: unknown) { return this.client.put(`/services/${id}`, data); }
  deleteService(id: number) { return this.client.delete(`/services/${id}`); }

  getProjects(lang = 'hy', filters?: Record<string, unknown>) { return this.client.get('/projects', { params: { lang, ...filters } }); }
  getProject(id: number, lang = 'hy') { return this.client.get(`/projects/${id}`, { params: { lang } }); }
  getAdminProjects() { return this.client.get('/admin/projects'); }
  getAdminProject(id: number) { return this.client.get(`/admin/projects/${id}`); }
  getProjectCategories() { return this.client.get('/projects/categories'); }
  createProject(data: unknown) { return this.client.post('/projects', data); }
  updateProject(id: number, data: unknown) {
    if (typeof FormData !== 'undefined' && data instanceof FormData) {
      data.set('_method', 'PUT');
      return this.client.post(`/projects/${id}`, data);
    }
    return this.client.put(`/projects/${id}`, data);
  }
  deleteProject(id: number) { return this.client.delete(`/projects/${id}`); }

  getTeam(lang = 'hy') { return this.client.get('/team', { params: { lang } }); }
  getTeamMember(id: number, lang = 'hy') { return this.client.get(`/team/${id}`, { params: { lang } }); }
  getAdminTeam() { return this.client.get('/admin/team'); }
  getAdminTeamMember(id: number) { return this.client.get(`/admin/team/${id}`); }
  createTeamMember(data: unknown) { return this.client.post('/team', data); }
  updateTeamMember(id: number, data: unknown) { return this.client.put(`/team/${id}`, data); }
  deleteTeamMember(id: number) { return this.client.delete(`/team/${id}`); }

  getNews(lang = 'hy', page = 1, limit = 10) { return this.client.get('/news', { params: { lang, page, limit } }); }
  getNewsItem(idOrSlug: number | string, lang = 'hy') { return this.client.get(`/news/${idOrSlug}`, { params: { lang } }); }
  getAdminNews() { return this.client.get('/admin/news'); }
  getAdminNewsItem(id: number) { return this.client.get(`/admin/news/${id}`); }
  createNews(data: unknown) { return this.client.post('/news', data); }
  updateNews(id: number, data: unknown) { return this.client.put(`/news/${id}`, data); }
  deleteNews(id: number) { return this.client.delete(`/news/${id}`); }

  getGallery(lang = 'hy', category?: string) { return this.client.get('/gallery', { params: { lang, category } }); }
  getGalleryCategories() { return this.client.get('/gallery/categories'); }
  createGalleryItem(data: unknown) { return this.client.post('/gallery', data); }
  updateGalleryItem(id: number, data: unknown) { return this.client.put(`/gallery/${id}`, data); }
  deleteGalleryItem(id: number) { return this.client.delete(`/gallery/${id}`); }
}

export const apiClient = new ApiClient();
