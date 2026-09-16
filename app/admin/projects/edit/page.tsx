'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { apiClient } from '@/lib/api';
import { Button } from '@/components/common/Button';
import { Loading } from '@/components/common/Loading';

export default function AdminProjectEditPage() {
  const router = useRouter();
  const params = useParams();
  const projectId = params.id as string;
  const isEditMode = projectId && projectId !== 'new';

  const [loading, setLoading] = useState(isEditMode);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title_hy: '',
    title_en: '',
    title_ru: '',
    description_hy: '',
    description_en: '',
    description_ru: '',
    category: '',
    featured: false,
    order_index: 0,
  });

  const [image, setImage] = useState<File | null>(null);

  useEffect(() => {
    if (isEditMode && projectId !== 'new') {
      fetchProject();
    }
  }, [projectId, isEditMode]);

  const fetchProject = async () => {
    try {
      setLoading(true);
      const response = await apiClient.getProject(parseInt(projectId), 'en');
      setFormData({
        title_hy: response.data.title_hy || '',
        title_en: response.data.title_en || '',
        title_ru: response.data.title_ru || '',
        description_hy: response.data.description_hy || '',
        description_en: response.data.description_en || '',
        description_ru: response.data.description_ru || '',
        category: response.data.category || '',
        featured: response.data.featured || false,
        order_index: response.data.order_index || 0,
      });
      if (response.data.image_url) {
        setPreview(response.data.image_url);
      }
    } catch (err: any) {
      setError('Failed to load project');
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      const submitData = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        submitData.append(key, String(value));
      });
      if (image) {
        submitData.append('image', image);
      }

      if (isEditMode && projectId !== 'new') {
        await apiClient.updateProject(parseInt(projectId), submitData);
      } else {
        await apiClient.createProject(submitData);
      }

      router.push('/admin/projects');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save project');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-4xl font-serif font-bold mb-8">
        {isEditMode ? 'Edit Project' : 'Create Project'}
      </h1>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-8 space-y-6">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {/* Image Upload */}
        <div>
          <label className="block text-sm font-semibold mb-2">Project Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
          />
          {preview && (
            <div className="mt-4">
              <img
                src={preview}
                alt="Preview"
                className="max-w-xs h-auto rounded-lg"
              />
            </div>
          )}
        </div>

        {/* Title Fields */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-semibold mb-2">Title (Armenian)*</label>
            <input
              type="text"
              name="title_hy"
              value={formData.title_hy}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2">Title (English)*</label>
            <input
              type="text"
              name="title_en"
              value={formData.title_en}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2">Title (Russian)</label>
            <input
              type="text"
              name="title_ru"
              value={formData.title_ru}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-500 outline-none"
            />
          </div>
        </div>

        {/* Description Fields */}
        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className="block text-sm font-semibold mb-2">Description (Armenian)</label>
            <textarea
              name="description_hy"
              value={formData.description_hy}
              onChange={handleChange}
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2">Description (English)</label>
            <textarea
              name="description_en"
              value={formData.description_en}
              onChange={handleChange}
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2">Description (Russian)</label>
            <textarea
              name="description_ru"
              value={formData.description_ru}
              onChange={handleChange}
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-500 outline-none"
            />
          </div>
        </div>

        {/* Category and Status */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-semibold mb-2">Category</label>
            <input
              type="text"
              name="category"
              value={formData.category}
              onChange={handleChange}
              placeholder="e.g., Infrastructure"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2">Order Index</label>
            <input
              type="number"
              name="order_index"
              value={formData.order_index}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-500 outline-none"
            />
          </div>
          <div className="flex items-end">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                name="featured"
                checked={formData.featured}
                onChange={handleChange}
                className="w-4 h-4"
              />
              <span className="text-sm font-semibold">Featured</span>
            </label>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-4 pt-6 border-t">
          <Button
            type="submit"
            variant="primary"
            disabled={submitting}
            className="flex-1"
          >
            {submitting ? 'Saving...' : 'Save Project'}
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={() => router.push('/admin/projects')}
            disabled={submitting}
            className="flex-1"
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
