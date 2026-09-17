'use client';

const customers = [
  { name: 'APACHE', logo: '/images/customers/apache.svg' },
  { name: 'Dalma Garden Mall', logo: '/images/customers/dalma-garden-mall.svg' },
  { name: 'Solar City', logo: '/images/customers/solar-city.svg' },
  { name: 'Teghout Mining', logo: '/images/customers/teghout-mining.svg' },
  { name: 'VivaCell-MTS', logo: '/images/customers/vivacell-mts.svg' },
  { name: 'Team Telecom Armenia', logo: '/images/customers/team-telecom-armenia.svg' },
  { name: 'Armenia Wine', logo: '/images/customers/armenia-wine.svg' },
  { name: 'Synopsys', logo: '/images/customers/synopsys.svg' },
] as const;

function LogoCard({ customer }: { customer: (typeof customers)[number] }) {
  return (
    <article className="customer-logo-card group" aria-label={customer.name}>
      <div className="flex h-24 w-full items-center justify-center overflow-hidden rounded-xl bg-white px-4">
        <img src={customer.logo} alt={customer.name} className="max-h-20 w-auto max-w-[190px] object-contain transition duration-500 group-hover:scale-105" loading="lazy" />
      </div>
      <p className="mt-4 text-center text-sm font-semibold text-slate-700 transition group-hover:text-slate-950">{customer.name}</p>
    </article>
  );
}

export function CustomersMarquee({ title, locale }: { title: string; locale: string }) {
  const loop = [...customers, ...customers];
  const eyebrow = locale === 'hy' ? 'ՄԵԶ ՎՍՏԱՀՈՒՄ ԵՆ' : locale === 'ru' ? 'НАМ ДОВЕРЯЮТ' : 'TRUSTED BY';
  const subtitle = locale === 'hy'
    ? 'ELDESCO-ն տարիների ընթացքում համագործակցել է հարյուրավոր փոքր, միջին և խոշոր կազմակերպությունների հետ։'
    : locale === 'ru'
      ? 'ELDESCO на протяжении многих лет сотрудничает с сотнями малых, средних и крупных организаций.'
      : 'ELDESCO has partnered with hundreds of small, medium and large organizations over the years.';

  return (
    <section className="overflow-hidden bg-white py-20 md:py-28">
      <div className="container">
        <p className="premium-eyebrow text-orange-600">{eyebrow}</p>
        <div className="mt-4 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <h2 className="max-w-3xl text-4xl font-bold text-slate-950 md:text-5xl">{title}</h2>
          <p className="max-w-xl text-sm leading-6 text-slate-500 md:text-base">{subtitle}</p>
        </div>
      </div>

      <div className="customer-marquee-shell mt-12">
        <div className="customer-marquee-track">
          {loop.map((customer, index) => <LogoCard key={`${customer.name}-${index}`} customer={customer} />)}
        </div>
      </div>
    </section>
  );
}
