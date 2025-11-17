import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { allPosts } from 'contentlayer/generated';
import { getPostBySlug } from '@/lib/posts';
import { siteConfig } from '@/lib/config';
import { ReadingProgress } from '@/components/reading-progress';
import { PostToc } from '@/components/post-toc';

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
    <>
      <ReadingProgress />
      <div className="mx-auto flex max-w-5xl gap-8 pt-4">
        <aside className="hidden w-56 shrink-0 lg:block">
          <PostToc />
        </aside>
        <div className="flex-1">
          <header className="mb-6 space-y-2">
            {post.published_at && (
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {new Date(post.published_at).toLocaleDateString(
                  siteConfig.defaultLocale
                )}
              </p>
            )}
            <h1 className="text-2xl font-bold leading-tight text-slate-900 sm:text-3xl dark:text-slate-50">
              {post.title}
            </h1>
            {post.tags && (
              <div className="flex flex-wrap gap-2 pt-1">
                {post.tags.map((t) => (
                  <span
                    key={t}
                    className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-700 dark:bg-slate-800 dark:text-slate-200"
                  >
                    #{t}
                  </span>
                ))}
              </div>
            )}
          </header>
          <article className="prose prose-slate max-w-none dark:prose-dark">
            {post.feature_image && (
              // feature_image is stored as "../assets/xyz", serve from "/assets/xyz"
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={post.feature_image.replace('../assets', '/assets')}
                alt={post.title}
                className="my-4 rounded"
              />
            )}
            <div dangerouslySetInnerHTML={{ __html: post.body.html }} />
          </article>
        </div>
      </div>
    </>
  );
}
