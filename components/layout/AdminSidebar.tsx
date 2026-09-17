'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/auth/store';

const Icon = ({ type }: { type: string }) => {
  const paths: Record<string, React.ReactNode> = {
    dashboard: <><rect x="3" y="3" width="7" height="7" rx="2"/><rect x="14" y="3" width="7" height="7" rx="2"/><rect x="3" y="14" width="7" height="7" rx="2"/><rect x="14" y="14" width="7" height="7" rx="2"/></>,
    pages: <><path d="M6 3h9l3 3v15H6z"/><path d="M9 12h6M9 16h6M14 3v4h4"/></>,
    services: <><path d="M4 7h16M4 12h16M4 17h16"/><circle cx="8" cy="7" r="1"/><circle cx="16" cy="12" r="1"/><circle cx="10" cy="17" r="1"/></>,
    projects: <><path d="M3 8h18v11H3z"/><path d="M8 8V5h8v3"/></>,
    team: <><circle cx="9" cy="8" r="3"/><circle cx="17" cy="9" r="2"/><path d="M3 20c0-4 2.5-6 6-6s6 2 6 6M15 15c3 0 5 1.5 5 4"/></>,
    news: <><path d="M4 4h16v16H4z"/><path d="M8 8h8M8 12h8M8 16h5"/></>,
  };
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {paths[type]}
    </svg>
  );
};

export function AdminSidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const { logout, user } = useAuthStore();

  const menuItems = [
    { label: 'Գլխավոր', href: '/admin/dashboard', icon: 'dashboard' },
    { label: 'Կայքի էջեր', href: '/admin/pages', icon: 'pages' },
    { label: 'Ծառայություններ', href: '/admin/services', icon: 'services' },
    { label: 'Նախագծեր', href: '/admin/projects', icon: 'projects' },
    { label: 'Թիմ', href: '/admin/team', icon: 'team' },
    { label: 'Նորություններ', href: '/admin/news', icon: 'news' },
  ];

  const handleLogout = async () => {
    await logout();
    router.push('/admin/login');
  };

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-[288px] overflow-hidden bg-[#08111f] text-white lg:flex lg:flex-col">
      <div className="absolute -left-24 top-0 h-72 w-72 rounded-full bg-orange-500/10 blur-3xl" />
      <div className="relative border-b border-white/10 px-7 py-7">
        <Link href="/admin/dashboard" className="inline-flex items-center gap-3">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-xl shadow-black/20">
            <img src="/images/brand/eldesco-logo.png" alt="ELDESCO" className="h-8 w-9 object-contain" />
          </span>
          <span>
            <span className="block text-lg font-extrabold tracking-[.08em]">ELDESCO</span>
            <span className="mt-0.5 block text-[10px] font-bold uppercase tracking-[.28em] text-orange-400">Control Center</span>
          </span>
        </Link>
      </div>

      <div className="relative px-5 pt-6">
        <p className="px-3 text-[10px] font-bold uppercase tracking-[.24em] text-slate-500">Կառավարում</p>
      </div>

      <nav className="relative mt-3 flex-1 space-y-1.5 px-5">
        {menuItems.map((item) => {
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`group flex items-center gap-3 rounded-2xl px-4 py-3.5 text-sm font-semibold transition-all ${
                active
                  ? 'bg-white text-slate-950 shadow-xl shadow-black/15'
                  : 'text-slate-300 hover:bg-white/[.07] hover:text-white'
              }`}
            >
              <span className={active ? 'text-orange-600' : 'text-slate-500 transition group-hover:text-orange-400'}><Icon type={item.icon} /></span>
              <span>{item.label}</span>
              {active && <span className="ml-auto h-2 w-2 rounded-full bg-orange-500" />}
            </Link>
          );
        })}
      </nav>

      <div className="relative m-5 rounded-2xl border border-white/10 bg-white/[.05] p-4">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-500 text-sm font-extrabold text-white">
            {(user?.email || 'A').slice(0, 1).toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="text-[11px] text-slate-500">Մուտք գործած հաշիվ</p>
            <p className="truncate text-xs font-semibold text-slate-200">{user?.email}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full rounded-xl border border-white/10 bg-white/[.04] px-4 py-2.5 text-xs font-bold text-slate-300 transition hover:border-red-400/30 hover:bg-red-500/10 hover:text-red-300"
        >
          Դուրս գալ
        </button>
      </div>
    </aside>
  );
}
