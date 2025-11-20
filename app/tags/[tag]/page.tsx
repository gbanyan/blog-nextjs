import type { Metadata } from 'next';
import { allPosts } from 'contentlayer2/generated';
import { PostListWithControls } from '@/components/post-list-with-controls';
import { getTagSlug } from '@/lib/posts';
import { SidebarLayout } from '@/components/sidebar-layout';
import { SectionDivider } from '@/components/section-divider';
import { ScrollReveal } from '@/components/scroll-reveal';
import { FiTag } from 'react-icons/fi';

export function generateStaticParams() {
  const slugs = new Set<string>();
  for (const post of allPosts) {
    if (!post.tags) continue;
    for (const tag of post.tags) {
      slugs.add(getTagSlug(tag));
    }
  }
  return Array.from(slugs).map((slug) => ({
    tag: slug
  }));
}

interface Props {
  params: Promise<{ tag: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { tag: slug } = await params;
  // Decode the slug since Next.js encodes non-ASCII characters in URLs
  const decodedSlug = decodeURIComponent(slug);
  // Find original tag label by slug
  const tag = allPosts
    .flatMap((post) => post.tags ?? [])
    .find((t) => getTagSlug(t) === decodedSlug);

  return {
    title: tag ? `標籤：${tag}` : '標籤'
  };
}

export default async function TagPage({ params }: Props) {
  const { tag: slug } = await params;
  // Decode the slug since Next.js encodes non-ASCII characters in URLs
  const decodedSlug = decodeURIComponent(slug);

  const posts = allPosts.filter(
    (post) => post.tags && post.tags.some((t) => getTagSlug(t) === decodedSlug)
  );

  const tagLabel =
    posts[0]?.tags?.find((t) => getTagSlug(t) === decodedSlug) ?? decodedSlug;

  return (
    <SidebarLayout>
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
