import Link from 'next/link';
import Image from 'next/image';
import type { Post } from 'contentlayer/generated';
import { siteConfig } from '@/lib/config';
import { faCalendarDays, faTags } from '@fortawesome/free-solid-svg-icons';
import { MetaItem } from './meta-item';

interface PostCardProps {
  post: Post;
  showTags?: boolean;
}

export function PostCard({ post, showTags = true }: PostCardProps) {
  const cover =
    post.feature_image && post.feature_image.startsWith('../assets')
      ? post.feature_image.replace('../assets', '/assets')
      : undefined;

  return (
    <article className="motion-card group relative overflow-hidden rounded-xl border bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-1 origin-left scale-x-0 bg-gradient-to-r from-blue-500 via-sky-400 to-indigo-500 opacity-80 transition-transform duration-300 ease-out group-hover:scale-x-100 dark:from-blue-400 dark:via-sky-300 dark:to-indigo-400" />
      {cover && (
        <div className="relative w-full bg-slate-100 dark:bg-slate-800">
          <Image
            src={cover}
            alt={post.title}
            width={640}
            height={360}
            className="mx-auto max-h-60 w-full object-contain transition-transform duration-300 ease-out group-hover:scale-105"
          />
        </div>
      )}
      <div className="space-y-3 px-4 py-4">
        <div className="flex flex-wrap items-center gap-3 text-xs">
          {post.published_at && (
            <MetaItem icon={faCalendarDays}>
              {new Date(post.published_at).toLocaleDateString(
                siteConfig.defaultLocale
              )}
            </MetaItem>
          )}
          {showTags && post.tags && post.tags.length > 0 && (
            <MetaItem icon={faTags} tone="muted">
              {post.tags.slice(0, 3).join(', ')}
            </MetaItem>
          )}
        </div>
        <h2 className="text-lg font-semibold leading-snug">
          <Link
            href={post.url}
            className="hover:text-blue-600 dark:hover:text-blue-400"
          >
            {post.title}
          </Link>
        </h2>
        {post.description && (
          <p className="line-clamp-3 text-sm text-slate-700 dark:text-slate-100">
            {post.description}
          </p>
        )}
      </div>
    </article>
  );
}
