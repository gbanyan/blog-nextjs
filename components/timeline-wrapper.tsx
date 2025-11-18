import { ReactNode } from 'react';
import clsx from 'clsx';

interface TimelineWrapperProps {
  children: ReactNode;
  className?: string;
}

export function TimelineWrapper({ children, className }: TimelineWrapperProps) {
  return (
    <div className={clsx('relative pl-8', className)}>
      <div className="pointer-events-none absolute left-3 top-0 h-full w-[2px] bg-gradient-to-b from-blue-500 via-blue-200 to-slate-200 shadow-[0_0_8px_rgba(59,130,246,0.35)] dark:from-cyan-400 dark:via-cyan-300 dark:to-slate-700" aria-hidden="true" />
      <div className="space-y-4">
        {children}
      </div>
    </div>
  );
}
