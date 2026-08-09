'use client';

// Locale-aware not-found boundary.
import { LocalizedLink } from '@/components/localized-link';
import { usePathname } from 'next/navigation';
import { getLocaleFromPathname } from '@/lib/locale-switcher';
import { getDictionary } from '@/lib/i18n/dictionaries';

export default function NotFound() {
  const dictionary = getDictionary(getLocaleFromPathname(usePathname() ?? '/'));
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4">
      <div className="max-w-md text-center">
        <h1 className="type-display mb-2 text-6xl font-bold text-slate-300 dark:text-slate-600">
          404
        </h1>
        <h2 className="mb-4 text-xl font-semibold text-slate-800 dark:text-slate-200">
          {dictionary.errors.notFoundTitle}
        </h2>
        <p className="mb-8 text-slate-600 dark:text-slate-400">
          {dictionary.errors.notFoundDescription}
        </p>
        <LocalizedLink
          href="/"
          className="inline-flex items-center rounded-lg bg-slate-800 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 dark:bg-slate-200 dark:text-slate-900 dark:hover:bg-slate-300"
        >
          {dictionary.common.backHome}
        </LocalizedLink>
      </div>
    </div>
  );
}
