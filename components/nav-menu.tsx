'use client';

import { useState, useRef, FocusEvent } from 'react';
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
  FiChevronDown
} from 'react-icons/fi';
import Link from 'next/link';

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
  const closeTimer = useRef<number | null>(null);

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

  const renderChild = (item: NavLinkItem) => {
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

  return (
    <div className="relative z-50 flex items-center gap-3">
      <button
        type="button"
        className="sm:hidden inline-flex h-9 w-9 items-center justify-center rounded-full text-slate-600 transition duration-180 ease-snappy hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40 dark:text-slate-200 dark:hover:bg-slate-800"
        aria-label={open ? '關閉選單' : '開啟選單'}
        aria-expanded={open}
        onClick={toggle}
      >
        {open ? <FiX className="h-4 w-4" /> : <FiMenu className="h-4 w-4" />}
      </button>
      <nav
        className={`${open ? 'flex' : 'hidden'} flex-col gap-2 sm:flex sm:flex-row sm:items-center sm:gap-3`}
      >
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

                {/* Desktop dropdown */}
                <div
                  className={`absolute left-0 top-full hidden min-w-[12rem] rounded-2xl border border-slate-200 bg-white p-2 shadow-lg transition duration-200 ease-snappy dark:border-slate-800 dark:bg-slate-900 sm:block z-50 ${
                    isOpen ? 'pointer-events-auto translate-y-2 opacity-100' : 'pointer-events-none translate-y-1 opacity-0'
                  }`}
                  role="menu"
                  aria-label={item.label}
                >
                  <div className="flex flex-col gap-1">
                    {item.children.map((child) => renderChild(child))}
                  </div>
                </div>

                {/* Mobile inline list */}
                <div className="sm:hidden ml-3 mt-1 flex flex-col gap-1">
                  {item.children.map((child) => renderChild(child))}
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
    </div>
  );
}
