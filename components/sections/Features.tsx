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
    title: 'Magical Link Creation',
    description:
      'Create memorable custom magic codes for your URLs or use our auto-generated enchanted spells.',
    color: 'text-blue-600',
    bgColor: 'bg-gradient-to-r from-blue-100 to-purple-100',
  },
  {
    icon: BarChart3,
    title: 'Enchanted Analytics',
    description:
      'Track magical clicks, mystical geographic data, enchanted referrers, devices, and more with detailed divination.',
    color: 'text-purple-600',
    bgColor: 'bg-gradient-to-r from-purple-100 to-pink-100',
  },
  {
    icon: Shield,
    title: 'Magically Protected',
    description:
      '99.9% magical uptime with dark magic protection, HTTPS enchantment barriers, and evil spell filtering.',
    color: 'text-green-600',
    bgColor: 'bg-gradient-to-r from-green-100 to-blue-100',
  },
  {
    icon: Rocket,
    title: 'Teleportation Speed',
    description:
      'Global magical portals ensure your enchanted links redirect instantly from anywhere in the digital realm.',
    color: 'text-yellow-600',
    bgColor: 'bg-gradient-to-r from-yellow-100 to-orange-100',
  },
  {
    icon: Globe,
    title: 'Universal Magic',
    description:
      'Magical towers worldwide ensure instant teleportation and detailed mystical geographic divination.',
    color: 'text-indigo-600',
    bgColor: 'bg-gradient-to-r from-indigo-100 to-purple-100',
  },
  {
    icon: Smartphone,
    title: 'Pocket-Sized Magic',
    description:
      'Responsive spellcasting design works perfectly on all enchanted devices - desktop, tablet, and mobile.',
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
              Everything you need to forge magical links
            </h2>
            <Sparkles className="h-6 w-6 animate-bounce text-purple-500" />
          </div>
          <p className="text-lg text-gray-600">
            Our free DV4 Links platform comes packed with powerful magical
            features to help you create, enchant, and track your magical links
            with supernatural effectiveness.
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
