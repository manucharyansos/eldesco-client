import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getPage, localizedText } from '@/lib/cms';
import { SectionRenderer } from '@/components/cms/SectionRenderer';

export async function generateMetadata({ params }: { params: { locale: string; slug: string } }): Promise<Metadata> {
  const page = await getPage(params.slug);
  if (!page) return {};

  return {
    title: localizedText(page.seo_title, params.locale) || `${page.name} | ELDESCO`,
    description: localizedText(page.seo_description, params.locale),
  };
}

export default async function CmsPage({ params }: { params: { locale: string; slug: string } }) {
  const page = await getPage(params.slug);
  if (!page) notFound();

  return (
    <>
      {page.sections
        .filter((section) => section.enabled)
        .sort((a, b) => a.sort_order - b.sort_order)
        .map((section) => (
          <SectionRenderer key={section.id} section={section} locale={params.locale} />
        ))}
    </>
  );
}
