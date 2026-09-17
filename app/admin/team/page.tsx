'use client';

import { useEffect, useState } from 'react';
import { apiClient } from '@/lib/api';

type Lang = 'hy' | 'en' | 'ru';
type RawMember = {
  id: number; name_hy: string; name_en: string; name_ru?: string | null;
  position_hy?: string | null; position_en?: string | null; position_ru?: string | null;
  image_url?: string | null; email?: string | null; order_index?: number | null;
};
type FormState = {
  name_hy: string; name_en: string; name_ru: string;
  position_hy: string; position_en: string; position_ru: string;
  image_url: string; email: string; order_index: number;
};
const emptyForm = (): FormState => ({ name_hy:'',name_en:'',name_ru:'',position_hy:'',position_en:'',position_ru:'',image_url:'',email:'',order_index:0 });
const langLabel: Record<Lang,string> = { hy:'Հայերեն', en:'English', ru:'Русский' };
const API_ORIGIN = (process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api').replace(/\/api\/?$/, '');
const imageSrc = (url: string) => url.startsWith('/storage/') ? `${API_ORIGIN}${url}` : url;

export default function AdminTeamPage() {
  const [members,setMembers]=useState<RawMember[]>([]);
  const [loading,setLoading]=useState(true);
  const [editingId,setEditingId]=useState<number|'new'|null>(null);
  const [form,setForm]=useState<FormState>(emptyForm());
  const [lang,setLang]=useState<Lang>('hy');
  const [saving,setSaving]=useState(false);
  const [uploading,setUploading]=useState(false);
  const [error,setError]=useState('');

  const load=async()=>{try{setLoading(true);const r=await apiClient.getAdminTeam();setMembers(r.data??[]);}catch{setError('Չհաջողվեց բեռնել թիմը։');}finally{setLoading(false);}};
  useEffect(()=>{void load();},[]);

  const edit=(m:RawMember)=>{setEditingId(m.id);setForm({name_hy:m.name_hy||'',name_en:m.name_en||'',name_ru:m.name_ru||'',position_hy:m.position_hy||'',position_en:m.position_en||'',position_ru:m.position_ru||'',image_url:m.image_url||'',email:m.email||'',order_index:m.order_index||0});setLang('hy');setError('');};
  const startNew=()=>{setEditingId('new');setForm({...emptyForm(),order_index:members.length+1});setLang('hy');setError('');};

  const upload=async(file?:File)=>{if(!file)return;setUploading(true);setError('');try{const r=await apiClient.uploadMedia(file);setForm((f)=>({...f,image_url:r.data.url||''}));}catch{setError('Նկարի վերբեռնումը չհաջողվեց։');}finally{setUploading(false);}};
  const save=async()=>{if(!form.name_hy.trim()||!form.name_en.trim()){setError('Հայերեն և անգլերեն անունները պարտադիր են։');return;}setSaving(true);setError('');try{if(editingId==='new')await apiClient.createTeamMember(form);else if(typeof editingId==='number')await apiClient.updateTeamMember(editingId,form);setEditingId(null);setForm(emptyForm());await load();}catch(e:any){setError(e.response?.data?.message||'Պահպանումը չհաջողվեց։');}finally{setSaving(false);}};
  const remove=async(id:number)=>{if(!confirm('Ջնջե՞լ այս թիմի անդամին։'))return;try{await apiClient.deleteTeamMember(id);setMembers((v)=>v.filter((m)=>m.id!==id));}catch{setError('Ջնջումը չհաջողվեց։');}};

  return <div className="space-y-7">
    <div className="flex flex-wrap items-end justify-between gap-5"><div><p className="text-[11px] font-extrabold uppercase tracking-[.24em] text-orange-600">Մարդիկ</p><h2 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">Թիմ</h2><p className="mt-3 text-sm text-slate-500">Կառավարիր ղեկավարների և մասնագետների տվյալները, պաշտոններն ու նկարները։</p></div><button onClick={startNew} className="rounded-2xl bg-slate-950 px-5 py-3.5 text-sm font-extrabold text-white shadow-xl transition hover:bg-orange-500">+ Նոր անդամ</button></div>
    {error&&<div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700">{error}</div>}
    <div className={`grid gap-6 ${editingId!==null?'xl:grid-cols-[.85fr_1.15fr]':''}`}>
      <section className="grid gap-4 sm:grid-cols-2">
        {loading?<div className="rounded-[28px] border border-slate-200 bg-white p-10 text-sm text-slate-500 sm:col-span-2">Բեռնվում է…</div>:members.map((m,index)=><article key={m.id} className={`rounded-[26px] border bg-white p-5 shadow-sm transition ${editingId===m.id?'border-orange-200 ring-4 ring-orange-50':'border-slate-200 hover:-translate-y-1 hover:shadow-lg'}`}>
          <div className="flex items-center gap-4"><div className="h-16 w-16 shrink-0 overflow-hidden rounded-2xl bg-slate-950">{m.image_url?<img src={imageSrc(m.image_url)} alt="" className="h-full w-full object-cover"/>:<div className="flex h-full items-center justify-center text-lg font-black text-white">{(m.name_hy||m.name_en||'?').slice(0,1)}</div>}</div><div className="min-w-0"><h3 className="truncate font-extrabold text-slate-950">{m.name_hy||m.name_en}</h3><p className="mt-1 truncate text-xs text-slate-500">{m.position_hy||m.position_en||'Պաշտոն նշված չէ'}</p><p className="mt-1 text-[10px] font-bold text-slate-400">#{m.order_index??index+1}</p></div></div>
          <div className="mt-5 flex gap-2 border-t border-slate-100 pt-4"><button onClick={()=>edit(m)} className="flex-1 rounded-xl border border-slate-200 px-3 py-2.5 text-xs font-bold text-slate-700 hover:border-orange-200 hover:text-orange-600">Խմբագրել</button><button onClick={()=>void remove(m.id)} className="rounded-xl border border-red-100 px-3 py-2.5 text-xs font-bold text-red-500 hover:bg-red-50">Ջնջել</button></div>
        </article>)}
        {!loading&&!members.length&&<div className="rounded-[26px] border border-dashed border-slate-300 bg-white p-10 text-center text-sm text-slate-500 sm:col-span-2">Թիմի անդամ դեռ չկա։</div>}
      </section>
      {editingId!==null&&<section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm sm:p-7">
        <div className="flex items-start justify-between"><div><p className="text-[10px] font-extrabold uppercase tracking-[.2em] text-orange-600">{editingId==='new'?'Նոր գրառում':'Խմբագրում'}</p><h3 className="mt-2 text-2xl font-black">Թիմի անդամի տվյալներ</h3></div><button onClick={()=>setEditingId(null)} className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-lg text-slate-500">×</button></div>
        <div className="mt-6 grid gap-5 md:grid-cols-[140px_1fr]"><div><div className="h-36 overflow-hidden rounded-2xl bg-slate-950">{form.image_url?<img src={imageSrc(form.image_url)} alt="" className="h-full w-full object-cover"/>:<div className="flex h-full items-center justify-center text-xs font-bold text-slate-500">Նկար չկա</div>}</div><label className="mt-3 block cursor-pointer rounded-xl border border-dashed border-slate-300 px-3 py-3 text-center text-xs font-bold text-slate-600 hover:border-orange-400">{uploading?'Վերբեռնվում է…':'Փոխել նկարը'}<input type="file" accept="image/*" className="hidden" disabled={uploading} onChange={(e)=>void upload(e.target.files?.[0])}/></label></div><div><label className="block"><span className="mb-2 block text-sm font-bold text-slate-700">Էլ․ փոստ</span><input type="email" value={form.email} onChange={(e)=>setForm({...form,email:e.target.value})} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"/></label><label className="mt-4 block"><span className="mb-2 block text-sm font-bold text-slate-700">Հերթականություն</span><input type="number" value={form.order_index} onChange={(e)=>setForm({...form,order_index:Number(e.target.value)})} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"/></label></div></div>
        <div className="mt-6 flex rounded-xl bg-slate-100 p-1">{(['hy','en','ru'] as Lang[]).map((l)=><button key={l} onClick={()=>setLang(l)} className={`flex-1 rounded-lg px-3 py-2 text-xs font-bold ${lang===l?'bg-white text-slate-950 shadow-sm':'text-slate-500'}`}>{langLabel[l]}</button>)}</div>
        <div className="mt-5 space-y-5"><label className="block"><span className="mb-2 block text-sm font-bold text-slate-700">Անուն · {langLabel[lang]}</span><input value={form[`name_${lang}`]} onChange={(e)=>setForm({...form,[`name_${lang}`]:e.target.value})} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-orange-400 focus:ring-4 focus:ring-orange-100"/></label><label className="block"><span className="mb-2 block text-sm font-bold text-slate-700">Պաշտոն · {langLabel[lang]}</span><input value={form[`position_${lang}`]} onChange={(e)=>setForm({...form,[`position_${lang}`]:e.target.value})} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-orange-400 focus:ring-4 focus:ring-orange-100"/></label></div>
        <div className="mt-7 flex gap-3 border-t border-slate-100 pt-5"><button onClick={()=>setEditingId(null)} className="flex-1 rounded-2xl border border-slate-200 px-5 py-3 text-sm font-bold text-slate-700">Չեղարկել</button><button onClick={()=>void save()} disabled={saving} className="flex-1 rounded-2xl bg-slate-950 px-5 py-3 text-sm font-extrabold text-white transition hover:bg-orange-500 disabled:opacity-50">{saving?'Պահպանվում է…':'Պահպանել'}</button></div>
      </section>}
    </div>
  </div>;
}
