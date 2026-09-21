'use client';

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { Locale } from '@/lib/config';
import type { SiteData } from '@/lib/cms-types';
import { makeUi } from '@/lib/defaults';
import { CMS_UPDATE_EVENT, CMS_UPDATE_KEY, fetchLiveJson } from '@/lib/live';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

type LiveSiteValue = { site: SiteData; refreshVersion: number };
const LiveSiteContext = createContext<LiveSiteValue | null>(null);

export function useLiveSite(): LiveSiteValue {
  const value = useContext(LiveSiteContext);
  if (!value) throw new Error('useLiveSite must be used inside LiveSiteShell');
  return value;
}

export function LiveSiteShell({ initialSite, locale, children }: { initialSite: SiteData; locale: Locale; children: ReactNode }) {
  const [site, setSite] = useState(initialSite);
  const [refreshVersion, setRefreshVersion] = useState(0);

  useEffect(() => {
    const refresh = () => setRefreshVersion((version) => version + 1);
    const refreshWhenVisible = () => {
      if (document.visibilityState === 'visible') refresh();
    };
    const refreshFromStorage = (event: StorageEvent) => {
      if (event.key === CMS_UPDATE_KEY) refresh();
    };

    window.addEventListener('focus', refresh);
    window.addEventListener('storage', refreshFromStorage);
    window.addEventListener(CMS_UPDATE_EVENT, refresh);
    document.addEventListener('visibilitychange', refreshWhenVisible);

    return () => {
      window.removeEventListener('focus', refresh);
      window.removeEventListener('storage', refreshFromStorage);
      window.removeEventListener(CMS_UPDATE_EVENT, refresh);
      document.removeEventListener('visibilitychange', refreshWhenVisible);
    };
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    void fetchLiveJson<SiteData>(`/site?lang=${locale}`, controller.signal)
      .then((nextSite) => {
        if (!nextSite || controller.signal.aborted) return;
        setSite((current) => ({
          settings: { ...current.settings, ...(nextSite.settings ?? {}) },
          navigation: {
            header: Array.isArray(nextSite.navigation?.header) ? nextSite.navigation.header : current.navigation.header,
            footer: Array.isArray(nextSite.navigation?.footer) ? nextSite.navigation.footer : current.navigation.footer,
          },
        }));
      })
      .catch(() => {
        // The statically rendered site remains usable during an API outage.
      });

    return () => controller.abort();
  }, [locale, refreshVersion]);

  const value = useMemo(() => ({ site, refreshVersion }), [site, refreshVersion]);
  const ui = makeUi(site.settings, locale);

  return (
    <LiveSiteContext.Provider value={value}>
      <a href="#content" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded focus:bg-white focus:px-4 focus:py-2 focus:font-bold focus:text-navy-800">
        {ui('skip_to_content')}
      </a>
      <Header site={site} locale={locale} />
      <main id="content" className="flex-1">{children}</main>
      <Footer site={site} locale={locale} />
    </LiveSiteContext.Provider>
  );
}
