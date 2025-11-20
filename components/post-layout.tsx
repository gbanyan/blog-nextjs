'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { FiList, FiChevronRight } from 'react-icons/fi';
import { PostToc } from './post-toc';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function PostLayout({ children, hasToc = true, contentKey }: { children: React.ReactNode; hasToc?: boolean; contentKey?: string }) {
    const [isTocOpen, setIsTocOpen] = useState(hasToc);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const tocButton = hasToc && mounted ? (
        <button
            onClick={() => setIsTocOpen(!isTocOpen)}
            className={cn(
                "toc-button fixed bottom-20 right-4 z-50 flex items-center gap-2 rounded-full border border-white/20 bg-white/80 px-4 py-2.5 shadow-lg backdrop-blur-md hover:bg-white dark:border-white/10 dark:bg-slate-900/80 dark:hover:bg-slate-900",
                "text-sm font-medium text-slate-600 dark:text-slate-300",
                "lg:bottom-8 lg:right-20" // Adjust position for desktop
            )}
            aria-label="Toggle Table of Contents"
        >
            {isTocOpen ? (
                <FiChevronRight className="h-3.5 w-3.5" />
            ) : (
                <FiList className="h-3.5 w-3.5" />
            )}
            <span>{isTocOpen ? 'Hide' : 'Menu'}</span>
        </button>
    ) : null;

    return (
        <div className="relative">
            <div className={cn(
                "group grid gap-8 transition-all duration-500 ease-snappy",
                isTocOpen && hasToc ? "lg:grid-cols-[1fr_16rem] toc-open" : "lg:grid-cols-[1fr_0rem]"
            )}>
                {/* Main Content Area */}
                <div className="min-w-0">
                    <div className={cn("mx-auto transition-all duration-500 ease-snappy", isTocOpen && hasToc ? "max-w-3xl" : "max-w-4xl")}>
                        {children}
                    </div>
                </div>

                {/* Desktop Sidebar (TOC) */}
                <aside className="hidden lg:block">
                    <div className="sticky top-24 h-[calc(100vh-6rem)] overflow-hidden">
                        {isTocOpen && hasToc && (
                            <div className="toc-sidebar h-full overflow-y-auto pr-2">
                                <PostToc key={contentKey} />
                            </div>
                        )}
                    </div>
                </aside>
            </div>

            {/* Mobile TOC Overlay */}
            {isTocOpen && hasToc && (
                <div className="toc-mobile fixed bottom-24 right-4 z-40 w-72 rounded-2xl border border-white/20 bg-white/90 p-6 shadow-2xl backdrop-blur-xl dark:border-white/10 dark:bg-slate-900/90 lg:hidden">
                    <div className="max-h-[60vh] overflow-y-auto">
                        <PostToc key={contentKey} onLinkClick={() => setIsTocOpen(false)} />
                    </div>
                </div>
            )}

            {/* Toggle Button - Rendered via Portal */}
            {tocButton && createPortal(tocButton, document.body)}
        </div>
    );
}
