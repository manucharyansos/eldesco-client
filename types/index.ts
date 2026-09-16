export interface Service {
  id: number;
  title: string;
  description?: string;
  icon?: string;
  order: number;
}

export interface Project {
  id: number;
  title: string;
  description?: string;
  image?: string;
  thumbnail?: string;
  category?: string;
  featured: boolean;
  createdAt: string;
}

export interface TeamMember {
  id: number;
  name: string;
  position?: string;
  image?: string;
  email?: string;
  order: number;
}

export interface NewsItem {
  id: number;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  image?: string;
  published: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface GalleryImage {
  id: number;
  title?: string;
  image: string;
  thumbnail?: string;
  category?: string;
  order: number;
}

export interface ApiResponse<T> {
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    total: number;
    per_page: number;
    current_page: number;
    last_page: number;
  };
}
