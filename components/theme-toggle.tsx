'use client';

import { useTheme } from 'next-themes';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  const next = theme === 'dark' ? 'light' : 'dark';

  return (
    <button
      type="button"
      className="rounded border px-2 py-1 text-xs"
      onClick={() => setTheme(next)}
    >
      {theme === 'dark' ? '☀️' : '🌙'}
    </button>
  );
}

