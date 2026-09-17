'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { apiClient } from '@/lib/api';
import { Project } from '@/types';
import { ProjectCard } from '@/components/common/ProjectCard';
import { Loading } from '@/components/common/Loading';

export default function ProjectsPage() {
  const params = useParams();
  const locale = params.locale as string;
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const response = await apiClient.getProjects(locale);
        setProjects(response.data);
      } catch (err: any) {
        setError(err.message || 'Failed to load projects');
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, [locale]);

  const title = locale === 'hy' ? 'Նախագծեր' : locale === 'ru' ? 'Проекты' : 'Projects';
  const subtitle = locale === 'hy'
    ? 'Իրականացված ինժեներական լուծումներ՝ էներգետիկայից մինչև արտադրական ենթակառուցվածքներ։'
    : locale === 'ru'
      ? 'Реализованные инженерные решения — от энергетики до производственной инфраструктуры.'
      : 'Delivered engineering solutions — from power infrastructure to industrial systems.';

  return (
    <div className="premium-page">
      <section className="premium-page-hero">
        <div className="premium-page-hero-glow" />
        <div className="container relative z-10 py-24 md:py-32">
          <div className="max-w-4xl animate-rise">
            <p className="premium-eyebrow">ELDESCO • PORTFOLIO</p>
            <h1 className="premium-title mt-5 text-white">{title}</h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300 md:text-xl">{subtitle}</p>
          </div>
        </div>
      </section>

      <section className="bg-slate-50 py-16 md:py-24">
        <div className="container">
          {loading && <Loading />}
          {error && <div className="premium-panel p-6 text-red-600">{error}</div>}
          {!loading && !error && (
            <div className="grid gap-6 md:grid-cols-2">
              {projects.map((project) => <ProjectCard key={project.id} project={project} />)}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
