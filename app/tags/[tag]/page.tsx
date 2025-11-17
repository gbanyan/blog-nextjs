import type { Metadata } from 'next';
import { allPosts } from 'contentlayer/generated';
import { PostListItem } from '@/components/post-list-item';

export function generateStaticParams() {
  const tags = new Set<string>();
  for (const post of allPosts) {
    if (!post.tags) continue;
    for (const tag of post.tags) {
      tags.add(tag);
    }
  }
  return Array.from(tags).map((tag) => ({
    tag
  }));
}

interface Props {
  params: { tag: string };
}

export function generateMetadata({ params }: Props): Metadata {
  const tag = params.tag;
  return {
    title: `標籤：${tag}`
  };
}

export default function TagPage({ params }: Props) {
  const tag = params.tag;

  const posts = allPosts.filter(
    (post) => post.tags && post.tags.includes(tag)
  );

  return (
    <section className="space-y-4">
      <h1 className="text-lg font-semibold text-slate-900 dark:text-slate-50">
        標籤：{tag}
      </h1>
      <ul className="space-y-3">
        {posts.map((post) => (
          <PostListItem key={post._id} post={post} />
        ))}
      </ul>
    </section>
  );
}

