import { notFound } from 'next/navigation';
import { getPage } from '@/lib/cms';
import { SectionRenderer } from '@/components/cms/SectionRenderer';

export default async function HomePage({ params }: { params: { locale: string } }) {
  const page = await getPage('home');

  if (!page) {
    notFound();
  }

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
