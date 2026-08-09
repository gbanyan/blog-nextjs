import type { MetadataRoute } from 'next';
import { DEFAULT_LOCALE } from '@/lib/locales';
import { siteConfig } from '@/lib/config';

export default function robots(): MetadataRoute.Robots {
  return localizedRobots(DEFAULT_LOCALE, '/sitemap.xml');
}

export function localizedRobots(
  locale: typeof DEFAULT_LOCALE | 'en',
  sitemapPath: string
): MetadataRoute.Robots {
  const siteUrl = siteConfig.url;

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/_next/', '/admin/'],
      },
      {
        userAgent: [
          'GPTBot',
          'ChatGPT-User',
          'Google-Extended',
          'Anthropic-ai',
          'ClaudeBot',
          'Claude-Web',
          'PerplexityBot',
          'Cohere-ai',
        ],
        allow: '/',
        disallow: ['/api/', '/_next/', '/admin/'],
      },
    ],
    sitemap: `${siteUrl}${sitemapPath}`,
    host: siteUrl,
  };
}
