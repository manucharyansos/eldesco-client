'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import { apiClient } from '@/lib/api';
import { NewsItem, PaginatedResponse } from '@/types';
import { NewsCard } from '@/components/common/NewsCard';
import { Loading } from '@/components/common/Loading';

export default function NewsPage() {
  const t = useTranslations('common');
  const params = useParams();
  const locale = params.locale as string;
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);
        const response = await apiClient.getNews(locale, page, 10);
        setNews(response.data.data);
        setTotalPages(response.data.pagination.last_page);
      } catch (err: any) {
        setError(err.message || 'Failed to load news');
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, [locale, page]);

  if (loading) return <Loading />;
  if (error) return <div className="text-center py-12 text-red-600">{error}</div>;

  return (
    <div className="container py-12">
      <h1 className="text-4xl font-bold mb-12 text-center">{t('news')}</h1>
      <div className="space-y-8">
        {news.map((item) => (
          <NewsCard key={item.id} news={item} locale={locale} />
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center gap-2 mt-12">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
          <button
            key={p}
            onClick={() => setPage(p)}
            className={`px-4 py-2 rounded ${
              p === page
                ? 'bg-accent-500 text-white'
                : 'bg-gray-200 hover:bg-gray-300'
            }`}
          >
            {p}
          </button>
        ))}
      </div>
    </div>
  );
}
