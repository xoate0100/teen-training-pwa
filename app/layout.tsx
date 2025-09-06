import type React from 'react';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Suspense } from 'react';
import './globals.css';
import { PWAProvider } from '@/components/pwa-provider';
import { UserProvider } from '@/lib/contexts/user-context';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'Teen Training Program',
  description: 'Athletic training program for young athletes',
  generator: 'v0.app',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Teen Training PWA',
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#3b82f6',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en' className={`${inter.variable} antialiased`}>
      <body>
        <PWAProvider>
          <UserProvider>
            <Suspense fallback={null}>{children}</Suspense>
          </UserProvider>
        </PWAProvider>
      </body>
    </html>
  );
}
