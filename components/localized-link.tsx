'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { ComponentProps } from 'react';

type LocalizedLinkProps = Omit<ComponentProps<typeof Link>, 'href'> & {
  href: string;
};

function localizeHref(href: string, pathname: string | null): string {
  if (!href.startsWith('/') || href.startsWith('//')) return href;
  const firstSegment = pathname?.split('/')[1];
  if (firstSegment !== 'en') return href;
  if (href === '/en' || href.startsWith('/en/')) return href;
  return href === '/' ? '/en' : `/en${href}`;
}

export function LocalizedLink({ href, ...props }: LocalizedLinkProps) {
  const pathname = usePathname();
  return <Link {...props} href={localizeHref(href, pathname)} />;
}
