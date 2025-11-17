import Link from 'next/link';
import type { Post } from 'contentlayer/generated';
import { siteConfig } from '@/lib/config';

interface Props {
  post: Post;
}

export function PostListItem({ post }: Props) {
  const cover =
    post.feature_image && post.feature_image.startsWith('../assets')
      ? post.feature_image.replace('../assets', '/assets')
      : undefined;

  const excerpt =
    post.description || post.custom_excerpt || post.body?.raw?.slice(0, 120);

  const tagColorClasses = [
    'bg-rose-100 text-rose-700 dark:bg-rose-900/60 dark:text-rose-200',
    'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/60 dark:text-emerald-200',
    'bg-sky-100 text-sky-700 dark:bg-sky-900/60 dark:text-sky-200',
    'bg-amber-100 text-amber-700 dark:bg-amber-900/60 dark:text-amber-200',
    'bg-violet-100 text-violet-700 dark:bg-violet-900/60 dark:text-violet-200'
  ];

  return (
    <li>
      <article className="group flex gap-4 rounded-lg border border-slate-200/70 bg-white/80 p-4 transition hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900/80 dark:hover:bg-slate-900">
        {cover && (
          <div className="hidden flex-none overflow-hidden rounded-md bg-slate-100 dark:bg-slate-800 sm:block sm:w-40">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={cover}
              alt={post.title}
              className="h-full w-full object-contain"
            />
          </div>
        )}
        <div className="flex-1 space-y-1.5">
          {post.published_at && (
            <p className="text-xs text-slate-500 dark:text-slate-500">
              {new Date(post.published_at).toLocaleDateString(
                siteConfig.defaultLocale
              )}
            </p>
          )}
          <h2 className="text-base font-semibold leading-snug text-slate-900 group-hover:text-blue-600 sm:text-lg dark:text-slate-50 dark:group-hover:text-blue-400">
            <Link href={post.url}>{post.title}</Link>
          </h2>
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-0.5">
              {post.tags.slice(0, 4).map((t, i) => {
                const color =
                  tagColorClasses[i % tagColorClasses.length];
                return (
                  <Link
                    key={t}
                    href={`/tags/${encodeURIComponent(
                      t.toLowerCase().replace(/\s+/g, '-')
                    )}`}
                    className={`rounded-full px-2 py-0.5 text-[11px] transition ${color}`}
                  >
                    #{t}
                  </Link>
                );
              })}
            </div>
          )}
          {excerpt && (
            <p className="line-clamp-2 text-sm text-slate-600 group-hover:text-slate-800 dark:text-slate-300 dark:group-hover:text-slate-100">
              {excerpt}
            </p>
          )}
        </div>
      </article>
    </li>
  );
}
