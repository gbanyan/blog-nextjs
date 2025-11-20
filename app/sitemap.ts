import { MetadataRoute } from 'next';
import { allPosts, allPages } from 'contentlayer2/generated';

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

  // Homepage
  const homepage = {
    url: siteUrl,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: 1,
  };

  // Blog listing page
  const blogPage = {
    url: `${siteUrl}/blog`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: 0.9,
  };

  // Tags page
  const tagsPage = {
    url: `${siteUrl}/tags`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  };

  // All blog posts
  const posts = allPosts
    .filter((post) => post.status === 'published')
    .map((post) => ({
      url: `${siteUrl}${post.url}`,
      lastModified: new Date(post.updated_at || post.published_at || post.created_at || Date.now()),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }));

  // All pages
  const pages = allPages
    .filter((page) => page.status === 'published')
    .map((page) => ({
      url: `${siteUrl}${page.url}`,
      lastModified: new Date(page.updated_at || page.published_at || page.created_at || Date.now()),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    }));

  // All unique tags
  const allTags = Array.from(
    new Set(
      allPosts
        .filter((post) => post.status === 'published' && post.tags)
        .flatMap((post) => post.tags || [])
    )
  );

  const tagPages = allTags.map((tag) => ({
    url: `${siteUrl}/tags/${encodeURIComponent(tag.toLowerCase().replace(/\s+/g, '-'))}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.5,
  }));

  return [homepage, blogPage, tagsPage, ...posts, ...pages, ...tagPages];
}
