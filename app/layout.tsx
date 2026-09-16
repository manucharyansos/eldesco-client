import React from 'react';
import type { ReactNode } from 'react';
import './globals.css';

export const metadata = {
  title: 'ELDESCO - Energy Infrastructure & Engineering Solutions',
  description: 'Design and manufacturing of energy infrastructure and engineering systems',
  charset: 'utf-8',
  viewport: 'width=device-width, initial-scale=1',
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <link rel="icon" href="/favicon.ico" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Georgia:wght@400;700&display=swap" rel="stylesheet" />
      </head>
      <body className="bg-white text-primary-900">
        {children}
      </body>
    </html>
  );
}
