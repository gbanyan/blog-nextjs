import { SiteHeader } from './site-header';
import { SiteFooter } from './site-footer';
import { RightSidebar } from './right-sidebar';
import { BackToTop } from './back-to-top';

export function LayoutShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1 container mx-auto px-4 py-6">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,3fr)_minmax(0,1.4fr)]">
          <div>{children}</div>
          <RightSidebar />
        </div>
      </main>
      <SiteFooter />
      <BackToTop />
    </div>
  );
}
