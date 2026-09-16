# ELDESCO Client

Next.js 14 corporate website and admin content studio for ELDESCO.

## Features

- Premium responsive corporate design
- Armenian / English / Russian public routes
- Public pages rendered from the Laravel CMS API
- Dynamic page sections: hero, split content, cards, feature lists, stats, galleries, customer logos and contact blocks
- Dynamic navigation, footer and contact information
- Admin login
- Admin page editor for SEO, section text, images and advanced section data
- Admin global settings editor
- Existing project, service, gallery, news and team management remains available

## Setup

```bash
npm install
cp .env.example .env.local
npm run dev
```

Configure:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

Then open `http://localhost:3000`.

## Admin

Open `/admin/login`, then use:

- `/admin/pages` — edit every CMS page and section
- `/admin/settings` — edit brand, navigation, contact, header/footer settings
- legacy admin screens for projects, news, gallery, services and team

Images uploaded through the page editor are stored by Laravel on the public storage disk, so the API server must have `php artisan storage:link` configured.

## Build

```bash
npm run build
npm run start
```

The public website expects the CMS seed data from the API (`php artisan db:seed --class=CmsSeeder`) on a fresh installation.
