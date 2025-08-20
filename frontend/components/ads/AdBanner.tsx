'use client';

import { useEffect, useRef } from 'react';
import { useInView } from 'react-intersection-observer';
import { cn } from '@/lib/utils';

interface AdBannerProps {
  slot: string;
  className?: string;
  lazy?: boolean;
}

export function AdBanner({ slot, className, lazy = false }: AdBannerProps) {
  const adRef = useRef<HTMLDivElement>(null);
  const { ref: inViewRef, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  useEffect(() => {
    // Only load ads when in view (if lazy loading is enabled)
    if (lazy && !inView) return;

    // Google AdSense integration
    try {
      if (typeof window !== 'undefined' && (window as any).adsbygoogle) {
        ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
      }
    } catch (error) {
      console.error('AdSense error:', error);
    }
  }, [inView, lazy]);

  // Combine refs for intersection observer and ad container
  const setRefs = (node: HTMLDivElement) => {
    adRef.current = node;
    inViewRef(node);
  };

  return (
    <div
      ref={setRefs}
      className={cn(
        'flex items-center justify-center min-h-[100px] bg-gray-50 border border-gray-200 rounded-lg',
        className
      )}
    >
      {/* Google AdSense Ad Unit */}
      <ins
        className="adsbygoogle block"
        style={{ display: 'block' }}
        data-ad-client="ca-pub-XXXXXXXXXXXXXXXX" // Replace with your AdSense publisher ID
        data-ad-slot={slot}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
      
      {/* Fallback content for development/testing */}
      {process.env.NODE_ENV === 'development' && (
        <div className="text-center p-4">
          <p className="text-sm text-gray-500 mb-2">Ad Space ({slot})</p>
          <p className="text-xs text-gray-400">
            This is where ads will appear in production
          </p>
        </div>
      )}
    </div>
  );
}

