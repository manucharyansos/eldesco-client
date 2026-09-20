import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getPage, getProjects, getSite } from '@/lib/cms';
import { isLocale } from '@/lib/config';
import { makeUi } from '@/lib/defaults';
import { firstImage, pageMetadata } from '@/lib/seo';
import { Img } from '@/components/common/Img';
import { SectionRenderer } from '@/components/cms/SectionRenderer';

type Props = { params: { locale: string } };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  if (!isLocale(params.locale)) return {};
  const [page, site] = await Promise.all([getPage('projects', params.locale), getSite(params.locale)]);
  const ui = makeUi(site.settings, params.locale);
  return pageMetadata({ locale: params.locale, path: 'projects', title: page?.meta_title || page?.title || ui('projects_title'), description: page?.meta_description || ui('projects_subtitle'), image: firstImage(page) });
}

export default async function ProjectsPage({ params }: Props) {
  if (!isLocale(params.locale)) notFound();
  const locale = params.locale;
  const [page, site, projects] = await Promise.all([getPage('projects', locale), getSite(locale), getProjects(locale)]);
  const ui = makeUi(site.settings, locale);
  const sections = (page?.sections ?? []).filter((s) => s.is_enabled).sort((a, b) => a.sort_order - b.sort_order);
  const hasHero = sections.some((s) => s.type === 'page_hero');

  return (
    <>
      {!hasHero && (
        <section className="page-hero">
          <div className="page-hero-shade" />
          <div className="container py-16 md:py-24">
            <h1 className="h-page max-w-4xl">{page?.title || ui('projects_title')}</h1>
            <p className="lead mt-5 max-w-2xl !text-navy-100">{page?.meta_description || ui('projects_subtitle')}</p>
          </div>
        </section>
      )}
      {sections.map((s) => <SectionRenderer key={s.id} section={s} locale={locale} site={site} pageTitle={page?.title} />)}

      <section className="section">
        <div className="container">
          {projects.length === 0 ? (
            <p className="lead">{ui('no_items')}</p>
          ) : (
            <ul className="grid gap-x-8 gap-y-12 md:grid-cols-2 lg:grid-cols-3">
              {projects.map((project) => (
                <li key={project.id}>
                  <Link href={`/${locale}/projects/${project.id}`} className="group block">
                    <div className="aspect-[4/3] overflow-hidden rounded-md bg-steel-100">
                      <Img src={project.image} alt="" className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.03]" />
                    </div>
                    {project.category && <p className="mt-5 text-sm font-semibold text-rust-600">{project.category}</p>}
                    <h2 className="h-item mt-1 transition group-hover:text-rust-600">{project.title}</h2>
                    {project.description && <p className="mt-3 line-clamp-3 leading-7 text-steel-600">{project.description}</p>}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </>
  );
}
