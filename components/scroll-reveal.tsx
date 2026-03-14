'use client';

import { useEffect, useRef, useCallback } from 'react';
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
  const observerRef = useRef<IntersectionObserver | null>(null);

  const handleObserver = useCallback((entries: IntersectionObserverEntry[]) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        if (once && observerRef.current) {
          observerRef.current.unobserve(entry.target);
        }
      } else if (!once) {
        entry.target.classList.remove('is-visible');
      }
    });
  }, [once]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Fallback for browsers without IntersectionObserver
    if (!('IntersectionObserver' in window)) {
      el.classList.add('is-visible');
      return;
    }

    observerRef.current = new IntersectionObserver(
      handleObserver,
      {
        threshold: 0.05,
        rootMargin: '0px 0px -20% 0px'
      }
    );

    observerRef.current.observe(el);

    // Fallback timeout for slow connections - reduce to 300ms
    const fallback = setTimeout(() => {
      el.classList.add('is-visible');
    }, 300);

    return () => {
      observerRef.current?.disconnect();
      clearTimeout(fallback);
    };
  }, [handleObserver, once]);

  return (
    <div
      ref={ref}
      className={clsx('scroll-reveal', className)}
    >
      {children}
    </div>
  );
}
