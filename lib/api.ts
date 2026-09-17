import axios, { AxiosInstance } from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

export interface CmsSection {
  id: number;
  type: string;
  name?: string;
  content: Record<string, unknown>;
  sort_order: number;
  is_active: boolean;
}

export interface CmsPage {
  id: number;
  slug: string;
  title: string;
  meta_title?: string;
  meta_description?: string;
  is_published: boolean;
  sections: CmsSection[];
}

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({ baseURL: API_URL, headers: { 'Content-Type': 'application/json' } });
    this.client.interceptors.request.use((config) => {
      const token = this.getToken();
      if (token) config.headers.Authorization = `Bearer ${token}`;
      return config;
    });
    this.client.interceptors.response.use((response) => response, (error) => {
      if (error.response?.status === 401 && typeof window !== 'undefined') {
        this.clearToken();
        if (window.location.pathname.startsWith('/admin')) window.location.href = '/admin/login';
      }
      throw error;
    });
  }

  private getToken() { return typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null; }
  private setToken(token: string) { localStorage.setItem('auth_token', token); }
  private clearToken() { localStorage.removeItem('auth_token'); }

  async login(email: string, password: string) { const r = await this.client.post('/auth/login', { email, password }); if (r.data.token) this.setToken(r.data.token); return r.data; }
  async register(email: string, name: string, password: string) { const r = await this.client.post('/auth/register', { email, name, password, password_confirmation: password }); if (r.data.token) this.setToken(r.data.token); return r.data; }
  async logout() { await this.client.post('/auth/logout'); this.clearToken(); }
  async getCurrentUser() { return (await this.client.get('/auth/me')).data; }

  getPage(slug: string, lang = 'hy') { return this.client.get<{ data: CmsPage }>(`/pages/${slug}`, { params: { lang } }); }
  getAdminPages() { return this.client.get('/admin/pages'); }
  createPage(data: unknown) { return this.client.post('/admin/pages', data); }
  updatePage(id: number, data: unknown) { return this.client.put(`/admin/pages/${id}`, data); }
  deletePage(id: number) { return this.client.delete(`/admin/pages/${id}`); }
  createSection(pageId: number, data: unknown) { return this.client.post(`/admin/pages/${pageId}/sections`, data); }
  updateSection(id: number, data: unknown) { return this.client.put(`/admin/sections/${id}`, data); }
  deleteSection(id: number) { return this.client.delete(`/admin/sections/${id}`); }

  getServices(lang = 'hy') { return this.client.get('/services', { params: { lang } }); }
  getService(id: number, lang = 'hy') { return this.client.get(`/services/${id}`, { params: { lang } }); }
  createService(data: unknown) { return this.client.post('/services', data); }
  updateService(id: number, data: unknown) { return this.client.put(`/services/${id}`, data); }
  deleteService(id: number) { return this.client.delete(`/services/${id}`); }
  getProjects(lang = 'hy', filters?: Record<string, unknown>) { return this.client.get('/projects', { params: { lang, ...filters } }); }
  getProject(id: number, lang = 'hy') { return this.client.get(`/projects/${id}`, { params: { lang } }); }
  createProject(data: unknown) { return this.client.post('/projects', data); }
  updateProject(id: number, data: unknown) { return this.client.put(`/projects/${id}`, data); }
  deleteProject(id: number) { return this.client.delete(`/projects/${id}`); }
  getTeam(lang = 'hy') { return this.client.get('/team', { params: { lang } }); }
  getNews(lang = 'hy', page = 1, limit = 10) { return this.client.get('/news', { params: { lang, page, limit } }); }
  getGallery(lang = 'hy', category?: string) { return this.client.get('/gallery', { params: { lang, category } }); }
}

export const apiClient = new ApiClient();
