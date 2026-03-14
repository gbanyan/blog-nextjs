'use client';

import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import { FiMoon, FiSun } from 'react-icons/fi';

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
  const isDark = theme === 'dark';

  return (
    <button
      type="button"
      className="inline-flex h-9 w-9 items-center justify-center rounded-full text-accent-textLight transition-all duration-300 ease-out-quarter hover:-translate-y-1 hover:scale-110 hover:bg-accent-soft hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40 dark:text-accent-textDark dark:hover:bg-accent-soft dark:hover:text-accent"
      onClick={() => setTheme(next)}
      aria-label={theme === 'dark' ? '切換為淺色主題' : '切換為深色主題'}
    >
      {isDark ? (
        <FiSun className="h-4 w-4 rotate-0 text-amber-400 transition-all duration-500 ease-out-expo" />
      ) : (
        <FiMoon className="h-4 w-4 rotate-180 text-blue-500 transition-all duration-500 ease-out-expo" />
      )}
    </button>
  );
}
