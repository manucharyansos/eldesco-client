import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'ELDESCO',
    template: '%s | ELDESCO',
  },
  description: 'Energy infrastructure and engineering systems',
  viewport: 'width=device-width, initial-scale=1',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="hy">
      <body>{children}</body>
    </html>
  );
}
