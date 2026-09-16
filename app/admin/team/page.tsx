'use client';

import { useEffect, useState } from 'react';
import { apiClient } from '@/lib/api';
import { TeamMember } from '@/types';
import { Button } from '@/components/common/Button';
import { Loading } from '@/components/common/Loading';

export default function AdminTeamPage() {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        setLoading(true);
        const response = await apiClient.getTeam('en');
        setMembers(response.data);
      } catch (err) {
        console.error('Error fetching team:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTeam();
  }, []);

  if (loading) return <Loading />;

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-serif font-bold">Manage Team</h1>
        <Button variant="primary">+ Add Member</Button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold">Name</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Position</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Email</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {members.map((member) => (
              <tr key={member.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 font-semibold">{member.name}</td>
                <td className="px-6 py-4 text-gray-600">{member.position}</td>
                <td className="px-6 py-4 text-sm">{member.email}</td>
                <td className="px-6 py-4 space-x-3">
                  <button className="text-accent-600 hover:text-accent-700 font-semibold">
                    Edit
                  </button>
                  <button className="text-red-600 hover:text-red-700 font-semibold">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
