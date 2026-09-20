import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';
import '@fontsource-variable/manrope';
import '@fontsource-variable/noto-sans-armenian';
import '../globals.css';
import { AdminShell } from '@/components/admin/AdminShell';

export const metadata: Metadata = { title: 'ELDESCO CMS', robots: { index: false, follow: false } };
export const viewport: Viewport = { width: 'device-width', initialScale: 1 };

export default function AdminRootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="hy">
      <body className="bg-[#f4f6f8] text-slate-950"><AdminShell>{children}</AdminShell></body>
    </html>
  );
}
