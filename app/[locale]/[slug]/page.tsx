import { notFound } from 'next/navigation';
import { PageRenderer } from '@/components/cms/PageRenderer';
import { getPublicPage } from '@/lib/cms';

export const dynamic = 'force-dynamic';

export default async function CmsSlugPage({ params }: { params: { locale: string; slug: string } }) {
  try {
    const page = await getPublicPage(params.slug);
    return <PageRenderer page={page} locale={params.locale} />;
  } catch {
    notFound();
  }
}
