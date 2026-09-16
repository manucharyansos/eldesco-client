'use client';

import { ChangeEvent, useEffect, useMemo, useState } from 'react';
import { adminApi } from '@/lib/cms';
import type { Locale, SettingRow, TranslatedText } from '@/types/cms';

const languages: { code: Locale; label: string }[] = [
  { code: 'hy', label: 'Հայերեն' }, { code: 'en', label: 'English' }, { code: 'ru', label: 'Русский' },
];

function isTranslated(value: unknown): value is TranslatedText {
  return Boolean(value && typeof value === 'object' && !Array.isArray(value) && ('hy' in (value as any) || 'en' in (value as any) || 'ru' in (value as any)));
}

export default function AdminSettingsPage() {
  const [rows, setRows] = useState<SettingRow[]>([]);
  const [language, setLanguage] = useState<Locale>('hy');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => { adminApi.settings().then(setRows).catch((e) => setError(String(e))).finally(() => setLoading(false)); }, []);

  const groups = useMemo(() => Array.from(new Set(rows.map((row) => row.group))), [rows]);
  const patch = (index: number, patch: Partial<SettingRow>) => setRows((current) => current.map((row, i) => i === index ? { ...row, ...patch } : row));

  const updateValue = (index: number, value: string) => {
    const row = rows[index];
    if (isTranslated(row.value)) patch(index, { value: { ...row.value, [language]: value } });
    else patch(index, { value });
  };

  const addSetting = () => setRows((current) => [...current, { key: `custom.${Date.now()}`, group: 'custom', value: '', is_public: true }]);

  const save = async () => {
    setSaving(true); setMessage(''); setError('');
    try {
      const saved = await adminApi.saveSettings(rows);
      setRows(saved);
      setMessage('Settings saved');
    } catch (e) { setError(e instanceof Error ? e.message : 'Save failed'); }
    finally { setSaving(false); }
  };

  const uploadLogo = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setSaving(true); setError('');
    try {
      const media = await adminApi.uploadMedia(file);
      const index = rows.findIndex((row) => row.key === 'site.logo_url');
      if (index >= 0) patch(index, { value: media.url, group: 'site', is_public: true });
      else setRows((current) => [...current, { key: 'site.logo_url', group: 'site', value: media.url, is_public: true }]);
      setMessage('Logo uploaded. Click “Save settings” to publish it.');
    } catch (e) { setError(e instanceof Error ? e.message : 'Upload failed'); }
    finally { setSaving(false); event.target.value = ''; }
  };

  if (loading) return <div className="admin-loading admin-loading--inline"><div className="admin-spinner"/>Loading settings…</div>;

  return (
    <div>
      <div className="admin-page-head">
        <div><span className="admin-kicker">Global content</span><h1>Site settings</h1><p>Brand, contacts and global information used across the website.</p></div>
        <button className="admin-button admin-button--primary" onClick={save} disabled={saving}>{saving ? 'Saving…' : 'Save settings'}</button>
      </div>
      {message && <div className="admin-alert admin-alert--success">{message}</div>}
      {error && <div className="admin-alert admin-alert--error">{error}</div>}

      <section className="admin-panel brand-settings">
        <div><h2>Brand logo</h2><p>Upload a replacement logo. The public header will use it immediately after saving.</p></div>
        <label className="admin-button admin-button--ghost">Upload logo<input type="file" accept="image/*" onChange={uploadLogo} hidden /></label>
      </section>

      <div className="language-tabs language-tabs--settings">{languages.map((item) => <button key={item.code} className={language === item.code ? 'is-active' : ''} onClick={() => setLanguage(item.code)}>{item.label}</button>)}</div>

      {groups.map((group) => (
        <section className="admin-panel settings-group" key={group}>
          <div className="settings-group__head"><div><span className="admin-kicker">{group}</span><h2>{group.charAt(0).toUpperCase() + group.slice(1)}</h2></div></div>
          <div className="settings-list">
            {rows.map((row, index) => row.group === group ? (
              <div className="setting-row" key={`${row.key}-${index}`}>
                <div className="setting-row__meta"><input value={row.key} onChange={(e) => patch(index, { key: e.target.value })}/><small>{isTranslated(row.value) ? `Multilingual · editing ${language.toUpperCase()}` : 'Single value'}</small></div>
                <div className="setting-row__value"><input value={isTranslated(row.value) ? String(row.value[language] || '') : String(row.value ?? '')} onChange={(e) => updateValue(index, e.target.value)} /></div>
                <label className="admin-check"><input type="checkbox" checked={row.is_public} onChange={(e) => patch(index, { is_public: e.target.checked })}/><span>Public</span></label>
              </div>
            ) : null)}
          </div>
        </section>
      ))}

      <button className="add-section-card add-section-card--compact" onClick={addSetting}><span>+</span><strong>Add custom global setting</strong></button>
    </div>
  );
}
