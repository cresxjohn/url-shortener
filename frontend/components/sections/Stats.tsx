import { Card } from '@/components/ui/Card';

const stats = [
  {
    value: '10M+',
    label: 'URLs Shortened',
    description: 'Millions of URLs shortened by our users',
  },
  {
    value: '99.9%',
    label: 'Uptime',
    description: 'Reliable service you can count on',
  },
  {
    value: '150+',
    label: 'Countries',
    description: 'Users from around the world',
  },
  {
    value: '24/7',
    label: 'Support',
    description: 'Always here when you need help',
  },
];

export function Stats() {
  return (
    <section className="py-20 bg-primary text-primary-foreground">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl font-bold sm:text-4xl mb-4">
            Trusted by millions worldwide
          </h2>
          <p className="text-lg opacity-90">
            Join thousands of users who trust us with their link shortening needs
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <Card key={index} className="p-6 text-center bg-primary-foreground/10 border-primary-foreground/20">
              <div className="text-4xl font-bold mb-2">
                {stat.value}
              </div>
              <div className="text-xl font-semibold mb-1">
                {stat.label}
              </div>
              <p className="text-sm opacity-80">
                {stat.description}
              </p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

