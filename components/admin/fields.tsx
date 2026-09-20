'use client';

import { createContext, useContext, useState } from 'react';
import type { FieldDef } from '@/lib/adminSchemas';
import { mediaUrl } from '@/lib/media';
import { MediaPicker } from './MediaPicker';

export type Lang = 'hy' | 'en' | 'ru';
export const LANGS: Lang[] = ['hy', 'en', 'ru'];
const LANG_BADGE: Record<Lang, string> = { hy: 'ՀԱՅ', en: 'ENG', ru: 'РУС' };

/** Which language inputs are visible: all three, or just one (handy when translating). */
export const LangFilterContext = createContext<'all' | Lang>('all');

export const inputCls = 'w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm outline-none transition placeholder:text-slate-400 focus:border-orange-400 focus:bg-white focus:ring-4 focus:ring-orange-100';

export const asLocalized = (value: unknown): Record<Lang, string> => {
  if (typeof value === 'string' || typeof value === 'number') return { hy: String(value), en: String(value), ru: String(value) };
  const v = (value ?? {}) as Partial<Record<Lang, unknown>>;
  return { hy: String(v.hy ?? ''), en: String(v.en ?? ''), ru: String(v.ru ?? '') };
};

const isObj = (v: unknown): v is Record<string, unknown> => !!v && typeof v === 'object' && !Array.isArray(v);

export function blankFor(def: { type: string; options?: Array<{ value: string }> }): unknown {
  switch (def.type) {
    case 'localized': case 'localized_textarea': return { hy: '', en: '', ru: '' };
    case 'list': return [];
    case 'toggle': return true;
    case 'select': return def.options?.[0]?.value ?? '';
    default: return '';
  }
}

function blankItem(def: Extract<FieldDef, { type: 'list' }>): unknown {
  if (def.fields) return Object.fromEntries(def.fields.map((f) => [f.key, blankFor(f as { type: string })]));
  if (def.of) return blankFor(def.of as { type: string });
  return '';
}

function FieldShell({ label, help, children }: { label: string; help?: string; children: React.ReactNode }) {
  return (
    <div>
      <span className="mb-1.5 block text-[13px] font-bold text-slate-700">{label}</span>
      {children}
      {help && <p className="mt-1.5 text-xs leading-5 text-slate-400">{help}</p>}
    </div>
  );
}

export function LocalizedInput({ value, onChange, multiline, placeholder }: { value: unknown; onChange: (v: Record<Lang, string>) => void; multiline?: boolean; placeholder?: string }) {
  const filter = useContext(LangFilterContext);
  const current = asLocalized(value);
  const langs = filter === 'all' ? LANGS : [filter];
  return (
    <div className="space-y-2">
      {langs.map((lang) => (
        <div key={lang} className="flex items-start gap-2">
          <span className="mt-2.5 w-9 shrink-0 rounded-md bg-slate-100 py-1 text-center text-[10px] font-black tracking-wide text-slate-500">{LANG_BADGE[lang]}</span>
          {multiline ? (
            <textarea lang={lang} rows={3} value={current[lang]} placeholder={placeholder} onChange={(e) => onChange({ ...current, [lang]: e.target.value })} className={`${inputCls} min-h-[5.5rem] resize-y leading-6`} />
          ) : (
            <input lang={lang} value={current[lang]} placeholder={placeholder} onChange={(e) => onChange({ ...current, [lang]: e.target.value })} className={inputCls} />
          )}
        </div>
      ))}
    </div>
  );
}

export function ImageInput({ value, onPick, onClear }: { value: string; onPick: (p: { path: string; w?: number; h?: number }) => void; onClear: () => void }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="flex flex-wrap items-center gap-4">
      <div className="flex h-24 w-36 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-dashed border-slate-300 bg-slate-100">
        {value
          // eslint-disable-next-line @next/next/no-img-element
          ? <img src={mediaUrl(value)} alt="" className="h-full w-full object-contain" />
          : <span className="px-2 text-center text-xs font-semibold text-slate-400">Նկար չկա</span>}
      </div>
      <div className="flex flex-col items-start gap-2">
        <button type="button" onClick={() => setOpen(true)} className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-800 transition hover:border-orange-300 hover:text-orange-600">{value ? 'Փոխել նկարը' : 'Ընտրել նկար'}</button>
        {value && <button type="button" onClick={onClear} className="text-xs font-bold text-red-500 hover:underline">Հեռացնել</button>}
      </div>
      <MediaPicker open={open} onClose={() => setOpen(false)} onPick={(p) => { setOpen(false); onPick(p); }} />
    </div>
  );
}

