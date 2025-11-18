import { ReactNode } from 'react';
import clsx from 'clsx';

interface TimelineWrapperProps {
  children: ReactNode;
  className?: string;
}

export function TimelineWrapper({ children, className }: TimelineWrapperProps) {
  return (
    <div className={clsx('relative pl-8', className)}>
      <div className="pointer-events-none absolute left-3 top-0 h-full w-0.5 bg-gradient-to-b from-transparent via-blue-400 to-transparent shadow-[0_0_12px_rgba(59,130,246,0.45)] dark:via-cyan-300" aria-hidden="true" />
      <div className="space-y-4">
        {children}
      </div>
    </div>
  );
}
