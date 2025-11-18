'use client';

import { useEffect, useRef, useState } from 'react';
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
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true);
            if (once) observer.unobserve(entry.target);
          } else if (!once) {
            setVisible(false);
          }
        });
      },
      {
        threshold: 0.15
      }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [once]);

  return (
    <div
      ref={ref}
      className={clsx(
        'motion-safe:transition-all motion-safe:duration-500 motion-safe:ease-out',
        'motion-safe:opacity-0 motion-safe:translate-y-3',
        visible &&
          'motion-safe:opacity-100 motion-safe:translate-y-0 motion-safe:animate-none',
        className
      )}
    >
      {children}
    </div>
  );
}

