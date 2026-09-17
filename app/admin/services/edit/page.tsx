'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { apiClient } from '@/lib/api';
import { Button } from '@/components/common/Button';
import { Loading } from '@/components/common/Loading';

export default function AdminServiceEditPage() {
  const router = useRouter();
  const params = useParams();
  const serviceId = params.id as string;
  const isEditMode = serviceId && serviceId !== 'new';

  const [loading, setLoading] = useState(isEditMode);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title_hy: '',
    title_en: '',
    title_ru: '',
    description_hy: '',
    description_en: '',
    description_ru: '',
    icon: '',
    order_index: 0,
  });

  useEffect(() => {
    if (isEditMode && serviceId !== 'new') {
      fetchService();
    }
  }, [serviceId, isEditMode]);

  const fetchService = async () => {
    try {
      setLoading(true);
      const response = await apiClient.getService(parseInt(serviceId), 'en');
      setFormData({
        title_hy: response.data.title_hy || '',
        title_en: response.data.title_en || '',
        title_ru: response.data.title_ru || '',
        description_hy: response.data.description_hy || '',
        description_en: response.data.description_en || '',
        description_ru: response.data.description_ru || '',
        icon: response.data.icon || '',
        order_index: response.data.order || 0,
      });
    } catch (err: any) {
      setError('Failed to load service');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      if (isEditMode && serviceId !== 'new') {
        await apiClient.updateService(parseInt(serviceId), formData);
      } else {
        await apiClient.createService(formData);
      }
      router.push('/admin/services');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save service');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-4xl font-serif font-bold mb-8">
        {isEditMode ? 'Edit Service' : 'Create Service'}
      </h1>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-8 space-y-6">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

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

        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className="block text-sm font-semibold mb-2">Description (Armenian)</label>
            <textarea
              name="description_hy"
              value={formData.description_hy}
              onChange={handleChange}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2">Description (English)</label>
            <textarea
              name="description_en"
              value={formData.description_en}
              onChange={handleChange}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2">Description (Russian)</label>
            <textarea
              name="description_ru"
              value={formData.description_ru}
              onChange={handleChange}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-500 outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold mb-2">Icon (emoji)</label>
            <input
              type="text"
              name="icon"
              value={formData.icon}
              onChange={handleChange}
              placeholder="e.g., ⚡"
              maxLength={2}
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
        </div>

        <div className="flex gap-4 pt-6 border-t">
          <Button type="submit" variant="primary" disabled={submitting} className="flex-1">
            {submitting ? 'Saving...' : 'Save Service'}
          </Button>
          <Button type="button" variant="secondary" onClick={() => router.push('/admin/services')} disabled={submitting} className="flex-1">
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
