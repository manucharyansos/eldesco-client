import Link from 'next/link';
import type { CmsPage, CmsSection, SectionItem, TranslatedText } from '@/types/cms';
import { tx } from '@/types/cms';

function hrefWithLocale(href: string | null | undefined, locale: string): string | undefined {
  if (!href) return undefined;
  if (/^(https?:|mailto:|tel:|#)/.test(href)) return href;
  const clean = href.startsWith('/') ? href : `/${href}`;
  if (clean === '/') return `/${locale}`;
  if (/^\/(hy|en|ru)(\/|$)/.test(clean)) return clean;
  return `/${locale}${clean}`;
}

function imageAlt(item: { media?: { alt?: TranslatedText | null } | null; title?: TranslatedText | null }, locale: string) {
  return tx(item.media?.alt, locale) || tx(item.title, locale) || 'ELDESCO';
}

function RichBody({ value, locale }: { value?: TranslatedText | null; locale: string }) {
  const body = tx(value, locale);
  if (!body) return null;
  return <p className="cms-body">{body}</p>;
}

function Hero({ section, locale }: { section: CmsSection; locale: string }) {
  return (
    <section className={`cms-hero ${section.media?.url ? 'cms-hero--image' : ''}`} style={section.media?.url ? { backgroundImage: `linear-gradient(90deg, rgba(5,25,43,.94), rgba(5,25,43,.58)), url(${section.media.url})` } : undefined}>
      <div className="cms-hero__grid" aria-hidden="true" />
      <div className="shell cms-hero__content">
        <span className="eyebrow">ELDESCO / {section.key.toUpperCase()}</span>
        <h1>{tx(section.title, locale)}</h1>
        {tx(section.subtitle, locale) && <p className="cms-hero__subtitle">{tx(section.subtitle, locale)}</p>}
        <RichBody value={section.body} locale={locale} />
      </div>
    </section>
  );
}

function Cards({ section, locale }: { section: CmsSection; locale: string }) {
  return (
    <section className="cms-section">
      <div className="shell">
        <SectionHeading section={section} locale={locale} />
        <div className="cms-cards">
          {(section.items || []).map((item, index) => {
            const href = hrefWithLocale(item.link_url, locale);
            const content = (
              <>
                <div className="cms-card__number">{String(index + 1).padStart(2, '0')}</div>
                {item.media?.url && <img src={item.media.url} alt={imageAlt(item, locale)} className="cms-card__image" />}
                <div className="cms-card__body">
                  <h3>{tx(item.title, locale)}</h3>
                  {tx(item.subtitle, locale) && <p>{tx(item.subtitle, locale)}</p>}
                  {tx(item.body, locale) && <p>{tx(item.body, locale)}</p>}
                  {href && <span className="cms-card__arrow">↗</span>}
                </div>
              </>
            );
            return href ? <Link href={href} key={item.id || item.key || index} className="cms-card">{content}</Link> : <article key={item.id || item.key || index} className="cms-card">{content}</article>;
          })}
        </div>
      </div>
    </section>
  );
}

function ListSection({ section, locale }: { section: CmsSection; locale: string }) {
  return (
    <section className="cms-section cms-section--muted">
      <div className="shell">
        <SectionHeading section={section} locale={locale} />
        <div className="cms-list">
          {(section.items || []).map((item, index) => (
            <div className="cms-list__item" key={item.id || item.key || index}>
              <span>{String(index + 1).padStart(2, '0')}</span>
              <div>
                <h3>{tx(item.title, locale)}</h3>
                {tx(item.body, locale) && <p>{tx(item.body, locale)}</p>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Gallery({ section, locale }: { section: CmsSection; locale: string }) {
  const items = (section.items || []).filter((item) => item.media?.url);
  return (
    <section className="cms-section">
      <div className="shell">
        <SectionHeading section={section} locale={locale} />
        {items.length ? (
          <div className="cms-gallery">
            {items.map((item, index) => (
              <figure className="cms-gallery__item" key={item.id || index}>
                <img src={item.media!.url} alt={imageAlt(item, locale)} />
                {(tx(item.title, locale) || tx(item.body, locale)) && <figcaption><strong>{tx(item.title, locale)}</strong>{tx(item.body, locale) && <span>{tx(item.body, locale)}</span>}</figcaption>}
              </figure>
            ))}
          </div>
        ) : (
          <div className="cms-gallery__empty"><span>+</span><p>{locale === 'hy' ? 'Նկարները կարող եք ավելացնել ադմին բաժնից' : locale === 'ru' ? 'Изображения можно добавить из админ-панели' : 'Images can be added from the admin panel'}</p></div>
        )}
      </div>
    </section>
  );
}

function Logos({ section, locale }: { section: CmsSection; locale: string }) {
  return (
    <section className="cms-section cms-section--muted">
      <div className="shell">
        <SectionHeading section={section} locale={locale} />
        <div className="logo-wall">
          {(section.items || []).map((item, index) => (
            <div className="logo-wall__item" key={item.id || item.key || index}>
              {item.media?.url ? <img src={item.media.url} alt={imageAlt(item, locale)} /> : <span>{tx(item.title, locale)}</span>}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Contact({ section, locale }: { section: CmsSection; locale: string }) {
  return (
    <section className="cms-section">
      <div className="shell contact-panel">
        <div><SectionHeading section={section} locale={locale} /></div>
        <div className="contact-panel__body"><RichBody value={section.body} locale={locale} /></div>
      </div>
    </section>
  );
}

function Cta({ section, locale }: { section: CmsSection; locale: string }) {
  const rawButton = section.settings?.button;
  const label = typeof rawButton === 'string' ? rawButton : tx(rawButton as TranslatedText, locale);
  const href = hrefWithLocale(String(section.settings?.href || '/contact'), locale) || `/${locale}/contact`;
  return (
    <section className="cms-cta">
      <div className="shell cms-cta__inner">
        <div><span className="eyebrow">ELDESCO</span><h2>{tx(section.title, locale)}</h2><RichBody value={section.body} locale={locale} /></div>
        <Link href={href} className="button button--light">{label || (locale === 'hy' ? 'Կապ մեզ հետ' : 'Contact us')} <span>↗</span></Link>
      </div>
    </section>
  );
}

function Stats({ section, locale }: { section: CmsSection; locale: string }) {
  return (
    <section className="cms-section">
      <div className="shell">
        <SectionHeading section={section} locale={locale} />
        <div className="cms-stats">{(section.items || []).map((item, i) => <div key={item.id || i}><strong>{tx(item.title, locale)}</strong><span>{tx(item.subtitle, locale) || tx(item.body, locale)}</span></div>)}</div>
      </div>
    </section>
  );
}

function SectionHeading({ section, locale }: { section: CmsSection; locale: string }) {
  return (
    <div className="section-heading">
      <div className="section-heading__line" />
      <div>
        {tx(section.subtitle, locale) && <span className="eyebrow eyebrow--dark">{tx(section.subtitle, locale)}</span>}
        <h2>{tx(section.title, locale)}</h2>
        <RichBody value={section.body} locale={locale} />
      </div>
    </div>
  );
}

export function PageRenderer({ page, locale }: { page: CmsPage; locale: string }) {
  return (
    <div className="cms-page">
      {(page.sections || []).map((section, index) => {
        if (section.is_enabled === false) return null;
        const key = section.id || `${section.key}-${index}`;
        switch (section.type) {
          case 'hero': return <Hero key={key} section={section} locale={locale} />;
          case 'cards': return <Cards key={key} section={section} locale={locale} />;
          case 'list': return <ListSection key={key} section={section} locale={locale} />;
          case 'gallery': return <Gallery key={key} section={section} locale={locale} />;
          case 'logos': return <Logos key={key} section={section} locale={locale} />;
          case 'contact': return <Contact key={key} section={section} locale={locale} />;
          case 'cta': return <Cta key={key} section={section} locale={locale} />;
          case 'stats': return <Stats key={key} section={section} locale={locale} />;
          default: return <section key={key} className="cms-section"><div className="shell"><SectionHeading section={section} locale={locale} /></div></section>;
        }
      })}
    </div>
  );
}
