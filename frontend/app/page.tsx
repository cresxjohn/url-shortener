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
  title: 'Free URL Shortener – Create Custom Short Links with Analytics | ShortURL',
  description: 'Free URL shortener with analytics. Create custom short links, track clicks, and manage your URLs with ease. 100% free, no hidden costs. Start shortening now!',
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
        <section className="bg-muted/50 py-4">
          <div className="container mx-auto px-4">
            <AdBanner 
              slot="homepage-top"
              className="max-w-4xl mx-auto"
              lazy
            />
          </div>
        </section>

        {/* Features Section */}
        <Features />

        {/* How It Works */}
        <HowItWorks />

        {/* Stats Section */}
        <Stats />

        {/* Donation Banner */}
        <section className="bg-gradient-to-r from-blue-50 to-indigo-50 py-8">
          <div className="container mx-auto px-4">
            <DonationBanner />
          </div>
        </section>

        {/* FAQ Section */}
        <FAQ />

        {/* Bottom Ad Banner */}
        <section className="bg-muted/30 py-6">
          <div className="container mx-auto px-4">
            <AdBanner 
              slot="homepage-bottom"
              className="max-w-3xl mx-auto"
              lazy
            />
          </div>
        </section>
      </main>

      <Footer />

      {/* Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebApplication',
            name: 'Free URL Shortener',
            description: 'Free URL shortener with analytics and custom short links',
            url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
            applicationCategory: 'WebApplication',
            operatingSystem: 'Any',
            offers: {
              '@type': 'Offer',
              price: '0',
              priceCurrency: 'USD',
            },
            featureList: [
              'Free URL shortening',
              'Custom short links',
              'Click analytics',
              'No registration required',
              'Bulk URL shortening',
              'API access',
            ],
            publisher: {
              '@type': 'Organization',
              name: 'URL Shortener',
            },
          }),
        }}
      />
    </div>
  );
}

