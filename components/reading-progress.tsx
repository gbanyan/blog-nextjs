'use client';

import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBookOpen } from '@fortawesome/free-solid-svg-icons';

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
    <div className="pointer-events-none fixed inset-x-0 top-0 z-40 h-1.5 bg-slate-200/40 backdrop-blur-sm dark:bg-slate-900/70">
      <div
        className="relative h-full origin-left bg-gradient-to-r from-blue-500 via-sky-400 to-indigo-500 shadow-[0_0_12px_rgba(56,189,248,0.7)] transition-[transform,box-shadow] duration-200 ease-out dark:from-blue-400 dark:via-sky-300 dark:to-indigo-400"
        style={{ transform: `scaleX(${progress / 100})` }}
      >
        <span className="absolute -right-3 -top-2.5 h-5 w-5 rounded-full bg-white/80 text-[10px] text-blue-600 shadow-md backdrop-blur dark:bg-slate-900/80" aria-hidden="true">
          <FontAwesomeIcon icon={faBookOpen} className="h-full w-full p-1" />
        </span>
      </div>
    </div>
  );
}
