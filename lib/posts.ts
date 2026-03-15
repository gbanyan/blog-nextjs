import { allPosts, allPages, Post, Page } from 'contentlayer2/generated';

let _sortedCache: Post[] | null = null;
let _relatedCache: Map<string, Post[]> = new Map();
let _neighborsCache: Map<string, { newer?: Post; older?: Post }> = new Map();
let _tagsCache: { tag: string; slug: string; count: number }[] | null = null;

export function getAllPostsSorted(): Post[] {
  if (_sortedCache) return _sortedCache;
  _sortedCache = [...allPosts].sort((a, b) => {
    const aDate = a.published_at ? new Date(a.published_at).getTime() : 0;
    const bDate = b.published_at ? new Date(b.published_at).getTime() : 0;
    return bDate - aDate;
  });
  return _sortedCache;
}

export function getPostBySlug(slug: string): Post | undefined {
  return allPosts.find(
    (post) =>
      post.flattenedPath === slug ||
      post.slug === slug ||
      post._raw.flattenedPath === slug
  );
}

export function getPageBySlug(slug: string): Page | undefined {
  return allPages.find(
    (page) =>
      page.flattenedPath === slug ||
      page.slug === slug ||
      page._raw.flattenedPath === slug
  );
}

export function getTagSlug(tag: string): string {
  // Normalize spaces and convert to lowercase
  // Replace multiple spaces/dashes with single dash
  // Next.js will handle URL encoding automatically, so we don't encode here
  return tag
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

export function getAllTagsWithCount(): { tag: string; slug: string; count: number }[] {
  if (_tagsCache) return _tagsCache;

  const map = new Map<string, number>();
  for (const post of allPosts) {
    if (!post.tags) continue;
    for (const postTag of post.tags) {
      map.set(postTag, (map.get(postTag) ?? 0) + 1);
    }
  }

  _tagsCache = Array.from(map.entries())
    .map(([tag, count]) => ({ tag, slug: getTagSlug(tag), count }))
    .sort((a, b) => {
      if (b.count === a.count) return a.tag.localeCompare(b.tag);
      return b.count - a.count;
    });
  return _tagsCache;
}

export function getRelatedPosts(target: Post, limit = 3): Post[] {
  const cacheKey = `${target._id}-${limit}`;
  if (_relatedCache.has(cacheKey)) {
    return _relatedCache.get(cacheKey)!;
  }

  const targetTags = new Set(target.tags?.map((tag) => tag.toLowerCase()) ?? []);
  const candidates = getAllPostsSorted().filter((post) => post._id !== target._id);

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

  _relatedCache.set(cacheKey, result);
  return result;
}

export function getPostNeighbors(target: Post): {
  newer?: Post;
  older?: Post;
} {
  const cacheKey = target._id;
  if (_neighborsCache.has(cacheKey)) {
    return _neighborsCache.get(cacheKey)!;
  }

  const sorted = getAllPostsSorted();
  const index = sorted.findIndex((post) => post._id === target._id);

  if (index === -1) return {};

  const result = {
    newer: index > 0 ? sorted[index - 1] : undefined,
    older: index < sorted.length - 1 ? sorted[index + 1] : undefined
  };

  _neighborsCache.set(cacheKey, result);
  return result;
}
