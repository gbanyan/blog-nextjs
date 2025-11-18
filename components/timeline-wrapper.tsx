import { Children, ReactNode } from 'react';
import clsx from 'clsx';

interface TimelineWrapperProps {
  children: ReactNode;
  className?: string;
}

export function TimelineWrapper({ children, className }: TimelineWrapperProps) {
  const items = Children.toArray(children);
  return (
    <div className={clsx('relative pl-8', className)}>
      <span
        className="pointer-events-none absolute left-3 top-0 h-full w-[2px] rounded-full bg-gradient-to-b from-blue-500 via-blue-200 to-slate-200 shadow-[0_0_10px_rgba(59,130,246,0.45)] dark:from-cyan-400 dark:via-cyan-300 dark:to-slate-700"
        aria-hidden="true"
      />
      <span
        className="pointer-events-none absolute left-3 top-0 h-full w-[6px] rounded-full bg-gradient-to-b from-blue-500/20 via-blue-200/15 to-transparent blur-[12px]"
        aria-hidden="true"
      />
      <span className="timeline-scroll-dot pointer-events-none absolute left-3 top-0 h-2 w-2 -translate-x-1/2 rounded-full bg-white shadow-[0_0_8px_rgba(96,165,250,0.7)]" aria-hidden="true" />

      <div className="space-y-4">
        {items.map((child, index) => (
          <div key={index} className="relative pl-6 sm:pl-8">
            <span className="pointer-events-none absolute left-0 top-1/2 h-[2px] w-7 -translate-x-full -translate-y-1/2 bg-gradient-to-r from-blue-400/80 via-blue-300/60 to-transparent dark:from-cyan-300/80 dark:via-cyan-200/60" aria-hidden="true" />
            {child}
          </div>
        ))}
      </div>
    </div>
  );
}
