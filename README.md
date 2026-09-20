# ELDESCO Client

Website and admin panel for ELDESCO LLC (Next.js 14, TypeScript, Tailwind) in Armenian, English and Russian.
All visible content - texts, images, menus, footer, labels - lives in the Laravel API and is edited in the admin panel.

## Quick start (local)

Needs Node 18.17+ (20 recommended). The API lives in a separate repository, [eldesco-api](https://github.com/manucharyansos/eldesco-api).

```bash
# once: the API (needs PHP 8.2+ and Composer), cloned next to this repo
git clone https://github.com/manucharyansos/eldesco-api.git
(cd eldesco-api && composer install && composer setup)

git clone https://github.com/manucharyansos/eldesco-client.git
cd eldesco-client
npm install
npm run dev:all      # API on http://127.0.0.1:8000 + website on http://localhost:3000
```

- Website: http://localhost:3000 - Admin panel: http://localhost:3000/admin
- Only the website: `npm run dev` (uses `.env.local`, created from `.env.example`; without an API it shows built-in fallback content)
- Checks: `npm run typecheck`, `npm run lint`, `npm run build`

## Production

See [DEPLOY.md](DEPLOY.md) - step-by-step guide for https://eldesco.am (nginx, pm2, HTTPS, updates).
`NEXT_PUBLIC_API_URL` / `NEXT_PUBLIC_SITE_URL` are compiled into the build (`.env.production.example`).

## Project Structure

```
app/
├── [locale]/                 # public website (hy / en / ru) - root layout with <html lang>
│   ├── page.tsx              # home  (CMS page "home")
│   ├── [slug]/page.tsx       # any CMS page created in the admin (about, customers, contact, ...)
│   ├── services/             # services list + /services/[slug] detail pages (CMS pages)
│   ├── projects/, team/, news/
├── admin/                    # admin panel (Armenian UI), noindex
│   ├── pages/[id]            # form-based section editor
│   ├── settings/             # company, contacts, logo, SEO, interface labels
│   ├── navigation/           # header / footer menus (with dropdowns)
│   ├── media/                # image library
│   └── services, projects, team, news
├── api/revalidate/           # purges the site cache after every admin save
├── sitemap.ts, robots.ts
components/
├── layout/                   # Header, Footer (fed by /api/site)
├── cms/                      # SectionRenderer, PageView
├── sections/                 # Hero, gallery lightbox
└── admin/                    # schema-driven form fields, media picker
lib/
├── cms.ts                    # server-side fetchers (cached 60 s, purged on save)
├── defaults.ts               # default interface labels + offline fallback
├── adminSchemas.ts           # describes every section type / setting shown in the admin
public/images/                # brand logos, presentation photos (deck/), customer logos
```

Everything visible on the site - texts, images, menus, footer, labels - is stored in the API and edited
in the admin panel. `lib/defaults.ts` only supplies defaults so the site still renders if the API is down.

## How content works

- **Pages** are built from sections (hero, text, gallery, customers, ...). Every section type is described once in
  `lib/adminSchemas.ts`; the admin form editor and the renderers (`components/cms/SectionRenderer.tsx`) follow it.
  To add a section type: describe it in `adminSchemas.ts`, then add a `case` in `SectionRenderer.tsx`.
- **Site-wide content** (company data, contacts, logo, footer text, menus, interface labels) comes from `/api/site`
  and is edited under *Site settings* and *Menu* in the admin.
- **Interface labels** have defaults in `lib/defaults.ts` (`UI_DEFAULTS`); the admin can override any of them.
  Add a new label there and use it with `makeUi(...)`.
- **Services** are shared by the home page, the services page and the menu; each service's detail page is the CMS page
  with the same slug (`/services/<slug>`).
- **Images**: static assets live in `public/images/` (brand, `deck/` presentation photos, `customers/` logos);
  uploaded files are served by the API (`/storage/...`). The admin image picker offers both.
- **Caching**: public content is cached for 60 seconds and purged immediately after each admin save (`app/api/revalidate`).
- **Languages**: `hy`, `en`, `ru` (`lib/config.ts`, routing in `middleware.ts`).

## Admin panel

`/admin` (Armenian interface): pages, services, projects, team, news, gallery, site settings, menus, image library.
Only users with the `admin` role can sign in.

## Troubleshooting

- **Site shows a short fallback home page** - the API is not reachable; check `NEXT_PUBLIC_API_URL`.
- **Admin cannot log in / CORS error** - the API must allow the site origin in `CORS_ALLOWED_ORIGINS`.
- **Changed `.env.production.local` but nothing happened** - `NEXT_PUBLIC_*` are baked into the build; rebuild.

## License

ELDESCO LLC. All rights reserved.
