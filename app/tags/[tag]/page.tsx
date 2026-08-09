import type { Metadata } from 'next';
import { allPosts } from '@/lib/content';
import { PostListWithControls } from '@/components/post-list-with-controls';
import { getTagSlug } from '@/lib/tags';
import { SidebarLayout } from '@/components/sidebar-layout';
import { getSidebarData } from '@/lib/sidebar-data';
import { SectionDivider } from '@/components/section-divider';
import { ScrollReveal } from '@/components/scroll-reveal';
import { FiTag } from 'react-icons/fi';
import { siteConfig } from '@/lib/config';
import { JsonLd } from '@/components/json-ld';
import { metadataForPath } from '@/lib/seo';
import { DEFAULT_LOCALE, getDocumentLocale } from '@/lib/locales';

export function generateStaticParams() {
  const slugs = new Set<string>();
  for (const post of allPosts) {
    if (getDocumentLocale(post) !== DEFAULT_LOCALE) continue;
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
  const decodedSlug = decodeURIComponent(slug);
  const tag = allPosts
    .filter((post) => getDocumentLocale(post) === DEFAULT_LOCALE)
    .flatMap((post) => post.tags ?? [])
    .find((t) => getTagSlug(t) === decodedSlug);

  if (!tag) return { robots: { index: false, follow: false } };

  return metadataForPath({
    title: `標籤：${tag}`,
    description: `查看標籤為「${tag}」的所有文章`,
    path: `/tags/${slug}`,
    locale: DEFAULT_LOCALE,
  });
}

export default async function TagPage({ params }: Props) {
  const { tags, aboutUrl, avatarSrc } = getSidebarData();
  const { tag: slug } = await params;
  const decodedSlug = decodeURIComponent(slug);

  const posts = allPosts.filter(
    (post) => getDocumentLocale(post) === DEFAULT_LOCALE && post.tags && post.tags.some((t) => getTagSlug(t) === decodedSlug)
  );

  const tagLabel =
    posts[0]?.tags?.find((t) => getTagSlug(t) === decodedSlug) ?? decodedSlug;

  // CollectionPage schema
  const collectionPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: `標籤：${tagLabel}`,
    description: `查看標籤為「${tagLabel}」的所有文章`,
    url: `${siteConfig.url}/tags/${slug}`,
    inLanguage: DEFAULT_LOCALE,
    about: {
      '@type': 'Thing',
      name: tagLabel
    },
    mainEntity: {
      '@type': 'Blog',
      blogPost: posts.slice(0, 10).map((post) => ({
        '@type': 'BlogPosting',
        headline: post.title,
        url: `${siteConfig.url}${post.url}`,
        datePublished: post.published_at,
        dateModified: post.updated_at || post.published_at,
        author: {
          '@type': 'Person',
          name: siteConfig.author
        }
      }))
    }
  };

  return (
    <SidebarLayout tags={tags} aboutUrl={aboutUrl} avatarSrc={avatarSrc}>
      <JsonLd data={collectionPageSchema} />
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
  );
}
