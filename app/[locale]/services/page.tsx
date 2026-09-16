'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import { apiClient } from '@/lib/api';
import { Service } from '@/types';
import { ServiceCard } from '@/components/common/ServiceCard';
import { Loading } from '@/components/common/Loading';

export default function ServicesPage() {
  const t = useTranslations('common');
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

  if (loading) return <Loading />;
  if (error) return <div className="text-center py-12 text-red-600">{error}</div>;

  return (
    <div className="container py-12">
      <h1 className="text-4xl font-bold mb-12 text-center">{t('services')}</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {services.map((service) => (
          <ServiceCard key={service.id} service={service} />
        ))}
      </div>
    </div>
  );
}
