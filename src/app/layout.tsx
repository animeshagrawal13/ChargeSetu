import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'ChargeSetu — Turning Every Household Socket into a Charging Point',
  description:
    'ChargeSetu connects EV riders with verified nearby charging sockets, making charging more accessible without building new charging stations everywhere.',
  applicationName: 'ChargeSetu',
  keywords: ['EV charging', 'two-wheeler', 'peer to peer', 'Indore', 'hyperlocal'],
};

export const viewport: Viewport = {
  themeColor: '#0B172A',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="min-h-dvh antialiased">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-navy focus:px-4 focus:py-2 focus:text-white"
        >
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}
