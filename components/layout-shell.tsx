'use client';

import { SiteHeader } from './site-header';
import { SiteFooter } from './site-footer';
import dynamic from 'next/dynamic';

// Lazy load BackToTop since it's not critical for initial render
const BackToTop = dynamic(() => import('./back-to-top').then(mod => ({ default: mod.BackToTop })), {
  ssr: false,
});

export function LayoutShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1 container mx-auto px-4 py-6">
        {children}
      </main>
      <SiteFooter />
      <BackToTop />
    </div>
  );
}
