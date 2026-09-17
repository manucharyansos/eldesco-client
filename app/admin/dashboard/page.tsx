'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { apiClient } from '@/lib/api';

interface Stats {
  services: number;
  projects: number;
  team: number;
  news: number;
}

const emptyStats: Stats = { services: 0, projects: 0, team: 0, news: 0 };

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>(emptyStats);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      const results = await Promise.allSettled([
        apiClient.getServices('hy'),
        apiClient.getProjects('hy'),
        apiClient.getTeam('hy'),
        apiClient.getNews('hy', 1, 100),
      ]);

      const [services, projects, team, news] = results;
      setStats({
        services: services.status === 'fulfilled' ? (services.value.data?.length ?? 0) : 0,
        projects: projects.status === 'fulfilled' ? (projects.value.data?.length ?? 0) : 0,
        team: team.status === 'fulfilled' ? (team.value.data?.length ?? 0) : 0,
        news: news.status === 'fulfilled'
          ? (news.value.data?.pagination?.total ?? news.value.data?.data?.length ?? 0)
          : 0,
      });
      setLoading(false);
    };

    void fetchStats();
  }, []);

  const statCards = [
    { label: 'Ծառայություններ', value: stats.services, href: '/admin/services', mark: '01', hint: 'Կայքի հիմնական ուղղություններ' },
    { label: 'Նախագծեր', value: stats.projects, href: '/admin/projects', mark: '02', hint: 'Իրականացված աշխատանքներ' },
    { label: 'Թիմի անդամներ', value: stats.team, href: '/admin/team', mark: '03', hint: 'Մասնագետներ և ղեկավարներ' },
    { label: 'Նորություններ', value: stats.news, href: '/admin/news', mark: '04', hint: 'Հոդվածներ և թարմացումներ' },
  ];

  const quickActions = [
    { title: 'Խմբագրել գլխավոր էջը', text: 'Hero, բաժիններ, SEO և հիմնական բովանդակություն', href: '/admin/pages' },
    { title: 'Ավելացնել նախագիծ', text: 'Նկարներ, նկարագրություն և կատեգորիա', href: '/admin/projects/edit/new' },
    { title: 'Կառավարել ծառայությունները', text: 'HY / EN / RU բովանդակություն և նկարներ', href: '/admin/services' },
  ];

  return (
    <div className="space-y-8">
      <section className="relative overflow-hidden rounded-[30px] bg-[#08111f] px-7 py-8 text-white shadow-2xl shadow-slate-900/10 sm:px-9 sm:py-10">
        <div className="absolute -right-16 -top-28 h-80 w-80 rounded-full bg-orange-500/20 blur-3xl" />
        <div className="absolute bottom-0 right-24 h-32 w-32 rounded-full bg-white/5 blur-2xl" />
        <div className="relative max-w-3xl">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[.06] px-3 py-1.5 text-[11px] font-bold uppercase tracking-[.2em] text-orange-300">
            <span className="h-1.5 w-1.5 rounded-full bg-orange-400" />
            Կայքի կառավարում
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">ELDESCO կառավարման կենտրոն</h2>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
            Այստեղից կառավարում ես կայքի էջերը, ծառայությունները, նախագծերը, թիմը և նորությունները։ Փոփոխությունները հրապարակելուց հետո հասանելի են public կայքում։
          </p>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {statCards.map((stat) => (
          <Link key={stat.label} href={stat.href} className="group rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-slate-300 hover:shadow-xl hover:shadow-slate-900/[.06]">
            <div className="flex items-start justify-between gap-3">
              <span className="text-[11px] font-extrabold tracking-[.2em] text-orange-600">{stat.mark}</span>
              <span className="text-lg text-slate-300 transition group-hover:translate-x-1 group-hover:text-orange-500">→</span>
            </div>
            <div className="mt-6 text-4xl font-black tracking-tight text-slate-950">{loading ? '—' : stat.value}</div>
            <h3 className="mt-2 font-bold text-slate-900">{stat.label}</h3>
            <p className="mt-2 text-xs leading-5 text-slate-500">{stat.hint}</p>
          </Link>
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.35fr_.65fr]">
        <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="mb-6 flex items-end justify-between gap-4">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[.2em] text-orange-600">Արագ գործողություններ</p>
              <h2 className="mt-2 text-2xl font-extrabold tracking-tight">Հաճախ օգտագործվող բաժիններ</h2>
            </div>
          </div>
          <div className="space-y-3">
            {quickActions.map((action, index) => (
              <Link key={action.title} href={action.href} className="group flex items-center gap-4 rounded-2xl border border-slate-100 bg-slate-50/70 p-4 transition hover:border-orange-200 hover:bg-orange-50/40">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-950 text-xs font-black text-white transition group-hover:bg-orange-500">0{index + 1}</span>
                <span className="min-w-0 flex-1">
                  <span className="block font-bold text-slate-900">{action.title}</span>
                  <span className="mt-1 block text-xs leading-5 text-slate-500">{action.text}</span>
                </span>
                <span className="text-slate-300 transition group-hover:translate-x-1 group-hover:text-orange-500">→</span>
              </Link>
            ))}
          </div>
        </div>

        <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <p className="text-[11px] font-bold uppercase tracking-[.2em] text-orange-600">Կայքի վիճակ</p>
          <h2 className="mt-2 text-2xl font-extrabold tracking-tight">Հրապարակման հուշումներ</h2>
          <div className="mt-6 space-y-5 text-sm text-slate-600">
            <div className="flex gap-3"><span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-emerald-500"/><p>Ստուգիր HY / EN / RU տարբերակները մինչև հրապարակելը։</p></div>
            <div className="flex gap-3"><span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-orange-500"/><p>Նկարների համար օգտագործիր հնարավորինս բարձր որակ և ճիշտ հարաբերակցություն։</p></div>
            <div className="flex gap-3"><span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-slate-400"/><p>SEO վերնագիրը և նկարագրությունը լրացրու յուրաքանչյուր կարևոր էջի համար։</p></div>
          </div>
          <Link href="/hy" target="_blank" className="mt-8 inline-flex w-full items-center justify-center rounded-2xl bg-slate-950 px-5 py-3.5 text-sm font-bold text-white transition hover:bg-orange-500">
            Դիտել կայքը ↗
          </Link>
        </div>
      </section>
    </div>
  );
}
