'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  DEFAULT_LOCALE,
  ENGLISH_LOCALE,
  getLocaleFromPathname,
  type LocaleRouteManifest,
  resolveLocaleSwitchTarget,
} from '@/lib/locale-switcher';
import { NAV_TRANSITION } from '@/lib/navigation';

const LOCALE_LABELS = {
  [DEFAULT_LOCALE]: '繁中',
  [ENGLISH_LOCALE]: 'EN',
} as const;

interface LanguageSwitcherProps {
  /** Optional generated route-pair manifest for translated detail pages. */
  manifest?: LocaleRouteManifest;
}

export function LanguageSwitcher({ manifest }: LanguageSwitcherProps = {}) {
  const pathname = usePathname() ?? '/';
  const currentLocale = getLocaleFromPathname(pathname);
  const targetLocale = currentLocale === DEFAULT_LOCALE ? ENGLISH_LOCALE : DEFAULT_LOCALE;
  const target = resolveLocaleSwitchTarget(pathname, targetLocale, manifest);
  const isEnglish = currentLocale === ENGLISH_LOCALE;
  const targetLabel = targetLocale === ENGLISH_LOCALE ? 'English' : '繁體中文';
  const fallbackHint = target.isFallback
    ? isEnglish
      ? '; no translated page is available, so the section index will open'
      : '，此頁沒有對應翻譯，將前往該語言的區段首頁'
    : '';

  return (
    <div
      className="inline-flex items-center gap-0.5 rounded-full border border-slate-200/80 bg-white/60 p-0.5 text-xs font-medium tracking-wide text-slate-500 dark:border-slate-700/80 dark:bg-slate-900/60 dark:text-slate-400"
      role="group"
      aria-label={isEnglish ? 'Language switcher, current language English' : '語言切換，目前為繁體中文'}
    >
      <span
        className={`inline-flex h-7 min-w-8 items-center justify-center rounded-full px-1.5 transition-colors ${
          currentLocale === DEFAULT_LOCALE
            ? 'bg-accent-soft text-accent-textLight dark:text-accent-textDark'
            : ''
        }`}
        aria-current={currentLocale === DEFAULT_LOCALE ? 'page' : undefined}
      >
        {LOCALE_LABELS[DEFAULT_LOCALE]}
      </span>
      <Link
        href={target.href}
        prefetch={true}
        transitionTypes={[...NAV_TRANSITION]}
        className={`inline-flex h-7 min-w-8 items-center justify-center rounded-full px-1.5 transition-colors hover:bg-accent-soft hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40 ${
          currentLocale === ENGLISH_LOCALE
            ? 'bg-accent-soft text-accent-textLight dark:text-accent-textDark'
            : ''
        }`}
        aria-label={isEnglish ? `Switch to ${targetLabel}${fallbackHint}` : `切換至${targetLabel}${fallbackHint}`}
        title={
          target.isFallback
            ? isEnglish
              ? `No translated page; open the ${targetLabel} section index`
              : `沒有對應翻譯，前往${targetLabel}區段首頁`
            : undefined
        }
      >
        {LOCALE_LABELS[ENGLISH_LOCALE]}
      </Link>
    </div>
  );
}
