import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { allPosts } from 'contentlayer2/generated';
import { getPostBySlug, getRelatedPosts, getPostNeighbors } from '@/lib/posts';
import { siteConfig } from '@/lib/config';
import { ReadingProgress } from '@/components/reading-progress';
import { ScrollReveal } from '@/components/scroll-reveal';
import { PostLayout } from '@/components/post-layout';
import { PostCard } from '@/components/post-card';
import { PostStorylineNav } from '@/components/post-storyline-nav';
import { SectionDivider } from '@/components/section-divider';
import { FooterCue } from '@/components/footer-cue';
import { JsonLd } from '@/components/json-ld';

export function generateStaticParams() {
  const params = allPosts.map((post) => ({
    slug: post.slug || post.flattenedPath
  }));
  return params.length > 0 ? params : [{ slug: '__placeholder__' }];
}

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};

  const ogImageUrl = new URL('/api/og', process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000');
  ogImageUrl.searchParams.set('title', post.title);
  if (post.description) {
    ogImageUrl.searchParams.set('description', post.description);
  }
  if (post.tags && post.tags.length > 0) {
    ogImageUrl.searchParams.set('tags', post.tags.slice(0, 3).join(','));
  }

  return {
    title: post.title,
    description: post.description || post.title,
    openGraph: {
      title: post.title,
      description: post.description || post.title,
      type: 'article',
      publishedTime: post.published_at,
      authors: post.authors,
      tags: post.tags,
      images: [
        {
          url: ogImageUrl.toString(),
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.description || post.title,
      images: [ogImageUrl.toString()],
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) return notFound();

  const relatedPosts = getRelatedPosts(post, 3);
  const neighbors = getPostNeighbors(post);

  const hasToc = /<h[23]/.test(post.body.html);

  // Generate absolute URL for the post
  const postUrl = `${siteConfig.url}${post.url}`;

  // Get the OG image URL (same as in metadata)
  const ogImageUrl = new URL('/api/og', siteConfig.url);
  ogImageUrl.searchParams.set('title', post.title);
  if (post.description) {
    ogImageUrl.searchParams.set('description', post.description);
  }
  if (post.tags && post.tags.length > 0) {
    ogImageUrl.searchParams.set('tags', post.tags.slice(0, 3).join(','));
  }

  // Get image URL - prefer feature_image, fallback to OG image
  const imageUrl = post.feature_image
    ? `${siteConfig.url}${post.feature_image.replace('../assets', '/assets')}`
    : ogImageUrl.toString();

  // BlogPosting Schema
  const blogPostingSchema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.description || post.custom_excerpt || post.title,
    image: imageUrl,
    datePublished: post.published_at,
    dateModified: post.updated_at || post.published_at,
    author: {
      '@type': 'Person',
      name: post.authors?.[0] || siteConfig.author,
      url: siteConfig.url,
    },
    publisher: {
      '@type': 'Organization',
      name: siteConfig.name,
      logo: {
        '@type': 'ImageObject',
        url: `${siteConfig.url}${siteConfig.avatar}`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': postUrl,
    },
    ...(post.tags && post.tags.length > 0 && {
      keywords: post.tags.join(', '),
      articleSection: post.tags[0],
    }),
    inLanguage: siteConfig.defaultLocale,
    url: postUrl,
  };

  // BreadcrumbList Schema
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: '首頁',
        item: siteConfig.url,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: '所有文章',
        item: `${siteConfig.url}/blog`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: post.title,
        item: postUrl,
      },
    ],
  };

  return (
    <>
      <JsonLd data={blogPostingSchema} />
      <JsonLd data={breadcrumbSchema} />
      <ReadingProgress />
      <PostLayout hasToc={hasToc} contentKey={slug}>
        <div className="space-y-8">
          {/* Main content area for Pagefind indexing */}
          <div data-pagefind-body>
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
                  <div className="flex flex-wrap justify-center gap-2 pt-2" data-pagefind-meta="tags">
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
              <article
                data-toc-content={slug}
                className="prose prose-lg prose-slate mx-auto max-w-none dark:prose-dark"
              >
                {post.feature_image && (
                  <div className="-mx-4 mb-8 transition-all duration-500 sm:-mx-12 lg:-mx-20 group-[.toc-open]:lg:-mx-4">
                    <Image
                      src={post.feature_image.replace('../assets', '/assets')}
                      alt={post.title}
                      width={1200}
                      height={600}
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1200px"
                      priority
                      className="w-full rounded-xl shadow-lg"
                    />
                  </div>
                )}
                <div dangerouslySetInnerHTML={{ __html: post.body.html }} />
              </article>
            </ScrollReveal>
          </SectionDivider>
          </div>

          <FooterCue />

          {/* Exclude navigation and related posts from search indexing */}
          <div data-pagefind-ignore>
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
        </div>
      </PostLayout>
    </>
  );
}
