// Locale-aware blog post.
import { LocalizedLink } from '@/components/localized-link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { allPostsByLocale } from '@/lib/content';
import { getPostBySlug, getRelatedPosts, getPostNeighbors } from '@/lib/posts';
import { getTagSlug } from '@/lib/tags';
import { siteConfig } from '@/lib/config';
import { ReadingProgress } from '@/components/reading-progress';
import { ScrollReveal } from '@/components/scroll-reveal';
import { PostLayout } from '@/components/post-layout';
import { PostCard } from '@/components/post-card';
import { PostStorylineNav } from '@/components/post-storyline-nav';
import { SectionDivider } from '@/components/section-divider';
import { FooterCue } from '@/components/footer-cue';
import { JsonLd } from '@/components/json-ld';
import { MermaidRenderer } from '@/components/mermaid-renderer';
import { MarkdownBody } from '@/components/markdown-body';
import { GiscusComments } from '@/components/giscus-comments';
import { metadataForDocument } from '@/lib/seo';
import {
  absoluteUrl,
  documentPath,
  getDocumentLocale,
  isLocale,
  isPlaceholderDocument,
  localeToOpenGraph,
  type Locale,
} from '@/lib/locales';
import { getDictionary } from '@/lib/i18n/dictionaries';

export function generateStaticParams() {
  const params = allPostsByLocale.map((post) => ({
    locale: getDocumentLocale(post),
    slug: post.slug || post.flattenedPath,
  }));
  return params.length > 0 ? params : [{ locale: 'zh-TW', slug: '__placeholder__' }];
}

interface Props {
  params: Promise<{ locale: string; slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale: rawLocale, slug } = await params;
  if (!isLocale(rawLocale)) return { robots: { index: false, follow: false } };
  const locale: Locale = rawLocale;
  const dictionary = getDictionary(locale);
  const post = getPostBySlug(slug, locale);
  if (!post) return { robots: { index: false, follow: false } };

  const ogImageUrl = new URL('/api/og', process.env.NEXT_PUBLIC_SITE_URL || 'https://blog.gbanyan.net');
  ogImageUrl.searchParams.set('locale', locale);
  ogImageUrl.searchParams.set('title', post.title);
  if (post.description) {
    ogImageUrl.searchParams.set('description', post.description);
  }
  if (post.tags && post.tags.length > 0) {
    ogImageUrl.searchParams.set('tags', post.tags.slice(0, 3).join(','));
  }

  // Prefer post's feature_image for social cards; fall back to dynamic OG
  const imageUrl = post.feature_image
    ? `${siteConfig.url}${post.feature_image.replace('../assets', '/assets')}`
    : ogImageUrl.toString();

  const baseMetadata = metadataForDocument(post, allPostsByLocale);

