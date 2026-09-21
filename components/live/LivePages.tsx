'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import type { CmsPage, ProjectItem, ServiceItem } from '@/lib/cms-types';
import type { Locale } from '@/lib/config';
import { str } from '@/lib/cms';
import { makeUi } from '@/lib/defaults';
import { formatDate } from '@/lib/utils';
import type { NewsItem, TeamMember } from '@/types';
import { asArrayResponse, asPaginatedArrayResponse, useLiveResource } from '@/hooks/useLiveResource';
import { PageView } from '@/components/cms/PageView';
import { SectionRenderer } from '@/components/cms/SectionRenderer';
import { Img } from '@/components/common/Img';
import { useLiveSite } from './LiveSiteShell';

function useRuntimeMetadata(title: string, description: string, siteName: string, absolute = false) {
  useEffect(() => {
    if (title) document.title = absolute || !siteName || title === siteName ? title : `${title} | ${siteName}`;
    if (!description) return;

    let meta = document.querySelector<HTMLMetaElement>('meta[name="description"]');
    if (!meta) {
      meta = document.createElement('meta');
      meta.name = 'description';
      document.head.appendChild(meta);
    }
    meta.content = description;
  }, [absolute, description, siteName, title]);
}

function Unavailable({ locale }: { locale: Locale }) {
  const { site } = useLiveSite();
  const ui = makeUi(site.settings, locale);
  return (
    <section className="page-hero">
      <div className="page-hero-shade" />
      <div className="container py-24 md:py-32">
        <h1 className="h-page max-w-4xl">{ui('content_unavailable')}</h1>
        <Link href={`/${locale}`} className="btn btn-primary mt-9">{ui('go_home')}</Link>
      </div>
    </section>
  );
}

type LiveCmsPageProps = {
  locale: Locale;
  slug: string;
  initialPage: CmsPage | null;
  initialServices: ServiceItem[];
  home?: boolean;
};

export function LiveCmsPage({ locale, slug, initialPage, initialServices, home = false }: LiveCmsPageProps) {
  const { site, refreshVersion } = useLiveSite();
  const page = useLiveResource<CmsPage | null>(`/pages/${encodeURIComponent(slug)}?lang=${locale}`, initialPage, refreshVersion);
  const services = useLiveResource<ServiceItem[]>(
    `/services?lang=${locale}`,
    initialServices,
    refreshVersion,
    asArrayResponse<ServiceItem>,
  );
  const siteName = str(site.settings['seo.site_name']) || str(site.settings['company.name']) || 'ELDESCO';
  useRuntimeMetadata(page?.meta_title || page?.title || siteName, page?.meta_description || '', siteName, home);

  if (!page) {
    if (!home) return <Unavailable locale={locale} />;
    const ui = makeUi(site.settings, locale);
    return (
      <section className="page-hero">
        <div className="page-hero-shade" />
        <div className="container py-24 md:py-32">
          <h1 className="h-display max-w-4xl">{str(site.settings['company.name'])}</h1>
          <p className="lead mt-6 max-w-2xl !text-navy-100">{str(site.settings['company.tagline'])}</p>
          <Link href={`/${locale}/contact`} className="btn btn-primary mt-9">{ui('contact_us')}</Link>
        </div>
      </section>
    );
  }

  return <PageView page={page} locale={locale} site={site} services={services} />;
}

