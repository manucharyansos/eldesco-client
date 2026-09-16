export type Localized = Record<string, string>;

export type CmsSection = {
  id: number;
  key: string;
  type: string;
  content: Record<string, any> | null;
  image_url?: string | null;
  gallery?: Array<string | { url: string; alt?: Localized | string }> | null;
  settings?: Record<string, any> | null;
  sort_order: number;
  enabled: boolean;
};

export type CmsPage = {
  id: number;
  slug: string;
  name: string;
  seo_title?: Localized | null;
  seo_description?: Localized | null;
  published: boolean;
  sort_order: number;
  sections: CmsSection[];
};

export type SiteSettings = Record<string, any>;
