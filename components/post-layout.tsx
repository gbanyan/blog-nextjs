'use client';

import { useState } from 'react';
import { createPortal } from 'react-dom';
import { FiList } from 'react-icons/fi';
import dynamic from 'next/dynamic';
import { cn } from '@/lib/utils';
import { MobileDrawer } from './mobile-drawer';
import { useDrawer } from '@/lib/use-drawer';

// Lazy load PostToc since it's not critical for initial render
const PostToc = dynamic(() => import('./post-toc').then(mod => ({ default: mod.PostToc })), {
  ssr: false,
});

export function PostLayout({ children, hasToc = true, contentKey, wide }: { children: React.ReactNode; hasToc?: boolean; contentKey?: string; wide?: boolean }) {
    const { open: isTocOpen, setOpen: setIsTocOpen, mounted } = useDrawer();
    const [isDesktopTocOpen, setIsDesktopTocOpen] = useState(false);

    const mobileToc = hasToc ? (
        <MobileDrawer
            open={isTocOpen}
            mounted={mounted}
            onClose={() => setIsTocOpen(false)}
            title="目錄"
            icon={<FiList className="h-5 w-5 text-slate-500" />}
            closeLabel="關閉文章目錄"
            side="bottom"
            backdropZ={1140}
            panelZ={1150}
        >
            <PostToc contentKey={contentKey} />
        </MobileDrawer>
    ) : null;

    const tocButton = hasToc && mounted ? (
        <button
            onClick={() => setIsTocOpen(true)}
             className={cn(
                "fixed bottom-6 right-16 z-40 flex h-9 items-center gap-2 rounded-full border border-slate-200 bg-white/90 px-3 text-sm font-medium text-slate-600 shadow-md backdrop-blur-sm transition hover:bg-slate-50 hover:text-accent dark:border-slate-700 dark:bg-slate-900/90 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-accent lg:hidden",
                isTocOpen ? "opacity-0 pointer-events-none" : "opacity-100"
              )}
            aria-label="開啟文章目錄"
        >
            <FiList className="h-4 w-4" />
            <span>目錄</span>
        </button>
    ) : null;

    const desktopTocButton = hasToc && mounted ? (
        <button
            onClick={() => setIsDesktopTocOpen(!isDesktopTocOpen)}
             className={cn(
                "fixed bottom-6 right-16 z-40 hidden h-9 items-center gap-2 rounded-full border border-slate-200 bg-white/90 px-3 text-sm font-medium text-slate-600 shadow-md backdrop-blur-sm transition hover:bg-slate-50 hover:text-accent dark:border-slate-700 dark:bg-slate-900/90 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-accent lg:flex",
              )}
            aria-label={isDesktopTocOpen ? "隱藏文章目錄" : "開啟文章目錄"}
        >
            <FiList className="h-4 w-4" />
            <span>{isDesktopTocOpen ? '隱藏目錄' : '顯示目錄'}</span>
        </button>
    ) : null;

    return (
        <div className="relative">
            <div className={cn(
                "group grid gap-8 transition-all duration-500 ease-snappy",
                isDesktopTocOpen && hasToc ? "lg:grid-cols-[1fr_16rem] toc-open" : "lg:grid-cols-[1fr_0rem]"
            )}>
                {/* Main Content Area */}
                <div className="min-w-0">
                    <div className={cn("mx-auto transition-all duration-500 ease-snappy", isDesktopTocOpen && hasToc ? "max-w-3xl" : wide ? "max-w-5xl" : "max-w-4xl")}>
                        {children}
                    </div>
                </div>

                {/* Desktop Sidebar (TOC) */}
                <aside className="hidden lg:block">
                    <div className="sticky top-24 h-[calc(100vh-6rem)] overflow-hidden">
                        {isDesktopTocOpen && hasToc && (
                            <div className="toc-sidebar scroll-panel h-full pr-2">
                                <PostToc contentKey={contentKey} />
                            </div>
                        )}
                    </div>
                </aside>
            </div>

            {/* Mobile TOC Overlay */}
            {mobileToc}

            {/* Toggle Buttons - Rendered via Portal */}
            {mounted && createPortal(
                <>
                    {tocButton}
                    {desktopTocButton}
                </>,
                document.body
            )}
        </div>
    );
}
