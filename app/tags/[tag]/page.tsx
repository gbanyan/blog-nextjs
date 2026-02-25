import type { Metadata } from 'next';
import { allPosts } from 'contentlayer2/generated';
import { PostListWithControls } from '@/components/post-list-with-controls';
import { getTagSlug } from '@/lib/posts';
import { siteConfig } from '@/lib/config';
import { SidebarLayout } from '@/components/sidebar-layout';
import { SectionDivider } from '@/components/section-divider';
import { ScrollReveal } from '@/components/scroll-reveal';
import { JsonLd } from '@/components/json-ld';
import { FiTag } from 'react-icons/fi';

export function generateStaticParams() {
  const slugs = new Set<string>();
  for (const post of allPosts) {
    if (!post.tags) continue;
    for (const tag of post.tags) {
      slugs.add(getTagSlug(tag));
    }
  }
  const params = Array.from(slugs).map((slug) => ({
    tag: slug
  }));
  return params.length > 0 ? params : [{ tag: '__placeholder__' }];
}

interface Props {
  params: Promise<{ tag: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { tag: slug } = await params;
  // Decode the slug since Next.js encodes non-ASCII characters in URLs
  const decodedSlug = decodeURIComponent(slug);
  // Find original tag label by slug
  const tag = allPosts
    .flatMap((post) => post.tags ?? [])
    .find((t) => getTagSlug(t) === decodedSlug);

  const postCount = allPosts.filter(
    (post) => post.tags && post.tags.some((t) => getTagSlug(t) === decodedSlug)
  ).length;

  const tagUrl = `${siteConfig.url}/tags/${slug}`;
  const title = tag ? `標籤：${tag}` : '標籤';
  const description = tag 
    ? `瀏覽「${tag}」標籤的 ${postCount} 篇文章`
    : '瀏覽所有標籤';

  return {
    title,
    description,
    alternates: {
      canonical: tagUrl,
    },
    openGraph: {
      title,
      description,
      url: tagUrl,
      type: 'website',
      siteName: siteConfig.title,
      locale: siteConfig.defaultLocale,
    },
    twitter: {
      card: 'summary',
      title,
      description,
    },
  };
}

export default async function TagPage({ params }: Props) {
  const { tag: slug } = await params;
  // Decode the slug since Next.js encodes non-ASCII characters in URLs
  const decodedSlug = decodeURIComponent(slug);

  const posts = allPosts.filter(
    (post) => post.tags && post.tags.some((t) => getTagSlug(t) === decodedSlug)
  );

  const tagLabel =
    posts[0]?.tags?.find((t) => getTagSlug(t) === decodedSlug) ?? decodedSlug;

  const tagUrl = `${siteConfig.url}/tags/${slug}`;

  // CollectionPage Schema for tag archive
  const collectionPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: `標籤：${tagLabel}`,
    description: `瀏覽「${tagLabel}」標籤的 ${posts.length} 篇文章`,
    url: tagUrl,
    inLanguage: siteConfig.defaultLocale,
    isPartOf: {
      '@type': 'WebSite',
      name: siteConfig.title,
      url: siteConfig.url,
    },
    about: {
      '@type': 'Thing',
      name: tagLabel,
    },
    numberOfItems: posts.length,
  };

  return (
    <>
      <JsonLd data={collectionPageSchema} />
      <SidebarLayout>
      <SectionDivider>
        <ScrollReveal>
          <div className="motion-card mb-8 rounded-2xl border border-white/40 bg-white/60 p-8 text-center shadow-lg backdrop-blur-md dark:border-white/10 dark:bg-slate-900/60">
            <div className="inline-flex items-center gap-2 text-accent">
              <FiTag className="h-5 w-5" />
              <span className="type-small uppercase tracking-[0.4em] text-slate-500 dark:text-slate-400">
                TAG ARCHIVE
              </span>
            </div>
            <h1 className="type-title mt-2 font-semibold text-slate-900 dark:text-slate-50">
              {tagLabel}
            </h1>
            <p className="type-small mt-2 text-slate-600 dark:text-slate-300">
              收錄 {posts.length} 篇文章
            </p>
          </div>
        </ScrollReveal>
      </SectionDivider>
      <PostListWithControls posts={posts} />
    </SidebarLayout>
    </>
  );
}
