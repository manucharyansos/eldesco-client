'use client';

import { useEffect, useState } from 'react';
import { apiClient } from '@/lib/api';
import { Metadata } from 'next';

interface Stats {
  services: number;
  projects: number;
  team: number;
  news: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({ services: 0, projects: 0, team: 0, news: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const servicesRes = await apiClient.getServices('en');
        const projectsRes = await apiClient.getProjects('en');
        const teamRes = await apiClient.getTeam('en');
        const newsRes = await apiClient.getNews('en', 1, 100);

        setStats({
          services: servicesRes.data.length,
          projects: projectsRes.data.length,
          team: teamRes.data.length,
          news: newsRes.data.pagination.total,
        });
      } catch (err) {
        console.error('Error fetching stats:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statCards = [
    { label: 'Services', value: stats.services },
    { label: 'Projects', value: stats.projects },
    { label: 'Team Members', value: stats.team },
    { label: 'News Articles', value: stats.news },
  ];

  return (
    <div>
      <h1 className="text-4xl font-serif font-bold mb-8">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat) => (
          <div key={stat.label} className="bg-white rounded-lg shadow p-6">
            <h3 className="text-gray-600 text-sm font-semibold mb-2">{stat.label}</h3>
            <p className="text-3xl font-bold text-primary-500">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-serif font-bold mb-4">Welcome to ELDESCO Admin Panel</h2>
        <p className="text-gray-600">
          Use the sidebar to manage your website content. You can edit services, projects,
          team members, news articles, and gallery images.
        </p>
      </div>
    </div>
  );
}
