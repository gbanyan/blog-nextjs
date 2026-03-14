'use client';

import { useState, useEffect, ReactNode } from 'react';

export function ViewTransitionProvider({ children }: { children: ReactNode }) {
  const [isSafari18, setIsSafari18] = useState(false);

  useEffect(() => {
    const isSafari = typeof navigator !== 'undefined' && navigator.userAgent.includes('safari') && !navigator.userAgent.includes('chrome') && !navigator.userAgent.includes('firefox');
    const hasNativeTransitions = typeof document !== 'undefined' && typeof document.startViewTransition === 'function';
    setIsSafari18(isSafari && hasNativeTransitions);
  }, []);

  if (isSafari18) {
    return <>{children}</>;
  }

  return <>{children}</>;
}
