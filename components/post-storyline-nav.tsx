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
  rel?: 'prev' | 'next';
}

export function PostStorylineNav({ current, newer, older }: Props) {
  const stations: StationConfig[] = [
    {
      key: 'older',
      label: '上一站',
      post: older,
      hint: older ? `發表於 ${formatDate(older.published_at)}` : '沒有更早的文章',
      rel: 'prev'
    },
    {
      key: 'current',
      label: '你在這裡',
      post: current,
      hint: current.published_at ? formatDate(current.published_at) : '草稿'
    },
    {
      key: 'newer',
      label: '下一站',
      post: newer,
      hint: newer ? `發表於 ${formatDate(newer.published_at)}` : '還沒有新文章',
      rel: 'next'
    }
  ];

  return (
    <nav aria-label="文章導覽" className="relative mt-10">
      <div className="relative overflow-hidden rounded-[32px] border border-slate-200/70 bg-gradient-to-r from-white via-slate-50 to-white p-6 shadow-lg dark:border-slate-800/70 dark:from-slate-900 dark:via-slate-900/80 dark:to-slate-900">
        <div className="pointer-events-none absolute inset-0 opacity-60">
          <div className="absolute left-6 right-6 top-1/2 hidden h-px -translate-y-1/2 bg-gradient-to-r from-transparent via-blue-500/30 to-transparent md:block" />
          <div className="absolute left-1/2 top-1/2 hidden h-56 w-56 -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-500/15 blur-3xl dark:bg-blue-400/15 md:block" />
        </div>
        <div className="relative grid gap-6 md:grid-cols-3">
          {stations.map((station) => (
            <Station key={station.key} station={station} />
          ))}
        </div>
      </div>
    </nav>
  );
}

function Station({ station }: { station: StationConfig }) {
  const { post, label, hint, key, rel } = station;
  const isCurrent = key === 'current';

  const base = `group flex flex-col gap-3 rounded-3xl px-4 py-5 transition duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/60 dark:focus-visible:ring-blue-300/70 ${
    isCurrent
      ? 'bg-white/80 shadow-md ring-1 ring-blue-200/60 dark:bg-slate-900/80 dark:ring-blue-500/20'
      : 'bg-white/60 shadow-sm hover:-translate-y-0.5 hover:shadow-lg dark:bg-slate-900/70'
  }`;

  const circle = (
    <span
      className={`flex h-12 w-12 items-center justify-center rounded-full border text-xs font-semibold uppercase tracking-[0.3em] ${
        isCurrent
          ? 'border-blue-500 bg-blue-500 text-white shadow-[0_0_0_8px_rgba(59,130,246,0.15)]'
          : post
            ? 'border-slate-300 bg-white text-slate-500 dark:border-slate-700 dark:bg-slate-900'
            : 'border-dashed border-slate-300 text-slate-300 dark:border-slate-700'
      }`}
    >
      {label === '下一站' ? 'NEXT' : label === '上一站' ? 'PREV' : 'NOW'}
    </span>
  );

  if (!post) {
    return (
      <div className={`${base} cursor-default opacity-60`}> 
        {circle}
        <p className="text-sm text-slate-500 dark:text-slate-400">{hint}</p>
      </div>
    );
  }

  return (
    <Link href={post.url} rel={rel} className={`${base} text-slate-900 dark:text-slate-100`}>
      <div className="flex items-center gap-4">
        {circle}
        <div className="text-xs uppercase tracking-[0.35em] text-slate-400 dark:text-slate-500">
          {label}
        </div>
      </div>
      <p className="text-lg font-semibold leading-snug tracking-tight text-slate-900 transition-colors group-hover:text-blue-600 dark:text-slate-50 dark:group-hover:text-blue-300">
        {post.title}
      </p>
      <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
        <span>{hint}</span>
        <span className="text-sm font-medium text-blue-600 opacity-0 transition group-hover:opacity-100 dark:text-blue-400">
          {label === '下一站' ? '→ 前往' : label === '上一站' ? '回顧 ←' : '正在閱讀'}
        </span>
      </div>
    </Link>
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
