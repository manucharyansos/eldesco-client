import { PremiumCmsPage } from '@/components/cms/PremiumCmsPage';

export default function CustomersPage({ params }: { params: { locale: string } }) {
  return <PremiumCmsPage slug="customers" locale={params.locale} eyebrow="ELDESCO • TRUST" />;
}
