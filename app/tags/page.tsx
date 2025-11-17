import Link from 'next/link';
import type { Metadata } from 'next';
import { getAllTagsWithCount } from '@/lib/posts';

export const metadata: Metadata = {
  title: '標籤索引'
};

export default function TagIndexPage() {
  const tags = getAllTagsWithCount();

  const colorClasses = [
    'bg-rose-100 text-rose-700 dark:bg-rose-900/60 dark:text-rose-200',
    'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/60 dark:text-emerald-200',
    'bg-sky-100 text-sky-700 dark:bg-sky-900/60 dark:text-sky-200',
    'bg-amber-100 text-amber-700 dark:bg-amber-900/60 dark:text-amber-200',
    'bg-violet-100 text-violet-700 dark:bg-violet-900/60 dark:text-violet-200'
  ];

  return (
    <section className="space-y-4">
      <h1 className="text-lg font-semibold text-slate-900 dark:text-slate-50">
        標籤索引
      </h1>
      <p className="text-xs text-slate-500 dark:text-slate-400">
        目前共有 {tags.length} 個標籤。
      </p>
      <div className="flex flex-wrap gap-3 text-xs">
        {tags.map(({ tag, slug, count }, index) => {
          const color = colorClasses[index % colorClasses.length];
          return (
            <Link
              key={tag}
              href={`/tags/${slug}`}
              className={`rounded-full px-3 py-1 transition ${color}`}
            >
              <span className="mr-1">{tag}</span>
              <span className="opacity-70">({count})</span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

