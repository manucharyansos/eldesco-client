# ELDESCO Client

Next.js frontend for ELDESCO LLC website with support for Armenian, English, and Russian languages, plus an integrated admin panel.

## Features

- **Multi-language Support**: Full i18n support for Armenian (hy), English (en), and Russian (ru)
- **Admin Panel**: Manage services, projects, team members, news, and gallery
- **Responsive Design**: Mobile-first design with TailwindCSS
- **Type Safety**: Full TypeScript support
- **API Integration**: Ready-to-use API client for Laravel backend
- **Authentication**: JWT token-based authentication with Zustand state management
- **Image Optimization**: Next.js Image component for optimized images

## Requirements

- Node.js 18+
- npm or yarn
- Running Laravel API server

## Installation

1. Clone the repository:
```bash
git clone https://github.com/manucharyansos/eldesco-client.git
cd eldesco-client
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Configure environment:
```bash
cp .env.example .env.local
```

Edit `.env.local`:
```
NEXT_PUBLIC_API_URL=http://localhost:8000/api
NEXT_PUBLIC_DEFAULT_LANGUAGE=en
```

## Development

Start the development server:
```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Build

Create an optimized production build:
```bash
npm run build
npm start
# or
yarn build
yarn start
```

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

## Production deployment (https://eldesco.am)

```bash
cp .env.example .env.production.local   # set NEXT_PUBLIC_API_URL=https://api.eldesco.am/api
                                        #     NEXT_PUBLIC_SITE_URL=https://eldesco.am
npm ci || npm install
npm run build          # NEXT_PUBLIC_* values are baked in at build time
npm start -- -p 3000   # keep alive with pm2 / systemd
```

Nginx in front of `next start`:

```nginx
server {
    server_name eldesco.am www.eldesco.am;
    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

Redirect `www` to the apex domain (or the other way round) and add TLS with certbot.
The admin panel lives at https://eldesco.am/admin. The API must list `https://eldesco.am` in `CORS_ALLOWED_ORIGINS`.

## API Integration

The application uses the `apiClient` from `lib/api.ts` for all backend communication:

```typescript
import { apiClient } from '@/lib/api';

// Get services in a specific language
const response = await apiClient.getServices('hy');

// Login
await apiClient.login('admin@eldesco.am', 'password');

// Create a news item (requires auth)
await apiClient.createNews({
  title_en: 'New Project Launch',
  content_en: 'Content...',
  published: true
});
```

## Authentication

Login is managed with Zustand store:

```typescript
import { useAuthStore } from '@/lib/auth/store';

export function LoginPage() {
  const { login, isLoading, error } = useAuthStore();

  const handleLogin = async (email: string, password: string) => {
    try {
      await login(email, password);
      // Redirect to admin
    } catch (err) {
      // Show error
    }
  };

  return (
    // Login form...
  );
}
```

## Styling

Using TailwindCSS with custom theme:

```jsx
// Primary color (dark blue-grey)
<div className="bg-primary-500 text-white">

// Accent color (orange)
<button className="bg-accent-500 hover:bg-accent-600">

// Custom utilities
<h1 className="text-4xl font-serif font-bold">
```

## Internationalization

All text is managed through JSON translation files in `lib/messages/`:

```json
// lib/messages/en.json
{
  "common": {
    "appName": "ELDESCO",
    "home": "Home"
  }
}
```

Use translations in components:

```typescript
import { useTranslations } from 'next-intl';

export function Component() {
  const t = useTranslations('common');
  return <h1>{t('appName')}</h1>;
}
```

## Adding New Languages

1. Create new translation file: `lib/messages/{lang_code}.json`
2. Add language code to `locales` array in `lib/i18n/request.ts`
3. Update `next.config.js` if needed
4. Update language selector in navbar

## Image Handling

Images are optimized using Next.js Image component:

```typescript
import Image from 'next/image';

<Image
  src="/images/project.jpg"
  alt="Project name"
  width={800}
  height={600}
  priority
/>
```

## Performance Tips

- Use Next.js Image component for all images
- Implement lazy loading for off-screen content
- Use dynamic imports for heavy components
- Enable compression in production
- Optimize bundle size with code splitting

## Deployment

Build for production and deploy:

```bash
npm run build
npm start
```

Or use Vercel, Netlify, or your preferred hosting platform.

## Troubleshooting

### API Connection Issues
- Ensure Laravel backend is running on `http://localhost:8000`
- Check CORS configuration in Laravel
- Verify `NEXT_PUBLIC_API_URL` in `.env.local`

### Language Not Switching
- Clear browser cache
- Verify language codes in URL
- Check `lib/messages/` files exist

### Admin Panel Not Loading
- Verify authentication token is valid
- Check user role is 'admin'
- Clear localStorage if issues persist

## License

ELDESCO LLC © 2024. All rights reserved.
