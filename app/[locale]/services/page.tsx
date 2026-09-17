'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { apiClient } from '@/lib/api';
import { Service } from '@/types';
import { ServiceCard } from '@/components/common/ServiceCard';
import { Loading } from '@/components/common/Loading';

export default function ServicesPage() {
  const params = useParams();
  const locale = params.locale as string;
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        const response = await apiClient.getServices(locale);
        setServices(response.data);
      } catch (err: any) {
        setError(err.message || 'Failed to load services');
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, [locale]);

  const title = locale === 'hy' ? 'Գործունեության ոլորտները' : locale === 'ru' ? 'Направления деятельности' : 'Areas of activity';
  const subtitle = locale === 'hy'
    ? 'Նախագծումից և արտադրությունից մինչև մոնտաժ ու ավտոմատացում՝ մեկ ինժեներական գործընկերոջ հետ։'
    : locale === 'ru'
      ? 'От проектирования и производства до монтажа и автоматизации — с одним инженерным партнером.'
      : 'From design and production to installation and automation — with one engineering partner.';

  return (
    <div className="premium-page">
      <section className="premium-page-hero">
        <div className="premium-page-hero-glow" />
        <div className="container relative z-10 py-24 md:py-32">
          <div className="max-w-4xl animate-rise">
            <p className="premium-eyebrow">ELDESCO • ENGINEERING</p>
            <h1 className="premium-title mt-5 text-white">{title}</h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300 md:text-xl">{subtitle}</p>
          </div>
        </div>
      </section>

      <section className="bg-slate-50 py-16 md:py-24">
        <div className="container">
          {loading && <Loading />}
          {error && <div className="premium-panel p-6 text-red-600">{error}</div>}
          {!loading && !error && (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {services.map((service) => <ServiceCard key={service.id} service={service} />)}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
