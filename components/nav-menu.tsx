'use client';

import { useState } from 'react';
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
  FiList
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
  href: string;
  label?: string;
  iconKey: IconKey;
}

interface NavMenuProps {
  items: NavLinkItem[];
}

export function NavMenu({ items }: NavMenuProps) {
  const [open, setOpen] = useState(false);

  const toggle = () => setOpen((val) => !val);
  const close = () => setOpen(false);

  return (
    <div className="flex items-center gap-3">
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
        {items.map((item) => (
          <Link
            key={item.key}
            href={item.href}
            className="motion-link type-nav group relative inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-slate-600 hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40 dark:text-slate-200"
            onClick={close}
          >
            {(() => {
              const Icon = ICON_MAP[item.iconKey] ?? FiFile;
              return <Icon className="h-3.5 w-3.5 text-slate-400 transition group-hover:text-accent" />;
            })()}
            <span>{item.label}</span>
            <span className="absolute inset-x-3 -bottom-0.5 h-px origin-left scale-x-0 bg-accent transition duration-180 ease-snappy group-hover:scale-x-100" aria-hidden="true" />
          </Link>
        ))}
      </nav>
    </div>
  );
}
