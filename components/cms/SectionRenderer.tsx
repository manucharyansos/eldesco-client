import Link from 'next/link';
import type { CmsSection } from '@/lib/api';
import { serviceCatalog } from '@/lib/serviceCatalog';
import { CustomersMarquee } from '@/components/sections/CustomersMarquee';

const text = (value: unknown) => (typeof value === 'string' ? value : '');
const list = (value: unknown) => (Array.isArray(value) ? value : []);
const ui = (locale: string, hy: string, en: string, ru: string) => locale === 'hy' ? hy : locale === 'ru' ? ru : en;

function localizedHref(url: string, locale: string) {
  if (!url) return `/${locale}/services`;
  if (/^(https?:|mailto:|tel:|#)/.test(url)) return url;
  if (url.startsWith(`/${locale}/`)) return url;
  return url.startsWith('/') ? `/${locale}${url}` : `/${locale}/${url}`;
}

function serviceHref(index: number, locale: string) {
  const item = serviceCatalog[index + 1];
  return item ? `/${locale}/services/${item.slug}` : `/${locale}/services`;
}

function servicesHeading(locale: string, original: string) {
  const seeded = ['Հինգ հիմնական ուղղություն', 'Five core directions', 'Пять основных направлений'];
  if (!original || seeded.includes(original)) {
    return ui(locale, 'Հիմնական ուղղություններ', 'Core directions', 'Основные направления');
  }
  return original;
}

export function SectionRenderer({ section, locale }: { section: CmsSection; locale: string }) {
  const c = section.content ?? {};
  if (!section.is_enabled) return null;

  if (section.type === 'hero') {
    return (
      <section className="relative isolate overflow-hidden bg-slate-950 py-28 text-white md:py-36">
        <div className="absolute inset-0 -z-30 bg-[url('/images/projects/substation.png')] bg-cover bg-center opacity-35" />
        <div className="absolute inset-0 -z-20 bg-gradient-to-r from-slate-950 via-slate-950/90 to-slate-950/55" />
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_75%_25%,rgba(249,115,22,0.2),transparent_34%)]" />
        <div className="absolute inset-0 premium-grid opacity-20" />
        <div className="container relative z-10 animate-rise">
          <p className="premium-eyebrow">{text(c.eyebrow)}</p>
          <h1 className="mt-5 max-w-5xl text-5xl font-bold leading-[1.04] tracking-[-.04em] md:text-7xl">{text(c.title)}</h1>
          <p className="mt-7 max-w-3xl text-xl leading-8 text-slate-300">{text(c.subtitle)}</p>
          {text(c.cta_label) && (
            <Link className="premium-button mt-9" href={localizedHref(text(c.cta_url), locale)}>
              {text(c.cta_label)} <span aria-hidden>→</span>
            </Link>
          )}
        </div>
      </section>
    );
  }

  if (section.type === 'intro' || section.type === 'rich_text') {
    return (
      <section className="py-20 md:py-28">
        <div className="container grid gap-10 lg:grid-cols-[.72fr_1.28fr] lg:gap-20">
          <div>
            <p className="premium-eyebrow text-orange-600">ELDESCO</p>
            <h2 className="mt-4 text-4xl font-bold leading-tight text-slate-950 md:text-5xl">{text(c.title)}</h2>
          </div>
          <div className="premium-panel space-y-6 p-7 text-lg leading-8 text-slate-600 md:p-10">
            {list(c.paragraphs).length > 0
              ? list(c.paragraphs).map((paragraph, index) => <p key={index}>{text(paragraph)}</p>)
              : text(c.description) && <p>{text(c.description)}</p>}
          </div>
        </div>
      </section>
    );
  }

  if (section.type === 'feature_split') {
    const image = text(c.image) || '/images/projects/metalworks.png';
    return (
      <section className="overflow-hidden bg-slate-950 py-20 text-white md:py-28">
        <div className="container grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-slate-900 shadow-2xl">
            <img src={image} alt="" className="h-[360px] w-full object-cover transition duration-700 hover:scale-[1.03] md:h-[460px]" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/35 to-transparent" />
          </div>
          <div>
            <p className="premium-eyebrow">{text(c.eyebrow) || 'ELDESCO'}</p>
            <h2 className="mt-5 text-4xl font-bold leading-tight md:text-5xl">{text(c.title)}</h2>
            <div className="mt-7 space-y-5 text-lg leading-8 text-slate-300">
              {list(c.paragraphs).map((paragraph, index) => <p key={index}>{text(paragraph)}</p>)}
              {!list(c.paragraphs).length && text(c.description) && <p>{text(c.description)}</p>}
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (section.type === 'timeline') {
    return (
      <section className="bg-slate-50 py-20 md:py-28">
        <div className="container">
          <p className="premium-eyebrow text-orange-600">{text(c.eyebrow) || ui(locale, 'ՄԵՐ ՊԱՏՄՈՒԹՅՈՒՆԸ', 'OUR STORY', 'НАША ИСТОРИЯ')}</p>
          <h2 className="mt-4 max-w-4xl text-4xl font-bold text-slate-950 md:text-5xl">{text(c.title)}</h2>
          <div className="mt-12 grid gap-5 lg:grid-cols-3">
            {list(c.items).map((item, index) => {
              const value = item as Record<string, unknown>;
              return (
                <article key={index} className="group relative overflow-hidden rounded-[26px] border border-slate-200 bg-white p-7 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl">
                  <div className="absolute right-0 top-0 h-24 w-24 rounded-full bg-orange-500/10 blur-2xl" />
                  <div className="relative text-4xl font-black tracking-tight text-orange-600">{text(value.year)}</div>
                  <h3 className="relative mt-5 text-xl font-bold text-slate-950">{text(value.title)}</h3>
                  <p className="relative mt-3 leading-7 text-slate-600">{text(value.description)}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>
    );
  }

  if (section.type === 'services') {
    return (
      <section className="bg-slate-50 py-20 md:py-28">
        <div className="container">
          <p className="premium-eyebrow text-orange-600">{text(c.eyebrow) || 'ELDESCO'}</p>
          <h2 className="mt-3 max-w-3xl text-4xl font-bold text-slate-950 md:text-5xl">{servicesHeading(locale, text(c.title))}</h2>
          <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {list(c.items).map((item, index) => {
              const value = item as Record<string, unknown>;
              const catalog = serviceCatalog[index + 1];
              return (
                <Link href={serviceHref(index, locale)} key={index} className="group premium-card overflow-hidden">
                  {catalog?.image ? (
                    <div className="h-48 overflow-hidden bg-slate-200">
                      <img src={catalog.image} alt="" className="h-full w-full object-cover transition duration-700 group-hover:scale-105" />
                    </div>
                  ) : (
                    <div className="relative h-40 overflow-hidden bg-slate-950">
                      <div className="absolute inset-0 premium-grid opacity-30" />
                      <div className="absolute -right-10 -top-12 h-40 w-40 rounded-full bg-orange-500/20 blur-3xl" />
                    </div>
                  )}
                  <div className="p-7">
                    <span className="text-xs font-bold tracking-[.22em] text-orange-600">0{index + 1}</span>
                    <h3 className="mt-5 text-xl font-bold text-slate-950 transition group-hover:text-orange-600">{text(value.title)}</h3>
                    <p className="mt-3 leading-7 text-slate-600">{text(value.description)}</p>
                    <div className="mt-6 text-sm font-semibold text-slate-950">{ui(locale, 'Մանրամասն', 'Explore service', 'Подробнее')} <span className="inline-block transition group-hover:translate-x-1">→</span></div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>
    );
  }

  if (section.type === 'bullets') {
    return (
      <section className="py-20 md:py-28">
        <div className="container">
          <p className="premium-eyebrow text-orange-600">{ui(locale, 'ELDESCO ՓՈՐՁԱՌՈՒԹՅՈՒՆ', 'ELDESCO EXPERTISE', 'ЭКСПЕРТИЗА ELDESCO')}</p>
          <h2 className="mt-4 max-w-4xl text-4xl font-bold text-slate-950 md:text-5xl">{text(c.title)}</h2>
          <div className="mt-12 grid gap-5 md:grid-cols-2">
            {list(c.items).map((item, index) => (
              <div key={index} className="premium-panel group flex gap-5 p-6 md:p-8">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-orange-100 font-bold text-orange-600 transition group-hover:bg-orange-600 group-hover:text-white">{String(index + 1).padStart(2, '0')}</div>
                <p className="pt-2 text-lg font-medium leading-7 text-slate-800">{text(item)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (section.type === 'stats') {
    return (
      <section className="bg-orange-600 py-14 text-white">
        <div className="container grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {list(c.items).map((item, index) => {
            const value = item as Record<string, unknown>;
            return (
              <div key={index} className="border-l border-white/25 pl-5">
                <div className="text-4xl font-bold md:text-5xl">{text(value.value)}</div>
                <div className="mt-2 text-orange-100">{text(value.label)}</div>
              </div>
            );
          })}
        </div>
      </section>
    );
  }

  if (section.type === 'customers') {
    return <CustomersMarquee title={text(c.title)} locale={locale} />;
  }

  if (section.type === 'company_details') {
    const accounts = list(c.accounts);
    const details = [
      [ui(locale, 'Կազմակերպություն', 'Company', 'Организация'), text(c.company)],
      [ui(locale, 'Բանկ', 'Bank', 'Банк'), text(c.bank)],
      [ui(locale, 'Հասցե', 'Address', 'Адрес'), text(c.business_address)],
      [ui(locale, 'ՀՎՀՀ', 'Tax ID', 'ИНН'), text(c.tax_id)],
      [ui(locale, 'Պետ. գրանցում', 'Registration', 'Регистрация'), text(c.registration)],
      [ui(locale, 'Տնօրեն', 'Director', 'Директор'), text(c.director)],
      [ui(locale, 'Գլխավոր հաշվապահ', 'Chief accountant', 'Главный бухгалтер'), text(c.chief_accountant)],
    ].filter(([, value]) => value);

    return (
      <section className="py-20 md:py-28">
        <div className="container grid gap-8 lg:grid-cols-[1.05fr_.95fr]">
          <div className="premium-panel p-8 md:p-10">
            <p className="premium-eyebrow text-orange-600">{ui(locale, 'ԿԱՊ', 'CONTACT', 'КОНТАКТЫ')}</p>
            <h2 className="mt-4 text-4xl font-bold text-slate-950">{text(c.company) || 'ELDESCO LLC'}</h2>
            <div className="mt-8 space-y-4 text-lg">
              <a href={`tel:${text(c.phone)}`} className="block font-semibold text-slate-900 hover:text-orange-600">{text(c.phone)}</a>
              <a href={`mailto:${text(c.email)}`} className="block text-slate-600 hover:text-orange-600">{text(c.email)}</a>
              <p className="leading-7 text-slate-600">{text(c.business_address)}</p>
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              <a className="premium-button" href={`tel:${text(c.phone)}`}>{ui(locale, 'Զանգահարել', 'Call us', 'Позвонить')}</a>
              <a className="premium-button-secondary" href={`mailto:${text(c.email)}`}>{ui(locale, 'Գրել մեզ', 'Email us', 'Написать')}</a>
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {details.map(([label, value]) => <div key={label} className="premium-panel p-5"><div className="text-xs font-bold uppercase tracking-[.18em] text-slate-400">{label}</div><div className="mt-2 font-medium leading-6 text-slate-800">{value}</div></div>)}
            {accounts.length > 0 && <div className="premium-panel p-5 sm:col-span-2"><div className="text-xs font-bold uppercase tracking-[.18em] text-slate-400">{ui(locale, 'Բանկային հաշիվներ', 'Bank accounts', 'Банковские счета')}</div><div className="mt-3 grid gap-2 text-sm text-slate-700 md:grid-cols-3">{accounts.map((account, index) => <div key={index}>{text(account)}</div>)}</div></div>}
          </div>
        </div>
      </section>
    );
  }

  if (section.type === 'cta') {
    return (
      <section className="py-20 md:py-28">
        <div className="container">
          <div className="relative overflow-hidden rounded-[2rem] bg-slate-950 p-9 text-white shadow-2xl md:p-16">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_85%_20%,rgba(249,115,22,.27),transparent_34%)]" />
            <div className="relative max-w-3xl">
              <p className="premium-eyebrow">ELDESCO</p>
              <h2 className="mt-4 text-4xl font-bold md:text-5xl">{text(c.title)}</h2>
              <p className="mt-5 text-lg leading-8 text-slate-300">{text(c.description)}</p>
              <Link className="premium-button mt-8" href={localizedHref(text(c.cta_url) || '/contact', locale)}>{text(c.cta_label) || ui(locale, 'Կապ մեզ հետ', 'Contact us', 'Связаться с нами')} <span>→</span></Link>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (section.type === 'contact') {
    return (
      <section className="py-20 md:py-28">
        <div className="container">
          <div className="relative overflow-hidden rounded-[2rem] bg-slate-950 p-9 text-white shadow-2xl md:p-16">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_85%_25%,rgba(249,115,22,.24),transparent_34%)]" />
            <div className="relative">
              <p className="premium-eyebrow">ELDESCO</p>
              <h2 className="mt-4 text-4xl font-bold md:text-5xl">{text(c.title)}</h2>
              <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-300">{text(c.description)}</p>
              <div className="mt-8 flex flex-col gap-4 text-lg md:flex-row md:flex-wrap md:gap-8">
                <a className="hover:text-orange-400" href={`tel:${text(c.phone)}`}>{text(c.phone)}</a>
                <a className="hover:text-orange-400" href={`mailto:${text(c.email)}`}>{text(c.email)}</a>
                <span>{text(c.address)}</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return null;
}
