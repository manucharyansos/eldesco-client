import { SectionRenderer } from '@/components/cms/SectionRenderer';

type PublicCmsSection = {
  id: number;
  type: string;
  key?: string | null;
  content: Record<string, unknown>;
  settings?: Record<string, unknown>;
  is_enabled: boolean;
  sort_order: number;
};

type PublicCmsPage = {
  id: number;
  slug: string;
  title: string;
  meta_title?: string | null;
  meta_description?: string | null;
  sections: PublicCmsSection[];
};

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';

async function loadPage(slug: string, locale: string): Promise<PublicCmsPage | null> {
  try {
    const response = await fetch(`${API_URL}/pages/${slug}?lang=${locale}`, {
      next: { revalidate: 60 },
      headers: { Accept: 'application/json' },
    });

    if (!response.ok) return null;
    return response.json();
  } catch {
    return null;
  }
}

export async function PremiumCmsPage({
  slug,
  locale,
  heroImage,
  eyebrow,
}: {
  slug: string;
  locale: string;
  heroImage?: string;
  eyebrow?: string;
}) {
  const page = await loadPage(slug, locale);
  const title = page?.title || slug.replace(/-/g, ' ');

  return (
    <div className="premium-page">
      <section className="premium-page-hero">
        {heroImage && (
          <div
            className="premium-page-hero-image"
            style={{ backgroundImage: `url(${heroImage})` }}
          />
        )}
        <div className="premium-page-hero-glow" />
        <div className="container relative z-10 py-24 md:py-32">
          <div className="max-w-4xl animate-rise">
            <p className="premium-eyebrow">{eyebrow || 'ELDESCO'}</p>
            <h1 className="premium-title mt-5 text-white">{title}</h1>
            {page?.meta_description && (
              <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300 md:text-xl">
                {page.meta_description}
              </p>
            )}
          </div>
        </div>
      </section>

      {page ? (
        <div>
          {[...page.sections]
            .sort((a, b) => a.sort_order - b.sort_order)
            .map((section) => (
              <SectionRenderer key={section.id} section={section} locale={locale} />
            ))}
        </div>
      ) : (
        <section className="py-20">
          <div className="container">
            <div className="premium-panel p-8 md:p-12">
              <p className="text-slate-600">
                {locale === 'hy'
                  ? 'Բովանդակությունը ժամանակավորապես հասանելի չէ։'
                  : locale === 'ru'
                    ? 'Содержимое временно недоступно.'
                    : 'Content is temporarily unavailable.'}
              </p>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
