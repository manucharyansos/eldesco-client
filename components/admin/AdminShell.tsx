'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { adminApi, hasAdminToken } from '@/lib/cms';

const links = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: '⌁' },
  { href: '/admin/pages', label: 'Pages', icon: '▤' },
  { href: '/admin/media', label: 'Media', icon: '▧' },
  { href: '/admin/settings', label: 'Settings', icon: '⚙' },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [ready, setReady] = useState(pathname === '/admin/login');

  useEffect(() => {
    if (pathname === '/admin/login') {
      setReady(true);
      return;
    }
    if (!hasAdminToken()) {
      router.replace('/admin/login');
      return;
    }
    adminApi.me().then(() => setReady(true)).catch(() => router.replace('/admin/login'));
  }, [pathname, router]);

  if (pathname === '/admin/login') return <>{children}</>;
  if (!ready) return <div className="admin-loading"><div className="admin-spinner"/><span>Loading admin…</span></div>;

  const logout = async () => {
    try { await adminApi.logout(); } catch { /* token may already be invalid */ }
    localStorage.removeItem('eldesco_admin_token');
    router.replace('/admin/login');
  };

  return (
    <div className="admin-app">
      <aside className="admin-sidebar">
        <div className="admin-brand"><span className="admin-brand__mark">E</span><div><strong>ELDESCO</strong><small>Content Manager</small></div></div>
        <nav className="admin-nav">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className={pathname.startsWith(link.href) ? 'is-active' : ''}>
              <span>{link.icon}</span>{link.label}
            </Link>
          ))}
        </nav>
        <div className="admin-sidebar__footer">
          <Link href="/hy" target="_blank">View website ↗</Link>
          <button onClick={logout}>Sign out</button>
        </div>
      </aside>
      <div className="admin-main">
        <div className="admin-topbar"><span>ELDESCO Website</span><div className="admin-status"><i/> CMS connected</div></div>
        <div className="admin-content">{children}</div>
      </div>
    </div>
  );
}
