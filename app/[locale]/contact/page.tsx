import { PremiumCmsPage } from '@/components/cms/PremiumCmsPage';

export default function ContactPage({ params }: { params: { locale: string } }) {
  return <PremiumCmsPage slug="contact" locale={params.locale} eyebrow="ELDESCO • CONTACT" />;
}
