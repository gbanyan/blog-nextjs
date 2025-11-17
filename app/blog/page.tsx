import { getAllPostsSorted } from '@/lib/posts';
import { PostCard } from '@/components/post-card';

export const metadata = {
  title: 'Blog'
};

export default function BlogIndexPage() {
  const posts = getAllPostsSorted();

  return (
    <section className="space-y-6">
      <h1 className="text-2xl font-bold">Blog</h1>
      <div className="space-y-4">
        {posts.map((post) => (
          <PostCard key={post._id} post={post} />
        ))}
      </div>
    </section>
  );
}
