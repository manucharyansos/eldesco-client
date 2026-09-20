'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/auth/store';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const { login } = useAuthStore();
  // The store's isLoading starts as true (it waits for checkAuth, which never runs on this page),
  // so a direct visit to /admin/login used to leave the button disabled forever.
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      await login(email, password);
      router.push('/admin/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Մուտքը չհաջողվեց։ Ստուգիր տվյալները։');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#07101d] text-white">
      <div className="absolute -left-32 top-10 h-96 w-96 rounded-full bg-orange-500/20 blur-3xl" />
      <div className="absolute -right-24 bottom-0 h-[420px] w-[420px] rounded-full bg-sky-500/10 blur-3xl" />
      <div className="absolute inset-0 opacity-[.08] [background-image:linear-gradient(rgba(255,255,255,.12)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.12)_1px,transparent_1px)] [background-size:44px_44px]" />

      <div className="relative mx-auto grid min-h-screen max-w-7xl items-center gap-14 px-5 py-10 lg:grid-cols-[1.05fr_.95fr] lg:px-10">
        <section className="hidden lg:block">
          <div className="inline-flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[.05] p-3 pr-5 backdrop-blur">
            <span className="flex h-14 w-14 items-center justify-center rounded-xl bg-white">
              <img src="/images/brand/eldesco-logo.png" alt="ELDESCO" className="h-9 w-10 object-contain" />
            </span>
            <div>
              <div className="text-lg font-extrabold tracking-[.08em]">ELDESCO</div>
              <div className="text-[10px] font-bold uppercase tracking-[.28em] text-orange-300">Content Management</div>
            </div>
          </div>
          <h1 className="mt-10 max-w-2xl text-5xl font-black leading-[1.05] tracking-[-.04em] xl:text-6xl">
            Կառավարիր ամբողջ կայքը մեկ տեղից։
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-8 text-slate-300">
            Էջեր, ծառայություններ, նախագծեր, նկարներ, SEO և երեք լեզու՝ մեկ միասնական կառավարման միջավայրում։
          </p>
          <div className="mt-10 grid max-w-xl grid-cols-3 gap-3">
            {['HY / EN / RU', 'CMS', 'SEO'].map((item) => (
              <div key={item} className="rounded-2xl border border-white/10 bg-white/[.04] px-4 py-4 text-center text-xs font-bold tracking-wide text-slate-300">{item}</div>
            ))}
          </div>
        </section>

        <section className="mx-auto w-full max-w-[520px] rounded-[32px] border border-white/10 bg-white/[.97] p-6 text-slate-950 shadow-2xl shadow-black/30 sm:p-9 lg:p-10">
          <div className="mb-8 lg:hidden">
            <img src="/images/brand/eldesco-logo.png" alt="ELDESCO" className="h-14 w-auto object-contain" />
          </div>
          <p className="text-[11px] font-extrabold uppercase tracking-[.24em] text-orange-600">Ադմինիստրատոր</p>
          <h2 className="mt-3 text-3xl font-black tracking-tight">Մուտք կառավարման վահանակ</h2>
          <p className="mt-3 text-sm leading-6 text-slate-500">Մուտք գործիր միայն ադմինիստրատորի հաստատված հաշվով։</p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            {error && <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">{error}</div>}

            <label className="block">
              <span className="mb-2 block text-sm font-bold text-slate-700">Էլ․ փոստ</span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="username"
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm outline-none transition placeholder:text-slate-400 focus:border-orange-400 focus:bg-white focus:ring-4 focus:ring-orange-100"
                placeholder="admin@eldesco.am"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-bold text-slate-700">Գաղտնաբառ</span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm outline-none transition placeholder:text-slate-400 focus:border-orange-400 focus:bg-white focus:ring-4 focus:ring-orange-100"
                placeholder="••••••••"
              />
            </label>

            <button
              type="submit"
              disabled={submitting}
              className="mt-2 flex w-full items-center justify-center rounded-2xl bg-slate-950 px-5 py-4 text-sm font-extrabold text-white shadow-xl shadow-slate-950/10 transition hover:bg-orange-500 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? 'Մուտք ենք գործում…' : 'Մուտք գործել'}
            </button>
          </form>

          <p className="mt-7 text-center text-xs leading-5 text-slate-400">ELDESCO CMS · պաշտպանված կառավարման միջավայր</p>
        </section>
      </div>
    </main>
  );
}
