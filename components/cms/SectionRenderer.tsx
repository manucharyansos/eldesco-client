import Link from 'next/link';
import type { CmsSection, SiteData } from '@/lib/cms-types';
import type { Locale } from '@/lib/config';
import { getServices, str } from '@/lib/cms';
import { makeUi } from '@/lib/defaults';
import { formatPhone, localizedHref, telHref } from '@/lib/nav';
import { Img } from '@/components/common/Img';
import { Hero } from '@/components/sections/Hero';
import { GalleryClient, type GalleryImage } from '@/components/sections/GalleryClient';

type Props = { section: CmsSection; locale: Locale; site: SiteData; pageTitle?: string };

const list = (v: unknown): any[] => (Array.isArray(v) ? v : []);
const paragraphsOf = (c: Record<string, any>) => {
  const p = list(c.paragraphs).map(str).filter(Boolean);
  return p.length ? p : [str(c.description)].filter(Boolean);
};

function SectionHead({ title, subtitle, dark }: { title: string; subtitle?: string; dark?: boolean }) {
  if (!title && !subtitle) return null;
  return (
    <div className="mb-10 max-w-3xl md:mb-14">
      {title && <h2 className="h-section">{title}</h2>}
      {subtitle && <p className={`lead mt-4 ${dark ? '!text-navy-100' : ''}`}>{subtitle}</p>}
    </div>
  );
}

