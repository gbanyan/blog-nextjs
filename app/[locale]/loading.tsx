'use client';

import { usePathname } from 'next/navigation';
import { getLocaleFromPathname } from '@/lib/locale-switcher';
import { getDictionary } from '@/lib/i18n/dictionaries';

export default function Loading() {
  const dictionary = getDictionary(getLocaleFromPathname(usePathname() ?? '/'));
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-blue-500 border-r-transparent"></div>
        <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">
          {dictionary.common.loading}
        </p>
      </div>
    </div>
  );
}
