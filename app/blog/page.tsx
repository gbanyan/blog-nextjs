import Link from 'next/link';
import { getAllPostsSorted } from '@/lib/posts';
import { PostListWithControls } from '@/components/post-list-with-controls';
import { TimelineWrapper } from '@/components/timeline-wrapper';
import { SidebarLayout } from '@/components/sidebar-layout';
import { SectionDivider } from '@/components/section-divider';
import { ScrollReveal } from '@/components/scroll-reveal';
import { FiTrendingUp } from 'react-icons/fi';
import { siteConfig } from '@/lib/config';
import { JsonLd } from '@/components/json-ld';

export const metadata = {
  title: '所有文章',
  description: '瀏覽所有文章，持續更新中。',
  alternates: {
    canonical: `${siteConfig.url}/blog`
  }
};

export default function BlogIndexPage() {
  const posts = getAllPostsSorted();

  // Blog schema
  const blogSchema = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: '所有文章',
    description: '瀏覽所有文章，持續更新中。',
    url: `${siteConfig.url}/blog`,
    inLanguage: siteConfig.defaultLocale,
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
  };

  return (
    <section className="space-y-4">
      <JsonLd data={blogSchema} />
      <SidebarLayout>
        <SectionDivider>
          <ScrollReveal>
            <header className="space-y-1">
              <h1 className="type-title font-semibold text-slate-900 dark:text-slate-50">
                所有文章
              </h1>
              <p className="type-small text-slate-500 dark:text-slate-400">
                繼續往下滑，慢慢逛逛。
              </p>
            </header>
          </ScrollReveal>
        </SectionDivider>
        <PostListWithControls posts={posts} />
      </SidebarLayout>
    </section>
  );
}
