// Locale-aware home page.
import { LocalizedLink } from '@/components/localized-link';
import { getAllPostsSorted } from '@/lib/posts';
import { siteConfig } from '@/lib/config';
import { PostListItem } from '@/components/post-list-item';
import { TimelineWrapper } from '@/components/timeline-wrapper';
import { SidebarLayout } from '@/components/sidebar-layout';
import { getSidebarData } from '@/lib/sidebar-data';
import { JsonLd } from '@/components/json-ld';
import { HeroSection } from '@/components/hero-section';
import { absoluteUrl, isLocale, localizedPath, type Locale } from '@/lib/locales';
import { metadataForPath } from '@/lib/seo';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getDictionary } from '@/lib/i18n/dictionaries';

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) return { robots: { index: false, follow: false } };
  const dictionary = getDictionary(rawLocale);
  return metadataForPath({
    title: `${siteConfig.name} — ${dictionary.common.latestPosts}`,
    description: dictionary.brand.description,
    path: '/',
    locale: rawLocale,
  });
}

export default async function HomePage({ params }: Props) {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) return notFound();
  const locale: Locale = rawLocale;
  const dictionary = getDictionary(locale);
  const { tags, aboutUrl, avatarSrc } = getSidebarData(locale);
  const posts = (await getAllPostsSorted(locale)).slice(0, siteConfig.postsPerPage);

  // CollectionPage Schema for homepage
  const collectionPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: `${siteConfig.name} — ${dictionary.common.latestPosts}`,
    description: dictionary.brand.description,
    url: absoluteUrl(localizedPath('/', locale)),
    inLanguage: locale,
    isPartOf: {
      '@type': 'WebSite',
      name: dictionary.brand.title,
      url: absoluteUrl(localizedPath('/', locale)),
    },
    about: {
      '@type': 'Blog',
      name: dictionary.brand.title,
      description: dictionary.brand.description,
    },
  };

  return (
    <>
      <JsonLd data={collectionPageSchema} />
      <section className="pb-4 sm:pb-8">
        <SidebarLayout
          tags={tags}
          aboutUrl={aboutUrl}
          avatarSrc={avatarSrc}
          locale={locale}
          variant="reading"
        >
          <div className="space-y-10 sm:space-y-12 lg:space-y-14">
            <h1 className="sr-only">
              {siteConfig.name} — {dictionary.common.latestPosts} — {dictionary.brand.tagline}
            </h1>
            <HeroSection
              title={`${siteConfig.name} — ${dictionary.common.latestPosts}`}
              tagline={dictionary.brand.tagline}
              ariaLabel={dictionary.terminal.ariaLabel(
                `${siteConfig.name} — ${dictionary.common.latestPosts}`,
                dictionary.brand.tagline
              )}
            />

            <section aria-labelledby="latest-posts-heading">
              <header className="mb-6 flex items-end justify-between gap-4 border-b border-slate-200/80 pb-3 dark:border-slate-800">
                <h2
                  id="latest-posts-heading"
                  className="text-xl font-semibold tracking-tight text-slate-900 dark:text-slate-100 sm:text-2xl"
                >
                  {dictionary.common.latestPosts}
                </h2>
                <LocalizedLink
                  href="/blog"
                  prefetch={true}
                  className="shrink-0 text-sm font-medium text-accent-textLight transition-colors hover:text-accent dark:text-accent-textDark dark:hover:text-accent"
                >
                  {dictionary.common.allPosts} →
                </LocalizedLink>
              </header>
              <TimelineWrapper>
                {posts.map((post, index) => (
                  <PostListItem
                    key={post._id}
                    post={post}
                    priority={index === 0}
                    variant="reading"
                  />
                ))}
              </TimelineWrapper>
            </section>
          </div>
        </SidebarLayout>
      </section>
    </>
  );
}
