import { ThemeToggle } from './theme-toggle';
import { SiteHeaderSearch } from './site-header-search';
import { NavMenu, NavLinkItem, IconKey } from './nav-menu';
import { LanguageSwitcher } from './language-switcher';
import { siteConfig } from '@/lib/config';
import { allPages } from '@/lib/content';
import Link from 'next/link';
import { NAV_TRANSITION } from '@/lib/navigation';

interface SiteHeaderProps {
  recentPosts?: { title: string; url: string }[];
}

export function SiteHeader({ recentPosts = [] }: SiteHeaderProps) {
  const pages = allPages
    .slice()
    .sort((a, b) => (a.title || '').localeCompare(b.title || ''));


  // Nav groups are driven by declarative frontmatter (TARGET #2): pages
  // declare `nav_category`, `nav_label` and `icon` instead of us
  // string-matching titles/slugs at runtime.
  const aboutChildren: NavLinkItem[] = [
    ...pages
      .filter((page) => page.nav_category === 'about')
      .map((page) => ({
        key: page._id,
        href: page.url,
        label: page.nav_label || page.title,
        iconKey: (page.icon as IconKey) ?? 'user'
      })),
    { key: 'projects', href: '/projects', label: '作品', iconKey: 'pen' }
  ];

  const deviceChildren: NavLinkItem[] = pages
    .filter((page) => page.nav_category === 'device')
    .map((page) => ({
      key: page._id,
      href: page.url,
      label: page.nav_label || page.title,
      iconKey: (page.icon as IconKey) ?? 'device'
    }));

  const navItems: NavLinkItem[] = [
    { key: 'home', href: '/', label: '首頁', iconKey: 'home' },
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
          transitionTypes={[...NAV_TRANSITION]}
           className="motion-link group relative type-title whitespace-nowrap text-slate-900 hover:text-accent focus-visible:outline-none focus-visible:text-accent dark:text-slate-100 dark:hover:text-accent"
        >
          <span className="absolute -bottom-0.5 left-0 h-[2px] w-0 bg-accent transition-all duration-180 ease-snappy group-hover:w-full" aria-hidden="true" />
          {siteConfig.title}
        </Link>
        <div className="flex items-center gap-3">
          <NavMenu items={navItems} />
          <SiteHeaderSearch recentPosts={recentPosts} />
          <LanguageSwitcher />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
