'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { SearchButton } from './search-modal';

const SearchModal = dynamic(
  () => import('./search-modal').then((mod) => ({ default: mod.SearchModal })),
  { ssr: false }
);

/**
 * Tiny client island for the header search. Keeps the open/close state
 * out of the server-rendered header so `site-header.tsx` can stay a
 * Server Component (no Contentlayer/client state in the initial bundle).
 */
export function SiteHeaderSearch({
  recentPosts = [],
}: {
  recentPosts?: { title: string; url: string }[];
}) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <>
      <SearchButton onClick={() => setIsSearchOpen(true)} />
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        recentPosts={recentPosts}
      />
    </>
  );
}
