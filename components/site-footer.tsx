import { siteConfig } from '@/lib/config';

export function SiteFooter() {
  return (
    <footer className="border-t py-4 text-center text-sm text-gray-500">
      © {new Date().getFullYear()} {siteConfig.author}
    </footer>
  );
}
