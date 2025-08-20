import { Metadata } from 'next';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import {
  LinkIcon,
  BarChart3,
  Shield,
  Zap,
  Globe,
  Smartphone,
  Cpu,
  Users,
  Download,
  Edit,
  Calendar,
  Link2,
  TrendingUp,
  Lock,
  CheckCircle,
} from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Features – Free URL Shortener with Analytics | ShortURL',
  description:
    'Discover all the powerful features of our free URL shortener: custom links, advanced analytics, bulk operations, API access, and more. 100% free forever.',
  alternates: {
    canonical: '/features',
  },
};

const features = [
  {
    icon: LinkIcon,
    title: 'Custom Short Links',
    description:
      'Create memorable, branded short links with custom slugs that represent your brand.',
    benefits: [
      'Custom domain support',
      'Branded short URLs',
      'Memorable slugs',
      'Professional appearance',
    ],
    color: 'text-blue-600',
    bgColor: 'bg-blue-100',
  },
  {
    icon: BarChart3,
    title: 'Advanced Analytics',
    description:
      'Get detailed insights into your link performance with comprehensive analytics.',
    benefits: [
      'Click tracking',
      'Geographic data',
      'Device & browser stats',
      'Referrer analysis',
    ],
    color: 'text-purple-600',
    bgColor: 'bg-purple-100',
  },
  {
    icon: Shield,
    title: 'Security & Safety',
    description:
      'Enterprise-grade security with malicious URL detection and spam protection.',
    benefits: [
      '99.9% uptime guarantee',
      'HTTPS encryption',
      'Malicious URL scanning',
      'Spam protection',
    ],
    color: 'text-green-600',
    bgColor: 'bg-green-100',
  },
  {
    icon: Zap,
    title: 'Lightning Fast',
    description:
      'Global CDN ensures your short links redirect quickly from anywhere in the world.',
    benefits: [
      'Global CDN network',
      'Sub-second redirects',
      'High availability',
      'Load balancing',
    ],
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-100',
  },
  {
    icon: Globe,
    title: 'Global Reach',
    description:
      'Servers worldwide with detailed geographic analytics and multi-language support.',
    benefits: [
      'Worldwide coverage',
      'Geographic insights',
      'Country-specific data',
      'International support',
    ],
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-100',
  },
  {
    icon: Smartphone,
    title: 'Mobile Optimized',
    description:
      'Perfect experience on desktop, tablet, and mobile devices with responsive design.',
    benefits: [
      'Mobile-first design',
      'Touch-friendly interface',
      'Cross-platform support',
      'Native app feel',
    ],
    color: 'text-pink-600',
    bgColor: 'bg-pink-100',
  },
];

const advancedFeatures = [
  {
    icon: Edit,
    title: 'Bulk Operations',
    description:
      'Create, edit, and manage multiple URLs at once with our bulk tools.',
  },
  {
    icon: Download,
    title: 'Export Data',
    description:
      'Export your analytics data in CSV or JSON format for further analysis.',
  },
  {
    icon: Calendar,
    title: 'Link Expiration',
    description:
      'Set expiration dates for your links with automatic deactivation.',
  },
  {
    icon: Link2,
    title: 'API Access',
    description:
      'Integrate with our RESTful API for programmatic URL shortening.',
  },
  {
    icon: Users,
    title: 'User Management',
    description: 'Secure user accounts with role-based access and permissions.',
  },
  {
    icon: TrendingUp,
    title: 'Real-time Stats',
    description: 'Monitor your link performance with real-time click tracking.',
  },
];

const comparisonFeatures = [
  'Unlimited URL shortening',
  'Custom short links',
  'Advanced analytics',
  'Mobile optimization',
  'API access',
  'Bulk operations',
  'Link expiration',
  'Geographic tracking',
  'Device analytics',
  'Referrer tracking',
  'Export capabilities',
  'Security scanning',
];

