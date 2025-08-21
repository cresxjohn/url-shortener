'use client';

import { Heart, Coffee, Gift } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export function DonationBanner() {
  return (
    <Card className="p-6 bg-gradient-to-r from-pink-50 to-rose-50 border-pink-200">
      <div className="text-center max-w-2xl mx-auto">
        <div className="flex justify-center mb-4">
          <div className="flex items-center justify-center w-16 h-16 rounded-full bg-pink-100">
            <Heart className="w-8 h-8 text-pink-600" />
          </div>
        </div>
        
        <h3 className="text-2xl font-bold text-gray-900 mb-3">
          Support Our Free Service
        </h3>
        
        <p className="text-gray-600 mb-6">
          Help us keep this URL shortener free for everyone! Your donations help us 
          maintain servers, add new features, and keep the service running smoothly.
        </p>

        <div className="flex flex-wrap justify-center gap-4">
          {/* PayPal Donation */}
          <Button 
            asChild
            className="bg-blue-600 hover:bg-blue-700"
          >
            <a 
              href="https://paypal.me/yourpaypalhandle" 
              target="_blank" 
              rel="noopener noreferrer"
            >
              <Gift className="w-4 h-4 mr-2" />
              Donate via PayPal
            </a>
          </Button>

          {/* Buy Me a Coffee */}
          <Button 
            asChild
            variant="outline"
            className="border-yellow-400 text-yellow-700 hover:bg-yellow-50"
          >
            <a 
              href="https://buymeacoffee.com/yourusername" 
              target="_blank" 
              rel="noopener noreferrer"
            >
              <Coffee className="w-4 h-4 mr-2" />
              Buy Me a Coffee
            </a>
          </Button>

          {/* Ko-fi */}
          <Button 
            asChild
            variant="outline"
            className="border-teal-400 text-teal-700 hover:bg-teal-50"
          >
            <a 
              href="https://ko-fi.com/yourusername" 
              target="_blank" 
              rel="noopener noreferrer"
            >
              <Heart className="w-4 h-4 mr-2" />
              Support on Ko-fi
            </a>
          </Button>
        </div>

        <p className="text-sm text-gray-500 mt-4">
          Every contribution, no matter how small, helps us improve the service for everyone. Thank you! 💝
        </p>
      </div>
    </Card>
  );
}

