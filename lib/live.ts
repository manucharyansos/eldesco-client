import { API_URL } from './config';

export const CMS_UPDATE_KEY = 'eldesco:cms-update:v1';
export const CMS_UPDATE_EVENT = 'eldesco:cms-update';

/** Notify public pages in this tab and other open tabs after a successful admin write. */
export function announceCmsUpdate() {
  if (typeof window === 'undefined') return;

  try {
    window.localStorage.setItem(CMS_UPDATE_KEY, String(Date.now()));
  } catch {
    // Storage can be disabled; the same-tab event still refreshes the page.
  }

  window.dispatchEvent(new Event(CMS_UPDATE_EVENT));
}

/** Browser-only public API read which always bypasses browser/proxy caches. */
export async function fetchLiveJson<T>(path: string, signal?: AbortSignal): Promise<T | null> {
  const separator = path.includes('?') ? '&' : '?';
  const response = await fetch(`${API_URL}${path}${separator}_cms=${Date.now()}`, {
    cache: 'no-store',
    headers: { Accept: 'application/json' },
    signal,
  });

  if (response.status === 404) return null;
  if (!response.ok) throw new Error(`CMS request failed with HTTP ${response.status}`);
  return (await response.json()) as T;
}
