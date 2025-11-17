import Link from 'next/link';
import { getAllPostsSorted } from '@/lib/posts';
import { siteConfig } from '@/lib/config';

export const metadata = {
  title: 'Blog'
};

export default function BlogIndexPage() {
  const posts = getAllPostsSorted();

  return (
    <section className="space-y-6">
      <h1 className="text-2xl font-bold">Blog</h1>
      <ul className="space-y-3">
        {posts.map((post) => (
          <li key={post._id}>
            <Link
              href={post.url}
              className="text-lg font-medium hover:underline"
            >
              {post.title}
            </Link>
            <div className="text-xs text-gray-500">
              {post.published_at &&
                new Date(post.published_at).toLocaleDateString(
                  siteConfig.defaultLocale
                )}
              {post.tags && post.tags.length > 0 && (
                <span className="ml-2">
                  {post.tags.map((t) => (
                    <span
                      key={t}
                      className="mr-1 rounded bg-gray-200 px-1 dark:bg-gray-800"
                    >
                      #{t}
                    </span>
                  ))}
                </span>
              )}
            </div>
            {post.description && (
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
                {post.description}
              </p>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}
