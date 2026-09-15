import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: { default: 'ElDesCo | Engineering Infrastructure', template: '%s | ElDesCo' },
  description: 'Energy infrastructure and engineering systems design and manufacturing in Armenia.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="hy"><body>{children}</body></html>;
}
