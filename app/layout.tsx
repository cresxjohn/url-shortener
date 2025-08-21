import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from '@/components/providers/AuthProvider';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Free URL Shortener – Create Custom Short Links with Analytics',
  description:
    'Shorten, share, and manage your links with ease. 100% free URL shortener with analytics, custom slugs, and no hidden costs. Get started now!',
  keywords: [
    'url shortener',
    'free url shortener',
    'short links',
    'custom short links',
    'link analytics',
    'bitly alternative',
    'free link shortener',
    'url analytics',
  ],
  authors: [{ name: 'DV4 Links' }],
  creator: 'DV4 Links',
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
  ),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: '/',
    title: 'DV4 Links – Create Custom Short Links with Analytics',
    description:
      'Shorten, share, and manage your links with ease. 100% free URL shortener with analytics, custom slugs, and no hidden costs.',
    siteName: 'DV4 Links',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Free URL Shortener',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'DV4 Links – Create Custom Short Links with Analytics',
    description:
      'Shorten, share, and manage your links with ease. 100% free URL shortener with analytics, custom slugs, and no hidden costs.',
    images: ['/og-image.png'],
    creator: '@dv4links',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link
          rel="canonical"
          href={process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}
        />
        <link rel="icon" href="/favicon.ico" />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link rel="manifest" href="/site.webmanifest" />
      </head>
      <body className={inter.className}>
        <AuthProvider>
          <div className="min-h-screen bg-background">{children}</div>
        </AuthProvider>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: 'hsl(var(--card))',
              color: 'hsl(var(--card-foreground))',
              border: '1px solid hsl(var(--border))',
            },
          }}
        />
      </body>
    </html>
  );
}
