import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getProject, getProjects } from '@/lib/cms';
import { LOCALES, isLocale } from '@/lib/config';
import { pageMetadata } from '@/lib/seo';
import { LiveProjectDetailPage } from '@/components/live/LivePages';

type Props = { params: { locale: string; id: string } };

export async function generateStaticParams() {
  const params: { locale: string; id: string }[] = [];
  for (const locale of LOCALES) {
    const projects = await getProjects(locale);
    for (const project of projects) params.push({ locale, id: String(project.id) });
  }
  if (!params.length) {
    for (const locale of LOCALES) for (const id of ['1', '2', '3', '4', '5']) params.push({ locale, id });
  }
  return params;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  if (!isLocale(params.locale)) return {};
  const project = await getProject(params.id, params.locale);
  if (!project) return {};
  return pageMetadata({ locale: params.locale, path: `projects/${params.id}`, title: project.title, description: project.description, image: project.image });
}

export default async function ProjectDetailPage({ params }: Props) {
  if (!isLocale(params.locale)) notFound();
  const locale = params.locale;
  const project = await getProject(params.id, locale);
  if (!project) notFound();
  return <LiveProjectDetailPage locale={locale} id={params.id} initialProject={project} />;
}
