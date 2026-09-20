import type { Locale } from './config';

export type Localized = { hy?: string; en?: string; ru?: string };

export interface NavItem {
  id?: number;
  label: string;
  page_slug?: string | null;
  url?: string | null;
  target?: string | null;
  children?: NavItem[];
}

export interface SiteData {
  settings: Record<string, unknown>;
  navigation: { header: NavItem[]; footer: NavItem[] };
}

export interface CmsSection {
  id: number;
  type: string;
  key?: string | null;
  content: Record<string, any>;
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
  is_published?: boolean;
  sections: CmsSection[];
}

export interface ServiceItem {
  id: number;
  slug?: string | null;
  title: string;
  description?: string | null;
  icon?: string | null;
  image?: string | null;
  order: number;
}

export interface ProjectItem {
  id: number;
  title: string;
  description?: string | null;
  image?: string | null;
  thumbnail?: string | null;
  category?: string | null;
  featured: boolean;
}

export type PageProps<P = Record<string, string>> = { params: { locale: Locale } & P };
