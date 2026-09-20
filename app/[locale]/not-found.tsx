import Link from 'next/link';
import { fallbackSite, makeUi } from '@/lib/defaults';

/** Rendered inside the locale layout; the locale is not available here, so the text comes from the Armenian default. */
export default function NotFound() {
  const ui = makeUi(fallbackSite('hy').settings, 'hy');
  return (
    <section className="section">
      <div className="container max-w-2xl">
        <p className="text-6xl font-extrabold text-rust-500">404</p>
        <h1 className="h-section mt-4">{ui('not_found_title')}</h1>
        <p className="lead mt-4">{ui('not_found_text')}</p>
        <Link href="/hy" className="btn btn-primary mt-8">{ui('go_home')}</Link>
      </div>
    </section>
  );
}
