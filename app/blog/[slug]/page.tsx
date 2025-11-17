import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { allPosts } from 'contentlayer/generated';
import { getPostBySlug } from '@/lib/posts';

export function generateStaticParams() {
  return allPosts.map((post) => ({
    slug: post.slug || post.flattenedPath
  }));
}

interface Props {
  params: { slug: string };
}

export function generateMetadata({ params }: Props): Metadata {
  const slug = params.slug;
  const post = getPostBySlug(slug);
  if (!post) return {};

  return {
    title: post.title,
    description: post.description || post.title
  };
}

export default function BlogPostPage({ params }: Props) {
  const slug = params.slug;
  const post = getPostBySlug(slug);

  if (!post) return notFound();

  return (
    <article className="prose dark:prose-invert max-w-none">
      <h1>{post.title}</h1>
      {post.published_at && (
        <p className="text-xs text-gray-500">
          {new Date(post.published_at).toLocaleDateString('zh-TW')}
        </p>
      )}
      {post.tags && (
        <p className="mt-1 text-xs">
          {post.tags.map((t) => (
            <span
              key={t}
              className="mr-1 rounded bg-gray-200 px-1 dark:bg-gray-800"
            >
              #{t}
            </span>
          ))}
        </p>
      )}
      <div dangerouslySetInnerHTML={{ __html: post.body.html }} />
    </article>
  );
}
