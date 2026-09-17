'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { apiClient } from '@/lib/api';
import { Button } from '@/components/common/Button';
import { Loading } from '@/components/common/Loading';

export default function AdminNewsEditPage() {
  const router = useRouter();
  const params = useParams();
  const newsId = params.id as string;
  const isEditMode = newsId && newsId !== 'new';

  const [loading, setLoading] = useState(isEditMode);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [image, setImage] = useState<File | null>(null);

  const [formData, setFormData] = useState({
    title_hy: '',
    title_en: '',
    title_ru: '',
    content_hy: '',
    content_en: '',
    content_ru: '',
    excerpt_hy: '',
    excerpt_en: '',
    excerpt_ru: '',
    published: true,
  });

  useEffect(() => {
    if (isEditMode && newsId !== 'new') {
      fetchNews();
    }
  }, [newsId, isEditMode]);

  const fetchNews = async () => {
    try {
      setLoading(true);
      const response = await apiClient.getNewsItem(newsId, 'en');
      setFormData({
        title_hy: response.data.title_hy || '',
        title_en: response.data.title_en || '',
        title_ru: response.data.title_ru || '',
        content_hy: response.data.content_hy || '',
        content_en: response.data.content_en || '',
        content_ru: response.data.content_ru || '',
        excerpt_hy: response.data.excerpt_hy || '',
        excerpt_en: response.data.excerpt_en || '',
        excerpt_ru: response.data.excerpt_ru || '',
        published: response.data.published || true,
      });
      if (response.data.image) setPreview(response.data.image);
    } catch (err: any) {
      setError('Failed to load news');
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onload = (e) => setPreview(e.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
      if (image) submitData.append('image', image);

      if (isEditMode && newsId !== 'new') {
        await apiClient.updateNews(parseInt(newsId), submitData);
      } else {
        await apiClient.createNews(submitData);
      }
      router.push('/admin/news');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-4xl font-serif font-bold mb-8">
        {isEditMode ? 'Edit News' : 'Create News'}
      </h1>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-8 space-y-6">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        <div>
          <label className="block text-sm font-semibold mb-2">Featured Image</label>
          <input type="file" accept="image/*" onChange={handleImageChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg" />
          {preview && <img src={preview} alt="Preview" className="mt-4 max-w-xs rounded-lg" />}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input type="text" name="title_hy" value={formData.title_hy} onChange={handleChange} required placeholder="Title (Armenian)" className="px-4 py-2 border border-gray-300 rounded-lg" />
          <input type="text" name="title_en" value={formData.title_en} onChange={handleChange} required placeholder="Title (English)" className="px-4 py-2 border border-gray-300 rounded-lg" />
          <input type="text" name="title_ru" value={formData.title_ru} onChange={handleChange} placeholder="Title (Russian)" className="px-4 py-2 border border-gray-300 rounded-lg" />
        </div>

        <div className="grid grid-cols-1 gap-4">
          <textarea name="content_hy" value={formData.content_hy} onChange={handleChange} required rows={5} placeholder="Content (Armenian)" className="px-4 py-2 border border-gray-300 rounded-lg" />
          <textarea name="content_en" value={formData.content_en} onChange={handleChange} required rows={5} placeholder="Content (English)" className="px-4 py-2 border border-gray-300 rounded-lg" />
          <textarea name="content_ru" value={formData.content_ru} onChange={handleChange} rows={5} placeholder="Content (Russian)" className="px-4 py-2 border border-gray-300 rounded-lg" />
        </div>

        <div className="grid grid-cols-1 gap-4">
          <input type="text" name="excerpt_hy" value={formData.excerpt_hy} onChange={handleChange} placeholder="Excerpt (Armenian)" className="px-4 py-2 border border-gray-300 rounded-lg" />
          <input type="text" name="excerpt_en" value={formData.excerpt_en} onChange={handleChange} placeholder="Excerpt (English)" className="px-4 py-2 border border-gray-300 rounded-lg" />
          <input type="text" name="excerpt_ru" value={formData.excerpt_ru} onChange={handleChange} placeholder="Excerpt (Russian)" className="px-4 py-2 border border-gray-300 rounded-lg" />
        </div>

        <div className="flex items-center gap-2">
          <input type="checkbox" name="published" checked={formData.published} onChange={handleChange} className="w-4 h-4" />
          <label className="text-sm font-semibold">Published</label>
        </div>

        <div className="flex gap-4 pt-6 border-t">
          <Button type="submit" variant="primary" disabled={submitting} className="flex-1">
            {submitting ? 'Saving...' : 'Save News'}
          </Button>
          <Button type="button" variant="secondary" onClick={() => router.push('/admin/news')} disabled={submitting} className="flex-1">
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
