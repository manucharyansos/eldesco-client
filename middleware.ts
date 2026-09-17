import createIntlMiddleware from 'next-intl/middleware';
import { NextRequest, NextResponse } from 'next/server';

const locales = ['hy', 'en', 'ru'] as const;

const intlMiddleware = createIntlMiddleware({
  locales: [...locales],
  defaultLocale: 'hy',
  localePrefix: 'always',
});

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Admin is intentionally locale-neutral. Keep one stable admin URL.
  const localizedAdmin = pathname.match(/^\/(hy|en|ru)\/admin(?:\/(.*))?$/);
  if (localizedAdmin) {
    const url = request.nextUrl.clone();
    url.pathname = `/admin${localizedAdmin[2] ? `/${localizedAdmin[2]}` : ''}`;
    return NextResponse.redirect(url);
  }

  if (pathname === '/admin' || pathname.startsWith('/admin/')) {
    return NextResponse.next();
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
};
