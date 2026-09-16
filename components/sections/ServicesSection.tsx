'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import { apiClient } from '@/lib/api';
import { Service } from '@/types';
import { ServiceCard } from '@/components/common/ServiceCard';
import { Loading } from '@/components/common/Loading';

export function ServicesSection() {
  const t = useTranslations('common');
  const params = useParams();
  const locale = params.locale as string;
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await apiClient.getServices(locale);
        setServices(response.data.slice(0, 3)); // Show only first 3
      } catch (err) {
        console.error('Error fetching services:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, [locale]);

  if (loading) return <Loading />;

  return (
    <section className="bg-gray-50 py-16">
      <div className="container">
        <h2 className="text-4xl font-bold text-center mb-12">{t('services')}</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {services.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
      </div>
    </section>
  );
}
