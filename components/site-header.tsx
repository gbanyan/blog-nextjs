'use client';

import Link from 'next/link';
import { useState } from 'react';
import dynamic from 'next/dynamic';
import { ThemeToggle } from './theme-toggle';
import { NavMenu, NavLinkItem, IconKey } from './nav-menu';
import { SearchButton } from './search-modal';
import { siteConfig } from '@/lib/config';
import { allPages } from 'contentlayer2/generated';

// Dynamically import SearchModal to reduce initial bundle size
const SearchModal = dynamic(
  () => import('./search-modal').then((mod) => ({ default: mod.SearchModal })),
  { ssr: false }
);

export function SiteHeader() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const pages = allPages
    .slice()
    .sort((a, b) => (a.title || '').localeCompare(b.title || ''));

  const navItems: NavLinkItem[] = [
    { key: 'home', href: '/', label: '首頁', iconKey: 'home' },
    { key: 'blog', href: '/blog', label: 'Blog', iconKey: 'blog' },
    ...pages.map((page) => ({
      key: page._id,
      href: page.url,
      label: page.title,
      iconKey: getIconForPage(page.title, page.slug)
    }))
  ];

  return (
    <header className="bg-white/80 backdrop-blur transition-colors duration-200 ease-snappy dark:bg-gray-950/80">
      <div className="container mx-auto flex items-center justify-between px-4 py-3 text-slate-900 dark:text-slate-100">
        <Link
          href="/"
          className="motion-link group relative type-title text-slate-900 hover:text-accent focus-visible:outline-none focus-visible:text-accent dark:text-slate-100"
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
        />
      </div>
    </header>
  );
}


const titleOverrides = Object.fromEntries(
  Object.entries(siteConfig.navIconOverrides?.titles ?? {}).map(([key, value]) => [
    key.trim().toLowerCase(),
    value as IconKey
  ])
);

const slugOverrides = Object.fromEntries(
  Object.entries(siteConfig.navIconOverrides?.slugs ?? {}).map(([key, value]) => [
    key.trim().toLowerCase(),
    value as IconKey
  ])
);

function getIconForPage(title?: string, slug?: string): IconKey {
  const normalizedTitle = title?.trim().toLowerCase();
  if (normalizedTitle && titleOverrides[normalizedTitle]) {
    return titleOverrides[normalizedTitle];
  }

  const normalizedSlug = slug?.trim().toLowerCase();
  if (normalizedSlug && slugOverrides[normalizedSlug]) {
    return slugOverrides[normalizedSlug];
  }

  if (!title) return 'file';
  const lower = title.toLowerCase();
  if (lower.includes('關於本站')) return 'menu';
  if (lower.includes('關於') || lower.includes('about')) return 'user';
  if (lower.includes('聯絡') || lower.includes('contact')) return 'contact';
  if (lower.includes('位置') || lower.includes('map')) return 'location';
  if (lower.includes('作品') || lower.includes('portfolio')) return 'pen';
  if (lower.includes('標籤') || lower.includes('tags')) return 'tags';
  if (lower.includes('homelab')) return 'server';
  if (lower.includes('server') || lower.includes('伺服') || lower.includes('infrastructure')) return 'server';
  if (lower.includes('開發工作環境')) return 'device';
  if (lower.includes('device') || lower.includes('設備') || lower.includes('硬體') || lower.includes('hardware')) return 'device';
  return 'file';
}
