import Link from 'next/link';
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
    <article className="motion-card group relative overflow-hidden rounded-xl border bg-white shadow-sm transition-all duration-300 ease-snappy hover:-translate-y-1 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-1 origin-left scale-x-0 bg-gradient-to-r from-[rgba(124,58,237,0.9)] via-[rgba(167,139,250,0.9)] to-[rgba(14,165,233,0.8)] opacity-80 transition-transform duration-300 ease-out group-hover:scale-x-100" />
      {cover && (
        <div className="relative w-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
          <Image
            src={cover}
            alt={post.title}
            width={640}
            height={360}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            loading="lazy"
            placeholder="blur"
            blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
            className="mx-auto w-full object-cover transition-transform duration-300 ease-out group-hover:scale-105"
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
            className="hover:text-accent dark:hover:text-accent"
          >
            {post.title}
          </Link>
        </h2>
        {post.description && (
          <p className="line-clamp-3 text-sm text-slate-600 dark:text-slate-300">
            {post.description}
          </p>
        )}
      </div>
    </article>
  );
}
