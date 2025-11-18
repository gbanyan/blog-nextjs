import { ReactNode } from 'react';
import clsx from 'clsx';

interface TimelineWrapperProps {
  children: ReactNode;
  className?: string;
}

export function TimelineWrapper({ children, className }: TimelineWrapperProps) {
  return (
    <div className={clsx('relative pl-8', className)}>
      <div className="pointer-events-none absolute left-3 top-0 h-full w-px bg-gradient-to-b from-transparent via-slate-200 to-transparent dark:via-slate-700" aria-hidden="true" />
      <div className="space-y-4">
        {children}
      </div>
    </div>
  );
}
