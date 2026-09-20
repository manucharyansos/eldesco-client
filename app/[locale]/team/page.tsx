import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { API_URL } from '@/lib/config';
import { isLocale } from '@/lib/config';
import { getSite } from '@/lib/cms';
import { makeUi } from '@/lib/defaults';
import { pageMetadata } from '@/lib/seo';
import { Img } from '@/components/common/Img';
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
  const [members, site] = await Promise.all([loadTeam(params.locale), getSite(params.locale)]);
  const ui = makeUi(site.settings, params.locale);

  return (
    <>
      <section className="page-hero"><div className="page-hero-shade" /><div className="container py-16 md:py-24"><h1 className="h-page">{ui('team_title')}</h1></div></section>
      <section className="section">
        <div className="container">
          {members.length === 0 ? <p className="lead">{ui('no_items')}</p> : (
            <ul className="grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
              {members.map((m) => (
                <li key={m.id}>
                  <div className="aspect-[4/5] overflow-hidden rounded-md bg-steel-100"><Img src={m.image} alt={m.name} className="h-full w-full object-cover" /></div>
                  <h2 className="mt-4 text-lg font-bold text-navy-800">{m.name}</h2>
                  {m.position && <p className="mt-1 text-steel-600">{m.position}</p>}
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </>
  );
}
