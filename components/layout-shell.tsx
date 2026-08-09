import { SiteHeader } from './site-header';
import { SiteFooter } from './site-footer';
import { BackToTop } from './back-to-top';
import type { Locale } from '@/lib/i18n/config';

/**
 * Server Component layout shell.
 *
 * BackToTop is a small client island — rendering it from here (instead of a
 * `'use client'` shell) keeps content/state out of the shared layout bundle.
 */
export function LayoutShell({
  children,
  recentPosts = [],
  locale,
}: {
  children: React.ReactNode;
  recentPosts?: { title: string; url: string }[];
  locale: Locale;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader recentPosts={recentPosts} locale={locale} />
      <main className="container mx-auto flex-1 px-4 py-6">{children}</main>
      <SiteFooter />
      <BackToTop />
    </div>
  );
}
