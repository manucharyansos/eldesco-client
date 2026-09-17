import { PremiumCmsPage } from '@/components/cms/PremiumCmsPage';

export default function AboutPage({ params }: { params: { locale: string } }) {
  return (
    <PremiumCmsPage
      slug="about"
      locale={params.locale}
      eyebrow="ELDESCO • 2011"
      heroImage="/images/projects/metalworks.png"
    />
  );
}
