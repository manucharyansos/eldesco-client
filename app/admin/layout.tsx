'use client';

import { useEffect, ReactNode } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/auth/store';
import { AdminSidebar } from '@/components/layout/AdminSidebar';
import { Loading } from '@/components/common/Loading';

export default function AdminLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, isLoading, checkAuth } = useAuthStore();
  const isLoginPage = pathname === '/admin/login';

  useEffect(() => {
    if (!isLoginPage) void checkAuth();
  }, [checkAuth, isLoginPage]);

  useEffect(() => {
    if (!isLoginPage && !isLoading && !isAuthenticated) {
      router.replace('/admin/login');
    }
  }, [isLoginPage, isLoading, isAuthenticated, router]);

  if (isLoginPage) return <>{children}</>;
  if (isLoading) return <Loading />;
  if (!isAuthenticated) return null;

  return (
    <div className="flex h-screen bg-gray-100">
      <AdminSidebar />
      <main className="flex-1 overflow-auto">
        <div className="p-8">{children}</div>
      </main>
    </div>
  );
}
