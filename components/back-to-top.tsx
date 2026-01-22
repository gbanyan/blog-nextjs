'use client';

import { useEffect, useState } from 'react';

export function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      if (window.scrollY > 400) {
        setVisible(true);
      } else {
        setVisible(false);
      }
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  if (!visible) return null;

  return (
    <button
      type="button"
      onClick={() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }}
      aria-label="回到頁面頂部"
      className="fixed bottom-6 right-4 z-40 inline-flex h-9 w-9 items-center justify-center rounded-full bg-slate-900 text-slate-50 shadow-md ring-1 ring-slate-800/70 transition hover:bg-slate-700 dark:bg-slate-100 dark:text-slate-900 dark:ring-slate-300/70 dark:hover:bg-slate-300"
    >
      <span className="text-lg leading-none">↑</span>
    </button>
  );
}

