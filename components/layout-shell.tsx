import { SiteHeader } from './site-header';
import { SiteFooter } from './site-footer';
import { BackToTop } from './back-to-top';
import { allPages } from 'contentlayer2/generated';
import { siteConfig } from '@/lib/config';
import type { NavLinkItem, IconKey } from './nav-menu';

interface LayoutShellProps {
  children: React.ReactNode;
  recentPosts?: { title: string; url: string }[];
}

// Pre-compute at module level – allPages and siteConfig are static build-time data
const navItems = buildNavItems();

export function LayoutShell({ children, recentPosts = [] }: LayoutShellProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader recentPosts={recentPosts} navItems={navItems} />
      <main className="flex-1 container mx-auto px-4 py-6">
        {children}
      </main>
      <SiteFooter />
      <BackToTop />
    </div>
  );
}

/* ── Nav-item helpers (server-only) ─────────────────────────── */

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

function buildNavItems(): NavLinkItem[] {
  const pages = allPages
    .slice()
    .sort((a, b) => (a.title || '').localeCompare(b.title || ''));

  const findPage = (title: string) => pages.find((page) => page.title === title);

  const aboutChildren: NavLinkItem[] = [
    ...(
      [
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
        .filter(Boolean) as NavLinkItem[]
    ),
    { key: 'projects', href: '/projects', label: '作品', iconKey: 'pen' }
  ];

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

  return [
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
}
