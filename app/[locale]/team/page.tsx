'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import { apiClient } from '@/lib/api';
import { TeamMember } from '@/types';
import { TeamMemberCard } from '@/components/common/TeamMemberCard';
import { Loading } from '@/components/common/Loading';

export default function TeamPage() {
  const t = useTranslations('common');
  const params = useParams();
  const locale = params.locale as string;
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        setLoading(true);
        const response = await apiClient.getTeam(locale);
        setMembers(response.data);
      } catch (err: any) {
        setError(err.message || 'Failed to load team');
      } finally {
        setLoading(false);
      }
    };

    fetchTeam();
  }, [locale]);

  if (loading) return <Loading />;
  if (error) return <div className="text-center py-12 text-red-600">{error}</div>;

  return (
    <div className="container py-12">
      <h1 className="text-4xl font-bold mb-12 text-center">{t('team')}</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {members.map((member) => (
          <TeamMemberCard key={member.id} member={member} />
        ))}
      </div>
    </div>
  );
}
