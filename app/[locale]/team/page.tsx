import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { API_URL } from '@/lib/config';
import { isLocale } from '@/lib/config';
import { getSite } from '@/lib/cms';
import { makeUi } from '@/lib/defaults';
import { pageMetadata } from '@/lib/seo';
import { LiveTeamPage } from '@/components/live/LivePages';
import type { TeamMember } from '@/types';

type Props = { params: { locale: string } };

async function loadTeam(locale: string): Promise<TeamMember[]> {
  try {
    const r = await fetch(`${API_URL}/team?lang=${locale}`, { next: { revalidate: 60, tags: ['cms'] } });
    return r.ok ? await r.json() : [];
  } catch { return []; }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  if (!isLocale(params.locale)) return {};
  const site = await getSite(params.locale);
  return pageMetadata({ locale: params.locale, path: 'team', title: makeUi(site.settings, params.locale)('team_title') });
}

export default async function TeamPage({ params }: Props) {
  if (!isLocale(params.locale)) notFound();
  const members = await loadTeam(params.locale);
  return <LiveTeamPage locale={params.locale} initialMembers={members} />;
}
