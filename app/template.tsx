'use client';

import { useEffect, useRef, useState } from 'react';

export default function Template({ children }: { children: React.ReactNode }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(true);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mq.matches);
    const handler = () => setPrefersReducedMotion(mq.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    if (prefersReducedMotion) {
      container.style.animation = 'none';
      container.style.opacity = '1';
      container.style.transform = 'none';
      return;
    }

    // Trigger animation on mount
    container.style.animation = 'none';
    void container.offsetHeight;
    container.style.animation = 'pageEnter 0.45s cubic-bezier(0.32, 0.72, 0, 1) forwards';
  }, [children, prefersReducedMotion]);

  return (
    <div ref={containerRef} className="page-transition">
      {children}
    </div>
  );
}
