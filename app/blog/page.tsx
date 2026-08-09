import { getAllPostsSorted } from '@/lib/posts';
import { getSidebarData } from '@/lib/sidebar-data';
import { PostListWithControls } from '@/components/post-list-with-controls';
import { SidebarLayout } from '@/components/sidebar-layout';
import { SectionDivider } from '@/components/section-divider';
import { siteConfig } from '@/lib/config';
import { JsonLd } from '@/components/json-ld';
import { metadataForPath } from '@/lib/seo';
import { DEFAULT_LOCALE } from '@/lib/locales';

export const metadata = metadataForPath({
  title: '所有文章',
  description: '瀏覽所有文章，持續更新中。',
  path: '/blog',
  locale: DEFAULT_LOCALE,
});

export default async function BlogIndexPage() {
  const posts = await getAllPostsSorted();
  const { tags, aboutUrl, avatarSrc } = getSidebarData();

  const blogSchema = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: '所有文章',
    description: '瀏覽所有文章，持續更新中。',
    url: `${siteConfig.url}/blog`,
    inLanguage: DEFAULT_LOCALE,
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
              瀏覽所有文章，持續更新中。
            </p>
          </header>
        </SectionDivider>
        <PostListWithControls posts={posts} />
      </SidebarLayout>
    </section>
  );
}
