import { getAllPostsSorted } from '@/lib/posts';
import { PostListItem } from '@/components/post-list-item';

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
      <ul className="space-y-3">
        {posts.map((post) => (
          <PostListItem key={post._id} post={post} />
        ))}
      </ul>
    </section>
  );
}
