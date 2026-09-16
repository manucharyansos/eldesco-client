'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import { apiClient } from '@/lib/api';
import { TeamMember } from '@/types';
import { TeamMemberCard } from '@/components/common/TeamMemberCard';
import { Loading } from '@/components/common/Loading';

export function TeamSection() {
  const t = useTranslations('common');
  const params = useParams();
  const locale = params.locale as string;
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const response = await apiClient.getTeam(locale);
        setMembers(response.data.slice(0, 4)); // Show only first 4
      } catch (err) {
        console.error('Error fetching team:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTeam();
  }, [locale]);

  if (loading) return <Loading />;

  return (
    <section className="bg-gray-50 py-16">
      <div className="container">
        <h2 className="text-4xl font-bold text-center mb-12">{t('team')}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {members.map((member) => (
            <TeamMemberCard key={member.id} member={member} />
          ))}
        </div>
      </div>
    </section>
  );
}
