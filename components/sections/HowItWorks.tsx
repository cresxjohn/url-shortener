import { Card } from '@/components/ui/Card';
import { Sparkles, Star, Heart, Zap } from 'lucide-react';

const steps = [
  {
    step: '1',
    title: 'Paste your long URL',
    description:
      'Enter the link you want to shorten. Optionally choose a custom slug.',
    icon: Zap,
    color: 'text-blue-500',
    bgColor: 'bg-gradient-to-r from-blue-100 to-purple-100',
  },
  {
    step: '2',
    title: 'Create your short link',
    description:
      'Click Create. We generate a short link that’s ready to share.',
    icon: Star,
    color: 'text-purple-500',
    bgColor: 'bg-gradient-to-r from-purple-100 to-pink-100',
  },
  {
    step: '3',
    title: 'Share and track results',
    description:
      'Share your link anywhere and view clicks, countries, devices, and more in your dashboard.',
    icon: Heart,
    color: 'text-red-500',
    bgColor: 'bg-gradient-to-r from-red-100 to-pink-100',
  },
];

export function HowItWorks() {
  return (
    <section className="bg-gradient-to-br from-gray-50 to-blue-50 py-20">
      <div className="container mx-auto px-4">
        <div className="mx-auto mb-16 max-w-3xl text-center">
          <div className="mb-4 flex items-center justify-center space-x-2">
            <Sparkles className="h-6 w-6 animate-pulse text-blue-500" />
            <h2 className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-3xl font-bold text-transparent sm:text-4xl">
              How it works
            </h2>
            <Star className="h-6 w-6 animate-bounce text-yellow-500" />
          </div>
          <p className="text-lg text-gray-600">
            Shorten a link in seconds and see exactly how it performs.
          </p>
        </div>

        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 md:grid-cols-3">
          {steps.map((step, index) => (
            <div key={index} className="text-center">
              <Card className="h-full border-0 bg-white/80 p-6 shadow-xl backdrop-blur-sm transition-all duration-300 hover:-translate-y-2 hover:scale-105 hover:shadow-2xl">
                <div
                  className={`inline-flex h-16 w-16 items-center justify-center rounded-full ${step.bgColor} mb-4 text-2xl font-bold shadow-lg transition-transform duration-200 hover:scale-110`}
                >
                  <step.icon className={`h-8 w-8 ${step.color}`} />
                </div>
                <div className="mb-3 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-3xl font-bold text-transparent">
                  {step.step}
                </div>
                <h3 className="mb-3 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-xl font-semibold text-transparent">
                  {step.title}
                </h3>
                <p className="text-gray-600">{step.description}</p>
              </Card>

              {/* Arrow for desktop */}
              {index < steps.length - 1 && (
                <div className="mb-8 mt-8 hidden justify-center md:flex">
                  <div className="animate-pulse rounded-full bg-gradient-to-r from-blue-500 to-purple-500 p-2 text-white shadow-lg">
                    <Zap className="h-5 w-5" />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
