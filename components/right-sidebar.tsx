import Link from 'next/link';
import { siteConfig } from '@/lib/config';
import { getAllPostsSorted } from '@/lib/posts';

export function RightSidebar() {
  const latest = getAllPostsSorted().slice(0, 5);

  return (
    <aside className="hidden flex-col gap-4 lg:flex">
      <section className="rounded-xl border bg-white px-4 py-3 text-sm shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100">
        <h2 className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
          關於本站
        </h2>
        <p className="mt-1 text-xs text-slate-600 dark:text-slate-200">
          {siteConfig.description}
        </p>
      </section>

      <section className="rounded-xl border bg-white px-4 py-3 text-sm shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100">
        <h2 className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
          最新文章
        </h2>
        <ul className="mt-2 space-y-1">
          {latest.map((post) => (
            <li key={post._id}>
              <Link
                href={post.url}
                className="line-clamp-2 text-xs text-slate-700 hover:text-blue-600 dark:text-slate-100 dark:hover:text-blue-400"
              >
                {post.title}
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </aside>
  );
}

