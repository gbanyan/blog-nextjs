import type { Metadata } from 'next';
import { allPosts } from 'contentlayer/generated';
import { PostListWithControls } from '@/components/post-list-with-controls';
import { getTagSlug } from '@/lib/posts';

export function generateStaticParams() {
  const slugs = new Set<string>();
  for (const post of allPosts) {
    if (!post.tags) continue;
    for (const tag of post.tags) {
      slugs.add(getTagSlug(tag));
    }
  }
  return Array.from(slugs).map((slug) => ({
    tag: slug
  }));
}

interface Props {
  params: { tag: string };
}

export function generateMetadata({ params }: Props): Metadata {
  const slug = params.tag;
  // Find original tag label by slug
  const tag = allPosts
    .flatMap((post) => post.tags ?? [])
    .find((t) => getTagSlug(t) === slug);

  return {
    title: tag ? `標籤：${tag}` : '標籤'
  };
}

export default function TagPage({ params }: Props) {
  const slug = params.tag;

  const posts = allPosts.filter(
    (post) => post.tags && post.tags.some((t) => getTagSlug(t) === slug)
  );

  const tagLabel =
    posts[0]?.tags?.find((t) => getTagSlug(t) === slug) ?? params.tag;

  return (
    <section className="space-y-4">
      <h1 className="text-lg font-semibold text-slate-900 dark:text-slate-50">
        標籤：{tagLabel}
      </h1>
      <PostListWithControls posts={posts} />
    </section>
  );
}
