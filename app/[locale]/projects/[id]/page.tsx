import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getProject, getProjects, getSite } from '@/lib/cms';
import { LOCALES, isLocale } from '@/lib/config';
import { makeUi } from '@/lib/defaults';
import { pageMetadata } from '@/lib/seo';
import { Img } from '@/components/common/Img';

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
  const [project, site] = await Promise.all([getProject(params.id, locale), getSite(locale)]);
  if (!project) notFound();
  const ui = makeUi(site.settings, locale);

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
          <div className="overflow-hidden rounded-md bg-steel-100"><Img src={project.image} alt={project.title} loading="eager" className="w-full object-cover" /></div>
          <div>
            {project.description && <div className="prose-eld"><p>{project.description}</p></div>}
            <Link href={`/${locale}/contact`} className="btn btn-primary mt-8">{ui('discuss_project')}</Link>
          </div>
        </div>
      </section>
    </>
  );
}
