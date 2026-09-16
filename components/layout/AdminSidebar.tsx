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

  const isActive = (href: string) => pathname === href;

  return (
    <aside className="w-64 bg-primary-500 text-white h-screen flex flex-col">
      <div className="p-6 border-b border-primary-400">
        <h1 className="font-serif text-2xl font-bold">ELDESCO</h1>
        <p className="text-sm text-gray-300 mt-1">Admin Panel</p>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`block px-4 py-2 rounded transition ${
              isActive(item.href)
                ? 'bg-accent-500 text-white'
                : 'hover:bg-primary-400'
            }`}
          >
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="border-t border-primary-400 p-4 space-y-3">
        <div className="text-sm">
          <p className="text-gray-300">Logged in as</p>
          <p className="font-semibold">{user?.email}</p>
        </div>
        <button
          onClick={handleLogout}
          className="w-full px-4 py-2 bg-red-600 hover:bg-red-700 rounded transition"
        >
          Logout
        </button>
      </div>
    </aside>
  );
}
