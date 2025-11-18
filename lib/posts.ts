import { allPosts, allPages, Post, Page } from 'contentlayer/generated';

export function getAllPostsSorted(): Post[] {
  return [...allPosts].sort((a, b) => {
    const aDate = a.published_at ? new Date(a.published_at).getTime() : 0;
    const bDate = b.published_at ? new Date(b.published_at).getTime() : 0;
    return bDate - aDate;
  });
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
  return encodeURIComponent(tag.toLowerCase().replace(/\s+/g, '-'));
}

export function getAllTagsWithCount(): { tag: string; slug: string; count: number }[] {
  const map = new Map<string, number>();

  for (const post of allPosts) {
    if (!post.tags) continue;
    for (const tag of post.tags) {
      map.set(tag, (map.get(tag) ?? 0) + 1);
    }
  }

  return Array.from(map.entries())
    .map(([tag, count]) => ({ tag, slug: getTagSlug(tag), count }))
    .sort((a, b) => {
      if (b.count === a.count) return a.tag.localeCompare(b.tag);
      return b.count - a.count;
    });
}

export function getRelatedPosts(target: Post, limit = 3): Post[] {
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

  if (scored.length >= limit) {
    return scored;
  }

  const fallback = candidates.filter(
    (post) => !scored.some((existing) => existing._id === post._id)
  );

  return [...scored, ...fallback.slice(0, limit - scored.length)].slice(0, limit);
}
