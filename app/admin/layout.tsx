'use client';

import Link from 'next/link';
import { ReactNode, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/auth/store';
import { AdminSidebar } from '@/components/layout/AdminSidebar';
import { Loading } from '@/components/common/Loading';

const pageTitle = (pathname: string) => {
  if (pathname.startsWith('/admin/pages')) return 'Կայքի էջեր';
  if (pathname.startsWith('/admin/services')) return 'Ծառայություններ';
  if (pathname.startsWith('/admin/projects')) return 'Նախագծեր';
  if (pathname.startsWith('/admin/team')) return 'Թիմ';
  if (pathname.startsWith('/admin/news')) return 'Նորություններ';
  return 'Կառավարման վահանակ';
};

export default function AdminLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, isLoading, checkAuth, user } = useAuthStore();
  const isLoginPage = pathname === '/admin/login';

  useEffect(() => {
    if (!isLoginPage) void checkAuth();
  }, [checkAuth, isLoginPage]);

  useEffect(() => {
    if (!isLoginPage && !isLoading && !isAuthenticated) router.replace('/admin/login');
  }, [isLoginPage, isLoading, isAuthenticated, router]);

  if (isLoginPage) return <>{children}</>;
  if (isLoading) return <Loading />;
  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-[#f4f6f8] text-slate-950">
      <AdminSidebar />

      <div className="lg:pl-[288px]">
        <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/90 backdrop-blur-xl">
          <div className="flex min-h-[76px] items-center justify-between gap-4 px-5 sm:px-8 lg:px-10">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[.24em] text-orange-600">ELDESCO CMS</p>
              <h1 className="mt-1 text-lg font-bold tracking-tight sm:text-xl">{pageTitle(pathname)}</h1>
            </div>

            <div className="flex items-center gap-3">
              <Link
                href="/hy"
                target="_blank"
                className="hidden rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50 sm:inline-flex"
              >
                Բացել կայքը ↗
              </Link>
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-950 text-sm font-extrabold text-white shadow-lg shadow-slate-950/10">
                {(user?.email || 'A').slice(0, 1).toUpperCase()}
              </div>
            </div>
          </div>
        </header>

        <main className="px-5 py-7 sm:px-8 lg:px-10 lg:py-9">
          <div className="mx-auto w-full max-w-[1500px]">{children}</div>
        </main>
      </div>
    </div>
  );
}
