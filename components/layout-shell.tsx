import { SiteHeader } from './site-header';
import { SiteFooter } from './site-footer';
import { BackToTop } from './back-to-top';

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
