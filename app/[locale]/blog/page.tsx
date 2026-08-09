// Locale-aware blog index.
import { getAllPostsSorted } from '@/lib/posts';
import { getSidebarData } from '@/lib/sidebar-data';
import { PostListWithControls } from '@/components/post-list-with-controls';
import { SidebarLayout } from '@/components/sidebar-layout';
import { SectionDivider } from '@/components/section-divider';
import { siteConfig } from '@/lib/config';
import { JsonLd } from '@/components/json-ld';
import { metadataForPath } from '@/lib/seo';
import { absoluteUrl, isLocale, localizedPath, type Locale } from '@/lib/locales';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getDictionary } from '@/lib/i18n/dictionaries';

interface Props {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ search?: string | string[] }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) return { robots: { index: false, follow: false } };
  const dictionary = getDictionary(rawLocale);
  return metadataForPath({
    title: dictionary.common.allPosts,
    description: dictionary.common.allPostsDescription,
    path: '/blog',
    locale: rawLocale,
  });
}

export default async function BlogIndexPage({ params, searchParams }: Props) {
  const { locale: rawLocale } = await params;
  const { search } = await searchParams;
  if (!isLocale(rawLocale)) return notFound();
  const locale: Locale = rawLocale;
  const dictionary = getDictionary(locale);
  const posts = await getAllPostsSorted(locale);
  const { tags, aboutUrl, avatarSrc } = getSidebarData(locale);

  const blogSchema = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: dictionary.common.allPosts,
    description: dictionary.common.allPostsDescription,
    url: absoluteUrl(localizedPath('/blog', locale)),
    inLanguage: locale,
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
  };

  return (
    <section className="space-y-4">
      <JsonLd data={blogSchema} />
      <SidebarLayout tags={tags} aboutUrl={aboutUrl} avatarSrc={avatarSrc} locale={locale}>
        <SectionDivider>
          <header className="space-y-1">
            <h1 className="type-title font-semibold text-slate-900 dark:text-slate-50">
              {dictionary.common.allPosts}
            </h1>
            <p className="type-small text-slate-500 dark:text-slate-400">
              {dictionary.common.allPostsDescription}
            </p>
          </header>
        </SectionDivider>
        <PostListWithControls
          posts={posts}
          locale={locale}
          initialSearch={Array.isArray(search) ? search[0] ?? '' : search ?? ''}
        />
      </SidebarLayout>
    </section>
  );
}
