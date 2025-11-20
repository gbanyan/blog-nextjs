'use client';

import { useEffect, useRef } from 'react';
import clsx from 'clsx';

interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  once?: boolean;
}

export function ScrollReveal({
  children,
  className,
  once = true
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Fallback for browsers without IntersectionObserver
    if (!('IntersectionObserver' in window)) {
      el.classList.add('is-visible');
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            if (once) observer.unobserve(entry.target);
          } else if (!once) {
            entry.target.classList.remove('is-visible');
          }
        });
      },
      {
        threshold: 0.05,
        rootMargin: '0px 0px -20% 0px'
      }
    );

    observer.observe(el);

    // Fallback timeout for slow connections
    const fallback = window.setTimeout(() => {
      el.classList.add('is-visible');
    }, 500);

    return () => {
      observer.disconnect();
      window.clearTimeout(fallback);
    };
  }, [once]);

  return (
    <div
      ref={ref}
      className={clsx('scroll-reveal', className)}
    >
      {children}
    </div>
  );
}
