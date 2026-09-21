import type { CmsPage, ServiceItem, SiteData } from '@/lib/cms-types';
import type { Locale } from '@/lib/config';
import { makeUi } from '@/lib/defaults';
import { SectionRenderer } from './SectionRenderer';

const HERO_TYPES = ['hero', 'page_hero'];
const EMPTY_SERVICES: ServiceItem[] = [];

/** Renders a CMS page. If the page has no hero section, a plain title header is shown so every page has an <h1>. */
export function PageView({ page, locale, site, services = EMPTY_SERVICES }: { page: CmsPage; locale: Locale; site: SiteData; services?: ServiceItem[] }) {
  const sections = [...page.sections].filter((x) => x.is_enabled).sort((a, b) => a.sort_order - b.sort_order);
  const hasHero = sections.some((x) => HERO_TYPES.includes(x.type));
  const ui = makeUi(site.settings, locale);

  return (
    <>
      {!hasHero && (
        <section className="page-hero">
          <div className="page-hero-shade" />
          <div className="container py-16 md:py-24">
            <h1 className="h-page max-w-4xl">{page.title}</h1>
            {page.meta_description && <p className="lead mt-5 max-w-2xl !text-navy-100">{page.meta_description}</p>}
          </div>
        </section>
      )}
      {sections.length === 0 && (
        <section className="section"><div className="container"><p className="lead">{ui('no_items')}</p></div></section>
      )}
      {sections.map((section) => (
        <SectionRenderer key={section.id} section={section} locale={locale} site={site} pageTitle={page.title} services={services} />
      ))}
    </>
  );
}
