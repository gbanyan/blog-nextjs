'use client';

import { usePathname } from 'next/navigation';
import { SiteHeader } from './site-header';
import { SiteFooter } from './site-footer';
import { RightSidebar } from './right-sidebar';
import { BackToTop } from './back-to-top';

export function LayoutShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isDetailPage =
    pathname.startsWith('/blog/') || pathname.startsWith('/pages/');

  const gridColsClass = isDetailPage
    ? 'lg:grid-cols-[minmax(0,3fr)_minmax(0,1.2fr)]'
    : 'lg:grid-cols-[minmax(0,2.6fr)_minmax(0,1.4fr)]';

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1 px-4 py-6">
        <div
          className={`mx-auto grid max-w-7xl gap-6 ${gridColsClass}`}
        >
          <div>{children}</div>
          <RightSidebar />
        </div>
      </main>
      <SiteFooter />
      <BackToTop />
    </div>
  );
}
