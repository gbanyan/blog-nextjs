import Link from 'next/link';
import { getAllPostsSorted } from '@/lib/posts';
import { siteConfig } from '@/lib/config';
import { PostListItem } from '@/components/post-list-item';
import { TimelineWrapper } from '@/components/timeline-wrapper';
import { SidebarLayout } from '@/components/sidebar-layout';

export default function HomePage() {
  const posts = getAllPostsSorted().slice(0, siteConfig.postsPerPage);

  return (
    <section className="space-y-6">
      <SidebarLayout>
        <header className="space-y-1 text-center">
          <h1 className="type-title font-bold text-slate-900 dark:text-slate-50">
            {siteConfig.name} 的最新動態
          </h1>
          <p className="type-small text-slate-600 dark:text-slate-300">
            {siteConfig.tagline}
          </p>
        </header>

        <div>
          <div className="mb-3 flex items-baseline justify-between">
            <h2 className="type-small font-semibold uppercase tracking-[0.4em] text-slate-500 dark:text-slate-400">
              最新文章
            </h2>
            <Link
              href="/blog"
              className="text-xs text-blue-600 hover:underline dark:text-blue-400"
            >
              所有文章 →
            </Link>
          </div>
          <TimelineWrapper>
            {posts.map((post) => (
              <PostListItem key={post._id} post={post} />
            ))}
          </TimelineWrapper>
        </div>
      </SidebarLayout>
    </section>
  );
}
