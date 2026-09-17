'use client';

import Link from 'next/link';

interface FooterProps {
  locale: string;
}

const copy = (locale: string) => ({
  about: locale === 'hy' ? 'Մեր մասին' : locale === 'ru' ? 'О нас' : 'About',
  services: locale === 'hy' ? 'Ծառայություններ' : locale === 'ru' ? 'Услуги' : 'Services',
  projects: locale === 'hy' ? 'Նախագծեր' : locale === 'ru' ? 'Проекты' : 'Projects',
  customers: locale === 'hy' ? 'Պատվիրատուներ' : locale === 'ru' ? 'Заказчики' : 'Customers',
  gallery: locale === 'hy' ? 'Պատկերասրահ' : locale === 'ru' ? 'Галерея' : 'Gallery',
  contact: locale === 'hy' ? 'Կապ մեզ հետ' : locale === 'ru' ? 'Контакты' : 'Contact',
  tagline: locale === 'hy'
    ? 'Էներգետիկ ենթակառուցվածքների և ինժեներական համակարգերի նախագծում և պատրաստում։'
    : locale === 'ru'
      ? 'Проектирование и производство энергетической инфраструктуры и инженерных систем.'
      : 'Design and production of energy infrastructure and engineering systems.',
  address: locale === 'hy'
    ? 'ՀՀ, ք․ Երևան, Թբիլիսյան 35/9'
    : locale === 'ru'
      ? 'Армения, Ереван, Тбилисское шоссе 35/9'
      : '35/9 Tbilisyan Hwy, Yerevan, Armenia',
});

export function Footer({ locale }: FooterProps) {
  const t = copy(locale);
  const year = new Date().getFullYear();

  const links = [
    ['about', t.about],
    ['services', t.services],
    ['projects', t.projects],
    ['customers', t.customers],
    ['gallery', t.gallery],
    ['contact', t.contact],
  ];

  return (
    <footer className="mt-auto overflow-hidden bg-slate-950 text-white">
      <div className="border-b border-white/10">
        <div className="container grid gap-12 py-16 lg:grid-cols-[1.2fr_.8fr_.8fr] lg:py-20">
          <div>
            <img
              src="/images/brand/eldesco-logo.png"
              alt="ELDESCO"
              className="h-20 w-auto rounded-lg bg-white object-contain px-2"
            />
            <p className="mt-6 max-w-md text-base leading-7 text-slate-400">{t.tagline}</p>
            <div className="mt-8 h-px w-20 bg-orange-500" />
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-[.22em] text-orange-400">Navigation</p>
            <ul className="mt-6 space-y-3">
              {links.map(([href, text]) => (
                <li key={href}>
                  <Link href={`/${locale}/${href}`} className="text-slate-300 transition hover:text-white">
                    {text}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-[.22em] text-orange-400">ELDESCO LLC</p>
            <div className="mt-6 space-y-4 text-sm leading-6 text-slate-300">
              <a className="block transition hover:text-white" href="tel:+37499694569">+374 99 694 569</a>
              <a className="block transition hover:text-white" href="mailto:eldesco@eldesco.am">eldesco@eldesco.am</a>
              <p>{t.address}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container flex flex-col gap-3 py-6 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
        <p>© {year} ELDESCO LLC.</p>
        <p>Engineering • Energy • Industrial Infrastructure</p>
      </div>
    </footer>
  );
}
