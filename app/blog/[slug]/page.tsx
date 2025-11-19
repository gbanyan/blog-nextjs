import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { allPosts } from 'contentlayer/generated';
import { getPostBySlug, getRelatedPosts, getPostNeighbors } from '@/lib/posts';
import { siteConfig } from '@/lib/config';
import { ReadingProgress } from '@/components/reading-progress';
import { ScrollReveal } from '@/components/scroll-reveal';
import { PostLayout } from '@/components/post-layout';
import { PostCard } from '@/components/post-card';
import { PostStorylineNav } from '@/components/post-storyline-nav';
import { SectionDivider } from '@/components/section-divider';
import { FooterCue } from '@/components/footer-cue';

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
  const neighbors = getPostNeighbors(post);

  const hasToc = /<h[23]/.test(post.body.html);

  return (
    <>
      <ReadingProgress />
      <PostLayout hasToc={hasToc}>
        <div className="space-y-8">
          <SectionDivider>
            <ScrollReveal>
              <header className="mb-6 space-y-4 text-center">
                {post.published_at && (
                  <p className="type-small text-slate-500 dark:text-slate-500">
                    {new Date(post.published_at).toLocaleDateString(
                      siteConfig.defaultLocale
                    )}
                  </p>
                )}
                <h1 className="type-display font-bold leading-tight text-slate-900 dark:text-slate-50">
                  {post.title}
                </h1>
                {post.tags && (
                  <div className="flex flex-wrap justify-center gap-2 pt-2">
                    {post.tags.map((t) => (
                      <Link
                        key={t}
                        href={`/tags/${encodeURIComponent(
                          t.toLowerCase().replace(/\s+/g, '-')
                        )}`}
                        className="tag-chip rounded-full bg-accent-soft px-3 py-1 text-sm text-accent-textLight dark:bg-slate-800 dark:text-slate-100"
                      >
                        #{t}
                      </Link>
                    ))}
                  </div>
                )}
              </header>
            </ScrollReveal>
          </SectionDivider>

          <SectionDivider>
            <ScrollReveal>
              <article className="prose prose-lg prose-slate mx-auto max-w-none dark:prose-dark">
                {post.feature_image && (
                  <div className="-mx-4 mb-8 transition-all duration-500 sm:-mx-12 lg:-mx-20 group-[.toc-open]:lg:-mx-4">
                    <Image
                      src={post.feature_image.replace('../assets', '/assets')}
                      alt={post.title}
                      width={1200}
                      height={600}
                      className="w-full rounded-xl shadow-lg"
                    />
                  </div>
                )}
                <div dangerouslySetInnerHTML={{ __html: post.body.html }} />
              </article>
            </ScrollReveal>
          </SectionDivider>

          <FooterCue />

          <SectionDivider>
            <ScrollReveal>
              <PostStorylineNav
                current={post}
                newer={neighbors.newer}
                older={neighbors.older}
              />
            </ScrollReveal>
          </SectionDivider>

          {relatedPosts.length > 0 && (
            <SectionDivider>
              <ScrollReveal>
                <section className="space-y-6 rounded-2xl border border-slate-200/60 bg-slate-50/50 p-8 dark:border-slate-800 dark:bg-slate-900/30">
                  <div className="flex items-center justify-between gap-2">
                    <h2 className="type-subtitle font-semibold text-slate-900 dark:text-slate-50">
                      相關文章
                    </h2>
                    <p className="type-small text-slate-500 dark:text-slate-400">
                      為你挑選相似主題
                    </p>
                  </div>
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {relatedPosts.map((related) => (
                      <PostCard key={related._id} post={related} showTags={false} />
                    ))}
                  </div>
                </section>
              </ScrollReveal>
            </SectionDivider>
          )}
        </div>
      </PostLayout>
    </>
  );
}