export default function FeaturesPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-20">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-4xl text-center">
              <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
                Powerful Features for
                <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  {' '}
                  Free URL Shortening
                </span>
              </h1>
              <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-gray-600">
                Discover all the tools and capabilities that make our platform
                the best choice for shortening, managing, and analyzing your
                URLs.
              </p>
              <div className="mt-8">
                <Link href="/signup">
                  <Button size="lg" className="mr-4">
                    Get Started Free
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button size="lg" variant="outline">
                    Contact Us
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Core Features */}
        <section className="bg-white py-20">
          <div className="container mx-auto px-4">
            <div className="mx-auto mb-16 max-w-3xl text-center">
              <h2 className="mb-4 text-3xl font-bold text-gray-900 sm:text-4xl">
                Core Features
              </h2>
              <p className="text-lg text-gray-600">
                Everything you need to create, manage, and track your short
                links effectively.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {features.map((feature, index) => (
                <Card
                  key={index}
                  className="p-6 transition-shadow hover:shadow-lg"
                >
                  <div
                    className={`inline-flex h-12 w-12 items-center justify-center rounded-lg ${feature.bgColor} mb-4`}
                  >
                    <feature.icon className={`h-6 w-6 ${feature.color}`} />
                  </div>
                  <h3 className="mb-3 text-xl font-semibold text-gray-900">
                    {feature.title}
                  </h3>
                  <p className="mb-4 text-gray-600">{feature.description}</p>
                  <ul className="space-y-2">
                    {feature.benefits.map((benefit, idx) => (
                      <li
                        key={idx}
                        className="flex items-center text-sm text-gray-600"
                      >
                        <CheckCircle className="mr-2 h-4 w-4 flex-shrink-0 text-green-500" />
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Advanced Features */}
        <section className="bg-gray-50 py-20">
          <div className="container mx-auto px-4">
            <div className="mx-auto mb-16 max-w-3xl text-center">
              <h2 className="mb-4 text-3xl font-bold text-gray-900 sm:text-4xl">
                Advanced Capabilities
              </h2>
              <p className="text-lg text-gray-600">
                Professional-grade features to supercharge your link management
                workflow.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {advancedFeatures.map((feature, index) => (
                <Card key={index} className="bg-white p-6">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                        <feature.icon className="h-5 w-5 text-primary" />
                      </div>
                    </div>
                    <div>
                      <h3 className="mb-2 text-lg font-semibold text-gray-900">
                        {feature.title}
                      </h3>
                      <p className="text-gray-600">{feature.description}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Comparison Table */}
        <section className="bg-white py-20">
          <div className="container mx-auto px-4">
            <div className="mx-auto mb-16 max-w-3xl text-center">
              <h2 className="mb-4 text-3xl font-bold text-gray-900 sm:text-4xl">
                100% Free Forever
              </h2>
              <p className="text-lg text-gray-600">
                No hidden costs, no premium tiers. All features are completely
                free.
              </p>
            </div>

            <div className="mx-auto max-w-2xl">
              <Card className="p-8">
                <div className="mb-8 text-center">
                  <h3 className="mb-2 text-2xl font-bold text-gray-900">
                    Free Plan
                  </h3>
                  <p className="text-gray-600">
                    All features included, no limits
                  </p>
                </div>

                <div className="space-y-4">
                  {comparisonFeatures.map((feature, index) => (
                    <div key={index} className="flex items-center">
                      <CheckCircle className="mr-3 h-5 w-5 flex-shrink-0 text-green-500" />
                      <span className="text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-8 text-center">
                  <Link href="/signup">
                    <Button size="lg" className="w-full">
                      Start Using for Free
                    </Button>
                  </Link>
                  <p className="mt-3 text-sm text-gray-500">
                    No credit card required • No setup fees • No monthly limits
                  </p>
                </div>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-primary py-20 text-primary-foreground">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="mb-4 text-3xl font-bold sm:text-4xl">
                Ready to get started?
              </h2>
              <p className="mb-8 text-lg opacity-90">
                Join thousands of users who trust our platform for their URL
                shortening needs.
              </p>
              <div className="flex flex-col justify-center gap-4 sm:flex-row">
                <Link href="/signup">
                  <Button
                    size="lg"
                    className="bg-white text-primary hover:bg-gray-100"
                  >
                    Create Free Account
                  </Button>
                </Link>
                <Link href="/">
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-white text-white hover:bg-white hover:text-primary"
                  >
                    Try Without Signing Up
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />

      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'SoftwareApplication',
            name: 'ShortURL - Free URL Shortener',
            description:
              'Free URL shortener with advanced analytics and custom short links',
            applicationCategory: 'WebApplication',
            operatingSystem: 'Any',
            offers: {
              '@type': 'Offer',
              price: '0',
              priceCurrency: 'USD',
            },
            featureList: comparisonFeatures,
          }),
        }}
      />
    </div>
  );
}
