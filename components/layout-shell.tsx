import { SiteHeader } from './site-header';
import { SiteFooter } from './site-footer';
import { BackToTop } from './back-to-top';

/**
 * Server Component layout shell.
 *
 * BackToTop is a small client island — rendering it from here (instead of a
 * `'use client'` shell) keeps Contentlayer/state out of the shared layout bundle.
 */
export function LayoutShell({
  children,
  recentPosts = [],
}: {
  children: React.ReactNode;
  recentPosts?: { title: string; url: string }[];
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader recentPosts={recentPosts} />
      <main className="flex-1">{children}</main>
      <SiteFooter />
      <BackToTop />
    </div>
  );
}
