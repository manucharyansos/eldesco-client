export type Locale = 'hy' | 'en' | 'ru';
export type TranslatedText = Partial<Record<Locale, string>>;

export interface MediaAsset {
  id: number;
  url: string;
  file_name: string;
  mime_type?: string | null;
  size?: number;
  alt?: TranslatedText | null;
}

export interface SectionItem {
  id?: number;
  key?: string | null;
  title?: TranslatedText | null;
  subtitle?: TranslatedText | null;
  body?: TranslatedText | null;
  meta?: Record<string, unknown> | null;
  media_id?: number | null;
  media?: MediaAsset | null;
  link_url?: string | null;
  is_enabled?: boolean;
  sort_order?: number;
}

export type SectionType = 'hero' | 'rich_text' | 'cards' | 'list' | 'gallery' | 'logos' | 'contact' | 'cta' | 'stats';

export interface CmsSection {
  id?: number;
  key: string;
  type: SectionType;
  title?: TranslatedText | null;
  subtitle?: TranslatedText | null;
  body?: TranslatedText | null;
  settings?: Record<string, any> | null;
  media_id?: number | null;
  media?: MediaAsset | null;
  is_enabled?: boolean;
  sort_order?: number;
  items?: SectionItem[];
}

export interface CmsPage {
  id: number;
  slug: string;
  title: TranslatedText;
  seo?: Record<string, any> | null;
  is_published: boolean;
  show_in_nav: boolean;
  sort_order: number;
  sections: CmsSection[];
}

export interface NavItem {
  id: number;
  slug: string;
  title: string;
}

export interface SitePayload {
  locale: Locale;
  supported_locales: Locale[];
  settings: Record<string, any>;
  navigation: NavItem[];
}

export interface SettingRow {
  id?: number;
  key: string;
  group: string;
  value: any;
  is_public: boolean;
}

export function tx(value: TranslatedText | null | undefined, locale: string): string {
  if (!value) return '';
  return value[locale as Locale] || value.hy || value.en || value.ru || '';
}
