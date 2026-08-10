import { siteConfig } from '@/lib/config';
import type { Locale } from '@/lib/locales';

/**
 * Shared social-card URL selection used by metadata and page renderers.
 * Prefers the document feature image; callers fall back to the dynamic
 * `/api/og` card. Extracted so `generateMetadata` and the page body can't
 * drift apart.
 */
export function socialImageUrl(featureImage?: string): string | null {
  if (!featureImage) return null;
  return `${siteConfig.url}${featureImage.replace('../assets', '/assets')}`;
}

/** Dynamic OG card URL for documents or section pages. */
export function ogCardUrl(opts: {
  locale: Locale;
  title: string;
  description?: string;
  tags?: string[];
}): string {
  const url = new URL('/api/og', siteConfig.url);
  url.searchParams.set('locale', opts.locale);
  url.searchParams.set('title', opts.title);
  if (opts.description) url.searchParams.set('description', opts.description);
  if (opts.tags?.length) url.searchParams.set('tags', opts.tags.slice(0, 3).join(','));
  return url.toString();
}
