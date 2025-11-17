import Link from 'next/link';
import { getAllPostsSorted } from '@/lib/posts';
import { siteConfig } from '@/lib/config';
import { Hero } from '@/components/hero';
import { PostCard } from '@/components/post-card';

export default function HomePage() {
  const posts = getAllPostsSorted().slice(0, siteConfig.postsPerPage);

  return (
    <section className="space-y-6">
      <Hero />

      <div>
        <div className="mb-3 flex items-baseline justify-between">
          <h2 className="text-xl font-semibold">最新文章</h2>
          <Link
            href="/blog"
            className="text-sm text-blue-600 hover:underline dark:text-blue-400"
          >
            所有文章 →
          </Link>
        </div>
        <div className="space-y-4">
          {posts.map((post) => (
            <PostCard key={post._id} post={post} />
          ))}
        </div>
      </div>
    </section>
  );
}
