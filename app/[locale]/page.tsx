import { Hero } from '@/components/sections/Hero';
import { ServicesSection } from '@/components/sections/ServicesSection';
import { ProjectsSection } from '@/components/sections/ProjectsSection';
import { TeamSection } from '@/components/sections/TeamSection';
import { SectionRenderer } from '@/components/cms/SectionRenderer';
import type { CmsPage } from '@/lib/api';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';

async function getHome(locale: string): Promise<CmsPage | null> {
  try {
    const response = await fetch(`${API_URL}/pages/home?lang=${locale}`, {
      next: { revalidate: 60 },
    });

    if (!response.ok) return null;
    return (await response.json()) as CmsPage;
  } catch {
    return null;
  }
}

export default async function HomePage({ params }: { params: { locale: string } }) {
  const locale = ['hy', 'en', 'ru'].includes(params.locale) ? params.locale : 'hy';
  const page = await getHome(locale);

  if (!page?.sections?.length) {
    return (
      <>
        <Hero />
        <ServicesSection />
        <ProjectsSection />
        <TeamSection />
      </>
    );
  }

  return (
    <>
      {page.sections
        .filter((section) => section.is_enabled)
        .sort((a, b) => a.sort_order - b.sort_order)
        .map((section) => (
          <SectionRenderer key={section.id} section={section} locale={locale} />
        ))}
    </>
  );
}
