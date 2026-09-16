'use client';

import { useEffect, useState } from 'react';
import { cmsAdmin } from '@/lib/admin-cms';

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<any[]>([]);
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const [message, setMessage] = useState('');

  const load = async () => {
    const data = await cmsAdmin.settings();
    setSettings(data);
    setDrafts(Object.fromEntries(data.map((item: any) => [item.key, JSON.stringify(item.value ?? {}, null, 2)])));
  };

  useEffect(() => { load().catch((e) => setMessage(e.message)); }, []);

  const save = async (item: any) => {
    try {
      const value = JSON.parse(drafts[item.key] || '{}');
      await cmsAdmin.updateSetting(item.key, item.group, value);
      setMessage(`${item.key} saved ✓`);
    } catch (e: any) {
      setMessage(e.message || 'Save failed');
    }
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8">
        <p className="text-xs uppercase tracking-[.2em] text-orange-600 font-bold">Website CMS</p>
        <h1 className="text-4xl font-semibold mt-2">Global settings</h1>
        <p className="text-gray-500 mt-2">Header, footer, contacts, navigation and company-wide content.</p>
      </div>

      {message && <div className="mb-5 p-3 rounded-lg bg-slate-100 text-sm">{message}</div>}

      <div className="space-y-5">
        {settings.map((item) => (
          <article key={item.key} className="bg-white border rounded-2xl p-5">
            <div className="flex items-center justify-between gap-4 mb-4">
              <div><h2 className="text-xl font-semibold">{item.key}</h2><p className="text-xs uppercase tracking-wider text-gray-400 mt-1">{item.group}</p></div>
              <button onClick={() => save(item)} className="px-4 py-2 rounded-lg bg-slate-900 text-white">Save</button>
            </div>
            <textarea value={drafts[item.key] ?? ''} onChange={(e) => setDrafts({ ...drafts, [item.key]: e.target.value })} rows={Math.max(8, (drafts[item.key] || '').split('\n').length + 1)} className="w-full border rounded-xl p-3 font-mono text-xs bg-slate-950 text-slate-100" />
          </article>
        ))}
      </div>
    </div>
  );
}
