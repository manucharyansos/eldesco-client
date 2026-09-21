import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getPage, getProjects, getServices, getSite } from '@/lib/cms';
import { isLocale } from '@/lib/config';
import { makeUi } from '@/lib/defaults';
import { firstImage, pageMetadata } from '@/lib/seo';
import { LiveProjectsPage } from '@/components/live/LivePages';

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
  const [page, projects, services] = await Promise.all([
    getPage('projects', locale),
    getProjects(locale),
    getServices(locale),
  ]);
  return <LiveProjectsPage locale={locale} initialPage={page} initialProjects={projects} initialServices={services} />;
}
