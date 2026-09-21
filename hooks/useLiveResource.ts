'use client';

import { useEffect, useState } from 'react';
import { fetchLiveJson } from '@/lib/live';

type Selector<T> = (value: unknown) => T;

export function asArrayResponse<T>(value: unknown): T[] {
  return Array.isArray(value) ? (value as T[]) : [];
}

export function asPaginatedArrayResponse<T>(value: unknown): T[] {
  if (Array.isArray(value)) return value as T[];
  if (value && typeof value === 'object' && Array.isArray((value as { data?: unknown }).data)) {
    return (value as { data: T[] }).data;
  }
  return [];
}

/** Keeps the static-export payload for first paint, then replaces it with fresh API data. */
export function useLiveResource<T>(path: string, initialData: T, refreshVersion: number, select?: Selector<T>): T {
  const [data, setData] = useState<T>(initialData);

  useEffect(() => {
    const controller = new AbortController();

    void fetchLiveJson<unknown>(path, controller.signal)
      .then((value) => {
        if (controller.signal.aborted) return;
        setData(select ? select(value) : (value as T));
      })
      .catch(() => {
        // Keep the last usable payload when the API is temporarily unavailable.
      });

    return () => controller.abort();
  }, [path, refreshVersion, select]);

  return data;
}
