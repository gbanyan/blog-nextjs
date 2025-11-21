'use client';

import { useState, useRef, FocusEvent, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
  FiMenu,
  FiX,
  FiHome,
  FiFileText,
  FiFile,
  FiUser,
  FiMail,
  FiMapPin,
  FiFeather,
  FiTag,
  FiServer,
  FiCpu,
  FiList,
  FiChevronDown,
  FiChevronRight
} from 'react-icons/fi';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export type IconKey =
  | 'home'
  | 'blog'
  | 'file'
  | 'user'
  | 'contact'
  | 'location'
  | 'pen'
  | 'tags'
  | 'server'
  | 'device'
  | 'menu';

const ICON_MAP: Record<IconKey, any> = {
  home: FiHome,
  blog: FiFileText,
  file: FiFile,
  user: FiUser,
  contact: FiMail,
  location: FiMapPin,
  pen: FiFeather,
  tags: FiTag,
  server: FiServer,
  device: FiCpu,
  menu: FiList
};

export interface NavLinkItem {
  key: string;
  href?: string;
  label: string;
  iconKey: IconKey;
  children?: NavLinkItem[];
}

interface NavMenuProps {
  items: NavLinkItem[];
}

export function NavMenu({ items }: NavMenuProps) {
  const [open, setOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [expandedMobileItems, setExpandedMobileItems] = useState<string[]>([]);
  const [mounted, setMounted] = useState(false);
  const closeTimer = useRef<number | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Lock body scroll when menu is open
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

  // Close menu on route change
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const toggle = () => setOpen((val) => !val);
  const close = () => setOpen(false);

  const handleBlur = (event: FocusEvent<HTMLDivElement>) => {
    if (!event.currentTarget.contains(event.relatedTarget as Node)) {
      setActiveDropdown(null);
    }
  };

  const clearCloseTimer = () => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  };

  const openDropdown = (key: string) => {
    clearCloseTimer();
    setActiveDropdown(key);
  };

  const scheduleCloseDropdown = () => {
    clearCloseTimer();
    closeTimer.current = window.setTimeout(() => setActiveDropdown(null), 180);
  };

  const toggleMobileItem = (key: string) => {
    setExpandedMobileItems(prev =>
      prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]
    );
  };

  const renderDesktopChild = (item: NavLinkItem) => {
    const Icon = ICON_MAP[item.iconKey] ?? FiFile;
    return item.href ? (
      <Link
        key={item.key}
        href={item.href}
        className="motion-link inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-slate-600 hover:bg-slate-100 hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40 dark:text-slate-200 dark:hover:bg-slate-800"
        onClick={close}
      >
        <Icon className="h-4 w-4 text-slate-400" />
        <span>{item.label}</span>
      </Link>
    ) : null;
  };

  const renderMobileItem = (item: NavLinkItem, depth = 0) => {
    const Icon = ICON_MAP[item.iconKey] ?? FiFile;
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedMobileItems.includes(item.key);

    if (hasChildren) {
      return (
        <div key={item.key} className="flex flex-col">
          <button
            onClick={() => toggleMobileItem(item.key)}
            className="flex w-full items-center justify-between rounded-xl px-4 py-3 text-base font-medium text-slate-700 transition-colors active:bg-slate-100 dark:text-slate-200 dark:active:bg-slate-800"
          >
            <div className="flex items-center gap-3">
              <Icon className="h-5 w-5 text-slate-400" />
              <span>{item.label}</span>
            </div>
            <FiChevronRight
              className={`h-5 w-5 text-slate-400 transition-transform duration-200 ${isExpanded ? 'rotate-90' : ''}`}
            />
          </button>
          <div
            className={`grid transition-all duration-200 ease-in-out ${isExpanded ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
              }`}
          >
            <div className="overflow-hidden">
              <div className="flex flex-col gap-1 pl-4 pt-1">
                {item.children!.map(child => renderMobileItem(child, depth + 1))}
              </div>
            </div>
          </div>
        </div>
      );
    }

    return item.href ? (
      <Link
        key={item.key}
        href={item.href}
        className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-base font-medium text-slate-700 transition-colors active:bg-slate-100 dark:text-slate-200 dark:active:bg-slate-800"
        onClick={close}
      >
        <Icon className="h-5 w-5 text-slate-400" />
        <span>{item.label}</span>
      </Link>
    ) : null;
  };

  return (
    <>
      {/* Mobile Menu Trigger */}
      <button
        type="button"
        className="relative z-50 inline-flex h-10 w-10 items-center justify-center rounded-full text-slate-600 transition-colors hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40 dark:text-slate-200 dark:hover:bg-slate-800 sm:hidden"
        aria-label={open ? '關閉選單' : '開啟選單'}
        aria-expanded={open}
        onClick={toggle}
      >
        <div className="relative h-5 w-5">
          <span
            className={`absolute left-0 top-1/2 h-0.5 w-5 -translate-y-1/2 bg-current transition-all duration-300 ease-snappy ${open ? 'rotate-45' : '-translate-y-1.5'
              }`}
          />
          <span
            className={`absolute left-0 top-1/2 h-0.5 w-5 -translate-y-1/2 bg-current transition-all duration-300 ease-snappy ${open ? 'opacity-0' : 'opacity-100'
              }`}
          />
          <span
            className={`absolute left-0 top-1/2 h-0.5 w-5 -translate-y-1/2 bg-current transition-all duration-300 ease-snappy ${open ? '-rotate-45' : 'translate-y-1.5'
              }`}
          />
        </div>
      </button>

      {/* Mobile Menu Overlay - Portaled */}
      {mounted && createPortal(
        <div
          className={`fixed inset-0 z-[100] flex flex-col bg-white/95 backdrop-blur-xl transition-all duration-300 ease-snappy dark:bg-gray-950/95 sm:hidden ${open ? 'visible opacity-100' : 'invisible opacity-0 pointer-events-none'
            }`}
        >
          {/* Close button area */}
          <div className="flex items-center justify-end px-4 py-3">
            <button
              type="button"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full text-slate-600 transition-colors hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40 dark:text-slate-200 dark:hover:bg-slate-800"
              onClick={close}
              aria-label="Close menu"
            >
              <div className="relative h-5 w-5">
                <span className="absolute left-0 top-1/2 h-0.5 w-5 -translate-y-1/2 rotate-45 bg-current" />
                <span className="absolute left-0 top-1/2 h-0.5 w-5 -translate-y-1/2 -rotate-45 bg-current" />
              </div>
            </button>
          </div>

          <div className="container mx-auto flex flex-1 flex-col px-4 pb-8">
            <div className="flex flex-1 flex-col gap-2 overflow-y-auto pt-4">
              {items.map(item => renderMobileItem(item))}
            </div>

            <div className="mt-auto pt-8 text-center text-xs text-slate-400">
              <p>© {new Date().getFullYear()} All rights reserved.</p>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Desktop Menu */}
      <nav className="hidden sm:flex sm:items-center sm:gap-3">
        {items.map((item) => {
          if (item.children && item.children.length > 0) {
            const Icon = ICON_MAP[item.iconKey] ?? FiFile;
            const isOpen = activeDropdown === item.key;
            return (
              <div
                key={item.key}
                className="group relative"
                onMouseEnter={() => openDropdown(item.key)}
                onMouseLeave={scheduleCloseDropdown}
                onFocus={() => openDropdown(item.key)}
                onBlur={handleBlur}
              >
                <button
                  type="button"
                  className="motion-link type-nav inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-slate-600 hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40 dark:text-slate-200"
                  aria-haspopup="menu"
                  aria-expanded={isOpen}
                >
                  <Icon className="h-3.5 w-3.5 text-slate-400 transition group-hover:text-accent" />
                  <span>{item.label}</span>
                  <FiChevronDown className="h-3 w-3 text-slate-400 transition group-hover:text-accent" />
                </button>

                <div
                  className={`absolute left-0 top-full z-50 hidden min-w-[12rem] rounded-2xl border border-slate-200 bg-white p-2 shadow-lg transition duration-200 ease-snappy dark:border-slate-800 dark:bg-slate-900 sm:block ${isOpen ? 'pointer-events-auto translate-y-2 opacity-100' : 'pointer-events-none translate-y-1 opacity-0'
                    }`}
                  role="menu"
                  aria-label={item.label}
                >
                  <div className="flex flex-col gap-1">
                    {item.children.map((child) => renderDesktopChild(child))}
                  </div>
                </div>
              </div>
            );
          }

          const Icon = ICON_MAP[item.iconKey] ?? FiFile;

          return item.href ? (
            <Link
              key={item.key}
              href={item.href}
              className="motion-link type-nav group relative inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-slate-600 hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40 dark:text-slate-200"
              onClick={close}
            >
              <Icon className="h-3.5 w-3.5 text-slate-400 transition group-hover:text-accent" />
              <span>{item.label}</span>
              <span className="absolute inset-x-3 -bottom-0.5 h-px origin-left scale-x-0 bg-accent transition duration-180 ease-snappy group-hover:scale-x-100" aria-hidden="true" />
            </Link>
          ) : null;
        })}
      </nav>
    </>
  );
}
