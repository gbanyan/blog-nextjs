import Link from 'next/link';
import type { Post } from 'contentlayer/generated';
import { siteConfig } from '@/lib/config';

interface Props {
  current: Post;
  newer?: Post;
  older?: Post;
}

interface StationConfig {
  key: 'older' | 'current' | 'newer';
  label: string;
  post?: Post;
  hint: string;
  align: 'start' | 'center' | 'end';
  rel?: 'prev' | 'next';
}

export function PostStorylineNav({ current, newer, older }: Props) {
  const stations: StationConfig[] = [
    {
      key: 'older',
      label: '回程站',
      post: older,
      hint: older
        ? `發表於 ${formatDate(older.published_at)}`
        : '這裡已是最早的文章',
      align: 'start',
      rel: 'prev'
    },
    {
      key: 'current',
      label: '你在這裡',
      post: current,
      hint: current.published_at
        ? `本篇發表於 ${formatDate(current.published_at)}`
        : '草稿狀態',
      align: 'center'
    },
    {
      key: 'newer',
      label: '前進站',
      post: newer,
      hint: newer
        ? `發表於 ${formatDate(newer.published_at)}`
        : '還沒有更新的文章',
      align: 'end',
      rel: 'next'
    }
  ];

  return (
    <nav
      aria-label="文章導覽"
      className="relative mt-10 overflow-hidden rounded-[32px] border border-slate-200/70 bg-white/90 p-6 shadow-xl dark:border-slate-800/80 dark:bg-slate-900/80"
    >
      <div className="pointer-events-none absolute left-8 right-8 top-1/2 hidden h-px -translate-y-1/2 border-t border-dashed border-slate-200 opacity-70 dark:border-slate-700 md:block" />
      <div className="pointer-events-none absolute left-1/2 top-1/2 hidden h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-500/10 blur-3xl dark:bg-blue-400/10 md:block" />
      <div className="relative grid gap-6 md:grid-cols-3">
        {stations.map((station) => (
          <Station key={station.key} station={station} />
        ))}
      </div>
    </nav>
  );
}

function Station({ station }: { station: StationConfig }) {
  const { post, label, hint, align, key, rel } = station;
  const alignClass =
    align === 'start'
      ? 'items-start text-left'
      : align === 'end'
        ? 'items-end text-right'
        : 'items-center text-center';

  const baseCard = `group relative flex w-full flex-col gap-2 rounded-3xl border border-slate-200/70 bg-white/95 px-4 py-5 text-slate-800 shadow-sm transition duration-300 hover:-translate-y-0.5 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/70 dark:border-slate-800/70 dark:bg-slate-900/80 dark:text-slate-100 ${alignClass}`;

  const circleClass = (() => {
    if (!post && key !== 'current') {
      return 'border-dashed border-slate-300 dark:border-slate-700';
    }
    if (key === 'current') {
      return 'border-blue-500 bg-blue-500 shadow-[0_0_0_6px_rgba(59,130,246,0.15)] dark:border-blue-400 dark:bg-blue-400';
    }
    return 'border-blue-500 bg-white shadow-[0_0_0_4px_rgba(59,130,246,0.08)] dark:border-blue-400 dark:bg-slate-900';
  })();

  const content = post ? (
    <Link href={post.url} rel={rel} className={baseCard}>
      <StationHeader label={label} hint={hint} circleClass={circleClass} align={align} hasPost />
      <h3 className="text-base font-semibold leading-snug text-slate-900 transition-colors group-hover:text-blue-600 dark:text-slate-50 dark:group-hover:text-blue-300">
        {post.title}
      </h3>
      {post.published_at && (
        <p className="text-xs text-slate-500 dark:text-slate-400">{formatDate(post.published_at)}</p>
      )}
      {post.tags && post.tags.length > 0 && (
        <div className={`flex flex-wrap gap-2 text-[11px] ${getJustifyClass(align)}`}>
          {post.tags.slice(0, 3).map((tag) => (
            <span
              key={`${post._id}-${tag}`}
              className="rounded-full bg-accent-soft/70 px-2 py-0.5 text-accent-textLight dark:bg-slate-800/80 dark:text-slate-100"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}
      <span
        aria-hidden="true"
        className={`text-sm text-blue-600 opacity-0 transition group-hover:opacity-100 dark:text-blue-400 ${align === 'end' ? 'self-end' : 'self-start'}`}
      >
        {align === 'end' ? '→ 前往下一站' : '探索此站 →'}
      </span>
    </Link>
  ) : (
    <div className={`${baseCard} cursor-default opacity-60 hover:translate-y-0 hover:shadow-none`}>
      <StationHeader label={label} hint={hint} circleClass={circleClass} align={align} />
      <p className="text-sm text-slate-500 dark:text-slate-400">{hint}</p>
    </div>
  );

  return (
    <div className="relative">
      {content}
    </div>
  );
}

function StationHeader({
  label,
  hint,
  circleClass,
  align,
  hasPost
}: {
  label: string;
  hint: string;
  circleClass: string;
  align: 'start' | 'center' | 'end';
  hasPost?: boolean;
}) {
  return (
    <div className={`flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.35em] text-slate-500 dark:text-slate-400 ${align === 'end' ? 'justify-end' : align === 'center' ? 'justify-center' : ''}`}>
      {align === 'end' && (
        <span className="text-[10px] font-normal tracking-normal text-slate-400 dark:text-slate-500">
          {hint}
        </span>
      )}
      <span className={`flex h-5 w-5 items-center justify-center rounded-full border ${circleClass}`}>
        {hasPost && <span className="h-1.5 w-1.5 rounded-full bg-white dark:bg-slate-900" />}
      </span>
      <span>{label}</span>
      {align !== 'end' && (
        <span className="text-[10px] font-normal tracking-normal text-slate-400 dark:text-slate-500">
          {hint}
        </span>
      )}
    </div>
  );
}

function formatDate(input?: string | Date) {
  if (!input) return '';
  const date = input instanceof Date ? input : new Date(input);
  return date.toLocaleDateString(siteConfig.defaultLocale ?? 'zh-TW', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
}

function getJustifyClass(align: 'start' | 'center' | 'end') {
  if (align === 'end') return 'justify-end';
  if (align === 'center') return 'justify-center';
  return 'justify-start';
}
