'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { apiClient } from '@/lib/api';
import { Button } from '@/components/common/Button';
import { Loading } from '@/components/common/Loading';

export default function AdminGalleryEditPage() {
  const router = useRouter();
  const params = useParams();
  const imageId = params.id as string;
  const isEditMode = imageId && imageId !== 'new';

  const [loading, setLoading] = useState(isEditMode);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [image, setImage] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);

  const [formData, setFormData] = useState({
    title_hy: '',
    title_en: '',
    title_ru: '',
    category: '',
    order_index: 0,
  });

  useEffect(() => {
    if (isEditMode && imageId !== 'new') {
      fetchImage();
    }
  }, [imageId, isEditMode]);

  const fetchImage = async () => {
    try {
      setLoading(true);
      // Since getGallery returns array, we'd need to implement single image endpoint
      // For now, just load form
    } catch (err: any) {
      setError('Failed to load image');
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processImage(file);
  };

  const processImage = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }
    setImage(file);
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const file = e.dataTransfer.files?.[0];
    if (file) processImage(file);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (!image && !isEditMode) {
      setError('Please select an image');
      return;
    }

    setSubmitting(true);

    try {
      const submitData = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        submitData.append(key, String(value));
      });
      if (image) submitData.append('image_url', image);

      if (isEditMode && imageId !== 'new') {
        await apiClient.updateGalleryImage(parseInt(imageId), submitData);
      } else {
        await apiClient.createGalleryImage(submitData);
      }
      router.push('/admin/gallery');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-4xl font-serif font-bold mb-8">
        {isEditMode ? 'Edit Image' : 'Upload Image'}
      </h1>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-8 space-y-6">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {/* Drag & Drop Area */}
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition ${
            dragActive ? 'border-accent-500 bg-accent-50' : 'border-gray-300'
          }`}
        >
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
            id="imageInput"
          />
          <label htmlFor="imageInput" className="cursor-pointer">
            <p className="text-lg font-semibold mb-2">Drag and drop image here</p>
            <p className="text-gray-600">or click to select file</p>
          </label>
        </div>

        {/* Preview */}
        {preview && (
          <div>
            <p className="text-sm font-semibold mb-2">Preview:</p>
            <img src={preview} alt="Preview" className="max-w-full h-auto rounded-lg" />
          </div>
        )}

        {/* Form Fields */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input type="text" name="title_hy" value={formData.title_hy} onChange={handleChange} placeholder="Title (Armenian)" className="px-4 py-2 border border-gray-300 rounded-lg" />
          <input type="text" name="title_en" value={formData.title_en} onChange={handleChange} placeholder="Title (English)" className="px-4 py-2 border border-gray-300 rounded-lg" />
          <input type="text" name="title_ru" value={formData.title_ru} onChange={handleChange} placeholder="Title (Russian)" className="px-4 py-2 border border-gray-300 rounded-lg" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <input type="text" name="category" value={formData.category} onChange={handleChange} placeholder="Category (e.g., Projects)" className="px-4 py-2 border border-gray-300 rounded-lg" />
          <input type="number" name="order_index" value={formData.order_index} onChange={handleChange} placeholder="Order" className="px-4 py-2 border border-gray-300 rounded-lg" />
        </div>

        {/* Buttons */}
        <div className="flex gap-4 pt-6 border-t">
          <Button type="submit" variant="primary" disabled={submitting} className="flex-1">
            {submitting ? 'Uploading...' : 'Upload Image'}
          </Button>
          <Button type="button" variant="secondary" onClick={() => router.push('/admin/gallery')} disabled={submitting} className="flex-1">
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
