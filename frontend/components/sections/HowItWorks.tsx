import { Card } from '@/components/ui/Card';

const steps = [
  {
    step: '01',
    title: 'Enter Your URL',
    description: 'Paste your long URL into our shortening tool. Add a custom slug if you want.',
  },
  {
    step: '02',
    title: 'Get Short Link',
    description: 'Click "Shorten URL" and get your custom short link instantly.',
  },
  {
    step: '03',
    title: 'Share & Track',
    description: 'Share your short link anywhere and track clicks with detailed analytics.',
  },
];

export function HowItWorks() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl mb-4">
            How it works
          </h2>
          <p className="text-lg text-gray-600">
            Create short links in seconds with our simple 3-step process. 
            No registration required to get started.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {steps.map((step, index) => (
            <div key={index} className="text-center">
              <Card className="p-6 h-full">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary text-primary-foreground text-xl font-bold mb-4">
                  {step.step}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {step.title}
                </h3>
                <p className="text-gray-600">
                  {step.description}
                </p>
              </Card>
              
              {/* Arrow for desktop */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-1/2 right-0 transform translate-x-4 -translate-y-1/2">
                  <svg 
                    className="w-6 h-6 text-gray-400" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M9 5l7 7-7 7" 
                    />
                  </svg>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

