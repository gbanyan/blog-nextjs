import Link from 'next/link';
import Image from 'next/image';
import { Post } from 'contentlayer2/generated';
import { siteConfig } from '@/lib/config';
import { FiCalendar, FiTag } from 'react-icons/fi';
import { MetaItem } from './meta-item';
import { Card } from '@heroui/react';

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
    <article>
      <Card
        variant="transparent"
        className="motion-card group relative flex gap-4 rounded-2xl border border-white/40 bg-white/60 p-5 shadow-lg backdrop-blur-md transition-all hover:scale-[1.01] hover:shadow-xl dark:border-white/10 dark:bg-slate-900/60"
      >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-0.5 origin-left scale-x-0 bg-gradient-to-r from-blue-500 via-sky-400 to-indigo-500 opacity-80 transition-transform duration-300 ease-out group-hover:scale-x-100 dark:from-blue-400 dark:via-sky-300 dark:to-indigo-400" />
      {cover && (
        <div className="relative flex h-24 w-24 flex-none overflow-hidden rounded-md bg-slate-100 dark:bg-slate-800 sm:h-auto sm:w-40">
          <Image
            src={cover}
            alt={post.title}
            width={320}
            height={240}
            sizes="(max-width: 640px) 96px, 160px"
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-300 ease-out group-hover:scale-105"
          />
        </div>
      )}
      <Card.Content className="flex-1 space-y-1.5 p-0">
        <div className="flex flex-wrap gap-3 text-xs">
          {post.published_at && (
            <MetaItem icon={FiCalendar}>
              {new Date(post.published_at).toLocaleDateString(
                siteConfig.defaultLocale
              )}
            </MetaItem>
          )}
          {post.tags && post.tags.length > 0 && (
            <MetaItem icon={FiTag} tone="muted">
              {post.tags.slice(0, 3).join(', ')}
            </MetaItem>
          )}
        </div>
        <Card.Header className="p-0">
          <Card.Title className="text-base font-semibold leading-snug text-slate-900 hover:text-[var(--color-accent)] sm:text-lg dark:text-slate-50 dark:hover:text-[var(--color-accent)]">
            <Link href={post.url}>{post.title}</Link>
          </Card.Title>
        </Card.Header>
        {excerpt && (
          <Card.Description className="line-clamp-2 text-sm text-slate-600 group-hover:text-slate-800 dark:text-slate-300 dark:group-hover:text-slate-100">
            {excerpt}
          </Card.Description>
        )}
      </Card.Content>
      </Card>
    </article>
  );
}
