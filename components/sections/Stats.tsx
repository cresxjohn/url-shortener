import { Card } from '@/components/ui/Card';
import { Zap, Heart, Star, Sparkles } from 'lucide-react';

const stats = [
  {
    value: '10M+',
    label: 'Magic Links Forged',
    description: 'Millions of magical links created by our wizards',
    icon: Zap,
    color: 'text-blue-400',
  },
  {
    value: '99.9%',
    label: 'Magical Uptime',
    description: 'Enchanted service you can count on',
    icon: Star,
    color: 'text-yellow-400',
  },
  {
    value: '150+',
    label: 'Magical Realms',
    description: 'Wizards from around the digital universe',
    icon: Sparkles,
    color: 'text-purple-400',
  },
  {
    value: '24/7',
    label: 'Wizard Council',
    description: 'Always here when you need magical assistance',
    icon: Heart,
    color: 'text-red-400',
  },
];

export function Stats() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-purple-600 py-20 text-white">
      {/* Magical background elements */}
      <div className="absolute inset-0">
        <div className="absolute left-10 top-10 animate-bounce">
          <Sparkles className="h-8 w-8 text-white/20" />
        </div>
        <div className="absolute right-20 top-20 animate-pulse">
          <Heart className="h-6 w-6 text-white/30" />
        </div>
        <div className="absolute bottom-20 left-20 animate-bounce delay-300">
          <Star className="h-5 w-5 text-white/25" />
        </div>
      </div>

      <div className="container relative mx-auto px-4">
        <div className="mx-auto mb-16 max-w-3xl text-center">
          <div className="mb-4 flex items-center justify-center space-x-2">
            <Star className="h-6 w-6 animate-pulse text-yellow-300" />
            <h2 className="text-3xl font-bold sm:text-4xl">
              Trusted by magical creators worldwide
            </h2>
            <Sparkles className="h-6 w-6 animate-bounce text-blue-300" />
          </div>
          <p className="text-lg opacity-90">
            Join thousands of digital wizards who trust DV4 Links with their
            magical link creation needs
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <Card
              key={index}
              className="border-white/20 bg-white/10 p-6 text-center text-white backdrop-blur-sm transition-all duration-300 hover:-translate-y-2 hover:scale-105 hover:bg-white/20"
            >
              <div className="mb-3 flex items-center justify-center">
                <stat.icon className={`h-8 w-8 ${stat.color}`} />
              </div>
              <div className="mb-2 text-4xl font-bold">{stat.value}</div>
              <div className="mb-1 text-xl font-semibold">{stat.label}</div>
              <p className="text-sm opacity-80">{stat.description}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
