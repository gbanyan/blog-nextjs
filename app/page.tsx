import Link from 'next/link';
import { getAllPostsSorted } from '@/lib/posts';
import { siteConfig } from '@/lib/config';

export default function HomePage() {
  const posts = getAllPostsSorted().slice(0, 5);

  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">
          你好，我是 {siteConfig.name}
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-300">
          這裡是我的個人首頁與技術 Blog。
        </p>
      </div>

      <div>
        <h2 className="text-xl font-semibold">最新文章</h2>
        <ul className="mt-3 space-y-2">
          {posts.map((post) => (
            <li key={post._id}>
              <Link href={post.url} className="hover:underline">
                {post.title}
              </Link>
              {post.published_at && (
                <span className="ml-2 text-xs text-gray-500">
                  {new Date(post.published_at).toLocaleDateString('zh-TW')}
                </span>
              )}
            </li>
          ))}
        </ul>
        <Link
          href="/blog"
          className="mt-4 inline-block text-sm text-blue-600 hover:underline"
        >
          所有文章 →
        </Link>
      </div>
    </section>
  );
}
