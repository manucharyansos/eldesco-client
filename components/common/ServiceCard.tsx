import { Service } from '@/types';

interface ServiceCardProps {
  service: Service;
}

export function ServiceCard({ service }: ServiceCardProps) {
  return (
    <div className="bg-white rounded-lg shadow hover:shadow-lg transition p-6 border border-gray-100">
      {service.icon && (
        <div className="text-4xl mb-4">{service.icon}</div>
      )}
      <h3 className="font-serif text-xl font-bold mb-3">{service.title}</h3>
      <p className="text-gray-600">{service.description}</p>
    </div>
  );
}
