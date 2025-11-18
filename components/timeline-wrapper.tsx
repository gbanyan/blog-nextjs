import { ReactNode } from 'react';
import clsx from 'clsx';

interface TimelineWrapperProps {
  children: ReactNode;
  className?: string;
}

export function TimelineWrapper({ children, className }: TimelineWrapperProps) {
  return (
    <div className={clsx('relative pl-8', className)}>
      <div className="pointer-events-none absolute left-3 top-0 h-full w-px bg-gradient-to-b from-transparent via-blue-200/70 to-transparent dark:via-blue-900/30" aria-hidden="true" />
      <div className="pointer-events-none absolute left-[10px] top-0 h-full w-px bg-gradient-to-b from-blue-500/20 via-blue-400/30 to-transparent blur-[1px] dark:from-blue-300/15 dark:via-blue-400/20" aria-hidden="true" />
      <div className="space-y-4">
        {children}
      </div>
    </div>
  );
}
