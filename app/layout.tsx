import type React from 'react';
import type { Metadata } from 'next';
import { GeistSans, GeistMono } from 'geist/font';
import { Suspense } from 'react';
import './globals.css';
import { PWAProvider } from '@/components/pwa-provider';

const geistSans = GeistSans({
  subsets: ['latin'],
  variable: '--font-geist-sans',
});

const geistMono = GeistMono({
  subsets: ['latin'],
  variable: '--font-geist-mono',
});

export const metadata: Metadata = {
  title: 'Teen Training Program',
  description: 'Athletic training program for young athletes',
  generator: 'v0.app',
  manifest: '/manifest.json',
  themeColor: '#3b82f6',
  viewport:
    'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Teen Training PWA',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang='en'
      className={`${geistSans.variable} ${geistMono.variable} antialiased`}
    >
      <body>
        <PWAProvider>
          <Suspense fallback={null}>{children}</Suspense>
        </PWAProvider>
      </body>
    </html>
  );
}
