import type { MetadataRoute } from 'next';
import { localizedSitemapEntries } from '@/lib/seo';

/**
 * The legacy /sitemap.xml remains the complete sitemap. Each localized pair
 * carries its real zh-TW/en URLs in alternates.languages; unpaired documents
 * only expose their existing canonical URL.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  return localizedSitemapEntries();
}
