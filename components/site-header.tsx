import Link from 'next/link';
import { ThemeToggle } from './theme-toggle';
import { siteConfig } from '@/lib/config';

export function SiteHeader() {
  return (
    <header className="border-b bg-white/80 dark:bg-gray-950/80 backdrop-blur">
      <div className="container mx-auto flex items-center justify-between px-4 py-3">
        <Link href="/" className="font-semibold">
          {siteConfig.title}
        </Link>
        <nav className="flex items-center gap-4 text-sm">
          <Link href="/blog">Blog</Link>
          <Link href="/pages/關於作者">關於</Link>
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
