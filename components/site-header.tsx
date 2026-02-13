'use client';

import { Link } from 'next-view-transitions';
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

interface SiteHeaderProps {
  recentPosts?: { title: string; url: string }[];
}

export function SiteHeader({ recentPosts = [] }: SiteHeaderProps) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const pages = allPages
    .slice()
    .sort((a, b) => (a.title || '').localeCompare(b.title || ''));

  const findPage = (title: string) => pages.find((page) => page.title === title);

  const aboutChildren = [
    { title: '關於作者', label: '作者' },
    { title: '關於本站', label: '本站' }
  ]
    .map(({ title, label }) => {
      const page = findPage(title);
      if (!page) return null;
      return {
        key: page._id,
        href: page.url,
        label,
        iconKey: getIconForPage(page.title, page.slug)
      } satisfies NavLinkItem;
    })
    .filter(Boolean) as NavLinkItem[];

  const deviceChildren = [
    { title: '開發工作環境', label: '開發環境' },
    { title: 'HomeLab', label: 'HomeLab' }
  ]
    .map(({ title, label }) => {
      const page = findPage(title);
      if (!page) return null;
      return {
        key: page._id,
        href: page.url,
        label,
        iconKey: getIconForPage(page.title, page.slug)
      } satisfies NavLinkItem;
    })
    .filter(Boolean) as NavLinkItem[];

  const navItems: NavLinkItem[] = [
    { key: 'home', href: '/', label: '首頁', iconKey: 'home' },
    { key: 'projects', href: '/projects', label: '作品', iconKey: 'pen' },
    {
      key: 'about',
      href: aboutChildren[0]?.href,
      label: '關於',
      iconKey: 'user',
      children: aboutChildren
    },
    {
      key: 'devices',
      href: deviceChildren[0]?.href,
      label: '裝置',
      iconKey: 'device',
      children: deviceChildren
    }
  ];

  return (
    <header className="relative z-40 bg-white/80 backdrop-blur transition-colors duration-200 ease-snappy dark:bg-gray-950/80">
      <div className="container mx-auto flex items-center justify-between px-4 py-3 text-slate-900 dark:text-slate-100">
        <Link
          href="/"
          prefetch={true}
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
          recentPosts={recentPosts}
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
