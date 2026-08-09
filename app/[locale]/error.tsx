// Locale-aware error boundary.
'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { FiAlertTriangle } from 'react-icons/fi';
import { getLocaleFromPathname } from '@/lib/locale-switcher';
import { getDictionary } from '@/lib/i18n/dictionaries';

type AppErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
  unstable_retry: () => void;
};

export default function Error({
  error,
  unstable_retry,
}: AppErrorProps) {
  const dictionary = getDictionary(getLocaleFromPathname(usePathname() ?? '/'));
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Application error:', error);
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="max-w-md text-center">
        <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/20">
          <FiAlertTriangle className="h-8 w-8 text-red-600 dark:text-red-400" />
        </div>

        <h2 className="mb-2 text-2xl font-semibold text-balance text-slate-900 dark:text-slate-100">
          {dictionary.errors.errorTitle}
        </h2>

        <p className="mb-6 text-pretty text-slate-600 dark:text-slate-400">
          {error.message || dictionary.errors.errorDescription}
        </p>

        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <button
            onClick={() => unstable_retry()}
            className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:bg-blue-500 dark:hover:bg-blue-600"
          >
            {dictionary.errors.retry}
          </button>

          <a
            href="/"
            className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-6 py-3 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
          >
            {dictionary.common.backHome}
          </a>
        </div>

        {error.digest && (
          <p className="mt-6 text-xs text-slate-500 dark:text-slate-500">
            {dictionary.errors.errorCode}: {error.digest}
          </p>
        )}
      </div>
    </div>
  );
}
