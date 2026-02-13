'use client';

import { useEffect } from 'react';

/**
 * Web Vitals monitoring component (optional)
 * 
 * To enable full Web Vitals tracking, install web-vitals package:
 * npm install web-vitals
 * 
 * Then uncomment the code below and import from 'web-vitals'
 */
export function WebVitals() {
  useEffect(() => {
    // Only track in production
    if (process.env.NODE_ENV !== 'production') return;

    // Basic performance monitoring using Performance API
    if (typeof window !== 'undefined' && 'performance' in window) {
      // Track page load time
      window.addEventListener('load', () => {
        const perfData = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
        if (perfData) {
          const loadTime = perfData.loadEventEnd - perfData.fetchStart;
          const domContentLoaded = perfData.domContentLoadedEventEnd - perfData.fetchStart;
          
          // Log metrics (can be sent to analytics service)
          if (process.env.NODE_ENV === 'development') {
            console.log('Performance Metrics:', {
              loadTime: Math.round(loadTime),
              domContentLoaded: Math.round(domContentLoaded),
              firstByte: Math.round(perfData.responseStart - perfData.fetchStart),
            });
          }
          
          // Example: Send to analytics service
          // if (typeof window !== 'undefined' && window.gtag) {
          //   window.gtag('event', 'page_load_time', {
          //     value: Math.round(loadTime),
          //     non_interaction: true,
          //   });
          // }
        }
      });
    }
  }, []);

  return null;
}
