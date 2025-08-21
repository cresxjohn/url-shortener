import { Metadata } from 'next';
import { Hero } from '@/components/sections/Hero';
import { Features } from '@/components/sections/Features';
import { HowItWorks } from '@/components/sections/HowItWorks';
import { Stats } from '@/components/sections/Stats';
import { FAQ } from '@/components/sections/FAQ';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { AdBanner } from '@/components/ads/AdBanner';
import { DonationBanner } from '@/components/donations/DonationBanner';

export const metadata: Metadata = {
  title: 'DV4 Links – Create Magic Links with Analytics | Free URL Shortener',
  description:
    'Transform your URLs into powerful magic links with DV4 Links. Free URL shortener with analytics, custom codes, and expiration settings. Create magic, track performance. 100% free!',
  alternates: {
    canonical: '/',
  },
};

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section with URL Shortener */}
        <Hero />

        {/* Non-intrusive Ad Banner */}
        {/* <section className="bg-muted/50 py-4">
          <div className="container mx-auto px-4">
            <AdBanner slot="homepage-top" className="mx-auto max-w-4xl" lazy />
          </div>
        </section> */}

        {/* Features Section */}
        <Features />

        {/* How It Works */}
        <HowItWorks />

        {/* Stats Section */}
        <Stats />

        {/* Donation Banner */}
        {/* <section className="bg-gradient-to-r from-blue-50 to-indigo-50 py-8">
          <div className="container mx-auto px-4">
            <DonationBanner />
          </div>
        </section> */}

        {/* FAQ Section */}
        <FAQ />

        {/* Bottom Ad Banner */}
        {/* <section className="bg-muted/30 py-6">
          <div className="container mx-auto px-4">
            <AdBanner
              slot="homepage-bottom"
              className="mx-auto max-w-3xl"
              lazy
            />
          </div>
        </section> */}
      </main>

      <Footer />

      {/* Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebApplication',
            name: 'DV4 Links',
            description:
              'Transform URLs into powerful magic links with analytics and custom codes',
            url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
            applicationCategory: 'WebApplication',
            operatingSystem: 'Any',
            offers: {
              '@type': 'Offer',
              price: '0',
              priceCurrency: 'USD',
            },
            featureList: [
              'Magic link creation',
              'Custom short codes',
              'Advanced analytics',
              'Expiration settings',
              'QR code generation',
              'Free forever',
            ],
            publisher: {
              '@type': 'Organization',
              name: 'DV4 Links',
            },
          }),
        }}
      />
    </div>
  );
}
