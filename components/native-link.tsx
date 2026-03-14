'use client';

import { useState, useEffect, ReactNode } from 'react';
import Link from 'next/link';

export function NativeLink({ href, children, ...props }: { href: string; children: ReactNode; [key: string]: any }) {
  const [isSafari18, setIsSafari18] = useState(false);

  useEffect(() => {
    const isSafari = typeof navigator !== 'undefined' && navigator.userAgent.includes('safari') && !navigator.userAgent.includes('chrome') && !navigator.userAgent.includes('firefox');
    const hasNativeTransitions = typeof document !== 'undefined' && typeof document.startViewTransition === 'function';
    setIsSafari18(isSafari && hasNativeTransitions);
  }, []);

  if (isSafari18) {
    return <a href={href} {...props}>{children}</a>;
  }

  return <Link href={href} {...props}>{children}</Link>;
}
