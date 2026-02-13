'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import dynamic from 'next/dynamic';
import { FiLayout, FiX } from 'react-icons/fi';
import { clsx } from 'clsx';

// Lazy load RightSidebar since it's only visible on lg+ screens
const RightSidebar = dynamic(() => import('./right-sidebar').then(mod => ({ default: mod.RightSidebar })), {
  ssr: false,
});

const RightSidebarContent = dynamic(() => import('./right-sidebar').then(mod => ({ default: mod.RightSidebarContent })), {
  ssr: false,
});

export function SidebarLayout({ children }: { children: React.ReactNode }) {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (mobileSidebarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [mobileSidebarOpen]);

  const mobileDrawer = mounted && createPortal(
    <>
      {/* Backdrop */}
      <div
        className={clsx(
          'fixed inset-0 z-[1100] bg-black/40 backdrop-blur-sm transition-opacity duration-300 lg:hidden',
          mobileSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        )}
        onClick={() => setMobileSidebarOpen(false)}
        aria-hidden="true"
      />

      {/* Slide-over panel from right */}
      <div
        className={clsx(
          'fixed top-0 right-0 bottom-0 z-[1110] w-full max-w-sm flex flex-col rounded-l-2xl border-l border-white/20 bg-white/95 shadow-2xl backdrop-blur-xl transition-transform duration-300 ease-snappy dark:border-white/10 dark:bg-slate-900/95 lg:hidden',
          mobileSidebarOpen ? 'translate-x-0' : 'translate-x-full'
        )}
      >
        <div className="flex items-center justify-between border-b border-slate-200/50 px-6 py-4 dark:border-slate-700/50">
          <div className="flex items-center gap-2 font-semibold text-slate-900 dark:text-slate-100">
            <FiLayout className="h-5 w-5 text-slate-500" />
            <span>側邊欄</span>
          </div>
          <button
            type="button"
            onClick={() => setMobileSidebarOpen(false)}
            className="rounded-full p-1 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
            aria-label="關閉側邊欄"
          >
            <FiX className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-6">
          <RightSidebarContent forceLoadFeed={mobileSidebarOpen} />
        </div>
      </div>
    </>,
    document.body
  );

  const mobileFab = mounted && (
    <button
      type="button"
      onClick={() => setMobileSidebarOpen(true)}
      className={clsx(
        'fixed bottom-6 left-6 z-40 flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white/90 text-slate-600 shadow-md backdrop-blur-sm transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900/90 dark:text-slate-300 dark:hover:bg-slate-800 lg:hidden',
        mobileSidebarOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'
      )}
      aria-label="開啟側邊欄"
    >
      <FiLayout className="h-5 w-5" />
    </button>
  );

  return (
    <>
      <div className="grid gap-8 lg:grid-cols-[minmax(0,3fr)_minmax(0,1.4fr)]">
        <div>{children}</div>
        <RightSidebar />
      </div>

      {mobileDrawer}
      {mobileFab}
    </>
  );
}
