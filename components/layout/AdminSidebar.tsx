'use client';

import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/lib/auth/store';

export function AdminSidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const { logout, user } = useAuthStore();

  const menuItems = [
    { label: 'Dashboard', href: '/admin/dashboard' },
    { label: 'Pages', href: '/admin/pages' },
    { label: 'Services', href: '/admin/services' },
    { label: 'Projects', href: '/admin/projects' },
    { label: 'Team', href: '/admin/team' },
    { label: 'News', href: '/admin/news' },
    { label: 'Gallery', href: '/admin/gallery' },
  ];

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <aside className="flex h-screen w-64 flex-col bg-primary-500 text-white">
      <div className="border-b border-primary-400 p-6">
        <h1 className="font-serif text-2xl font-bold">ELDESCO</h1>
        <p className="mt-1 text-sm text-gray-300">Admin Panel</p>
      </div>

      <nav className="flex-1 space-y-2 p-4">
        {menuItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`block rounded px-4 py-2 transition ${
              isActive(item.href)
                ? 'bg-accent-500 text-white'
                : 'hover:bg-primary-400'
            }`}
          >
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="space-y-3 border-t border-primary-400 p-4">
        <div className="text-sm">
          <p className="text-gray-300">Logged in as</p>
          <p className="font-semibold">{user?.email}</p>
        </div>
        <button
          onClick={handleLogout}
          className="w-full rounded bg-red-600 px-4 py-2 transition hover:bg-red-700"
        >
          Logout
        </button>
      </div>
    </aside>
  );
}
