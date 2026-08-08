'use client';
import dynamic from 'next/dynamic';
import { FiLayout } from 'react-icons/fi';
import { MobileDrawer } from './mobile-drawer';
import { useDrawer } from '@/lib/use-drawer';

// Lazy load RightSidebarContent since it's only visible on lg+ screens.
const RightSidebarContent = dynamic(() => import('./right-sidebar').then(mod => ({ default: mod.RightSidebarContent })), {
  ssr: false,
});

interface SidebarLayoutProps {
  children: React.ReactNode;
}

/**
 * Desktop: main content + right sidebar side-by-side.
 * Mobile: the sidebar lives in a shared MobileDrawer (TARGET #3), opened via
 * the floating button below.
 */
export function SidebarLayout({ children }: SidebarLayoutProps) {
  const { open, setOpen, mounted } = useDrawer();

  return (
    <>
      <div className="grid gap-8 lg:grid-cols-[minmax(0,3fr)_minmax(0,1.4fr)]">
        <div>{children}</div>
        <RightSidebarContent />
      </div>

      <MobileDrawer
        open={open}
        mounted={mounted}
        onClose={() => setOpen(false)}
        title="側邊欄"
        icon={<FiLayout className="h-5 w-5 text-slate-500" />}
        closeLabel="關閉側邊欄"
      >
        <RightSidebarContent />
      </MobileDrawer>

      {/* Floating button to open the sidebar on mobile */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="fixed bottom-6 left-6 z-40 flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white/90 text-slate-600 shadow-md backdrop-blur-sm transition hover:bg-slate-50 hover:text-accent dark:border-slate-700 dark:bg-slate-900/90 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-accent lg:hidden"
        aria-label="開啟側邊欄"
      >
        <FiLayout className="h-5 w-5" />
      </button>
    </>
  );
}
