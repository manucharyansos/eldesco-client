import { Project } from '@/types';

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <div className="bg-white rounded-lg shadow hover:shadow-lg transition overflow-hidden">
      {project.image && (
        <div className="relative w-full h-48 bg-gray-200 overflow-hidden">
          <img
            src={project.image}
            alt={project.title}
            className="w-full h-full object-cover hover:scale-105 transition"
          />
        </div>
      )}
      <div className="p-6">
        <h3 className="font-serif text-xl font-bold mb-2">{project.title}</h3>
        {project.category && (
          <span className="inline-block bg-accent-100 text-accent-700 text-xs font-semibold px-2 py-1 rounded mb-3">
            {project.category}
          </span>
        )}
        <p className="text-gray-600 line-clamp-3">{project.description}</p>
      </div>
    </div>
  );
}
