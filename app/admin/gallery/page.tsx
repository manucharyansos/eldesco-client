'use client';

import { useEffect, useState } from 'react';
import { apiClient } from '@/lib/api';
import { GalleryImage } from '@/types';
import { Button } from '@/components/common/Button';
import { Loading } from '@/components/common/Loading';

export default function AdminGalleryPage() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        setLoading(true);
        const response = await apiClient.getGallery('en');
        setImages(response.data);
      } catch (err) {
        console.error('Error fetching gallery:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, []);

  if (loading) return <Loading />;

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-serif font-bold">Manage Gallery</h1>
        <Button variant="primary">+ Add Image</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {images.map((image) => (
          <div key={image.id} className="bg-white rounded-lg shadow overflow-hidden">
            <div className="relative w-full h-40 bg-gray-200">
              <img
                src={image.image}
                alt={image.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-4">
              <p className="text-sm text-gray-600 font-semibold mb-3">
                {image.category}
              </p>
              <div className="flex gap-2">
                <button className="flex-1 text-accent-600 hover:text-accent-700 font-semibold py-2 rounded bg-accent-50">
                  Edit
                </button>
                <button className="flex-1 text-red-600 hover:text-red-700 font-semibold py-2 rounded bg-red-50">
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
