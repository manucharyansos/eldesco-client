'use client';

import { useEffect, type ReactNode } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/auth/store';
import { AdminSidebar } from '@/components/layout/AdminSidebar';
import { Loading } from '@/components/common/Loading';

export default function AdminLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated, isLoading, checkAuth } = useAuthStore();
  const isLogin = pathname === '/admin/login';

  useEffect(() => {
    if (!isLogin) checkAuth();
  }, [isLogin, checkAuth]);

  useEffect(() => {
    if (!isLogin && !isLoading && !isAuthenticated) {
      router.replace('/admin/login');
    }
  }, [isLogin, isLoading, isAuthenticated, router]);

  if (isLogin) return <>{children}</>;
  if (isLoading) return <Loading />;
  if (!isAuthenticated) return null;

  return (
    <div className="flex min-h-screen bg-[#f5f6f8]">
      <AdminSidebar />
      <main className="flex-1 min-w-0 overflow-auto">
        <div className="p-5 md:p-8 lg:p-10">{children}</div>
      </main>
    </div>
  );
}
