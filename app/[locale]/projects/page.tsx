'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import { apiClient } from '@/lib/api';
import { Project } from '@/types';
import { ProjectCard } from '@/components/common/ProjectCard';
import { Loading } from '@/components/common/Loading';

export default function ProjectsPage() {
  const t = useTranslations('common');
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

  if (loading) return <Loading />;
  if (error) return <div className="text-center py-12 text-red-600">{error}</div>;

  return (
    <div className="container py-12">
      <h1 className="text-4xl font-bold mb-12 text-center">{t('projects')}</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </div>
  );
}
