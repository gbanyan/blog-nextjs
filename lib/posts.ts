import { allPages, allPosts } from '@/lib/content';
import type { Page, Post } from '@/lib/content';
import { DEFAULT_LOCALE, getDocumentLocale, type Locale } from '@/lib/locales';

/**
 * All posts sorted newest-first.
 *
 * Uses Next.js `"use cache"` (enabled via `cacheComponents`) so the derivation
 * is cached across renders/requests instead of relying on a brittle
 * module-level `_sortedCache` variable. This also lets the route be
 * statically prerendered under Partial Prerendering (PPR).
 */
export async function getAllPostsSorted(locale: Locale = DEFAULT_LOCALE): Promise<Post[]> {
  'use cache';
  return allPosts.filter((post) => getDocumentLocale(post) === locale).sort((a, b) => {
    const aDate = a.published_at ? new Date(a.published_at).getTime() : 0;
    const bDate = b.published_at ? new Date(b.published_at).getTime() : 0;
    return bDate - aDate;
  });
}

export function getPostBySlug(slug: string, locale: Locale = DEFAULT_LOCALE): Post | undefined {
  return allPosts.find(
    (post) =>
      getDocumentLocale(post) === locale &&
      (post.flattenedPath === slug ||
      post.slug === slug ||
      post._raw.flattenedPath === slug)
  );
}

export function getPageBySlug(slug: string, locale: Locale = DEFAULT_LOCALE): Page | undefined {
  return allPages.find(
    (page) =>
      getDocumentLocale(page) === locale &&
      (page.flattenedPath === slug ||
      page.slug === slug ||
      page._raw.flattenedPath === slug)
  );
}

/**
 * Posts related to `target` by shared tags, newest-first.
 * `"use cache"` replaces the previous module-level `_relatedCache`.
 */
export async function getRelatedPosts(target: Post, limit = 3): Promise<Post[]> {
  'use cache';
  const posts = await getAllPostsSorted(getDocumentLocale(target));

  const targetTags = new Set(target.tags?.map((tag) => tag.toLowerCase()) ?? []);
  const candidates = posts.filter((post) => post._id !== target._id);

  if (candidates.length === 0) return [];

  const scored = candidates
    .map((post) => {
      const sharedTags = (post.tags ?? []).reduce((acc, tag) => {
        return acc + (targetTags.has(tag.toLowerCase()) ? 1 : 0);
      }, 0);
      return { post, score: sharedTags };
    })
    .filter((entry) => entry.score > 0)
    .sort((a, b) => {
      if (b.score === a.score) {
        const aDate = a.post.published_at
          ? new Date(a.post.published_at).getTime()
          : 0;
        const bDate = b.post.published_at
          ? new Date(b.post.published_at).getTime()
          : 0;
        return bDate - aDate;
      }
      return b.score - a.score;
    })
    .slice(0, limit)
    .map((entry) => entry.post);

  let result: Post[];
  if (scored.length >= limit) {
    result = scored;
  } else {
    const fallback = candidates.filter(
      (post) => !scored.some((existing) => existing._id === post._id)
    );
    result = [...scored, ...fallback.slice(0, limit - scored.length)].slice(0, limit);
  }

  return result;
}

/**
 * Newer/older neighbors around `target` for prev/next navigation.
 * `"use cache"` replaces the previous module-level `_neighborsCache`.
 */
export async function getPostNeighbors(target: Post): Promise<{
  newer?: Post;
  older?: Post;
}> {
  'use cache';
  const posts = await getAllPostsSorted(getDocumentLocale(target));

  const index = posts.findIndex((post) => post._id === target._id);
  if (index === -1) return {};

  return {
    newer: index > 0 ? posts[index - 1] : undefined,
    older: index < posts.length - 1 ? posts[index + 1] : undefined
  };
}
