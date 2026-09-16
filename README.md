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
├── layout.tsx                 # Root layout
├── page.tsx                   # Home page
├── globals.css               # Global styles
├── [locale]/                 # Locale-specific pages
│   ├── layout.tsx
│   ├── page.tsx
│   ├── services/
│   ├── projects/
│   ├── team/
│   ├── news/
│   └── gallery/
├── admin/                    # Admin panel
│   ├── layout.tsx
│   ├── dashboard/
│   ├── services/
│   ├── projects/
│   ├── team/
│   ├── news/
│   └── gallery/
└── api/                      # API routes (if needed)

components/
├── layout/
│   ├── Navbar.tsx
│   ├── Footer.tsx
│   └── Sidebar.tsx
├── common/
│   ├── Button.tsx
│   ├── Card.tsx
│   ├── Modal.tsx
│   └── Loading.tsx
└── sections/
    ├── Hero.tsx
    ├── Services.tsx
    ├── Projects.tsx
    └── Team.tsx

lib/
├── api.ts                    # API client
├── i18n/
│   └── request.ts           # i18n configuration
├── auth/
│   └── store.ts             # Zustand auth store
└── messages/
    ├── en.json
    ├── hy.json
    └── ru.json

types/
└── index.ts                 # TypeScript types

public/
└── images/                  # Static images
```

## Available Pages

### Public Pages
- `/en` - Home page (English)
- `/hy` - Գլխավոր (Armenian)
- `/ru` - Главная (Russian)
- `/{locale}/services` - Services listing
- `/{locale}/projects` - Projects gallery
- `/{locale}/team` - Team members
- `/{locale}/news` - News/blog
- `/{locale}/gallery` - Photo gallery

### Admin Pages (Protected)
- `/admin/login` - Admin login
- `/admin/dashboard` - Dashboard
- `/admin/services` - Manage services
- `/admin/projects` - Manage projects
- `/admin/team` - Manage team
- `/admin/news` - Manage news
- `/admin/gallery` - Manage gallery
- `/admin/settings` - Site settings

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
