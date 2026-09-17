'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { apiClient } from '@/lib/api';
import { GalleryImage } from '@/types';
import { Loading } from '@/components/common/Loading';

export default function GalleryPage() {
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
        setError(null);
        const [imagesRes, categoriesRes] = await Promise.all([
          apiClient.getGallery(locale),
          apiClient.getGalleryCategories(),
        ]);
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

  const filtered = selectedCategory ? images.filter((img) => img.category === selectedCategory) : images;
  const title = locale === 'hy' ? 'Պատկերասրահ' : locale === 'ru' ? 'Галерея' : 'Gallery';
  const all = locale === 'hy' ? 'Բոլորը' : locale === 'ru' ? 'Все' : 'All';

  return (
    <div className="premium-page">
      <section className="premium-page-hero">
        <div className="premium-page-hero-glow" />
        <div className="container relative z-10 py-24 md:py-32">
          <div className="max-w-4xl animate-rise">
            <p className="premium-eyebrow">ELDESCO • FIELD WORK</p>
            <h1 className="premium-title mt-5 text-white">{title}</h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
              {locale === 'hy'
                ? 'Իրականացված աշխատանքներ, արտադրական հանգույցներ և ինժեներական համակարգեր։'
                : locale === 'ru'
                  ? 'Реализованные работы, производственные узлы и инженерные системы.'
                  : 'Delivered work, industrial installations and engineering systems.'}
            </p>
          </div>
        </div>
      </section>

      <section className="bg-slate-50 py-16 md:py-24">
        <div className="container">
          <div className="mb-10 flex flex-wrap gap-2">
            <button onClick={() => setSelectedCategory(null)} className={`rounded-full px-5 py-2 text-sm font-bold transition ${selectedCategory === null ? 'bg-slate-950 text-white' : 'border border-slate-200 bg-white text-slate-600 hover:border-orange-300 hover:text-orange-600'}`}>{all}</button>
            {categories.map((cat) => (
              <button key={cat} onClick={() => setSelectedCategory(cat)} className={`rounded-full px-5 py-2 text-sm font-bold transition ${selectedCategory === cat ? 'bg-slate-950 text-white' : 'border border-slate-200 bg-white text-slate-600 hover:border-orange-300 hover:text-orange-600'}`}>{cat}</button>
            ))}
          </div>

          {loading && <Loading />}
          {error && <div className="premium-panel p-6 text-red-600">{error}</div>}

          {!loading && !error && filtered.length === 0 && (
            <div className="premium-panel p-10 text-center text-slate-500">No gallery items yet.</div>
          )}

          {!loading && !error && filtered.length > 0 && (
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {filtered.map((image, index) => (
                <button
                  key={image.id}
                  type="button"
                  onClick={() => setSelectedImage(image)}
                  className={`group premium-card overflow-hidden text-left ${index % 5 === 0 ? 'md:col-span-2' : ''}`}
                >
                  <div className={`${index % 5 === 0 ? 'h-80 md:h-[420px]' : 'h-72'} overflow-hidden bg-slate-200`}>
                    <img src={image.image} alt={image.title || 'ELDESCO work'} className="h-full w-full object-cover transition duration-700 group-hover:scale-105" />
                  </div>
                  <div className="flex items-center justify-between gap-4 p-5">
                    <div>
                      {image.category && <div className="text-xs font-bold uppercase tracking-[.18em] text-orange-600">{image.category}</div>}
                      {image.title && <div className="mt-2 font-semibold text-slate-900">{image.title}</div>}
                    </div>
                    <span className="text-xl text-slate-400 transition group-hover:translate-x-1 group-hover:text-orange-600">↗</span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      {selectedImage && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-950/90 p-4 backdrop-blur-md" onClick={() => setSelectedImage(null)}>
          <div className="relative max-h-[90vh] max-w-6xl overflow-hidden rounded-2xl bg-black shadow-2xl" onClick={(event) => event.stopPropagation()}>
            <img src={selectedImage.image} alt={selectedImage.title || 'ELDESCO work'} className="max-h-[86vh] max-w-full object-contain" />
            <button type="button" onClick={() => setSelectedImage(null)} className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-full bg-white/90 text-2xl text-slate-950 shadow">×</button>
          </div>
        </div>
      )}
    </div>
  );
}
