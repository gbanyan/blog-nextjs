import { ReactNode } from 'react';
import clsx from 'clsx';

interface TimelineWrapperProps {
  children: ReactNode;
  className?: string;
}

export function TimelineWrapper({ children, className }: TimelineWrapperProps) {
  return (
    <div className={clsx('relative pl-8', className)}>
      <span className="pointer-events-none absolute left-3 top-0 h-full w-[2px] bg-gradient-to-b from-blue-500 via-blue-200 to-slate-200 shadow-[0_0_8px_rgba(59,130,246,0.35)] dark:from-cyan-400 dark:via-cyan-300 dark:to-slate-700" aria-hidden="true" />
      <span
        className="pointer-events-none absolute top-0 h-full w-[4px] opacity-80"
        style={{
          left: 'calc(0.75rem - 2px)',
          backgroundImage:
            'repeating-linear-gradient(to bottom, rgba(96,165,250,0.9), rgba(96,165,250,0.9) 2px, transparent 2px, transparent 150px)'
        }}
        aria-hidden="true"
      />
      <span className="pointer-events-none absolute bottom-0 h-3 w-3 translate-y-1/2 rotate-45 border-b-2 border-r-2 border-blue-400 dark:border-cyan-300" style={{ left: '0.75rem' }} aria-hidden="true" />
      <div className="space-y-4">
        {children}
      </div>
    </div>
  );
}
