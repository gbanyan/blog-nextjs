// Locale-aware tag archive.
import type { Metadata } from 'next';
import { getPostsByLocale, allPostsByLocale } from '@/lib/content';
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
import { absoluteUrl, isLocale, localizedPath, type Locale } from '@/lib/locales';
import { notFound } from 'next/navigation';
import { getDictionary } from '@/lib/i18n/dictionaries';

export function generateStaticParams() {
  const params = new Set<string>();
  return allPostsByLocale.flatMap((post) =>
    (post.tags ?? []).map((tag) => {
      const key = `${post.locale}:${getTagSlug(tag)}`;
      if (params.has(key)) return null;
      params.add(key);
      return { locale: post.locale, tag: getTagSlug(tag) };
    })
  ).filter((param): param is { locale: 'zh-TW' | 'en'; tag: string } => param !== null);
}

interface Props {
  params: Promise<{ locale: string; tag: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale: rawLocale, tag: slug } = await params;
  if (!isLocale(rawLocale)) return { robots: { index: false, follow: false } };
  const locale: Locale = rawLocale;
  const dictionary = getDictionary(locale);
  const posts = getPostsByLocale(locale);
  const decodedSlug = decodeURIComponent(slug);
  const tag = posts
    .flatMap((post) => post.tags ?? [])
    .find((t) => getTagSlug(t) === decodedSlug);

  if (!tag) return { robots: { index: false, follow: false } };

  return metadataForPath({
    title: `${dictionary.tags.title}: ${tag}`,
    description: `${dictionary.tags.title}: ${tag}`,
    path: `/tags/${slug}`,
    locale,
  });
}

export default async function TagPage({ params }: Props) {
  const { locale: rawLocale, tag: slug } = await params;
  if (!isLocale(rawLocale)) return notFound();
  const locale: Locale = rawLocale;
  const dictionary = getDictionary(locale);
  const { tags, aboutUrl, avatarSrc } = getSidebarData(locale);
  const postsForLocale = getPostsByLocale(locale);
  const decodedSlug = decodeURIComponent(slug);

  const posts = postsForLocale.filter(
    (post) => post.tags && post.tags.some((t) => getTagSlug(t) === decodedSlug)
  );

  const tagLabel =
    posts[0]?.tags?.find((t) => getTagSlug(t) === decodedSlug) ?? decodedSlug;

  // CollectionPage schema
  const collectionPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: `${dictionary.tags.title}: ${tagLabel}`,
    description: `${dictionary.tags.title}: ${tagLabel}`,
    url: absoluteUrl(localizedPath(`/tags/${slug}`, locale)),
    inLanguage: locale,
    about: {
      '@type': 'Thing',
      name: tagLabel
    },
    mainEntity: {
      '@type': 'Blog',
      blogPost: posts.slice(0, 10).map((post) => ({
        '@type': 'BlogPosting',
        headline: post.title,
        url: absoluteUrl(localizedPath(post.url, locale)),
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
    <SidebarLayout tags={tags} aboutUrl={aboutUrl} avatarSrc={avatarSrc} locale={locale}>
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
              {dictionary.tags.count(posts.length)}
            </p>
          </div>
        </ScrollReveal>
      </SectionDivider>
      <PostListWithControls posts={posts} locale={locale} />
    </SidebarLayout>
  );
}
