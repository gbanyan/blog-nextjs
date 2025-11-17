import Link from 'next/link';
import { siteConfig } from '@/lib/config';
import { getAllPostsSorted, getAllTagsWithCount } from '@/lib/posts';

export function RightSidebar() {
  const latest = getAllPostsSorted().slice(0, 5);
  const tags = getAllTagsWithCount().slice(0, 30);

  return (
    <aside className="hidden lg:block">
      <div className="sticky top-20 flex flex-col gap-4">
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

      {tags.length > 0 && (
        <section className="rounded-xl border bg-white px-4 py-3 text-sm shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100">
          <h2 className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
            標籤雲
          </h2>
          <div className="mt-2 flex flex-wrap gap-2 text-xs">
            {tags.map(({ tag, slug, count }, index) => {
              let sizeClass = 'text-[11px]';
              if (count >= 5) sizeClass = 'text-sm font-semibold';
              else if (count >= 3) sizeClass = 'text-xs font-medium';

              const colorClasses = [
                'bg-rose-100 text-rose-700 dark:bg-rose-900/60 dark:text-rose-200',
                'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/60 dark:text-emerald-200',
                'bg-sky-100 text-sky-700 dark:bg-sky-900/60 dark:text-sky-200',
                'bg-amber-100 text-amber-700 dark:bg-amber-900/60 dark:text-amber-200',
                'bg-violet-100 text-violet-700 dark:bg-violet-900/60 dark:text-violet-200'
              ];
              const color =
                colorClasses[index % colorClasses.length];

              return (
                <Link
                  key={tag}
                  href={`/tags/${slug}`}
                  className={`${sizeClass} rounded-full px-2 py-0.5 transition ${color}`}
                >
                  {tag}
                </Link>
              );
            })}
          </div>
        </section>
      )}
      </div>
    </aside>
  );
}
