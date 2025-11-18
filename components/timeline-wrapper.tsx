import { ReactNode } from 'react';
import clsx from 'clsx';

interface TimelineWrapperProps {
  children: ReactNode;
  className?: string;
}

export function TimelineWrapper({ children, className }: TimelineWrapperProps) {
  return (
    <div className={clsx('relative pl-6', className)}>
      <div className="pointer-events-none absolute left-2 top-0 h-full w-px bg-gradient-to-b from-transparent via-slate-200 to-transparent shadow-[0_0_6px_rgba(148,163,184,0.35)] dark:via-slate-700" aria-hidden="true" />
      <div className="space-y-4">
        {children}
      </div>
    </div>
  );
}
