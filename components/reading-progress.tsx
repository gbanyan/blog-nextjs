'use client';

import { useEffect, useState } from 'react';

export function ReadingProgress() {
  const [mounted, setMounted] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
      const total = scrollHeight - clientHeight;
      if (total <= 0) {
        setProgress(0);
        return;
      }
      const value = Math.min(100, Math.max(0, (scrollTop / total) * 100));
      setProgress(value);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [mounted]);

  if (!mounted) return null;

  return (
    <div className="pointer-events-none fixed inset-x-0 top-0 z-40 h-1 bg-slate-200/60 dark:bg-slate-900/80">
      <div
        className="h-full origin-left bg-blue-500 transition-transform dark:bg-blue-400"
        style={{ transform: `scaleX(${progress / 100})` }}
      />
    </div>
  );
}

