import { notFound } from 'next/navigation';
import { PremiumCmsPage } from '@/components/cms/PremiumCmsPage';
import { serviceHeroImages, serviceSlugs } from '@/lib/serviceCatalog';

export default function ServiceDetailPage({ params }: { params: { locale: string; slug: string } }) {
  if (!serviceSlugs.includes(params.slug)) notFound();

  return (
    <PremiumCmsPage
      slug={params.slug}
      locale={params.locale}
      heroImage={serviceHeroImages[params.slug]}
      eyebrow="ELDESCO • ENGINEERING"
    />
  );
}
