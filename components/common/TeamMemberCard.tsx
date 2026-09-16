import { TeamMember } from '@/types';

interface TeamMemberCardProps {
  member: TeamMember;
}

export function TeamMemberCard({ member }: TeamMemberCardProps) {
  return (
    <div className="bg-white rounded-lg shadow hover:shadow-lg transition text-center overflow-hidden">
      {member.image && (
        <div className="w-full h-48 bg-gray-200 overflow-hidden">
          <img
            src={member.image}
            alt={member.name}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      <div className="p-4">
        <h3 className="font-serif text-lg font-bold">{member.name}</h3>
        {member.position && (
          <p className="text-accent-600 text-sm font-semibold mb-2">{member.position}</p>
        )}
        {member.email && (
          <a href={`mailto:${member.email}`} className="text-gray-600 text-sm hover:text-accent-500">
            {member.email}
          </a>
        )}
      </div>
    </div>
  );
}
