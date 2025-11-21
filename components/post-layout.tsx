'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { FiList, FiX } from 'react-icons/fi';
import { PostToc } from './post-toc';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function PostLayout({ children, hasToc = true, contentKey }: { children: React.ReactNode; hasToc?: boolean; contentKey?: string }) {
    const [isTocOpen, setIsTocOpen] = useState(false); // Default closed on mobile
    const [isDesktopTocOpen, setIsDesktopTocOpen] = useState(hasToc); // Separate state for desktop
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Lock body scroll when mobile TOC is open
    useEffect(() => {
        if (isTocOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isTocOpen]);

    const mobileToc = hasToc && mounted
        ? createPortal(
            <>
                {/* Backdrop */}
                <div
                    className={cn(
                        "fixed inset-0 z-[1140] bg-black/40 backdrop-blur-sm transition-opacity duration-300 lg:hidden",
                        isTocOpen ? "opacity-100" : "opacity-0 pointer-events-none"
                    )}
                    onClick={() => setIsTocOpen(false)}
                    aria-hidden="true"
                />

                {/* Drawer */}
                <div
                    className={cn(
                        "fixed bottom-0 left-0 right-0 z-[1150] flex max-h-[85vh] flex-col rounded-t-2xl border-t border-white/20 bg-white/95 shadow-2xl backdrop-blur-xl transition-transform duration-300 ease-snappy dark:border-white/10 dark:bg-slate-900/95 lg:hidden",
                        isTocOpen ? "translate-y-0" : "translate-y-full"
                    )}
                >
                    {/* Handle / Header */}
                    <div className="flex items-center justify-between border-b border-slate-200/50 px-6 py-4 dark:border-slate-700/50" onClick={() => setIsTocOpen(false)}>
                        <div className="flex items-center gap-2 font-semibold text-slate-900 dark:text-slate-100">
                            <FiList className="h-5 w-5 text-slate-500" />
                            <span>目錄</span>
                        </div>
                        <button
                            onClick={() => setIsTocOpen(false)}
                            className="rounded-full p-1 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                        >
                            <FiX className="h-5 w-5" />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="flex-1 overflow-y-auto px-6 py-6">
                        <PostToc
                            contentKey={contentKey}
                            onLinkClick={() => setIsTocOpen(false)}
                            showTitle={false}
                            className="w-full"
                        />
                    </div>
                </div>
            </>,
            document.body
        )
        : null;

    const tocButton = hasToc && mounted ? (
        <button
            onClick={() => setIsTocOpen(true)}
            className={cn(
                "fixed bottom-6 right-16 z-40 flex h-9 items-center gap-2 rounded-full border border-slate-200 bg-white/90 px-3 text-sm font-medium text-slate-600 shadow-md backdrop-blur-sm transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900/90 dark:text-slate-300 dark:hover:bg-slate-800 lg:hidden",
                isTocOpen ? "opacity-0 pointer-events-none" : "opacity-100"
            )}
            aria-label="Open Table of Contents"
        >
            <FiList className="h-4 w-4" />
            <span>目錄</span>
        </button>
    ) : null;

    const desktopTocButton = hasToc && mounted ? (
        <button
            onClick={() => setIsDesktopTocOpen(!isDesktopTocOpen)}
            className={cn(
                "fixed bottom-6 right-16 z-40 hidden h-9 items-center gap-2 rounded-full border border-slate-200 bg-white/90 px-3 text-sm font-medium text-slate-600 shadow-md backdrop-blur-sm transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900/90 dark:text-slate-300 dark:hover:bg-slate-800 lg:flex",
            )}
            aria-label={isDesktopTocOpen ? "Close Table of Contents" : "Open Table of Contents"}
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
                    <div className={cn("mx-auto transition-all duration-500 ease-snappy", isDesktopTocOpen && hasToc ? "max-w-3xl" : "max-w-4xl")}>
                        {children}
                    </div>
                </div>

                {/* Desktop Sidebar (TOC) */}
                <aside className="hidden lg:block">
                    <div className="sticky top-24 h-[calc(100vh-6rem)] overflow-hidden">
                        {isDesktopTocOpen && hasToc && (
                            <div className="toc-sidebar h-full overflow-y-auto pr-2">
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
