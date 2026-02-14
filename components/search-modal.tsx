'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Command } from 'cmdk';
import {
  FiSearch,
  FiHome,
  FiFileText,
  FiTag,
  FiBook
} from 'react-icons/fi';
import { cn } from '@/lib/utils';

interface PagefindResult {
  url: string;
  meta: { title?: string };
  excerpt?: string;
}

interface QuickAction {
  id: string;
  title: string;
  url: string;
  icon: React.ReactNode;
}

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  recentPosts?: { title: string; url: string }[];
}

export function SearchModal({
  isOpen,
  onClose,
  recentPosts = []
}: SearchModalProps) {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [results, setResults] = useState<PagefindResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagefindReady, setPagefindReady] = useState(false);
  const pagefindRef = useRef<{
    init: () => void;
    options: (opts: { bundlePath: string }) => Promise<void>;
    preload: (query: string) => void;
    debouncedSearch: (
      query: string,
      opts: object,
      debounceMs: number
    ) => Promise<{ results: { data: () => Promise<PagefindResult> }[] } | null>;
  } | null>(null);

  // Initialize Pagefind when modal opens
  useEffect(() => {
    if (!isOpen) return;

    const loadPagefind = async () => {
      try {
        const pagefindUrl = `${window.location.origin}/_pagefind/pagefind.js`;
        const pagefind = await import(/* webpackIgnore: true */ pagefindUrl);
        await pagefind.options({ bundlePath: '/_pagefind/' });
        pagefind.init();
        pagefindRef.current = pagefind;
        setPagefindReady(true);
      } catch (error) {
        console.error('Failed to load Pagefind:', error);
      }
    };

    loadPagefind();

    return () => {
      pagefindRef.current = null;
      setPagefindReady(false);
      setSearch('');
      setResults([]);
    };
  }, [isOpen]);

  // Debounced search when user types
  useEffect(() => {
    const query = search.trim();
    if (!query || !pagefindRef.current) {
      setResults([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    pagefindRef.current.preload(query);

    const timer = setTimeout(async () => {
      const pagefind = pagefindRef.current;
      if (!pagefind) return;

      const searchResult = await pagefind.debouncedSearch(query, {}, 300);
      if (searchResult === null) return; // Superseded by newer search

      const dataPromises = searchResult.results.slice(0, 10).map((r) => r.data());
      const items = await Promise.all(dataPromises);
      setResults(items);
      setLoading(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [search, pagefindReady]);

  const handleSelect = useCallback(
    (url: string) => {
      onClose();
      router.push(url);
    },
    [onClose, router]
  );

  const navActions: QuickAction[] = [
    { id: 'home', title: '首頁', url: '/', icon: <FiHome className="size-4" /> },
    {
      id: 'blog',
      title: '部落格',
      url: '/blog',
      icon: <FiFileText className="size-4" />
    },
    {
      id: 'tags',
      title: '標籤',
      url: '/tags',
      icon: <FiTag className="size-4" />
    }
  ];

  const recentPostActions: QuickAction[] = recentPosts.map((p) => ({
    id: `post-${p.url}`,
    title: p.title,
    url: p.url,
    icon: <FiBook className="size-4" />
  }));

  return (
    <Command.Dialog
      open={isOpen}
      onOpenChange={(open) => !open && onClose()}
      label="全站搜尋"
      shouldFilter={false}
      className="fixed left-1/2 top-[20%] z-[9999] w-full max-w-2xl -translate-x-1/2 rounded-2xl border border-white/40 bg-white/95 shadow-2xl backdrop-blur-md dark:border-white/10 dark:bg-slate-900/95"
    >
      <div className="flex items-center border-b border-slate-200 px-4 dark:border-slate-700">
        <FiSearch className="size-5 shrink-0 text-slate-400" />
        <Command.Input
          value={search}
          onValueChange={setSearch}
          placeholder="搜尋文章或快速導航…"
          className="flex h-14 w-full bg-transparent px-3 text-base text-slate-900 placeholder:text-slate-400 focus:outline-none dark:text-slate-100 dark:placeholder:text-slate-500"
        />
      </div>

      <Command.List className="max-h-[min(60vh,400px)] overflow-y-auto p-2">
        {loading && (
          <Command.Loading className="flex items-center justify-center py-8 text-sm text-slate-500 dark:text-slate-400">
            搜尋中…
          </Command.Loading>
        )}

        {!loading && !search.trim() && (
          <>
            <Command.Group heading="導航" className="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-slate-500 [&_[cmdk-group-heading]]:dark:text-slate-400">
              {navActions.map((action) => (
                <Command.Item
                  key={action.id}
                  value={`${action.title} ${action.url}`}
                  onSelect={() => handleSelect(action.url)}
                  className={cn(
                    'flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-slate-700 outline-none transition-colors',
                    'data-[selected=true]:bg-slate-100 data-[selected=true]:text-slate-900',
                    'dark:text-slate-300 dark:data-[selected=true]:bg-slate-800 dark:data-[selected=true]:text-slate-100'
                  )}
                >
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-md bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                    {action.icon}
                  </span>
                  <span className="truncate">{action.title}</span>
                </Command.Item>
              ))}
            </Command.Group>
            {recentPostActions.length > 0 && (
              <Command.Group heading="最近文章" className="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-slate-500 [&_[cmdk-group-heading]]:dark:text-slate-400">
                {recentPostActions.map((action) => (
                  <Command.Item
                    key={action.id}
                    value={`${action.title} ${action.url}`}
                    onSelect={() => handleSelect(action.url)}
                    className={cn(
                      'flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-slate-700 outline-none transition-colors',
                      'data-[selected=true]:bg-slate-100 data-[selected=true]:text-slate-900',
                      'dark:text-slate-300 dark:data-[selected=true]:bg-slate-800 dark:data-[selected=true]:text-slate-100'
                    )}
                  >
                    <span className="flex size-8 shrink-0 items-center justify-center rounded-md bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                      {action.icon}
                    </span>
                    <span className="truncate">{action.title}</span>
                  </Command.Item>
                ))}
              </Command.Group>
            )}
          </>
        )}

        {!loading && search.trim() && results.length > 0 && (
          <Command.Group heading="搜尋結果" className="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-slate-500 [&_[cmdk-group-heading]]:dark:text-slate-400">
            {results.map((result, i) => (
              <Command.Item
                key={`${result.url}-${i}`}
                value={`${result.meta?.title ?? ''} ${result.url}`}
                onSelect={() => handleSelect(result.url)}
                className={cn(
                  'flex cursor-pointer flex-col gap-0.5 rounded-lg px-3 py-2.5 outline-none transition-colors',
                  'data-[selected=true]:bg-slate-100 dark:data-[selected=true]:bg-slate-800'
                )}
              >
                <span className="truncate text-sm font-medium text-slate-900 dark:text-slate-100">
                  {result.meta?.title ?? result.url}
                </span>
                {result.excerpt && (
                  <span
                    className="line-clamp-2 text-xs text-slate-500 dark:text-slate-400 [&_mark]:bg-yellow-200 [&_mark]:font-semibold [&_mark]:text-slate-900 dark:[&_mark]:bg-yellow-600 dark:[&_mark]:text-slate-100"
                    dangerouslySetInnerHTML={{ __html: result.excerpt }}
                  />
                )}
              </Command.Item>
            ))}
          </Command.Group>
        )}

        <Command.Empty className="py-8 text-center text-sm text-slate-500 dark:text-slate-400">
          找不到結果
        </Command.Empty>
      </Command.List>

      <div className="border-t border-slate-200 px-4 py-2 text-xs text-slate-500 dark:border-slate-700 dark:text-slate-400">
        <span>ESC 關閉</span>
        <span className="ml-4">⌘K 開啟</span>
      </div>
    </Command.Dialog>
  );
}

export function SearchButton({ onClick }: { onClick: () => void }) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        onClick();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClick]);

  return (
    <button
      onClick={onClick}
      className="motion-link inline-flex h-9 shrink-0 items-center gap-2 rounded-full bg-slate-100 px-3 py-1.5 text-sm text-slate-600 transition hover:bg-slate-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
      aria-label="搜尋 (Cmd+K)"
    >
      <FiSearch className="h-3.5 w-3.5 shrink-0" />
      <span className="hidden shrink-0 whitespace-nowrap sm:inline">搜尋</span>
      <kbd className="hidden rounded bg-white px-1.5 py-0.5 text-xs font-semibold text-slate-500 shadow-sm dark:bg-slate-900 dark:text-slate-400 sm:inline-block">
        ⌘K
      </kbd>
    </button>
  );
}
