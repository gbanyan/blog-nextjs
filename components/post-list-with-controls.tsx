'use client';

import { useEffect, useMemo, useState } from 'react';
import type { Post } from 'contentlayer/generated';
import { siteConfig } from '@/lib/config';
import { PostListItem } from './post-list-item';

interface Props {
  posts: Post[];
  pageSize?: number;
}

type SortOrder = 'new' | 'old';

export function PostListWithControls({ posts, pageSize }: Props) {
  const [sortOrder, setSortOrder] = useState<SortOrder>('new');
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');

  const size = pageSize ?? siteConfig.postsPerPage ?? 5;

  const normalizedQuery = searchTerm.trim().toLowerCase();

  const filteredPosts = useMemo(() => {
    if (!normalizedQuery) return posts;

    return posts.filter((post) => {
      const haystack = [
        post.title,
        post.description,
        post.custom_excerpt,
        post.tags?.join(' ')
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();
      return haystack.includes(normalizedQuery);
    });
  }, [posts, normalizedQuery]);

  const sortedPosts = useMemo(() => {
    const arr = [...filteredPosts];
    arr.sort((a, b) => {
      const aDate = a.published_at
        ? new Date(a.published_at).getTime()
        : 0;
      const bDate = b.published_at
        ? new Date(b.published_at).getTime()
        : 0;
      return sortOrder === 'new' ? bDate - aDate : aDate - bDate;
    });
    return arr;
  }, [filteredPosts, sortOrder]);

  const totalPages = Math.max(1, Math.ceil(sortedPosts.length / size));
  const currentPage = Math.min(page, totalPages);
  const start = (currentPage - 1) * size;
  const currentPosts = sortedPosts.slice(start, start + size);

  useEffect(() => {
    setPage(1);
  }, [normalizedQuery]);

  const handleChangeSort = (order: SortOrder) => {
    setSortOrder(order);
    setPage(1);
  };

  const goToPage = (p: number) => {
    if (p < 1 || p > totalPages) return;
    setPage(p);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 text-xs text-slate-500 dark:text-slate-400 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <span>排序：</span>
          <button
            type="button"
            onClick={() => handleChangeSort('new')}
            className={`rounded-full px-2 py-0.5 ${
              sortOrder === 'new'
                ? 'bg-blue-600 text-white dark:bg-blue-500'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
            }`}
          >
            新到舊
          </button>
          <button
            type="button"
            onClick={() => handleChangeSort('old')}
            className={`rounded-full px-2 py-0.5 ${
              sortOrder === 'old'
                ? 'bg-blue-600 text-white dark:bg-blue-500'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
            }`}
          >
            舊到新
          </button>
        </div>
        <div className="flex w-full items-center gap-2 text-sm sm:w-auto">
          <label htmlFor="post-search" className="text-xs">
            搜尋：
          </label>
          <input
            id="post-search"
            type="search"
            placeholder="輸入標題或標籤"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            className="w-full rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-700 shadow-sm transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:focus:ring-blue-500 sm:w-56"
          />
        </div>
      </div>

      <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
        <p>
          第 {currentPage} / {totalPages} 頁 · 共 {sortedPosts.length} 篇
          {normalizedQuery && `（搜尋「${searchTerm}」）`}
        </p>
        {normalizedQuery && sortedPosts.length === 0 && (
          <button
            type="button"
            onClick={() => setSearchTerm('')}
            className="text-blue-600 underline-offset-2 hover:underline dark:text-blue-400"
          >
            清除搜尋
          </button>
        )}
      </div>

      {currentPosts.length === 0 ? (
        <div className="rounded-lg border border-dashed border-slate-200 p-6 text-center text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400">
          找不到符合關鍵字的文章，換個詞再試試？
        </div>
      ) : (
        <ul className="space-y-3">
          {currentPosts.map((post) => (
            <PostListItem key={post._id} post={post} />
          ))}
        </ul>
      )}

      {totalPages > 1 && currentPosts.length > 0 && (
        <nav className="flex items-center justify-center gap-3 text-xs text-slate-600 dark:text-slate-300">
          <button
            type="button"
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
            className="rounded border border-slate-200 px-2 py-1 disabled:opacity-40 dark:border-slate-700"
          >
            上一頁
          </button>
          <div className="flex items-center gap-1">
            {Array.from({ length: totalPages }).map((_, i) => {
              const p = i + 1;
              const isActive = p === currentPage;
              return (
                <button
                  key={p}
                  type="button"
                  onClick={() => goToPage(p)}
                  className={`h-7 w-7 rounded text-xs ${
                    isActive
                      ? 'bg-blue-600 text-white dark:bg-blue-500'
                      : 'hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  {p}
                </button>
              );
            })}
          </div>
          <button
            type="button"
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="rounded border border-slate-200 px-2 py-1 disabled:opacity-40 dark:border-slate-700"
          >
            下一頁
          </button>
        </nav>
      )}
    </div>
  );
}
