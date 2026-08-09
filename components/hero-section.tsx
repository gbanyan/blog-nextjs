'use client';

import { useSyncExternalStore } from 'react';
import { TerminalWindow } from './terminal-window';

interface HeroSectionProps {
  title: string;
  tagline: string;
}

const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';

function subscribeToReducedMotion(callback: () => void) {
  const mediaQuery = window.matchMedia(REDUCED_MOTION_QUERY);
  mediaQuery.addEventListener('change', callback);
  return () => mediaQuery.removeEventListener('change', callback);
}

function getReducedMotion() {
  return window.matchMedia(REDUCED_MOTION_QUERY).matches;
}

export function HeroSection({ title, tagline }: HeroSectionProps) {
  const reducedMotion = useSyncExternalStore(
    subscribeToReducedMotion,
    getReducedMotion,
    () => false
  );

  return (
    <div className="relative h-[360px] w-full overflow-hidden rounded-2xl sm:h-[400px] lg:h-[440px] xl:h-[480px]">
      {/* The terminal owns the clipped Matrix layer so the rain cannot spill
          into the hero or outside the window. */}
      <div className="relative z-10 mx-auto w-full max-w-2xl px-4 py-6 sm:max-w-3xl lg:max-w-4xl xl:max-w-5xl">
        <TerminalWindow
          title={title}
          tagline={tagline}
          reducedMotion={reducedMotion}
        />
      </div>
    </div>
  );
}
