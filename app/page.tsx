import Link from 'next/link';
import { getAllPostsSorted } from '@/lib/posts';
import { siteConfig } from '@/lib/config';
import { PostListItem } from '@/components/post-list-item';
import { TimelineWrapper } from '@/components/timeline-wrapper';
import { SidebarLayout } from '@/components/sidebar-layout';
import { JsonLd } from '@/components/json-ld';
import { HeroSection } from '@/components/hero-section';

export default function HomePage() {
  const posts = getAllPostsSorted().slice(0, siteConfig.postsPerPage);

  // CollectionPage Schema for homepage
  const collectionPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: `${siteConfig.name} 的最新動態`,
    description: siteConfig.description,
    url: siteConfig.url,
    inLanguage: siteConfig.defaultLocale,
    isPartOf: {
      '@type': 'WebSite',
      name: siteConfig.title,
      url: siteConfig.url,
    },
    about: {
      '@type': 'Blog',
      name: siteConfig.title,
      description: siteConfig.description,
    },
  };

  return (
    <>
      <JsonLd data={collectionPageSchema} />
      <section className="space-y-6">
      <SidebarLayout>
        <h1 className="sr-only">
          {siteConfig.name} 的最新動態 — {siteConfig.tagline}
        </h1>
        <HeroSection
          title={`${siteConfig.name} 的最新動態`}
          tagline={siteConfig.tagline}
        />

        <div>
          <div className="mb-3 flex items-baseline justify-between">
            <h2 className="type-small font-semibold uppercase tracking-[0.4em] text-slate-500 dark:text-slate-400">
              最新文章
            </h2>
            <Link
              href="/blog"
              prefetch={true}
              className="text-xs text-blue-600 hover:underline dark:text-blue-400"
            >
              所有文章 →
            </Link>
          </div>
          <TimelineWrapper>
            {posts.map((post, index) => (
              <PostListItem key={post._id} post={post} priority={index === 0} />
            ))}
          </TimelineWrapper>
        </div>
      </SidebarLayout>
    </section>
    </>
  );
}
