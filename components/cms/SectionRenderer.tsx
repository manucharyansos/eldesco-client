import Link from 'next/link';
import type { CmsSection } from '@/lib/api';
import { serviceCatalog } from '@/lib/serviceCatalog';

const text = (value: unknown) => (typeof value === 'string' ? value : '');
const list = (value: unknown) => (Array.isArray(value) ? value : []);

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

export function SectionRenderer({ section, locale }: { section: CmsSection; locale: string }) {
  const c = section.content ?? {};
  if (!section.is_enabled) return null;

  if (section.type === 'hero') {
    return (
      <section className="relative overflow-hidden bg-slate-950 py-28 text-white md:py-36">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_25%,rgba(249,115,22,0.2),transparent_34%)]" />
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

  if (section.type === 'services') {
    return (
      <section className="bg-slate-50 py-20 md:py-28">
        <div className="container">
          <p className="premium-eyebrow text-orange-600">{text(c.eyebrow) || 'ELDESCO'}</p>
          <h2 className="mt-3 max-w-3xl text-4xl font-bold text-slate-950 md:text-5xl">{text(c.title)}</h2>
          <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {list(c.items).map((item, index) => {
              const value = item as Record<string, unknown>;
              const catalog = serviceCatalog[index + 1];
              return (
                <Link
                  href={serviceHref(index, locale)}
                  key={index}
                  className="group premium-card overflow-hidden"
                >
                  {catalog?.image && (
                    <div className="h-48 overflow-hidden bg-slate-200">
                      <img
                        src={catalog.image}
                        alt=""
                        className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                      />
                    </div>
                  )}
                  <div className="p-7">
                    <span className="text-xs font-bold tracking-[.22em] text-orange-600">0{index + 1}</span>
                    <h3 className="mt-5 text-xl font-bold text-slate-950 transition group-hover:text-orange-600">{text(value.title)}</h3>
                    <p className="mt-3 leading-7 text-slate-600">{text(value.description)}</p>
                    <div className="mt-6 text-sm font-semibold text-slate-950">{locale === 'hy' ? 'Մանրամասն' : locale === 'ru' ? 'Подробнее' : 'Explore service'} <span className="inline-block transition group-hover:translate-x-1">→</span></div>
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
          <p className="premium-eyebrow text-orange-600">ELDESCO EXPERTISE</p>
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
    return (
      <section className="bg-slate-50 py-20 md:py-28">
        <div className="container">
          <p className="premium-eyebrow text-orange-600">TRUST</p>
          <h2 className="mt-4 text-4xl font-bold text-slate-950 md:text-5xl">{text(c.title)}</h2>
          <div className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {list(c.items).map((item, index) => {
              const value = item as Record<string, unknown>;
              return (
                <div key={index} className="premium-panel flex min-h-24 items-center justify-center px-4 py-5 text-center text-sm font-semibold text-slate-700 transition hover:-translate-y-1 hover:border-orange-200">
                  {text(value.name)}
                </div>
              );
            })}
          </div>
        </div>
      </section>
    );
  }

  if (section.type === 'company_details') {
    const accounts = list(c.accounts);
    const details = [
      ['Company', text(c.company)],
      ['Bank', text(c.bank)],
      ['Address', text(c.business_address)],
      ['Tax ID', text(c.tax_id)],
      ['Registration', text(c.registration)],
      ['Director', text(c.director)],
      ['Chief accountant', text(c.chief_accountant)],
    ].filter(([, value]) => value);

    return (
      <section className="py-20 md:py-28">
        <div className="container grid gap-8 lg:grid-cols-[1.05fr_.95fr]">
          <div className="premium-panel p-8 md:p-10">
            <p className="premium-eyebrow text-orange-600">CONTACT</p>
            <h2 className="mt-4 text-4xl font-bold text-slate-950">{text(c.company) || 'ELDESCO LLC'}</h2>
            <div className="mt-8 space-y-4 text-lg">
              <a href={`tel:${text(c.phone)}`} className="block font-semibold text-slate-900 hover:text-orange-600">{text(c.phone)}</a>
              <a href={`mailto:${text(c.email)}`} className="block text-slate-600 hover:text-orange-600">{text(c.email)}</a>
              <p className="leading-7 text-slate-600">{text(c.business_address)}</p>
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              <a className="premium-button" href={`tel:${text(c.phone)}`}>{locale === 'hy' ? 'Զանգահարել' : locale === 'ru' ? 'Позвонить' : 'Call us'}</a>
              <a className="premium-button-secondary" href={`mailto:${text(c.email)}`}>{locale === 'hy' ? 'Գրել մեզ' : locale === 'ru' ? 'Написать' : 'Email us'}</a>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {details.map(([label, value]) => (
              <div key={label} className="premium-panel p-5">
                <div className="text-xs font-bold uppercase tracking-[.18em] text-slate-400">{label}</div>
                <div className="mt-2 font-medium leading-6 text-slate-800">{value}</div>
              </div>
            ))}
            {accounts.length > 0 && (
              <div className="premium-panel p-5 sm:col-span-2">
                <div className="text-xs font-bold uppercase tracking-[.18em] text-slate-400">Bank accounts</div>
                <div className="mt-3 grid gap-2 text-sm text-slate-700 md:grid-cols-3">
                  {accounts.map((account, index) => <div key={index}>{text(account)}</div>)}
                </div>
              </div>
            )}
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
