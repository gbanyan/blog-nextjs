'use client';
import { useEffect, useState } from 'react';

/**
 * Shared mobile-drawer state: `open` flag, `mounted` (needed because the
 * drawer is rendered via `createPortal(document.body)` which is unavailable
 * during SSR), and the body overflow-lock effect.
 *
 * Extracted from `sidebar-layout` / `post-layout` so the duplicated drawer
 * boilerplate lives in one place (TARGET #3).
 */
export function useDrawer() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  // Lock body scroll while the drawer is open, and restore on unmount.
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  return { open, setOpen, mounted };
}
