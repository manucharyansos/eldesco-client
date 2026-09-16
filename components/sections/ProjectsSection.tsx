'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import { apiClient } from '@/lib/api';
import { Project } from '@/types';
import { ProjectCard } from '@/components/common/ProjectCard';
import { Loading } from '@/components/common/Loading';
import Link from 'next/link';

export function ProjectsSection() {
  const t = useTranslations('common');
  const params = useParams();
  const locale = params.locale as string;
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await apiClient.getProjects(locale, { featured: true });
        setProjects(response.data.slice(0, 4)); // Show only first 4
      } catch (err) {
        console.error('Error fetching projects:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [locale]);

  if (loading) return <Loading />;

  return (
    <section className="py-16">
      <div className="container">
        <h2 className="text-4xl font-bold text-center mb-12">{t('projects')}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
        <div className="text-center">
          <Link href={`/${locale}/projects`} className="btn btn-secondary">
            View All Projects →
          </Link>
        </div>
      </div>
    </section>
  );
}
