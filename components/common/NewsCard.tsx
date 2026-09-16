import Link from 'next/link';
import { NewsItem } from '@/types';
import { formatDate } from '@/lib/utils';

interface NewsCardProps {
  news: NewsItem;
  locale: string;
}

export function NewsCard({ news, locale }: NewsCardProps) {
  return (
    <article className="bg-white rounded-lg shadow hover:shadow-lg transition overflow-hidden border border-gray-100">
      <div className="md:flex">
        {news.image && (
          <div className="md:w-48 h-48 md:h-auto bg-gray-200 overflow-hidden">
            <img
              src={news.image}
              alt={news.title}
              className="w-full h-full object-cover hover:scale-105 transition"
            />
          </div>
        )}
        <div className="p-6 flex-1">
          <p className="text-sm text-gray-500 mb-2">
            {formatDate(news.createdAt, locale)}
          </p>
          <h2 className="font-serif text-xl font-bold mb-3">{news.title}</h2>
          <p className="text-gray-600 mb-4 line-clamp-2">{news.excerpt || news.content}</p>
          <Link
            href={`/${locale}/news/${news.slug}`}
            className="text-accent-600 font-semibold hover:text-accent-700"
          >
            Read More →
          </Link>
        </div>
      </div>
    </article>
  );
}
