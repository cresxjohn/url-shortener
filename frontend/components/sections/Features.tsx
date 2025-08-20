import { BarChart3, LinkIcon, Shield, Zap, Globe, Smartphone } from 'lucide-react';
import { Card } from '@/components/ui/Card';

const features = [
  {
    icon: LinkIcon,
    title: 'Custom Short Links',
    description: 'Create memorable custom slugs for your URLs or use our auto-generated short codes.',
    color: 'text-blue-600',
    bgColor: 'bg-blue-100',
  },
  {
    icon: BarChart3,
    title: 'Advanced Analytics',
    description: 'Track clicks, geographic data, referrers, devices, and more with detailed analytics.',
    color: 'text-purple-600',
    bgColor: 'bg-purple-100',
  },
  {
    icon: Shield,
    title: 'Safe & Secure',
    description: '99.9% uptime with malicious URL protection, HTTPS encryption, and spam filtering.',
    color: 'text-green-600',
    bgColor: 'bg-green-100',
  },
  {
    icon: Zap,
    title: 'Lightning Fast',
    description: 'Global CDN ensures your short links redirect quickly from anywhere in the world.',
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-100',
  },
  {
    icon: Globe,
    title: 'Global Reach',
    description: 'Servers worldwide ensure fast redirects and detailed geographic analytics.',
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-100',
  },
  {
    icon: Smartphone,
    title: 'Mobile Optimized',
    description: 'Responsive design works perfectly on desktop, tablet, and mobile devices.',
    color: 'text-pink-600',
    bgColor: 'bg-pink-100',
  },
];

export function Features() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl mb-4">
            Everything you need to manage your links
          </h2>
          <p className="text-lg text-gray-600">
            Our free URL shortener comes packed with powerful features to help you 
            create, manage, and track your short links effectively.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
              <div className={`inline-flex items-center justify-center w-12 h-12 rounded-lg ${feature.bgColor} mb-4`}>
                <feature.icon className={`w-6 h-6 ${feature.color}`} />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-600">
                {feature.description}
              </p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

