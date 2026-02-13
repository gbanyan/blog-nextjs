import { Link } from 'next-view-transitions';
import Image from 'next/image';
import type { Post } from 'contentlayer2/generated';
import { siteConfig } from '@/lib/config';
import { FiCalendar, FiTag } from 'react-icons/fi';
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
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            loading="lazy"
            placeholder="blur"
            blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
            className="mx-auto max-h-60 w-full object-contain transition-transform duration-300 ease-out group-hover:scale-105"
          />
        </div>
      )}
      <div className="space-y-3 px-4 py-4">
        <div className="flex flex-wrap items-center gap-3 text-xs">
          {post.published_at && (
            <MetaItem icon={FiCalendar}>
              {new Date(post.published_at).toLocaleDateString(
                siteConfig.defaultLocale
              )}
            </MetaItem>
          )}
          {showTags && post.tags && post.tags.length > 0 && (
            <MetaItem icon={FiTag} tone="muted">
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