export function LiveProjectsPage({
  locale,
  initialPage,
  initialProjects,
  initialServices,
}: {
  locale: Locale;
  initialPage: CmsPage | null;
  initialProjects: ProjectItem[];
  initialServices: ServiceItem[];
}) {
  const { site, refreshVersion } = useLiveSite();
  const page = useLiveResource<CmsPage | null>(`/pages/projects?lang=${locale}`, initialPage, refreshVersion);
  const projects = useLiveResource<ProjectItem[]>(
    `/projects?lang=${locale}`,
    initialProjects,
    refreshVersion,
    asArrayResponse<ProjectItem>,
  );
  const services = useLiveResource<ServiceItem[]>(
    `/services?lang=${locale}`,
    initialServices,
    refreshVersion,
    asArrayResponse<ServiceItem>,
  );
  const ui = makeUi(site.settings, locale);
  const sections = [...(page?.sections ?? [])].filter((section) => section.is_enabled).sort((a, b) => a.sort_order - b.sort_order);
  const hasHero = sections.some((section) => section.type === 'page_hero');
  const title = page?.meta_title || page?.title || ui('projects_title');
  const description = page?.meta_description || ui('projects_subtitle');
  const siteName = str(site.settings['seo.site_name']) || str(site.settings['company.name']) || 'ELDESCO';
  useRuntimeMetadata(title, description, siteName);

  return (
    <>
      {!hasHero && (
        <section className="page-hero">
          <div className="page-hero-shade" />
          <div className="container py-16 md:py-24">
            <h1 className="h-page max-w-4xl">{page?.title || ui('projects_title')}</h1>
            <p className="lead mt-5 max-w-2xl !text-navy-100">{description}</p>
          </div>
        </section>
      )}
      {sections.map((section) => (
        <SectionRenderer
          key={section.id}
          section={section}
          locale={locale}
          site={site}
          pageTitle={page?.title}
          services={services}
        />
      ))}

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

export function LiveProjectDetailPage({ locale, id, initialProject }: { locale: Locale; id: string; initialProject: ProjectItem | null }) {
  const { site, refreshVersion } = useLiveSite();
  const project = useLiveResource<ProjectItem | null>(
    `/projects/${encodeURIComponent(id)}?lang=${locale}`,
    initialProject,
    refreshVersion,
  );
  const ui = makeUi(site.settings, locale);
  const siteName = str(site.settings['seo.site_name']) || str(site.settings['company.name']) || 'ELDESCO';
  useRuntimeMetadata(project?.title || ui('projects_title'), project?.description || '', siteName);

  if (!project) return <Unavailable locale={locale} />;

  return (
    <>
      <section className="page-hero">
        <div className="page-hero-shade" />
        <div className="container py-14 md:py-20">
          <Link href={`/${locale}/projects`} className="link-quiet text-sm">{ui('all_projects')}</Link>
          {project.category && <p className="mt-8 text-sm font-bold text-amber-400">{project.category}</p>}
          <h1 className="h-page mt-3 max-w-4xl">{project.title}</h1>
        </div>
      </section>
      <section className="section">
        <div className="container grid gap-10 lg:grid-cols-[1.2fr_.8fr] lg:gap-16">
          <div className="overflow-hidden rounded-md bg-steel-100">
            <Img src={project.image} alt={project.title} loading="eager" className="w-full object-cover" />
          </div>
          <div>
            {project.description && <div className="prose-eld"><p>{project.description}</p></div>}
            <Link href={`/${locale}/contact`} className="btn btn-primary mt-8">{ui('discuss_project')}</Link>
          </div>
        </div>
      </section>
    </>
  );
}

export function LiveTeamPage({ locale, initialMembers }: { locale: Locale; initialMembers: TeamMember[] }) {
  const { site, refreshVersion } = useLiveSite();
  const members = useLiveResource<TeamMember[]>(
    `/team?lang=${locale}`,
    initialMembers,
    refreshVersion,
    asArrayResponse<TeamMember>,
  );
  const ui = makeUi(site.settings, locale);
  const title = ui('team_title');
  const siteName = str(site.settings['seo.site_name']) || str(site.settings['company.name']) || 'ELDESCO';
  useRuntimeMetadata(title, '', siteName);

  return (
    <>
      <section className="page-hero"><div className="page-hero-shade" /><div className="container py-16 md:py-24"><h1 className="h-page">{title}</h1></div></section>
      <section className="section">
        <div className="container">
          {members.length === 0 ? <p className="lead">{ui('no_items')}</p> : (
            <ul className="grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
              {members.map((member) => (
                <li key={member.id}>
                  <div className="aspect-[4/5] overflow-hidden rounded-md bg-steel-100"><Img src={member.image} alt={member.name} className="h-full w-full object-cover" /></div>
                  <h2 className="mt-4 text-lg font-bold text-navy-800">{member.name}</h2>
                  {member.position && <p className="mt-1 text-steel-600">{member.position}</p>}
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </>
  );
}

export function LiveNewsPage({ locale, initialItems }: { locale: Locale; initialItems: NewsItem[] }) {
  const { site, refreshVersion } = useLiveSite();
  const items = useLiveResource<NewsItem[]>(
    `/news?lang=${locale}&limit=30`,
    initialItems,
    refreshVersion,
    asPaginatedArrayResponse<NewsItem>,
  );
  const ui = makeUi(site.settings, locale);
  const title = ui('news_title');
  const siteName = str(site.settings['seo.site_name']) || str(site.settings['company.name']) || 'ELDESCO';
  useRuntimeMetadata(title, '', siteName);

  return (
    <>
      <section className="page-hero"><div className="page-hero-shade" /><div className="container py-16 md:py-24"><h1 className="h-page">{title}</h1></div></section>
      <section className="section">
        <div className="container">
          {items.length === 0 ? <p className="lead">{ui('no_items')}</p> : (
            <ul className="grid gap-x-8 gap-y-12 md:grid-cols-2 lg:grid-cols-3">
              {items.map((item) => (
                <li key={item.id}>
                  {item.image && <div className="aspect-[16/10] overflow-hidden rounded-md bg-steel-100"><Img src={item.image} alt="" className="h-full w-full object-cover" /></div>}
                  <p className="mt-5 text-sm font-semibold text-steel-500">{formatDate(item.createdAt, locale)}</p>
                  <h2 className="h-item mt-1">{item.title}</h2>
                  {item.excerpt && <p className="mt-3 line-clamp-4 leading-7 text-steel-600">{item.excerpt}</p>}
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </>
  );
}
