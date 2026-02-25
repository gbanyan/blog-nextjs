import { getAllPostsSorted } from '@/lib/posts';
import { siteConfig } from '@/lib/config';
import { PostListWithControls } from '@/components/post-list-with-controls';
import { TimelineWrapper } from '@/components/timeline-wrapper';
import { SidebarLayout } from '@/components/sidebar-layout';
import { JsonLd } from '@/components/json-ld';

export const metadata = {
  title: '所有文章',
  description: `瀏覽 ${siteConfig.name} 的所有技術文章與分享`,
  alternates: {
    canonical: `${siteConfig.url}/blog`,
  },
  openGraph: {
    title: '所有文章',
    description: `瀏覽 ${siteConfig.name} 的所有技術文章與分享`,
    type: 'website',
    url: `${siteConfig.url}/blog`,
  },
};

export default function BlogIndexPage() {
  const posts = getAllPostsSorted();

  // Blog CollectionPage Schema
  const blogSchema = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: `${siteConfig.name} 的部落格`,
    description: `瀏覽 ${siteConfig.name} 的所有技術文章與分享`,
    url: `${siteConfig.url}/blog`,
    inLanguage: siteConfig.defaultLocale,
    author: {
      '@type': 'Person',
      name: siteConfig.author,
      url: siteConfig.url,
    },
    blogPost: posts.slice(0, 10).map((post) => ({
      '@type': 'BlogPosting',
      headline: post.title,
      url: `${siteConfig.url}${post.url}`,
      datePublished: post.published_at,
      ...(post.description && { description: post.description }),
    })),
  };

  return (
    <>
      <JsonLd data={blogSchema} />
      <section className="space-y-4">
        <SidebarLayout>
          <header className="space-y-1">
            <h1 className="type-title font-semibold text-slate-900 dark:text-slate-50">
              所有文章
            </h1>
            <p className="type-small text-slate-500 dark:text-slate-400">
              繼續往下滑，慢慢逛逛。
            </p>
          </header>
          <PostListWithControls posts={posts} />
        </SidebarLayout>
      </section>
    </>
  );
}
