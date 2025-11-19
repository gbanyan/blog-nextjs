'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faListUl, faChevronRight, faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { PostToc } from './post-toc';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function PostLayout({ children, hasToc = true }: { children: React.ReactNode; hasToc?: boolean }) {
    const [isTocOpen, setIsTocOpen] = useState(hasToc);

    return (
        <div className="relative">
            <div className={cn(
                "group grid gap-8 transition-all duration-500 ease-snappy",
                isTocOpen && hasToc ? "lg:grid-cols-[1fr_16rem] toc-open" : "lg:grid-cols-[1fr_0rem]"
            )}>
                {/* Main Content Area */}
                <div className="min-w-0">
                    <motion.div
                        layout
                        className={cn("mx-auto transition-all duration-500 ease-snappy", isTocOpen && hasToc ? "max-w-3xl" : "max-w-4xl")}
                    >
                        {children}
                    </motion.div>
                </div>

                {/* Sidebar (TOC) */}
                <aside className="hidden lg:block">
                    <div className="sticky top-24 h-[calc(100vh-6rem)] overflow-hidden">
                        <AnimatePresence mode="wait">
                            {isTocOpen && hasToc && (
                                <motion.div
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    transition={{ duration: 0.3 }}
                                    className="h-full overflow-y-auto pr-2"
                                >
                                    <PostToc />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </aside>
            </div>

            {/* Toggle Button (Glassmorphism Pill) */}
            {hasToc && (
                <motion.button
                    layout
                    onClick={() => setIsTocOpen(!isTocOpen)}
                    className={cn(
                        "fixed bottom-8 right-20 z-50 flex items-center gap-2 rounded-full border border-white/20 bg-white/80 px-4 py-2.5 shadow-lg backdrop-blur-md transition-all hover:bg-white hover:scale-105 dark:border-white/10 dark:bg-slate-900/80 dark:hover:bg-slate-900",
                        "text-sm font-medium text-slate-600 dark:text-slate-300"
                    )}
                    whileTap={{ scale: 0.95 }}
                    aria-label="Toggle Table of Contents"
                >
                    <FontAwesomeIcon
                        icon={isTocOpen ? faChevronRight : faListUl}
                        className="h-3.5 w-3.5"
                    />
                    <span>{isTocOpen ? 'Hide' : 'Menu'}</span>
                </motion.button>
            )}
        </div>
    );
}
