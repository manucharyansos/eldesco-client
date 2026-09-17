'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Service } from '@/types';
import { serviceCatalog } from '@/lib/serviceCatalog';

interface ServiceCardProps {
  service: Service;
}

export function ServiceCard({ service }: ServiceCardProps) {
  const params = useParams();
  const locale = (params.locale as string) || 'hy';
  const catalog = serviceCatalog[service.id];
  const href = catalog ? `/${locale}/services/${catalog.slug}` : `/${locale}/services`;

  return (
    <Link href={href} className="group premium-card block overflow-hidden">
      {catalog?.image ? (
        <div className="h-56 overflow-hidden bg-slate-200">
          <img
            src={catalog.image}
            alt={service.title}
            className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
          />
        </div>
      ) : (
        <div className="relative h-44 overflow-hidden bg-slate-950">
          <div className="absolute inset-0 premium-grid opacity-30" />
          <div className="absolute -right-10 -top-12 h-40 w-40 rounded-full bg-orange-500/20 blur-3xl" />
        </div>
      )}
      <div className="p-7">
        <div className="flex items-center justify-between gap-4">
          <span className="text-xs font-bold tracking-[.22em] text-orange-600">SERVICE {String(service.order || service.id).padStart(2, '0')}</span>
          <span className="text-xl text-slate-400 transition group-hover:translate-x-1 group-hover:text-orange-600">→</span>
        </div>
        <h3 className="mt-5 text-xl font-bold leading-snug text-slate-950 transition group-hover:text-orange-600">{service.title}</h3>
        {service.description && <p className="mt-3 line-clamp-3 leading-7 text-slate-600">{service.description}</p>}
      </div>
    </Link>
  );
}
