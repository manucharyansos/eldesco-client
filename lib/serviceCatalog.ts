export type ServiceCatalogItem = {
  slug: string;
  image?: string;
};

export const serviceCatalog: Record<number, ServiceCatalogItem> = {
  1: { slug: 'power-infrastructure', image: '/images/projects/substation.png' },
  2: { slug: 'industrial-infrastructure' },
  3: { slug: 'led-displays', image: '/images/projects/led.png' },
  4: { slug: 'refrigeration' },
  5: { slug: 'sheet-metal-processing', image: '/images/projects/metalworks.png' },
};

export const serviceHeroImages: Record<string, string | undefined> = Object.fromEntries(
  Object.values(serviceCatalog).map((item) => [item.slug, item.image])
);

export const serviceSlugs = Object.values(serviceCatalog).map((item) => item.slug);
