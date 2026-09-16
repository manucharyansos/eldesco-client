import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add auth token to requests if available
    this.client.interceptors.request.use((config) => {
      const token = this.getToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    // Handle response errors
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          // Clear token and redirect to login
          this.clearToken();
          window.location.href = '/login';
        }
        throw error;
      }
    );
  }

  private getToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('auth_token');
    }
    return null;
  }

  private setToken(token: string): void {
    localStorage.setItem('auth_token', token);
  }

  private clearToken(): void {
    localStorage.removeItem('auth_token');
  }

  // Auth endpoints
  async login(email: string, password: string) {
    const response = await this.client.post('/auth/login', { email, password });
    if (response.data.token) {
      this.setToken(response.data.token);
    }
    return response.data;
  }

  async register(email: string, name: string, password: string) {
    const response = await this.client.post('/auth/register', {
      email,
      name,
      password,
      password_confirmation: password,
    });
    if (response.data.token) {
      this.setToken(response.data.token);
    }
    return response.data;
  }

  async logout() {
    await this.client.post('/auth/logout');
    this.clearToken();
  }

  async getCurrentUser() {
    const response = await this.client.get('/auth/me');
    return response.data;
  }

  // Services
  getServices(lang: string = 'en') {
    return this.client.get('/services', { params: { lang } });
  }

  getService(id: number, lang: string = 'en') {
    return this.client.get(`/services/${id}`, { params: { lang } });
  }

  createService(data: any) {
    return this.client.post('/services', data);
  }

  updateService(id: number, data: any) {
    return this.client.put(`/services/${id}`, data);
  }

  deleteService(id: number) {
    return this.client.delete(`/services/${id}`);
  }

  // Projects
  getProjects(lang: string = 'en', filters?: any) {
    return this.client.get('/projects', { params: { lang, ...filters } });
  }

  getProject(id: number, lang: string = 'en') {
    return this.client.get(`/projects/${id}`, { params: { lang } });
  }

  createProject(data: any) {
    const config = data instanceof FormData ? { headers: { 'Content-Type': 'multipart/form-data' } } : {};
    return this.client.post('/projects', data, config);
  }

  updateProject(id: number, data: any) {
    const config = data instanceof FormData ? { headers: { 'Content-Type': 'multipart/form-data' } } : {};
    return this.client.put(`/projects/${id}`, data, config);
  }

  deleteProject(id: number) {
    return this.client.delete(`/projects/${id}`);
  }

  // Team
  getTeam(lang: string = 'en') {
    return this.client.get('/team', { params: { lang } });
  }

  getTeamMember(id: number, lang: string = 'en') {
    return this.client.get(`/team/${id}`, { params: { lang } });
  }

  createTeamMember(data: any) {
    return this.client.post('/team', data);
  }

  updateTeamMember(id: number, data: any) {
    return this.client.put(`/team/${id}`, data);
  }

  deleteTeamMember(id: number) {
    return this.client.delete(`/team/${id}`);
  }

  // News
  getNews(lang: string = 'en', page: number = 1, limit: number = 10) {
    return this.client.get('/news', { params: { lang, page, limit } });
  }

  getNewsItem(slugOrId: string | number, lang: string = 'en') {
    return this.client.get(`/news/${slugOrId}`, { params: { lang } });
  }

  createNews(data: any) {
    return this.client.post('/news', data);
  }

  updateNews(id: number, data: any) {
    return this.client.put(`/news/${id}`, data);
  }

  deleteNews(id: number) {
    return this.client.delete(`/news/${id}`);
  }

  // Gallery
  getGallery(lang: string = 'en', category?: string) {
    return this.client.get('/gallery', { params: { lang, category } });
  }

  getGalleryCategories() {
    return this.client.get('/gallery/categories');
  }

  createGalleryImage(data: any) {
    return this.client.post('/gallery', data);
  }

  updateGalleryImage(id: number, data: any) {
    return this.client.put(`/gallery/${id}`, data);
  }

  deleteGalleryImage(id: number) {
    return this.client.delete(`/gallery/${id}`);
  }
}

export const apiClient = new ApiClient();
