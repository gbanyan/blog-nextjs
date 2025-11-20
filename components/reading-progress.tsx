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
    <div className="pointer-events-none fixed inset-x-0 top-0 z-[999] h-2 bg-transparent">
      <div className="relative h-2 w-full overflow-visible">
        <div
          className="absolute inset-y-0 left-0 w-full origin-left rounded-full bg-gradient-to-r from-[rgba(124,58,237,0.75)] via-[rgba(167,139,250,0.8)] to-[rgba(14,165,233,0.7)] shadow-[0_0_10px_rgba(124,58,237,0.45)] transition-[transform,opacity] duration-300 ease-out"
          style={{ transform: `scaleX(${progress / 100})`, opacity: progress > 0 ? 1 : 0 }}
        >
          <span className="absolute -right-2 top-1/2 h-3 w-3 -translate-y-1/2 rounded-full bg-white/75 blur-[1px] dark:bg-slate-900/75" aria-hidden="true" />
        </div>
        <span className="absolute inset-x-0 top-2 h-px bg-gradient-to-r from-transparent via-blue-200/40 to-transparent blur-sm dark:via-blue-900/30" aria-hidden="true" />
      </div>
    </div>
  );
}
