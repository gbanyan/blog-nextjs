import { ThemeToggle } from './theme-toggle';
import { SiteHeaderSearch } from './site-header-search';
import { NavMenu, NavLinkItem, IconKey } from './nav-menu';
import { LanguageSwitcher } from './language-switcher';
import { siteConfig } from '@/lib/config';
import { allPagesByLocale, allPostsByLocale, getPagesByLocale } from '@/lib/content';
import { LocalizedLink } from '@/components/localized-link';
import { NAV_TRANSITION } from '@/lib/navigation';
import { getDictionary } from '@/lib/i18n/dictionaries';
import type { Locale } from '@/lib/i18n/config';
import { LOCALE_ROUTE_MANIFEST, type LocaleRouteManifest } from '@/lib/locale-switcher';
import { documentPath } from '@/lib/locales';

interface SiteHeaderProps {
  recentPosts?: { title: string; url: string }[];
  locale: Locale;
}

export function SiteHeader({ recentPosts = [], locale }: SiteHeaderProps) {
  const dictionary = getDictionary(locale);
  const pages = getPagesByLocale(locale)
    .slice()
    .sort((a, b) => (a.title || '').localeCompare(b.title || ''));

  const localeManifest: LocaleRouteManifest = { ...LOCALE_ROUTE_MANIFEST };
  for (const document of [...allPagesByLocale, ...allPostsByLocale]) {
    if (document.locale !== 'zh-TW') continue;
    const translation = [...allPagesByLocale, ...allPostsByLocale].find(
      (candidate) =>
        candidate.locale === 'en' && candidate.translationId === document.translationId
    );
    if (translation) {
      const defaultPath = documentPath(document, 'zh-TW');
      localeManifest[defaultPath] = {
        defaultPath,
        en: documentPath(translation, 'en'),
      };
    }
  }


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
    { key: 'projects', href: '/projects', label: dictionary.navigation.projects, iconKey: 'pen' }
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
    { key: 'home', href: '/', label: dictionary.navigation.home, iconKey: 'home' },
    {
      key: 'about',
      href: aboutChildren[0]?.href,
      label: dictionary.navigation.about,
      iconKey: 'user',
      children: aboutChildren
    },
    {
      key: 'devices',
      href: deviceChildren[0]?.href,
      label: dictionary.navigation.devices,
      iconKey: 'device',
      children: deviceChildren
    }
  ];

  return (
    <header className="relative z-40 bg-white/80 backdrop-blur transition-colors duration-200 ease-snappy dark:bg-gray-950/80">
      <div className="container mx-auto flex items-center justify-between px-4 py-3 text-slate-900 dark:text-slate-100">
        <LocalizedLink
          href="/"
          prefetch={true}
          transitionTypes={[...NAV_TRANSITION]}
           className="motion-link group relative type-title whitespace-nowrap text-slate-900 hover:text-accent focus-visible:outline-none focus-visible:text-accent dark:text-slate-100 dark:hover:text-accent"
        >
          <span className="absolute -bottom-0.5 left-0 h-[2px] w-0 bg-accent transition-all duration-180 ease-snappy group-hover:w-full" aria-hidden="true" />
          {siteConfig.title}
        </LocalizedLink>
        <div className="flex items-center gap-3">
          <NavMenu items={navItems} />
          <SiteHeaderSearch recentPosts={recentPosts} />
          <LanguageSwitcher manifest={localeManifest} />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
