'use client';

import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const next = theme === 'dark' ? 'light' : 'dark';

  return (
    <button
      type="button"
      className="inline-flex h-8 w-8 items-center justify-center rounded-full text-slate-500 transition hover:bg-slate-100 hover:text-slate-800 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100"
      onClick={() => setTheme(next)}
      aria-label={theme === 'dark' ? '切換為淺色主題' : '切換為深色主題'}
    >
      <span className="text-lg leading-none">
        {theme === 'dark' ? '●' : '○'}
      </span>
    </button>
  );
}
