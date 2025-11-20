'use client';

import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { FiSearch, FiX } from 'react-icons/fi';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const pagefindUIRef = useRef<any>(null);

  useEffect(() => {
    if (!isOpen) return;

    let link: HTMLLinkElement | null = null;
    let script: HTMLScriptElement | null = null;

    // Load Pagefind UI dynamically when modal opens
    const loadPagefind = async () => {
      if (pagefindUIRef.current) {
        // Already loaded
        return;
      }

      try {
        // Load Pagefind UI CSS
        link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = '/_pagefind/pagefind-ui.css';
        document.head.appendChild(link);

        // Load Pagefind UI JS
        script = document.createElement('script');
        script.src = '/_pagefind/pagefind-ui.js';
        script.onload = () => {
          if (searchContainerRef.current && (window as any).PagefindUI) {
            pagefindUIRef.current = new (window as any).PagefindUI({
              element: searchContainerRef.current,
              bundlePath: '/_pagefind/',
              showSubResults: true,
              showImages: false,
              excerptLength: 15,
              resetStyles: false,
              autofocus: true,
              translations: {
                placeholder: '搜尋文章...',
                clear_search: '清除',
                load_more: '載入更多結果',
                search_label: '搜尋此網站',
                filters_label: '篩選',
                zero_results: '找不到 [SEARCH_TERM] 的結果',
                many_results: '找到 [COUNT] 個 [SEARCH_TERM] 的結果',
                one_result: '找到 [COUNT] 個 [SEARCH_TERM] 的結果',
                alt_search: '找不到 [SEARCH_TERM] 的結果。改為顯示 [DIFFERENT_TERM] 的結果',
                search_suggestion: '找不到 [SEARCH_TERM] 的結果。請嘗試以下搜尋：',
                searching: '搜尋中...'
              }
            });
            setIsLoaded(true);

            // Auto-focus the search input after a short delay
            setTimeout(() => {
              const input = searchContainerRef.current?.querySelector('input[type="search"]') as HTMLInputElement;
              if (input) {
                input.focus();
              }
            }, 100);
          }
        };
        document.head.appendChild(script);
      } catch (error) {
        console.error('Failed to load Pagefind:', error);
      }
    };

    loadPagefind();

    // Cleanup function to prevent duplicate initializations
    return () => {
      if (link && link.parentNode) {
        link.parentNode.removeChild(link);
      }
      if (script && script.parentNode) {
        script.parentNode.removeChild(script);
      }
      if (pagefindUIRef.current && pagefindUIRef.current.destroy) {
        pagefindUIRef.current.destroy();
        pagefindUIRef.current = null;
      }
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  useEffect(() => {
    // Prevent body scroll when modal is open
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  // Use portal to render modal at document body level to avoid z-index stacking context issues
  if (typeof window === 'undefined') return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-start justify-center bg-black/50 backdrop-blur-sm pt-20 px-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-3xl rounded-2xl border border-white/40 bg-white/95 shadow-2xl backdrop-blur-md dark:border-white/10 dark:bg-slate-900/95"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4 dark:border-slate-700">
          <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
            <FiSearch className="h-5 w-5" />
            <span className="text-sm font-medium">全站搜尋</span>
          </div>
          <button
            onClick={onClose}
            className="inline-flex h-8 w-8 items-center justify-center rounded-full text-slate-500 transition hover:bg-slate-100 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200"
            aria-label="關閉搜尋"
          >
            <FiX className="h-5 w-5" />
          </button>
        </div>

        {/* Search Container */}
        <div className="max-h-[60vh] overflow-y-auto p-6">
          <div
            ref={searchContainerRef}
            className="pagefind-search"
            data-pagefind-ui
          />
          {!isLoaded && (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-500 border-r-transparent"></div>
                <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">
                  載入搜尋引擎...
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-slate-200 px-6 py-3 text-xs text-slate-500 dark:border-slate-700 dark:text-slate-400">
          <div className="flex items-center justify-between">
            <span>按 ESC 關閉</span>
            <span className="text-right">支援中英文全文搜尋</span>
          </div>
        </div>
      </div>
    </div>,
    document.body
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
      className="motion-link inline-flex h-9 items-center gap-2 rounded-full bg-slate-100 px-3 py-1.5 text-sm text-slate-600 transition hover:bg-slate-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
      aria-label="搜尋 (Cmd+K)"
    >
      <FiSearch className="h-3.5 w-3.5" />
      <span className="hidden sm:inline">搜尋</span>
      <kbd className="hidden rounded bg-white px-1.5 py-0.5 text-xs font-semibold text-slate-500 shadow-sm dark:bg-slate-900 dark:text-slate-400 sm:inline-block">
        ⌘K
      </kbd>
    </button>
  );
}
