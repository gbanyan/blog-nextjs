import Link from 'next/link';
import { ThemeToggle } from './theme-toggle';
import { siteConfig } from '@/lib/config';
import { allPages } from 'contentlayer/generated';

export function SiteHeader() {
  const pages = allPages
    .slice()
    .sort((a, b) => (a.title || '').localeCompare(b.title || ''));

  return (
    <header className="bg-white/80 backdrop-blur dark:bg-gray-950/80">
      <div className="container mx-auto flex items-center justify-between px-4 py-3 text-slate-900 dark:text-slate-100">
        <Link
          href="/"
          className="font-semibold transition hover:text-accent-textDark focus-visible:outline-none focus-visible:text-accent-textDark"
        >
          {siteConfig.title}
        </Link>
        <nav className="flex items-center gap-4 text-sm">
          <Link
            href="/blog"
            className="transition hover:text-accent-textDark focus-visible:outline-none focus-visible:text-accent-textDark"
          >
            Blog
          </Link>
          {pages.map((page) => (
            <Link
              key={page._id}
              href={page.url}
              className="transition hover:text-accent-textDark focus-visible:outline-none focus-visible:text-accent-textDark"
            >
              {page.title}
            </Link>
          ))}
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
