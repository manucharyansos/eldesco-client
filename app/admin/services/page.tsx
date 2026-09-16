'use client';

import { useEffect, useState } from 'react';
import { apiClient } from '@/lib/api';
import { Service } from '@/types';
import { Button } from '@/components/common/Button';
import { Loading } from '@/components/common/Loading';

export default function AdminServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    title_en: '',
    title_hy: '',
    title_ru: '',
    description_en: '',
    description_hy: '',
    description_ru: '',
    icon: '',
  });

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const response = await apiClient.getServices('en');
      setServices(response.data);
    } catch (err) {
      console.error('Error fetching services:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (service: any) => {
    setEditingId(service.id);
    setFormData({
      title_en: service.title_en || '',
      title_hy: service.title_hy || '',
      title_ru: service.title_ru || '',
      description_en: service.description_en || '',
      description_hy: service.description_hy || '',
      description_ru: service.description_ru || '',
      icon: service.icon || '',
    });
  };

  const handleSave = async () => {
    if (!editingId) return;

    try {
      await apiClient.updateService(editingId, formData);
      setEditingId(null);
      fetchServices();
    } catch (err) {
      console.error('Error saving service:', err);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this service?')) {
      try {
        await apiClient.deleteService(id);
        fetchServices();
      } catch (err) {
        console.error('Error deleting service:', err);
      }
    }
  };

  if (loading) return <Loading />;

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-serif font-bold">Manage Services</h1>
        <Button variant="primary">+ Add Service</Button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold">Title (EN)</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Description</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {services.map((service: any) => (
              <tr key={service.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  {editingId === service.id ? (
                    <input
                      type="text"
                      value={formData.title_en}
                      onChange={(e) =>
                        setFormData({ ...formData, title_en: e.target.value })
                      }
                      className="border border-gray-300 rounded px-2 py-1 w-full"
                    />
                  ) : (
                    service.title_en
                  )}
                </td>
                <td className="px-6 py-4 text-gray-600 truncate">
                  {service.description_en}
                </td>
                <td className="px-6 py-4 space-x-2">
                  {editingId === service.id ? (
                    <>
                      <button
                        onClick={handleSave}
                        className="text-green-600 hover:text-green-700 font-semibold"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className="text-gray-600 hover:text-gray-700 font-semibold"
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => handleEdit(service)}
                        className="text-accent-600 hover:text-accent-700 font-semibold"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(service.id)}
                        className="text-red-600 hover:text-red-700 font-semibold"
                      >
                        Delete
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
