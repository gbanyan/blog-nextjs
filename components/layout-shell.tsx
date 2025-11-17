import { SiteHeader } from './site-header';
import { SiteFooter } from './site-footer';

export function LayoutShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      <main className="flex-1 container mx-auto px-4 py-6">{children}</main>
      <SiteFooter />
    </div>
  );
}

