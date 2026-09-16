import { PageRenderer } from '@/components/cms/PageRenderer';
import { getPublicPage } from '@/lib/cms';

export const dynamic = 'force-dynamic';

export default async function HomePage({ params }: { params: { locale: string } }) {
  try {
    const page = await getPublicPage('home');
    return <PageRenderer page={page} locale={params.locale} />;
  } catch {
    return (
      <section className="cms-hero">
        <div className="shell cms-hero__content">
          <span className="eyebrow">ELDESCO</span>
          <h1>Energy infrastructure & engineering systems</h1>
          <p className="cms-body">The CMS API is not available yet. Start the Laravel backend and run the database seed.</p>
        </div>
      </section>
    );
  }
}
