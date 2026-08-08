import { getAllPostsSorted } from '@/lib/posts';
import { getSidebarData } from '@/lib/sidebar-data';
import { PostListWithControls } from '@/components/post-list-with-controls';
import { SidebarLayout } from '@/components/sidebar-layout';
import { SectionDivider } from '@/components/section-divider';
import { siteConfig } from '@/lib/config';
import { JsonLd } from '@/components/json-ld';

const posts = getAllPostsSorted();
const postCount = posts.length;
const { tags, aboutUrl, avatarSrc } = getSidebarData();

export const metadata = {
  title: '所有文章',
  description: `瀏覽所有文章，共 ${postCount} 篇。`,
  alternates: {
    canonical: `${siteConfig.url}/blog`
  }
};

export default function BlogIndexPage() {
  const blogSchema = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: '所有文章',
    description: `瀏覽所有文章，共 ${postCount} 篇。`,
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
      <SidebarLayout tags={tags} aboutUrl={aboutUrl} avatarSrc={avatarSrc}>
        <SectionDivider>
          <header className="space-y-1">
            <h1 className="type-title font-semibold text-slate-900 dark:text-slate-50">
              所有文章
            </h1>
            <p className="type-small text-slate-500 dark:text-slate-400">
              共 {postCount} 篇文章，依時間排序。
            </p>
          </header>
        </SectionDivider>
        <PostListWithControls posts={posts} />
      </SidebarLayout>
    </section>
  );
}
