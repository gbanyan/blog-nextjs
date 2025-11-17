import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { allPosts } from 'contentlayer/generated';
import { getPostBySlug } from '@/lib/posts';
import { siteConfig } from '@/lib/config';

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
      {post.feature_image && (
        // feature_image is stored as "../assets/xyz", serve from "/assets/xyz"
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={post.feature_image.replace('../assets', '/assets')}
          alt={post.title}
          className="my-4 rounded"
        />
      )}
      {post.published_at && (
        <p className="text-xs text-gray-500">
          {new Date(post.published_at).toLocaleDateString(
            siteConfig.defaultLocale
          )}
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
