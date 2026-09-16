'use client';

import { useEffect, useState } from 'react';
import { apiClient } from '@/lib/api';
import { NewsItem, PaginatedResponse } from '@/types';
import { Button } from '@/components/common/Button';
import { Loading } from '@/components/common/Loading';
import { formatDate } from '@/lib/utils';

export default function AdminNewsPage() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);
        const response = await apiClient.getNews('en', 1, 50);
        setNews(response.data.data);
      } catch (err) {
        console.error('Error fetching news:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  if (loading) return <Loading />;

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-serif font-bold">Manage News</h1>
        <Button variant="primary">+ Add Article</Button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold">Title</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Date</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Status</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {news.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 font-semibold">{item.title}</td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {formatDate(item.createdAt, 'en')}
                </td>
                <td className="px-6 py-4">
                  <span className={`text-xs font-semibold px-2 py-1 rounded ${
                    item.published
                      ? 'bg-green-100 text-green-700'
                      : 'bg-gray-100 text-gray-700'
                  }`}>
                    {item.published ? 'Published' : 'Draft'}
                  </span>
                </td>
                <td className="px-6 py-4 space-x-3">
                  <button className="text-accent-600 hover:text-accent-700 font-semibold">
                    Edit
                  </button>
                  <button className="text-red-600 hover:text-red-700 font-semibold">
                    Delete
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