export async function SectionRenderer({ section, locale, site, pageTitle }: Props) {
  if (!section.is_enabled) return null;
  const c = section.content ?? {};
  const s = site.settings;
  const ui = makeUi(s, locale);

  switch (section.type) {
    case 'hero':
      return <Hero content={c} locale={locale} areasLabel={ui('areas_of_activity')} />;

    case 'page_hero':
      return (
        <section className="page-hero">
          {str(c.image) && <div className="page-hero-media" aria-hidden="true"><Img src={str(c.image)} loading="eager" fetchPriority="high" /></div>}
          <div className="page-hero-shade" />
          <div className="container py-16 md:py-24 lg:py-28">
            {str(c.eyebrow) && <p className="text-sm font-bold text-amber-400">{str(c.eyebrow)}</p>}
            <h1 className="h-page mt-3 max-w-4xl">{str(c.title) || pageTitle}</h1>
            {str(c.subtitle) && <p className="lead mt-5 max-w-2xl !text-navy-100">{str(c.subtitle)}</p>}
          </div>
        </section>
      );

    case 'text':
    case 'intro':
    case 'rich_text': {
      const image = str(c.image);
      const left = str(c.image_position) === 'left';
      const wash = str(c.background) === 'wash';
      return (
        <section className={`section ${wash ? 'band-wash' : ''}`}>
          <div className={`container grid gap-10 lg:gap-16 ${image ? 'items-center lg:grid-cols-2' : 'lg:grid-cols-[.8fr_1.2fr]'}`}>
            {image && <div className={`overflow-hidden rounded-md bg-steel-100 ${left ? 'lg:order-first' : 'lg:order-last'}`}><Img src={image} alt={str(c.image_alt)} className="aspect-[4/3] w-full object-cover" /></div>}
            <div>
              {str(c.title) && <h2 className="h-section">{str(c.title)}</h2>}
              <div className={`prose-eld ${str(c.title) ? 'mt-6' : ''}`}>{paragraphsOf(c).map((p, i) => <p key={i}>{p}</p>)}</div>
              {str(c.cta_label) && <Link href={localizedHref(str(c.cta_url), locale)} className="link-quiet mt-8 inline-block">{str(c.cta_label)}</Link>}
            </div>
          </div>
        </section>
      );
    }

    case 'feature_split': {
      const dark = str(c.theme) !== 'light';
      const image = str(c.image);
      const left = str(c.image_position) === 'left';
      return (
        <section className={`section ${dark ? 'band-navy-deep on-dark' : ''}`}>
          <div className={`container grid gap-10 lg:gap-16 ${image ? 'items-center lg:grid-cols-2' : ''}`}>
            {image && <div className={`overflow-hidden rounded-md ${left ? 'lg:order-first' : 'lg:order-last'}`}><Img src={image} alt={str(c.image_alt)} className="aspect-[4/3] w-full object-cover" /></div>}
            <div>
              {str(c.title) && <h2 className="h-section">{str(c.title)}</h2>}
              <div className="prose-eld mt-6">{paragraphsOf(c).map((p, i) => <p key={i}>{p}</p>)}</div>
              {str(c.cta_label) && <Link href={localizedHref(str(c.cta_url), locale)} className="link-quiet mt-8 inline-block">{str(c.cta_label)}</Link>}
            </div>
          </div>
        </section>
      );
    }

    case 'services': {
      const services = await getServices(locale);
      if (!services.length) return null;
      return (
        <section className="section">
          <div className="container">
            <SectionHead title={str(c.title)} subtitle={str(c.subtitle)} />
            <div>
              {services.map((service, i) => {
                const href = service.slug ? `/${locale}/services/${service.slug}` : `/${locale}/services`;
                return (
                  <article key={service.id} className="service-row grid gap-6 py-8 md:py-12 lg:grid-cols-12 lg:items-center lg:gap-14">
                    <div className={`service-media aspect-[4/3] lg:col-span-7 ${i % 2 ? 'lg:order-2' : ''}`}>
                      <Link href={href} tabIndex={-1} aria-hidden="true" className="block h-full">
                        <Img src={service.image} alt="" className="h-full w-full" />
                      </Link>
                    </div>
                    <div className="lg:col-span-5">
                      <h3 className="h-item"><Link href={href} className="transition hover:text-rust-600">{service.title}</Link></h3>
                      {service.description && <p className="mt-4 text-[1.0625rem] leading-8 text-steel-600">{service.description}</p>}
                      <Link href={href} className="link-quiet mt-6 inline-block">{ui('learn_more')}</Link>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </section>
      );
    }

    case 'stats': {
      const items = list(c.items);
      if (!items.length) return null;
      return (
        <section className="band-wash border-y border-steel-200">
          <div className="container grid grid-cols-2 gap-x-6 gap-y-8 py-10 md:py-12 lg:grid-cols-4">
            {items.map((item, i) => (
              <div key={i} className="min-w-0 [overflow-wrap:anywhere]">
                <div className="text-[1.45rem] font-extrabold leading-tight text-navy-800 sm:text-3xl md:text-4xl">{str(item?.value)}</div>
                <div className="mt-2 text-sm font-medium leading-snug text-steel-600">{str(item?.label)}</div>
              </div>
            ))}
          </div>
        </section>
      );
    }

    case 'customers': {
      const items = list(c.items).filter((x) => str(x?.logo) || str(x?.name));
      if (!items.length) return null;
      return (
        <section className="section">
          <div className="container">
            <SectionHead title={str(c.title)} subtitle={str(c.subtitle)} />
            <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
              {items.map((item, i) => (
                <li key={i} className="logo-tile">
                  {str(item.logo)
                    ? <Img src={str(item.logo)} alt={str(item.name)} />
                    : <span className="text-center text-sm font-bold text-steel-600">{str(item.name)}</span>}
                </li>
              ))}
            </ul>
          </div>
        </section>
      );
    }

    case 'timeline': {
      const items = list(c.items);
      if (!items.length) return null;
      return (
        <section className="section band-wash">
          <div className="container">
            <SectionHead title={str(c.title)} />
            <ol className="grid gap-x-10 gap-y-10 md:grid-cols-3">
              {items.map((item, i) => (
                <li key={i} className="border-t-2 border-navy-800 pt-5">
                  <div className="text-3xl font-extrabold text-rust-500">{str(item?.year)}</div>
                  <h3 className="mt-4 text-lg font-bold leading-snug text-navy-800">{str(item?.title)}</h3>
                  <p className="mt-3 leading-7 text-steel-600">{str(item?.description)}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>
      );
    }

    case 'bullets': {
      const items = list(c.items).map(str).filter(Boolean);
      if (!items.length) return null;
      return (
        <section className="section">
          <div className="container grid gap-8 lg:grid-cols-[.8fr_1.2fr] lg:gap-16">
            <h2 className="h-section">{str(c.title)}</h2>
            <ul className="scope-list">{items.map((item, i) => <li key={i}>{item}</li>)}</ul>
          </div>
        </section>
      );
    }

    case 'gallery': {
      const images: GalleryImage[] = list(c.images)
        .filter((x) => str(x?.image))
        .map((x) => ({
          image: str(x.image),
          alt: str(x.alt) || str(x.caption) || str(c.title) || pageTitle || '',
          caption: str(x.caption) || undefined,
          w: Number(x.w) || undefined,
          h: Number(x.h) || undefined,
        }));
      if (!images.length) return null;
      return (
        <section className="section band-wash">
          <div className="container">
            <SectionHead title={str(c.title)} />
            <GalleryClient images={images} labels={{ close: ui('close'), next: ui('next'), previous: ui('previous') }} />
          </div>
        </section>
      );
    }

    case 'cta':
      return (
        <section className="band-navy on-dark">
          <div className="container flex flex-col gap-8 py-14 md:py-20 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <h2 className="h-section">{str(c.title)}</h2>
              {str(c.description) && <p className="lead mt-4">{str(c.description)}</p>}
            </div>
            <Link href={localizedHref(str(c.cta_url) || '/contact', locale)} className="btn btn-primary shrink-0">{str(c.cta_label) || ui('contact_us')}</Link>
          </div>
        </section>
      );

    case 'contact': {
      const phone = str(s['contact.phone']) || str(c.phone);
      const email = str(s['contact.email']) || str(c.email);
      const address = str(s['contact.business_address']) || str(c.address);
      return (
        <section className="section">
          <div className="container grid gap-10 lg:grid-cols-2 lg:gap-16">
            <div>
              <h2 className="h-section">{str(c.title) || ui('contact_us')}</h2>
              {str(c.description) && <p className="lead mt-4 max-w-xl">{str(c.description)}</p>}
              <div className="mt-8 flex flex-wrap gap-3">
                {phone && <a href={telHref(phone)} className="btn btn-primary">{ui('call_us')}</a>}
                {email && <a href={`mailto:${email}`} className="btn btn-outline">{ui('email_us')}</a>}
              </div>
            </div>
            <dl className="divide-y divide-steel-200 border-y border-steel-200">
              {phone && <div className="grid gap-1 py-5 sm:grid-cols-[9rem_1fr]"><dt className="text-sm font-semibold text-steel-500">{ui('phone')}</dt><dd><a href={telHref(phone)} className="text-xl font-bold text-navy-800 hover:text-rust-600">{formatPhone(phone)}</a></dd></div>}
              {email && <div className="grid gap-1 py-5 sm:grid-cols-[9rem_1fr]"><dt className="text-sm font-semibold text-steel-500">{ui('email')}</dt><dd><a href={`mailto:${email}`} className="text-lg font-semibold text-navy-800 hover:text-rust-600 break-all">{email}</a></dd></div>}
              {address && <div className="grid gap-1 py-5 sm:grid-cols-[9rem_1fr]"><dt className="text-sm font-semibold text-steel-500">{ui('business_address')}</dt><dd className="text-lg font-medium leading-7 text-ink">{address}</dd></div>}
            </dl>
          </div>
        </section>
      );
    }

    case 'company_details': {
      const pick = (key: string, alt?: string) => str(s[key]) || (alt ? str(c[alt]) : '');
      const accounts = [pick('bank.account_amd'), pick('bank.account_usd'), pick('bank.account_eur')].filter(Boolean);
      const legacyAccounts = list(c.accounts).map(str).filter(Boolean);
      const rows: Array<[string, React.ReactNode]> = [
        [ui('company'), pick('company.name', 'company')],
        [ui('tax_id'), pick('company.tax_id', 'tax_id')],
        [ui('registration'), pick('company.registration', 'registration')],
        [ui('business_address'), pick('contact.business_address', 'business_address')],
        [ui('legal_address'), pick('contact.legal_address', 'legal_address')],
        [ui('bank'), pick('bank.name', 'bank')],
        [ui('bank_accounts'), (accounts.length ? accounts : legacyAccounts).map((a) => <span key={a} className="block">{a}</span>)],
        [ui('phone'), formatPhone(pick('contact.phone', 'phone'))],
        [ui('email'), pick('contact.email', 'email')],
        [str(s['company.director_position']) || ui('director'), pick('company.director', 'director')],
        [str(s['company.chief_accountant_position']) || ui('chief_accountant'), pick('company.chief_accountant', 'chief_accountant')],
      ].filter(([label, value]) => label && value && !(Array.isArray(value) && !value.length)) as Array<[string, React.ReactNode]>;
      return (
        <section className="section band-wash">
          <div className="container">
            <SectionHead title={str(c.title)} />
            <dl className="divide-y divide-steel-200 border-y border-steel-200 bg-white px-5 md:px-8">
              {rows.map(([label, value]) => (
                <div key={label} className="grid gap-1 py-4 md:grid-cols-[15rem_1fr] md:gap-6">
                  <dt className="text-sm font-semibold text-steel-500">{label}</dt>
                  <dd className="font-semibold text-navy-800">{value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>
      );
    }

    default:
      return null;
  }
}
