import { getAllPostsSorted } from '@/lib/posts';
import { PostListWithControls } from '@/components/post-list-with-controls';

export const metadata = {
  title: '所有文章'
};

export default function BlogIndexPage() {
  const posts = getAllPostsSorted();

  return (
    <section className="space-y-4">
      <header className="space-y-1">
        <h1 className="type-title font-semibold text-slate-900 dark:text-slate-50">
          所有文章
        </h1>
        <p className="type-small text-slate-500 dark:text-slate-400">
          繼續往下滑，慢慢逛逛。
        </p>
      </header>
      <PostListWithControls posts={posts} />
    </section>
  );
}
