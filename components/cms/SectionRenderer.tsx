import Link from 'next/link';
import Image from 'next/image';
import type { CmsSection } from '@/types/cms';
import { localize } from '@/lib/cms';

const API_BASE = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api').replace(/\/api\/?$/, '');

function mediaUrl(url?: string | null) {
  if (!url) return '';
  if (/^https?:\/\//.test(url)) return url;
  return `${API_BASE}${url}`;
}

function SectionImage({ url, alt }: { url?: string | null; alt: string }) {
  if (!url) return <div className="cms-image-placeholder" aria-hidden="true" />;
  return (
    <div className="cms-image-wrap">
      <Image src={mediaUrl(url)} alt={alt} fill sizes="(max-width: 900px) 100vw, 50vw" className="object-cover" />
    </div>
  );
}

export function SectionRenderer({ section, locale }: { section: CmsSection; locale: string }) {
  const c = localize(section.content || {}, locale) as Record<string, any>;
  const settings = section.settings || {};

  switch (section.type) {
    case 'hero':
      return (
        <section className="cms-hero">
          <div className="cms-hero-grid shell">
            <div className="cms-hero-copy">
              {c.eyebrow && <div className="eyebrow">{c.eyebrow}</div>}
              <h1>{c.title}</h1>
              {c.text && <p className="lead">{c.text}</p>}
              <div className="hero-actions">
                {c.primary_cta && <Link href={`/${locale}/power-infrastructure`} className="btn-primary">{c.primary_cta}</Link>}
                {c.secondary_cta && <Link href={`/${locale}/contact`} className="btn-ghost">{c.secondary_cta}</Link>}
              </div>
            </div>
            <div className="cms-hero-art">
              <div className="hero-orbit hero-orbit-one" />
              <div className="hero-orbit hero-orbit-two" />
              <div className="hero-panel">
                <span>11kV</span>
                <strong>ELDESCO</strong>
                <small>ENGINEERING SYSTEMS</small>
              </div>
            </div>
          </div>
        </section>
      );

    case 'page-hero':
      return (
        <section className="page-hero">
          <div className="shell">
            <div className="eyebrow">ELDESCO</div>
            <h1>{c.title}</h1>
            {c.text && <p>{c.text}</p>}
          </div>
        </section>
      );

    case 'split':
    case 'feature':
      return (
        <section className="section-block">
          <div className="shell split-grid">
            <div>
              <div className="section-kicker">{settings.kicker || 'ELDESCO'}</div>
              <h2>{c.title}</h2>
              {c.text && <p className="section-copy">{c.text}</p>}
            </div>
            <SectionImage url={section.image_url} alt={c.title || 'ELDESCO'} />
          </div>
        </section>
      );

    case 'richtext':
      return (
        <section className="section-block">
          <div className="shell narrow-copy">
            <div className="section-kicker">ELDESCO</div>
            <h2>{c.title}</h2>
            {c.text && <p className="section-copy">{c.text}</p>}
          </div>
        </section>
      );

    case 'cards':
      return (
        <section className="section-block section-muted">
          <div className="shell">
            <div className="section-head">
              <div className="section-kicker">CAPABILITIES</div>
              <h2>{c.title}</h2>
            </div>
            <div className="capability-grid">
              {(c.items || []).map((item: any, index: number) => (
                <Link key={`${item.slug || index}`} href={`/${locale}/${item.slug || ''}`} className="capability-card">
                  <span className="capability-index">0{index + 1}</span>
                  <h3>{item.title}</h3>
                  <span className="card-arrow">↗</span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      );

    case 'feature-list':
      return (
        <section className="section-block">
          <div className="shell">
            {c.title && <h2>{c.title}</h2>}
            <div className="feature-list">
              {(c.items || []).map((item: any, index: number) => (
                <article className="feature-row" key={index}>
                  <span>{String(index + 1).padStart(2, '0')}</span>
                  <h3>{item.title}</h3>
                </article>
              ))}
            </div>
          </div>
        </section>
      );

    case 'stat':
      return (
        <section className="stat-band">
          <div className="shell stat-inner">
            <strong>{c.value}</strong>
            <span>{c.label}</span>
          </div>
        </section>
      );

    case 'gallery':
      return (
        <section className="section-block section-dark">
          <div className="shell">
            <div className="section-head light"><div className="section-kicker">PROJECTS</div><h2>{c.title}</h2></div>
            <div className="gallery-grid">
              {(section.gallery || []).length > 0 ? (section.gallery || []).map((item: any, index: number) => {
                const url = typeof item === 'string' ? item : item.url;
                return <SectionImage key={index} url={url} alt={c.title || 'Project'} />;
              }) : Array.from({ length: 6 }).map((_, index) => <div key={index} className="gallery-placeholder" />)}
            </div>
          </div>
        </section>
      );

    case 'logos':
      return (
        <section className="section-block">
          <div className="shell">
            <div className="section-head"><div className="section-kicker">TRUST</div><h2>{c.title}</h2>{c.text && <p>{c.text}</p>}</div>
            <div className="logo-wall">
              {(c.items || ['APACHE', 'DALMA', 'SOLAR CITY', 'VIVA-MTS', 'VEON', 'TEAM', 'ARMENIA WINE', 'SYNERGY']).map((item: any, index: number) => (
                <div className="logo-chip" key={index}>{typeof item === 'string' ? item : item.name}</div>
              ))}
            </div>
          </div>
        </section>
      );

    case 'contact':
      return (
        <section className="section-block contact-band">
          <div className="shell contact-grid">
            <div><div className="section-kicker">CONTACT</div><h2>{c.title}</h2></div>
            <div className="contact-cta"><a href="tel:+37499694569">+374 99 694 569</a><a href="mailto:eldesco@eldesco.am">eldesco@eldesco.am</a></div>
          </div>
        </section>
      );

    default:
      return null;
  }
}
