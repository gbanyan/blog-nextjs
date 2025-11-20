'use client';

import { useEffect, useRef } from 'react';

export default function Template({ children }: { children: React.ReactNode }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Trigger animation on mount
    container.style.animation = 'none';
    // Force reflow
    void container.offsetHeight;
    container.style.animation = 'pageEnter 0.3s cubic-bezier(0.32, 0.72, 0, 1) forwards';
  }, [children]);

  return (
    <div ref={containerRef} className="page-transition">
      {children}
    </div>
  );
}
