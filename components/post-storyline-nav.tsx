import Link from 'next/link';
import type { Post } from 'contentlayer/generated';

interface Props {
  current: Post;
  newer?: Post;
  older?: Post;
}

interface StationConfig {
  key: 'older' | 'newer';
  label: string;
  post?: Post;
  rel?: 'prev' | 'next';
  subtitle: string;
  align: 'start' | 'end';
}

export function PostStorylineNav({ current, newer, older }: Props) {
  const stations: StationConfig[] = [
    {
      key: 'older',
      label: '上一站',
      post: older,
      subtitle: older ? '回顧這篇' : '到達起點',
      rel: 'prev',
      align: 'end'
    },
    {
      key: 'newer',
      label: '下一站',
      post: newer,
      subtitle: newer ? '繼續前往' : '尚無新章',
      rel: 'next',
      align: 'start'
    }
  ];

  return (
    <nav aria-label="文章導覽" className="relative mt-10">
      <div className="relative overflow-hidden rounded-[32px] border border-slate-200/70 bg-gradient-to-r from-white via-slate-50 to-white px-6 py-8 shadow-lg dark:border-slate-800/70 dark:from-slate-900 dark:via-slate-900/80 dark:to-slate-900">
        <div className="pointer-events-none absolute inset-x-12 top-1/2 hidden md:block">
          <div className="relative flex items-center text-slate-200 dark:text-slate-700">
            <span className="h-0 w-0 -translate-x-3 border-y-[7px] border-y-transparent border-r-[14px] border-r-current" />
            <span className="flex-1 border-t border-dashed border-current" />
            <span className="h-0 w-0 translate-x-3 rotate-180 border-y-[7px] border-y-transparent border-r-[14px] border-r-current" />
          </div>
        </div>
        <div className="relative grid gap-6 md:grid-cols-[1fr_auto_1fr] md:items-center">
          <Station station={stations[0]} />
          <div className="hidden flex-col items-center gap-2 text-center text-xs uppercase tracking-[0.4em] text-slate-400 md:flex">
            <span className="h-2 w-2 rounded-full bg-blue-500" aria-hidden="true" />
            <span>你在這裡</span>
          </div>
          <Station station={stations[1]} />
        </div>
      </div>
    </nav>
  );
}

function Station({ station }: { station: StationConfig }) {
  const { post, label, subtitle, rel, align } = station;
  const alignClass = align === 'end' ? 'items-end text-right' : 'items-start text-left';

  if (!post) {
    return (
      <div className={`flex flex-col gap-1 text-slate-400 ${alignClass}`}>
        <p className="text-[11px] uppercase tracking-[0.4em]">{label}</p>
        <p className="text-base font-semibold">{subtitle}</p>
      </div>
    );
  }

  return (
    <Link
      href={post.url}
      rel={rel}
      className={`group flex flex-col gap-1 text-center transition duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 dark:focus-visible:ring-blue-300 ${alignClass}`}
    >
      <p className="text-[11px] uppercase tracking-[0.4em] text-slate-400 transition group-hover:text-blue-500 dark:text-slate-500">
        {label}
      </p>
      <p className="text-lg font-semibold leading-snug tracking-tight text-slate-900 transition group-hover:text-blue-600 dark:text-slate-50 dark:group-hover:text-blue-300">
        {post.title}
      </p>
      <span className="text-xs text-slate-500 transition group-hover:text-blue-500 dark:text-slate-400">
        {subtitle}
      </span>
      <span
        className={`mt-2 h-0.5 w-16 rounded-full bg-slate-200 transition group-hover:w-24 group-hover:bg-blue-400 dark:bg-slate-700 ${
          align === 'end' ? 'self-end' : 'self-start'
        }`}
      />
    </Link>
  );
}