  return {
    ...baseMetadata,
    authors: post.authors?.length ? post.authors.map(author => ({ name: author })) : [{ name: siteConfig.author }],
    robots: isPlaceholderDocument(post)
      ? { index: false, follow: true, googleBot: { index: false, follow: true } }
      : { index: true, follow: true, googleBot: { index: true, follow: true } },
    openGraph: {
      ...baseMetadata.openGraph,
      title: post.title,
      description: post.description || post.title,
      type: 'article',
      locale: localeToOpenGraph(getDocumentLocale(post)),
      publishedTime: post.published_at
        ? new Date(post.published_at).toISOString()
        : undefined,
      authors: post.authors?.length ? post.authors : [siteConfig.author],
      tags: post.tags,
      images: [
        {
          url: imageUrl,
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
      images: [imageUrl],
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { locale: rawLocale, slug } = await params;
  if (!isLocale(rawLocale)) return notFound();
  const locale: Locale = rawLocale;
  const dictionary = getDictionary(locale);
  const post = getPostBySlug(slug, locale);

  if (!post) return notFound();

  const relatedPosts = await getRelatedPosts(post, 3);
  const neighbors = await getPostNeighbors(post);

  const hasToc = /<h[23]/.test(post.body.html);
  const hasMermaid =
    /data-language="mermaid"|language-mermaid/.test(post.body.html);

  // Generate absolute URL for the post
  const postUrl = absoluteUrl(documentPath(post, locale));

  // Get the OG image URL (same as in metadata)
  const ogImageUrl = new URL('/api/og', siteConfig.url);
  ogImageUrl.searchParams.set('locale', locale);
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

  // Estimate word count and reading time
  const textContent = post.body?.raw || '';
  const wordCount = textContent.split(/\s+/).filter(Boolean).length;
  const readingTime = Math.ceil(wordCount / 200);

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
    ...(wordCount > 0 && {
      wordCount: wordCount,
      readingTime: `${readingTime} min read`,
    }),
    url: postUrl,
    inLanguage: getDocumentLocale(post),
  };

  // Speakable Schema for AEO
  const speakableSchema = {
    '@context': 'https://schema.org',
    '@type': 'SpeakableSpecification',
    speakable: {
      '@type': 'CSSSelector',
      selector: [
        'article[data-toc-content]',
        '.prose h2',
        '.prose h3',
        '.prose p',
      ],
    },
  };

  // BreadcrumbList Schema
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: dictionary.navigation.home,
        item: absoluteUrl(documentPath({ url: '/' }, locale)),
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: dictionary.common.allPosts,
        item: absoluteUrl(documentPath({ url: '/blog' }, locale)),
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
      <JsonLd data={speakableSchema} />
      <ReadingProgress />
      <PostLayout hasToc={hasToc} contentKey={slug} locale={locale}>
        <div className="space-y-8">
          {/* Main content area for Pagefind indexing */}
          <div data-pagefind-body>
            <SectionDivider>
              <ScrollReveal>
                <header className="mb-6 space-y-4 text-center">
                {post.published_at && (
                  <p className="type-small text-slate-500 dark:text-slate-400">
                    {new Date(post.published_at).toLocaleDateString(
                      getDocumentLocale(post)
                    )}
                  </p>
                )}
                <h1 className="type-display font-bold leading-tight text-slate-900 dark:text-slate-50">
                  {post.title}
                </h1>
                {post.tags && (
                  <div className="flex flex-wrap justify-center gap-2 pt-2" data-pagefind-meta="tags">
                    {post.tags.map((t) => (
                      <LocalizedLink
                        key={t}
                        href={`/tags/${encodeURIComponent(getTagSlug(t))}`}
                        className="tag-chip rounded-full bg-accent-soft px-3 py-1 text-sm text-accent-textLight dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700 dark:hover:text-white"
                      >
                        #{t}
                      </LocalizedLink>
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
                className="prose prose-lg prose-slate mx-auto max-w-none dark:prose-invert"
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
                <div>
                  <MarkdownBody html={post.body.html} />
                </div>
                {hasMermaid && <MermaidRenderer labels={dictionary.mermaid} />}
              </article>
            </ScrollReveal>
          </SectionDivider>
          </div>

          <FooterCue label={dictionary.common.footerCue} />

          {/* Exclude navigation and related posts from search indexing */}
          <div data-pagefind-ignore>
            <SectionDivider>
              <ScrollReveal>
                <PostStorylineNav
                  current={post}
                  newer={neighbors.newer}
                  older={neighbors.older}
                  labels={dictionary.common}
                />
              </ScrollReveal>
            </SectionDivider>

            {relatedPosts.length > 0 && (
              <SectionDivider>
                <ScrollReveal>
                  <section className="space-y-6 rounded-2xl border border-slate-200/60 bg-slate-50/50 p-8 dark:border-slate-800 dark:bg-slate-900/30">
                  <div className="flex items-center justify-between gap-2">
                    <h2 className="type-subtitle font-semibold text-slate-900 dark:text-slate-50">
                      {dictionary.common.relatedPosts}
                    </h2>
                    <p className="type-small text-slate-500 dark:text-slate-400">
                      {dictionary.common.relatedPostsDescription}
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

            <SectionDivider>
              <ScrollReveal>
                <GiscusComments locale={locale} />
              </ScrollReveal>
            </SectionDivider>
          </div>
        </div>
      </PostLayout>
    </>
  );
}
