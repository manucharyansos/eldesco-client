'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import { apiClient } from '@/lib/api';
import { GalleryImage } from '@/types';
import { Loading } from '@/components/common/Loading';
import Image from 'next/image';

export default function GalleryPage() {
  const t = useTranslations('common');
  const params = useParams();
  const locale = params.locale as string;
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const imagesRes = await apiClient.getGallery(locale);
        const categoriesRes = await apiClient.getGalleryCategories();
        
        setImages(imagesRes.data);
        setCategories(categoriesRes.data);
      } catch (err: any) {
        setError(err.message || 'Failed to load gallery');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [locale]);

  const filtered = selectedCategory
    ? images.filter(img => img.category === selectedCategory)
    : images;

  if (loading) return <Loading />;
  if (error) return <div className="text-center py-12 text-red-600">{error}</div>;

  return (
    <div className="container py-12">
      <h1 className="text-4xl font-bold mb-8 text-center">Gallery</h1>

      {/* Category filter */}
      <div className="flex flex-wrap gap-2 mb-8 justify-center">
        <button
          onClick={() => setSelectedCategory(null)}
          className={`px-4 py-2 rounded ${
            selectedCategory === null
              ? 'bg-accent-500 text-white'
              : 'bg-gray-200 hover:bg-gray-300'
          }`}
        >
          All
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded ${
              selectedCategory === cat
                ? 'bg-accent-500 text-white'
                : 'bg-gray-200 hover:bg-gray-300'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Gallery grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((image) => (
          <div
            key={image.id}
            className="cursor-pointer hover:opacity-75 transition"
            onClick={() => setSelectedImage(image)}
          >
            <img
              src={image.image}
              alt={image.title || 'Gallery image'}
              className="w-full h-48 object-cover rounded"
            />
          </div>
        ))}
      </div>

      {/* Lightbox modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-3xl max-h-[80vh]" onClick={(e) => e.stopPropagation()}>
            <img
              src={selectedImage.image}
              alt={selectedImage.title || 'Image'}
              className="max-w-full max-h-[80vh]"
            />
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 bg-white text-black w-8 h-8 rounded-full flex items-center justify-center"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
