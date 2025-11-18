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
      <span className="pointer-events-none absolute left-3 top-0 h-full w-[2px] bg-gradient-to-b from-blue-500 via-blue-200 to-slate-200 shadow-[0_0_8px_rgba(59,130,246,0.35)] dark:from-cyan-400 dark:via-cyan-300 dark:to-slate-700" aria-hidden="true" />
      <span className="pointer-events-none absolute bottom-0 left-[0.75rem] h-3 w-3 translate-y-1/2 rotate-45 border-b-2 border-r-2 border-blue-400 dark:border-cyan-300" aria-hidden="true" />
      <div className="space-y-4">
        {items.map((child, index) => (
          <div key={index} className="relative pl-6">
            <span className="pointer-events-none absolute left-0 top-1/2 h-[2px] w-6 -translate-x-full -translate-y-1/2 bg-gradient-to-r from-blue-400 to-transparent dark:from-cyan-300" aria-hidden="true" />
            {child}
          </div>
        ))}
      </div>
    </div>
  );
}
