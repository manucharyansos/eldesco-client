'use client';

import { useEffect, useState } from 'react';
import { apiClient } from '@/lib/api';
import { Project } from '@/types';
import { Button } from '@/components/common/Button';
import { Loading } from '@/components/common/Loading';

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<number | null>(null);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const response = await apiClient.getProjects('en');
      setProjects(response.data);
    } catch (err) {
      console.error('Error fetching projects:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this project?')) {
      return;
    }

    try {
      setDeleting(id);
      await apiClient.deleteProject(id);
      setProjects(projects.filter(p => p.id !== id));
    } catch (err) {
      console.error('Error deleting project:', err);
      alert('Failed to delete project');
    } finally {
      setDeleting(null);
    }
  };

  if (loading) return <Loading />;

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-serif font-bold">Manage Projects</h1>
        <Button 
          variant="primary"
          onClick={() => window.location.href = '/admin/projects/edit/new'}
        >
          + Add Project
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold">Title</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Category</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Featured</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {projects.map((project) => (
              <tr key={project.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 font-semibold">{project.title}</td>
                <td className="px-6 py-4 text-gray-600">{project.category}</td>
                <td className="px-6 py-4">
                  <span className={project.featured ? 'text-green-600' : 'text-gray-400'}>
                    {project.featured ? '★' : '☆'}
                  </span>
                </td>
                <td className="px-6 py-4 space-x-3">
                  <button 
                    onClick={() => window.location.href = `/admin/projects/edit/${project.id}`}
                    className="text-accent-600 hover:text-accent-700 font-semibold"
                  >
                    Edit
                  </button>
                  <button 
                    onClick={() => handleDelete(project.id)}
                    disabled={deleting === project.id}
                    className="text-red-600 hover:text-red-700 font-semibold disabled:opacity-50"
                  >
                    {deleting === project.id ? 'Deleting...' : 'Delete'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
