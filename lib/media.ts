import { API_ORIGIN } from './config';

/**
 * Turn a stored image path into a URL the browser can load:
 *  - absolute URLs and data: URIs are used as-is
 *  - /storage/... files are uploaded through the API and served by it
 *  - everything else (/images/...) is a static asset of this web client
 */
export function mediaUrl(path?: string | null): string {
  if (!path) return '';
  if (/^(https?:)?\/\//i.test(path) || path.startsWith('data:') || path.startsWith('blob:')) return path;
  if (path.startsWith('/storage/')) return `${API_ORIGIN}${path}`;
  return path;
}