type RendererProps = { def: FieldDef; value: unknown; onChange: (v: unknown) => void; onPatch?: (patch: Record<string, unknown>) => void };

export function FieldRenderer({ def, value, onChange, onPatch }: RendererProps) {
  switch (def.type) {
    case 'text': case 'url':
      return <FieldShell label={def.label} help={def.help}><input value={String(value ?? '')} placeholder={def.placeholder} onChange={(e) => onChange(e.target.value)} className={inputCls} /></FieldShell>;
    case 'number':
      return <FieldShell label={def.label} help={def.help}><input type="number" value={value === '' || value == null ? '' : Number(value)} onChange={(e) => onChange(e.target.value === '' ? '' : Number(e.target.value))} className={inputCls} /></FieldShell>;
    case 'textarea':
      return <FieldShell label={def.label} help={def.help}><textarea rows={4} value={String(value ?? '')} onChange={(e) => onChange(e.target.value)} className={`${inputCls} resize-y leading-6`} /></FieldShell>;
    case 'localized':
      return <FieldShell label={def.label} help={def.help}><LocalizedInput value={value} onChange={onChange} placeholder={def.placeholder} /></FieldShell>;
    case 'localized_textarea':
      return <FieldShell label={def.label} help={def.help}><LocalizedInput value={value} onChange={onChange} multiline placeholder={def.placeholder} /></FieldShell>;
    case 'select':
      return (
        <FieldShell label={def.label} help={def.help}>
          <select value={String(value ?? def.options[0]?.value ?? '')} onChange={(e) => onChange(e.target.value)} className={inputCls}>
            {def.options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </FieldShell>
      );
    case 'toggle':
      return (
        <label className="flex cursor-pointer items-center gap-3 rounded-xl bg-slate-50 px-4 py-3">
          <input type="checkbox" checked={value !== false} onChange={(e) => onChange(e.target.checked)} className="h-4 w-4 accent-orange-500" />
          <span className="text-sm font-bold text-slate-700">{def.label}</span>
        </label>
      );
    case 'image':
      return (
        <FieldShell label={def.label} help={def.help}>
          <ImageInput
            value={String(value ?? '')}
            onClear={() => (def.dims && onPatch ? onPatch({ [def.key]: '', w: undefined, h: undefined }) : onChange(''))}
            onPick={({ path, w, h }) => (def.dims && onPatch ? onPatch({ [def.key]: path, w, h }) : onChange(path))}
          />
        </FieldShell>
      );
    case 'list':
      return <ListField def={def} value={value} onChange={onChange} />;
    default:
      return null;
  }
}

export function FieldsForm({ fields, value, onChange }: { fields: FieldDef[]; value: Record<string, unknown>; onChange: (next: Record<string, unknown>) => void }) {
  return (
    <div className="space-y-5">
      {fields.map((def) => (
        <FieldRenderer
          key={def.key}
          def={def}
          value={value?.[def.key]}
          onChange={(v) => onChange({ ...value, [def.key]: v })}
          onPatch={(patch) => onChange({ ...value, ...patch })}
        />
      ))}
    </div>
  );
}

const preview = (item: unknown, titleKey?: string): string => {
  const pick = (v: unknown): string => {
    if (typeof v === 'string' || typeof v === 'number') return String(v);
    if (isObj(v)) return v.hy || v.en || v.ru ? String(v.hy || v.en || v.ru) : '';
    return '';
  };
  if (isObj(item)) return (titleKey && pick(item[titleKey])) || Object.values(item).map(pick).find((x) => x && !x.startsWith('/')) || '';
  return pick(item);
};

const firstImage = (item: unknown): string => {
  if (!isObj(item)) return '';
  const hit = Object.entries(item).find(([k, v]) => typeof v === 'string' && v && (k === 'image' || k === 'logo'));
  return hit ? String(hit[1]) : '';
};

function ListField({ def, value, onChange }: { def: Extract<FieldDef, { type: 'list' }>; value: unknown; onChange: (v: unknown) => void }) {
  const items = Array.isArray(value) ? value : [];
  const [open, setOpen] = useState<Record<number, boolean>>({});
  const isOpen = (i: number) => open[i] ?? items.length <= 4;

  const set = (next: unknown[]) => onChange(next);
  const move = (i: number, d: number) => {
    const j = i + d;
    if (j < 0 || j >= items.length) return;
    const next = [...items];
    [next[i], next[j]] = [next[j], next[i]];
    set(next);
    setOpen({});
  };

  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <span className="text-[13px] font-bold text-slate-700">{def.label} <span className="font-semibold text-slate-400">({items.length})</span></span>
      </div>
      <div className="space-y-2.5">
        {items.map((item, i) => {
          const thumb = firstImage(item);
          const title = preview(item, def.titleKey);
          return (
            <div key={i} className="rounded-2xl border border-slate-200 bg-white">
              <div className="flex items-center gap-2 px-3 py-2">
                <button type="button" onClick={() => setOpen({ ...open, [i]: !isOpen(i) })} className="flex min-w-0 flex-1 items-center gap-3 text-left" aria-expanded={isOpen(i)}>
                  <span className={`text-xs text-slate-400 transition ${isOpen(i) ? 'rotate-90' : ''}`}>▶</span>
                  {thumb
                    // eslint-disable-next-line @next/next/no-img-element
                    ? <img src={mediaUrl(thumb)} alt="" className="h-9 w-12 shrink-0 rounded-md border border-slate-100 bg-slate-50 object-contain" />
                    : null}
                  <span className="min-w-0 flex-1 truncate text-sm font-bold text-slate-800">{title || `#${i + 1}`}</span>
                </button>
                <div className="flex shrink-0 gap-1">
                  <button type="button" onClick={() => move(i, -1)} disabled={i === 0} className="h-8 w-8 rounded-lg text-slate-500 hover:bg-slate-100 disabled:opacity-25" aria-label="Վերև">↑</button>
                  <button type="button" onClick={() => move(i, 1)} disabled={i === items.length - 1} className="h-8 w-8 rounded-lg text-slate-500 hover:bg-slate-100 disabled:opacity-25" aria-label="Ներքև">↓</button>
                  <button type="button" onClick={() => { if (confirm('Հեռացնե՞լ այս կետը։')) set(items.filter((_, k) => k !== i)); }} className="h-8 w-8 rounded-lg text-red-400 hover:bg-red-50 hover:text-red-600" aria-label="Հեռացնել">×</button>
                </div>
              </div>
              {isOpen(i) && (
                <div className="border-t border-slate-100 p-4">
                  {def.fields ? (
                    <FieldsForm fields={def.fields} value={isObj(item) ? item : {}} onChange={(next) => set(items.map((x, k) => (k === i ? next : x)))} />
                  ) : def.of ? (
                    <FieldRenderer def={{ ...(def.of as FieldDef), key: 'item', label: def.of.label ?? '' } as FieldDef} value={item} onChange={(v) => set(items.map((x, k) => (k === i ? v : x)))} />
                  ) : null}
                </div>
              )}
            </div>
          );
        })}
      </div>
      <button type="button" onClick={() => { set([...items, blankItem(def)]); setOpen({ ...open, [items.length]: true }); }} className="mt-3 rounded-xl border border-dashed border-slate-300 px-4 py-2.5 text-sm font-bold text-slate-600 transition hover:border-orange-400 hover:bg-orange-50 hover:text-orange-600">{def.addLabel ?? '+ Ավելացնել'}</button>
    </div>
  );
}

export function LanguageSwitch({ value, onChange }: { value: 'all' | Lang; onChange: (v: 'all' | Lang) => void }) {
  const options: Array<['all' | Lang, string]> = [['all', 'Բոլոր լեզուները'], ['hy', 'Հայերեն'], ['en', 'English'], ['ru', 'Русский']];
  return (
    <div className="inline-flex rounded-xl bg-slate-100 p-1" role="group" aria-label="Լեզու">
      {options.map(([v, label]) => (
        <button key={v} type="button" onClick={() => onChange(v)} className={`rounded-lg px-3 py-1.5 text-xs font-bold transition ${value === v ? 'bg-white text-slate-950 shadow-sm' : 'text-slate-500 hover:text-slate-900'}`}>{label}</button>
      ))}
    </div>
  );
}
