import {
  BarChart3,
  Zap,
  Shield,
  Globe,
  Smartphone,
  Sparkles,
  Heart,
  Star,
  Rocket,
} from 'lucide-react';
import { Card } from '@/components/ui/Card';

const features = [
  {
    icon: Zap,
    title: 'Create short links',
    description:
      'Turn any long URL into a short, shareable link. Use your own custom slug if you like.',
    color: 'text-blue-600',
    bgColor: 'bg-gradient-to-r from-blue-100 to-purple-100',
  },
  {
    icon: BarChart3,
    title: 'Built‑in analytics',
    description:
      'See clicks over time, top countries, devices, browsers, and referrers in your dashboard.',
    color: 'text-purple-600',
    bgColor: 'bg-gradient-to-r from-purple-100 to-pink-100',
  },
  {
    icon: Shield,
    title: 'Safe by default',
    description:
      'HTTPS everywhere, blacklist checks, and abuse protection keep your links and users safe.',
    color: 'text-green-600',
    bgColor: 'bg-gradient-to-r from-green-100 to-blue-100',
  },
  {
    icon: Rocket,
    title: 'Fast redirects',
    description:
      'Snappy performance and reliable uptime so your links work the moment they’re clicked.',
    color: 'text-yellow-600',
    bgColor: 'bg-gradient-to-r from-yellow-100 to-orange-100',
  },
  {
    icon: Globe,
    title: 'Works everywhere',
    description:
      'Share links on social, email, and SMS. Your short links open on any device and browser.',
    color: 'text-indigo-600',
    bgColor: 'bg-gradient-to-r from-indigo-100 to-purple-100',
  },
  {
    icon: Smartphone,
    title: 'Mobile‑friendly',
    description:
      'Create and manage links from your phone or desktop with a clean, responsive UI.',
    color: 'text-pink-600',
    bgColor: 'bg-gradient-to-r from-pink-100 to-red-100',
  },
];

export function Features() {
  return (
    <section id="features-section" className="bg-white py-20">
      <div className="container mx-auto px-4">
        <div className="mx-auto mb-16 max-w-3xl text-center">
          <div className="mb-4 flex items-center justify-center space-x-2">
            <Star className="h-6 w-6 animate-pulse text-yellow-500" />
            <h2 className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-3xl font-bold text-transparent sm:text-4xl">
              Everything you need to shorten and track links
            </h2>
            <Sparkles className="h-6 w-6 animate-bounce text-purple-500" />
          </div>
          <p className="text-lg text-gray-600">
            DV4 Links makes it simple to create short links and understand how
            they perform.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="border-0 bg-white/80 p-6 shadow-xl backdrop-blur-sm transition-all duration-300 hover:-translate-y-2 hover:scale-105 hover:shadow-2xl"
            >
              <div
                className={`inline-flex h-14 w-14 items-center justify-center rounded-xl ${feature.bgColor} mb-4 shadow-lg transition-transform duration-200 hover:scale-110`}
              >
                <feature.icon className={`h-7 w-7 ${feature.color}`} />
              </div>
              <h3 className="mb-3 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-xl font-semibold text-transparent">
                {feature.title}
              </h3>
              <p className="text-gray-600">{feature.description}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
