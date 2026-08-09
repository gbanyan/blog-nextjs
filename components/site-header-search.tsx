'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { SearchButton } from './search-modal';
import type { Locale } from '@/lib/i18n/config';
import { getDictionary } from '@/lib/i18n/dictionaries';

const SearchModal = dynamic(
  () => import('./search-modal').then((mod) => ({ default: mod.SearchModal })),
  { ssr: false }
);

/**
 * Tiny client island for the header search. Keeps the open/close state
 * out of the server-rendered header so `site-header.tsx` can stay a
 * Server Component without client state in the initial bundle.
 */
export function SiteHeaderSearch({
  recentPosts = [],
  locale,
}: {
  recentPosts?: { title: string; url: string }[];
  locale: Locale;
}) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const labels = getDictionary(locale).search;

  return (
    <>
      <SearchButton onClick={() => setIsSearchOpen(true)} labels={labels} />
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        recentPosts={recentPosts}
        labels={labels}
      />
    </>
  );
}
