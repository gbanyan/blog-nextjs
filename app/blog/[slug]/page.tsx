import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { allPosts } from 'contentlayer/generated';
import { getPostBySlug, getRelatedPosts } from '@/lib/posts';
import { siteConfig } from '@/lib/config';
import { ReadingProgress } from '@/components/reading-progress';
import { PostToc } from '@/components/post-toc';
import { ScrollReveal } from '@/components/scroll-reveal';
import { PostCard } from '@/components/post-card';

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

  const relatedPosts = getRelatedPosts(post, 3);

  return (
    <>
      <ReadingProgress />
      <div className="flex gap-6 pt-4">
        <aside className="hidden shrink-0 lg:block lg:w-44">
          <PostToc />
        </aside>
        <div className="flex-1 space-y-6">
          <ScrollReveal>
            <header className="mb-2 space-y-2">
              {post.published_at && (
                <p className="text-xs text-slate-500 dark:text-slate-500">
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
                    <Link
                      key={t}
                      href={`/tags/${encodeURIComponent(
                        t.toLowerCase().replace(/\s+/g, '-')
                      )}`}
                      className="rounded-full bg-accent-soft px-2 py-0.5 text-xs text-accent-textLight transition hover:bg-accent hover:text-white dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700"
                    >
                      #{t}
                    </Link>
                  ))}
                </div>
              )}
            </header>
          </ScrollReveal>

          <ScrollReveal>
            <article className="prose prose-lg prose-slate max-w-none dark:prose-dark">
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
          </ScrollReveal>

          {relatedPosts.length > 0 && (
            <ScrollReveal>
              <section className="space-y-4 rounded-xl border border-slate-200 bg-white/80 p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900/50">
                <div className="flex items-center justify-between gap-2">
                  <h2 className="text-base font-semibold text-slate-900 dark:text-slate-50">
                    相關文章
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    為你挑選相似主題
                  </p>
                </div>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {relatedPosts.map((related) => (
                    <PostCard key={related._id} post={related} />
                  ))}
                </div>
              </section>
            </ScrollReveal>
          )}
        </div>
      </div>
    </>
  );
}
