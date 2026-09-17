import Link from 'next/link';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';

type ProjectDetail = {
  id: number;
  title: string;
  description?: string;
  image?: string;
  thumbnail?: string;
  category?: string;
};

async function loadProject(id: string, locale: string): Promise<ProjectDetail | null> {
  try {
    const response = await fetch(`${API_URL}/projects/${id}?lang=${locale}`, { next: { revalidate: 60 } });
    if (!response.ok) return null;
    return response.json();
  } catch {
    return null;
  }
}

export default async function ProjectDetailPage({ params }: { params: { locale: string; id: string } }) {
  const project = await loadProject(params.id, params.locale);
  const back = params.locale === 'hy' ? 'Բոլոր նախագծերը' : params.locale === 'ru' ? 'Все проекты' : 'All projects';
  const contact = params.locale === 'hy' ? 'Քննարկել նախագիծը' : params.locale === 'ru' ? 'Обсудить проект' : 'Discuss a project';

  if (!project) {
    return (
      <section className="py-24">
        <div className="container">
          <div className="premium-panel p-10">Project not found.</div>
        </div>
      </section>
    );
  }

  return (
    <div className="premium-page">
      <section className="premium-page-hero">
        {project.image && <div className="premium-page-hero-image" style={{ backgroundImage: `url(${project.image})` }} />}
        <div className="premium-page-hero-glow" />
        <div className="container relative z-10 py-24 md:py-32">
          <Link href={`/${params.locale}/projects`} className="text-sm font-semibold text-orange-300 transition hover:text-orange-200">← {back}</Link>
          <div className="mt-8 max-w-4xl animate-rise">
            <p className="premium-eyebrow">{project.category || 'ELDESCO PROJECT'}</p>
            <h1 className="premium-title mt-5 text-white">{project.title}</h1>
          </div>
        </div>
      </section>

      <section className="py-20 md:py-28">
        <div className="container grid gap-10 lg:grid-cols-[1.2fr_.8fr]">
          <div className="premium-panel overflow-hidden">
            {project.image && <img src={project.image} alt={project.title} className="max-h-[650px] w-full object-cover" />}
          </div>
          <div className="lg:pt-8">
            <p className="premium-eyebrow text-orange-600">PROJECT DETAILS</p>
            <h2 className="mt-4 text-4xl font-bold text-slate-950">{project.title}</h2>
            {project.description && <p className="mt-6 text-lg leading-8 text-slate-600">{project.description}</p>}
            <Link href={`/${params.locale}/contact`} className="premium-button mt-8">{contact} →</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
