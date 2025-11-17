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
