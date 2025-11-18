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
        className="pointer-events-none absolute left-3 top-0 h-full w-[2px] rounded-full bg-blue-400 shadow-[0_0_10px_rgba(59,130,246,0.35)] dark:bg-cyan-300"
        aria-hidden="true"
      />
      <span
        className="pointer-events-none absolute left-3 top-0 h-full w-[8px] rounded-full bg-blue-500/15 blur-[14px]"
        aria-hidden="true"
      />

      <div className="space-y-4">
        {items.map((child, index) => (
          <div key={index} className="relative pl-6 sm:pl-8">
            <span className="pointer-events-none absolute left-0 top-1/2 h-px w-8 -translate-x-full -translate-y-1/2 bg-gradient-to-r from-transparent via-blue-300/80 to-transparent dark:via-cyan-200/80" aria-hidden="true" />
            {child}
          </div>
        ))}
      </div>
    </div>
  );
}
