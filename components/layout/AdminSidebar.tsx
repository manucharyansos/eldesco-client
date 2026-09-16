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
    { label: 'Website pages', href: '/admin/pages' },
    { label: 'Global settings', href: '/admin/settings' },
    { label: 'Projects', href: '/admin/projects' },
    { label: 'News', href: '/admin/news' },
    { label: 'Gallery', href: '/admin/gallery' },
    { label: 'Services', href: '/admin/services' },
    { label: 'Team', href: '/admin/team' },
  ];

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  return (
    <aside className="w-72 bg-[#071321] text-white h-screen flex flex-col shrink-0">
      <div className="p-6 border-b border-white/10">
        <div className="text-xs tracking-[.24em] text-orange-400 font-bold mb-2">ELDESCO</div>
        <h1 className="text-2xl font-semibold">Content Studio</h1>
      </div>

      <nav className="flex-1 p-4 space-y-1 overflow-auto">
        {menuItems.map((item) => {
          const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <Link key={item.href} href={item.href} className={`block px-4 py-3 rounded-xl transition ${active ? 'bg-orange-600 text-white' : 'text-slate-300 hover:bg-white/5 hover:text-white'}`}>
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-white/10 p-4 space-y-3">
        <div className="text-sm px-2"><p className="text-slate-400 text-xs">Logged in as</p><p className="font-semibold truncate">{user?.email}</p></div>
        <button onClick={handleLogout} className="w-full px-4 py-2.5 bg-white/5 hover:bg-white/10 rounded-xl transition text-left">Logout</button>
      </div>
    </aside>
  );
}
