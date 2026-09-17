'use client';

const customers = [
  { name: 'APACHE', x: 430, y: 30, w: 260, h: 125 },
  { name: 'Dalma Garden Mall', x: 755, y: 5, w: 215, h: 180 },
  { name: 'Solar City', x: 990, y: 35, w: 310, h: 130 },
  { name: 'Teghout Mining', x: 1350, y: 20, w: 235, h: 155 },
  { name: 'VivaCell-MTS', x: 150, y: 190, w: 350, h: 95 },
  { name: 'VEON', x: 705, y: 180, w: 225, h: 255 },
  { name: 'EcoVille', x: 915, y: 220, w: 205, h: 215 },
  { name: "Gold's Gym", x: 1125, y: 220, w: 235, h: 230 },
  { name: 'TERYAN Residential Building', x: 1370, y: 220, w: 265, h: 205 },
  { name: 'Armada', x: 1630, y: 225, w: 260, h: 215 },
  { name: 'Team Telecom Armenia', x: 355, y: 455, w: 235, h: 120 },
  { name: 'Armenia Wine', x: 675, y: 470, w: 235, h: 120 },
  { name: 'ART Group', x: 920, y: 455, w: 220, h: 130 },
  { name: 'Aqua Systems', x: 1180, y: 455, w: 330, h: 125 },
  { name: 'Vallex Group', x: 1570, y: 450, w: 335, h: 250 },
  { name: 'IU Networks', x: 0, y: 620, w: 335, h: 100 },
  { name: 'Astra Crystals', x: 935, y: 610, w: 200, h: 140 },
  { name: 'Dilijan Beer', x: 1190, y: 575, w: 305, h: 205 },
  { name: 'Synopsys', x: 470, y: 735, w: 380, h: 135 },
  { name: 'SAGAMAR CJSC', x: 885, y: 740, w: 265, h: 120 },
  { name: 'Synergy International Systems', x: 1340, y: 730, w: 355, h: 155 },
  { name: 'Cigarone', x: 1080, y: 865, w: 385, h: 210 },
  { name: 'Ohanyan Brandy Company', x: 1615, y: 880, w: 300, h: 195 },
];

function LogoCard({ customer }: { customer: (typeof customers)[number] }) {
  const maxW = 180;
  const maxH = 88;
  const scale = Math.min(maxW / customer.w, maxH / customer.h, 1);
  const width = customer.w * scale;
  const height = customer.h * scale;
  const sizeW = 1920 * scale;
  const sizeH = 1080 * scale;

  return (
    <div className="customer-logo-card group">
      <div
        className="customer-logo-sprite"
        style={{
          width,
          height,
          backgroundImage: "url('/images/customers/customers-sprite.jpg')",
          backgroundSize: `${sizeW}px ${sizeH}px`,
          backgroundPosition: `${-customer.x * scale}px ${-customer.y * scale}px`,
        }}
      />
      <div className="mt-4 text-center text-sm font-semibold text-slate-700 transition group-hover:text-slate-950">
        {customer.name}
      </div>
    </div>
  );
}

export function CustomersMarquee({ title }: { title: string }) {
  const loop = [...customers, ...customers];

  return (
    <section className="overflow-hidden bg-white py-20 md:py-28">
      <div className="container">
        <p className="premium-eyebrow text-orange-600">TRUSTED BY</p>
        <div className="mt-4 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <h2 className="max-w-3xl text-4xl font-bold text-slate-950 md:text-5xl">{title}</h2>
          <p className="max-w-xl text-sm leading-6 text-slate-500">
            ELDESCO has delivered engineering and infrastructure solutions for organizations across Armenia.
          </p>
        </div>
      </div>

      <div className="customer-marquee-shell mt-12">
        <div className="customer-marquee-track">
          {loop.map((customer, index) => (
            <LogoCard key={`${customer.name}-${index}`} customer={customer} />
          ))}
        </div>
      </div>
    </section>
  );
}
