'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Project } from '@/types';

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  const params = useParams();
  const locale = (params.locale as string) || 'hy';

  return (
    <Link href={`/${locale}/projects/${project.id}`} className="group premium-card block overflow-hidden">
      <div className="relative h-64 overflow-hidden bg-slate-900">
        {project.image ? (
          <img
            src={project.image}
            alt={project.title}
            className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 premium-grid opacity-30" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
        {project.category && (
          <span className="absolute bottom-5 left-5 rounded-full bg-white/90 px-3 py-1 text-xs font-bold uppercase tracking-[.12em] text-slate-900 backdrop-blur">
            {project.category}
          </span>
        )}
      </div>
      <div className="p-7">
        <div className="flex items-start justify-between gap-5">
          <h3 className="text-2xl font-bold leading-tight text-slate-950 transition group-hover:text-orange-600">{project.title}</h3>
          <span className="mt-1 text-xl text-slate-400 transition group-hover:translate-x-1 group-hover:text-orange-600">→</span>
        </div>
        {project.description && <p className="mt-4 line-clamp-3 leading-7 text-slate-600">{project.description}</p>}
      </div>
    </Link>
  );
}
