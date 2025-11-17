import { getAllPostsSorted } from '@/lib/posts';
import { PostListWithControls } from '@/components/post-list-with-controls';

export const metadata = {
  title: '所有文章'
};

export default function BlogIndexPage() {
  const posts = getAllPostsSorted();

  return (
    <section className="space-y-4">
      <h1 className="text-lg font-semibold text-slate-900 dark:text-slate-50">
        所有文章
      </h1>
      <PostListWithControls posts={posts} />
    </section>
  );
}
