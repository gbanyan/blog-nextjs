import Link from 'next/link';
import type { Post } from 'contentlayer/generated';
import { siteConfig } from '@/lib/config';
import { faCalendarDays, faTags } from '@fortawesome/free-solid-svg-icons';
import { MetaItem } from './meta-item';

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

  return (
    <div className="timeline-entry group relative pl-6" role="listitem">
      <article className="motion-card group relative flex gap-4 rounded-lg border border-slate-200/70 bg-white/90 p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900/80">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-0.5 origin-left scale-x-0 bg-gradient-to-r from-blue-500 via-sky-400 to-indigo-500 opacity-80 transition-transform duration-300 ease-out group-hover:scale-x-100 dark:from-blue-400 dark:via-sky-300 dark:to-indigo-400" />
        {cover && (
          <div className="flex h-24 w-24 flex-none overflow-hidden rounded-md bg-slate-100 dark:bg-slate-800 sm:h-auto sm:w-40">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={cover}
              alt={post.title}
              className="h-full w-full object-cover transition-transform duration-300 ease-out group-hover:scale-105"
            />
          </div>
        )}
        <div className="flex-1 space-y-1.5">
          <div className="flex flex-wrap gap-3 text-xs">
            {post.published_at && (
              <MetaItem icon={faCalendarDays}>
                {new Date(post.published_at).toLocaleDateString(
                  siteConfig.defaultLocale
                )}
              </MetaItem>
            )}
            {post.tags && post.tags.length > 0 && (
              <MetaItem icon={faTags} tone="muted">
                {post.tags.slice(0, 3).join(', ')}
              </MetaItem>
            )}
          </div>
          <h2 className="text-base font-semibold leading-snug text-slate-900 hover:text-accent sm:text-lg dark:text-slate-50 dark:hover:text-accent">
            <Link href={post.url}>{post.title}</Link>
          </h2>
          {excerpt && (
            <p className="line-clamp-2 text-sm text-slate-600 group-hover:text-slate-800 dark:text-slate-300 dark:group-hover:text-slate-100">
              {excerpt}
            </p>
          )}
        </div>
      </article>
    </div>
  );
}
