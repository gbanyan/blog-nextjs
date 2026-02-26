'use client';

import { Link } from 'next-view-transitions';
import { useState } from 'react';
import dynamic from 'next/dynamic';
import { ThemeToggle } from './theme-toggle';
import { NavMenu, NavLinkItem } from './nav-menu';
import { SearchButton } from './search-modal';
import { siteConfig } from '@/lib/config';

// Dynamically import SearchModal to reduce initial bundle size
const SearchModal = dynamic(
  () => import('./search-modal').then((mod) => ({ default: mod.SearchModal })),
  { ssr: false }
);

interface SiteHeaderProps {
  recentPosts?: { title: string; url: string }[];
  navItems: NavLinkItem[];
}

export function SiteHeader({ recentPosts = [], navItems }: SiteHeaderProps) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <header className="relative z-40 bg-white/80 backdrop-blur transition-colors duration-200 ease-snappy dark:bg-gray-950/80">
      <div className="container mx-auto flex items-center justify-between px-4 py-3 text-slate-900 dark:text-slate-100">
        <Link
          href="/"
          prefetch={true}
          className="motion-link group relative type-title whitespace-nowrap text-slate-900 hover:text-accent focus-visible:outline-none focus-visible:text-accent dark:text-slate-100"
        >
          <span className="absolute -bottom-0.5 left-0 h-[2px] w-0 bg-accent transition-all duration-180 ease-snappy group-hover:w-full" aria-hidden="true" />
          {siteConfig.title}
        </Link>
        <div className="flex items-center gap-3">
          <NavMenu items={navItems} />
          <SearchButton onClick={() => setIsSearchOpen(true)} />
          <ThemeToggle />
        </div>
        <SearchModal
          isOpen={isSearchOpen}
          onClose={() => setIsSearchOpen(false)}
          recentPosts={recentPosts}
        />
      </div>
    </header>
  );
}
