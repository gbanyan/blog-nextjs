import Link from 'next/link';
import type { Post } from 'contentlayer/generated';

interface Props {
  current: Post;
  newer?: Post;
  older?: Post;
}

interface StationConfig {
  key: 'older' | 'current' | 'newer';
  label: string;
  post?: Post;
  rel?: 'prev' | 'next';
  subtitle: string;
}

export function PostStorylineNav({ current, newer, older }: Props) {
  const stations: StationConfig[] = [
    {
      key: 'older',
      label: '上一站',
      post: older,
      subtitle: older ? '回顧這篇' : '到達起點',
      rel: 'prev'
    },
    {
      key: 'current',
      label: '你在這裡',
      post: current,
      subtitle: '正在閱讀'
    },
    {
      key: 'newer',
      label: '下一站',
      post: newer,
      subtitle: newer ? '繼續前往' : '尚無新章',
      rel: 'next'
    }
  ];

  return (
    <nav aria-label="文章導覽" className="relative mt-10">
      <div className="relative overflow-hidden rounded-[32px] border border-slate-200/70 bg-gradient-to-r from-white via-slate-50 to-white px-6 py-10 shadow-lg dark:border-slate-800/70 dark:from-slate-900 dark:via-slate-900/80 dark:to-slate-900">
        <div className="pointer-events-none absolute inset-x-10 top-1/2 hidden -translate-y-1/2 items-center gap-3 text-slate-300 dark:text-slate-600 md:flex">
          <span className="h-0 w-0 border-y-[7px] border-y-transparent border-r-[14px] border-r-current" />
          <span className="flex-1 border-t border-dashed border-current" />
          <span className="h-0 w-0 rotate-180 border-y-[7px] border-y-transparent border-r-[14px] border-r-current" />
        </div>
        <div className="relative grid gap-8 md:grid-cols-3">
          {stations.map((station) => (
            <Station key={station.key} station={station} />
          ))}
        </div>
      </div>
    </nav>
  );
}

function Station({ station }: { station: StationConfig }) {
  const { post, label, rel, subtitle, key } = station;
  const isCurrent = key === 'current';

  const capsule = (
    <span
      className={`flex h-14 w-14 items-center justify-center rounded-full border-2 text-[11px] font-semibold uppercase tracking-[0.35em] transition duration-300 ${
        isCurrent
          ? 'border-blue-500 bg-blue-500 text-white shadow-[0_0_20px_rgba(59,130,246,0.35)]'
          : post
            ? 'border-slate-300 bg-white text-slate-500 dark:border-slate-700 dark:bg-slate-900'
            : 'border-dashed border-slate-300 text-slate-400 dark:border-slate-700'
      }`}
    >
      {label === '下一站' ? 'NEXT' : label === '上一站' ? 'PREV' : 'NOW'}
    </span>
  );

  if (!post) {
    return (
      <div className="flex flex-col items-center gap-3 text-center text-slate-400">
        {capsule}
        <p className="text-xs tracking-[0.35em] uppercase">{label}</p>
        <p className="text-base font-semibold text-slate-400">{subtitle}</p>
      </div>
    );
  }

  return (
    <Link
      href={post.url}
      rel={rel}
      className="group flex flex-col items-center gap-3 text-center text-slate-900 transition duration-300 hover:-translate-y-1 hover:text-blue-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 dark:text-slate-50"
    >
      <span className="relative flex items-center">
        {capsule}
        <span className={`absolute inset-x-2 top-full mt-2 h-1 rounded-full transition ${isCurrent ? 'bg-blue-500/70' : 'bg-transparent group-hover:bg-blue-400/60'}`} />
      </span>
      <p className="text-[11px] uppercase tracking-[0.4em] text-slate-400 dark:text-slate-500">
        {label}
      </p>
      <p className="text-lg font-semibold leading-snug tracking-tight">
        {post.title}
      </p>
      <span className="text-xs text-slate-500 transition group-hover:text-blue-500 dark:text-slate-400">
        {subtitle}
      </span>
    </Link>
  );
}
