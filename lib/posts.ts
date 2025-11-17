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

