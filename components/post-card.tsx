import Link from 'next/link';
import type { Post } from 'contentlayer/generated';
import { siteConfig } from '@/lib/config';

interface PostCardProps {
  post: Post;
}

export function PostCard({ post }: PostCardProps) {
  const cover =
    post.feature_image && post.feature_image.startsWith('../assets')
      ? post.feature_image.replace('../assets', '/assets')
      : undefined;

  return (
    <article className="group overflow-hidden rounded-xl border bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-slate-800 dark:bg-slate-900">
      {cover && (
        <div className="w-full bg-slate-100 dark:bg-slate-800">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={cover}
            alt={post.title}
            className="mx-auto max-h-60 w-full object-contain"
          />
        </div>
      )}
      <div className="space-y-2 px-4 py-4">
        <h2 className="text-lg font-semibold leading-snug">
          <Link
            href={post.url}
            className="hover:text-blue-600 dark:hover:text-blue-400"
          >
            {post.title}
          </Link>
        </h2>
        <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
          {post.published_at && (
            <span>
              {new Date(post.published_at).toLocaleDateString(
                siteConfig.defaultLocale
              )}
            </span>
          )}
          {post.tags && post.tags.length > 0 && (
            <span className="flex flex-wrap gap-1">
              {post.tags.slice(0, 3).map((t) => (
                <span
                  key={t}
                  className="rounded bg-slate-100 px-1.5 py-0.5 text-[11px] dark:bg-slate-800"
                >
                  #{t}
                </span>
              ))}
            </span>
          )}
        </div>
        {post.description && (
          <p className="line-clamp-3 text-sm text-slate-700 dark:text-slate-100">
            {post.description}
          </p>
        )}
      </div>
    </article>
  );
}
