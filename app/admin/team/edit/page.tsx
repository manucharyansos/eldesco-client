'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { apiClient } from '@/lib/api';
import { Button } from '@/components/common/Button';
import { Loading } from '@/components/common/Loading';

export default function AdminTeamEditPage() {
  const router = useRouter();
  const params = useParams();
  const memberId = params.id as string;
  const isEditMode = memberId && memberId !== 'new';

  const [loading, setLoading] = useState(isEditMode);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [image, setImage] = useState<File | null>(null);

  const [formData, setFormData] = useState({
    name_hy: '',
    name_en: '',
    name_ru: '',
    position_hy: '',
    position_en: '',
    position_ru: '',
    email: '',
    order_index: 0,
  });

  useEffect(() => {
    if (isEditMode && memberId !== 'new') {
      fetchMember();
    }
  }, [memberId, isEditMode]);

  const fetchMember = async () => {
    try {
      setLoading(true);
      const response = await apiClient.getTeamMember(parseInt(memberId), 'en');
      setFormData({
        name_hy: response.data.name_hy || '',
        name_en: response.data.name_en || '',
        name_ru: response.data.name_ru || '',
        position_hy: response.data.position_hy || '',
        position_en: response.data.position_en || '',
        position_ru: response.data.position_ru || '',
        email: response.data.email || '',
        order_index: response.data.order || 0,
      });
      if (response.data.image) setPreview(response.data.image);
    } catch (err: any) {
      setError('Failed to load team member');
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
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

      if (isEditMode && memberId !== 'new') {
        await apiClient.updateTeamMember(parseInt(memberId), submitData);
      } else {
        await apiClient.createTeamMember(submitData);
      }
      router.push('/admin/team');
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
        {isEditMode ? 'Edit Team Member' : 'Add Team Member'}
      </h1>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-8 space-y-6">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        <div>
          <label className="block text-sm font-semibold mb-2">Photo</label>
          <input type="file" accept="image/*" onChange={handleImageChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg" />
          {preview && <img src={preview} alt="Preview" className="mt-4 max-w-xs h-auto rounded-lg" />}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input type="text" name="name_hy" value={formData.name_hy} onChange={handleChange} required placeholder="Name (Armenian)" className="px-4 py-2 border border-gray-300 rounded-lg" />
          <input type="text" name="name_en" value={formData.name_en} onChange={handleChange} required placeholder="Name (English)" className="px-4 py-2 border border-gray-300 rounded-lg" />
          <input type="text" name="name_ru" value={formData.name_ru} onChange={handleChange} placeholder="Name (Russian)" className="px-4 py-2 border border-gray-300 rounded-lg" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input type="text" name="position_hy" value={formData.position_hy} onChange={handleChange} placeholder="Position (Armenian)" className="px-4 py-2 border border-gray-300 rounded-lg" />
          <input type="text" name="position_en" value={formData.position_en} onChange={handleChange} placeholder="Position (English)" className="px-4 py-2 border border-gray-300 rounded-lg" />
          <input type="text" name="position_ru" value={formData.position_ru} onChange={handleChange} placeholder="Position (Russian)" className="px-4 py-2 border border-gray-300 rounded-lg" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email" className="px-4 py-2 border border-gray-300 rounded-lg" />
          <input type="number" name="order_index" value={formData.order_index} onChange={handleChange} placeholder="Order" className="px-4 py-2 border border-gray-300 rounded-lg" />
        </div>

        <div className="flex gap-4 pt-6 border-t">
          <Button type="submit" variant="primary" disabled={submitting} className="flex-1">
            {submitting ? 'Saving...' : 'Save Member'}
          </Button>
          <Button type="button" variant="secondary" onClick={() => router.push('/admin/team')} disabled={submitting} className="flex-1">
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
