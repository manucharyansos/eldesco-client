import { useTranslations } from 'next-intl';
import { Hero } from '@/components/sections/Hero';
import { ServicesSection } from '@/components/sections/ServicesSection';
import { ProjectsSection } from '@/components/sections/ProjectsSection';
import { TeamSection } from '@/components/sections/TeamSection';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'ELDESCO - Home',
  description: 'Energy Infrastructure & Engineering Solutions',
};

export default function HomePage() {
  const t = useTranslations('common');

  return (
    <>
      <Hero />
      <ServicesSection />
      <ProjectsSection />
      <TeamSection />
    </>
  );
}
