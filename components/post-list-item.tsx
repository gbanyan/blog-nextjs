import { LocalizedLink } from '@/components/localized-link';
import Image from 'next/image';
import type { Post } from '@/lib/content';
import { siteConfig } from '@/lib/config';
import { FiCalendar, FiClock, FiTag } from 'react-icons/fi';
import { MetaItem } from './meta-item';
import { NAV_TRANSITION } from '@/lib/navigation';
import { estimateReadingMinutes, readingTimeLabel } from '@/lib/reading-time';
import { clsx } from 'clsx';

interface Props {
  post: Post;
  priority?: boolean;
  variant?: 'default' | 'reading';
}

export function PostListItem({ post, priority = false, variant = 'default' }: Props) {
  const readingMinutes = estimateReadingMinutes(post.body?.raw ?? '');
  const cover =
    post.feature_image && post.feature_image.startsWith('../assets')
      ? post.feature_image.replace('../assets', '/assets')
      : undefined;

  const excerpt =
    post.description || post.custom_excerpt || post.body?.raw?.slice(0, 120);
  const readingVariant = variant === 'reading';

  return (
    <article
      className={clsx(
        'group relative flex gap-4 border',
        readingVariant
          ? 'rounded-xl border-slate-200/80 bg-white p-4 shadow-[0_1px_2px_rgba(15,23,42,0.04)] transition-colors hover:border-slate-300 hover:bg-slate-50/60 dark:border-slate-800 dark:bg-slate-950/30 dark:hover:border-slate-700 dark:hover:bg-slate-900/50 sm:p-5'
          : 'motion-card rounded-2xl border-white/40 bg-white/90 p-5 shadow-lg transition-all hover:scale-[1.01] hover:shadow-xl dark:border-white/10 dark:bg-slate-900/90'
      )}
    >
      {!readingVariant && (
        <div className="pointer-events-none absolute inset-x-0 top-0 h-0.5 origin-left scale-x-0 bg-accent opacity-80 transition-transform duration-300 ease-out group-hover:scale-x-100" />
      )}
      {cover && (
        <div className="relative flex h-24 w-24 flex-none overflow-hidden rounded-md bg-slate-100 dark:bg-slate-800 sm:h-auto sm:w-40">
          <Image
            src={cover}
            alt={post.title}
            width={320}
            height={240}
            sizes="(max-width: 640px) 96px, 160px"
            loading={priority ? undefined : 'lazy'}
            priority={priority}
            placeholder="blur"
            blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
            className="h-full w-full object-cover transition-transform duration-300 ease-out group-hover:scale-105"
          />
        </div>
      )}
      <div className="min-w-0 flex-1 space-y-1.5">
        <div className="flex flex-wrap gap-3 text-xs">
          {post.published_at && (
            <MetaItem icon={FiCalendar}>
              {new Date(post.published_at).toLocaleDateString(
                siteConfig.defaultLocale
              )}
            </MetaItem>
          )}
          {readingMinutes > 1 && (
            <MetaItem icon={FiClock} tone="muted">
              {readingTimeLabel(readingMinutes, post.locale)}
            </MetaItem>
          )}
          {post.tags && post.tags.length > 0 && (
            <MetaItem icon={FiTag} tone="muted">
              {post.tags.slice(0, 3).join(', ')}
            </MetaItem>
          )}
        </div>
        <h2
          className={clsx(
            'font-editorial font-semibold leading-snug transition-colors hover:text-accent',
            readingVariant ? 'text-lg text-slate-900 dark:text-slate-100 sm:text-xl' : 'type-body sm:type-title'
          )}
        >
          <LocalizedLink href={post.url} transitionTypes={[...NAV_TRANSITION]}>
            {post.title}
          </LocalizedLink>
        </h2>
        {excerpt && (
          <p className="line-clamp-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
            {excerpt}
          </p>
        )}
      </div>
    </article>
  );
}
