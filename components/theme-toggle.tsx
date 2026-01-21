'use client';

import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import { FiMoon, FiSun } from 'react-icons/fi';
import { Button } from '@heroui/react';

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
    <Button
      isIconOnly
      variant="ghost"
      className="h-9 w-9 rounded-full text-[var(--color-accent-text-light)] transition duration-180 hover:-translate-y-0.5 hover:bg-[var(--color-accent-soft)] hover:text-[var(--color-accent)] active:scale-95 dark:text-[var(--color-accent-text-dark)] dark:hover:bg-slate-800 dark:hover:text-[var(--color-accent)]"
      onPress={() => setTheme(next)}
      aria-label={theme === 'dark' ? '切換為淺色主題' : '切換為深色主題'}
    >
      {isDark ? (
        <FiSun className="h-4 w-4 rotate-0 text-amber-400 transition-transform duration-260" />
      ) : (
        <FiMoon className="h-4 w-4 rotate-180 text-blue-500 transition-transform duration-260" />
      )}
    </Button>
  );
}
