'use client';

import { useEffect } from 'react';
import { FiAlertTriangle } from 'react-icons/fi';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
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

        <h2 className="mb-2 text-2xl font-semibold text-slate-900 dark:text-slate-100">
          發生錯誤
        </h2>

        <p className="mb-6 text-slate-600 dark:text-slate-400">
          {error.message || '頁面載入時發生問題，請稍後再試。'}
        </p>

        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <button
            onClick={reset}
            className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:bg-blue-500 dark:hover:bg-blue-600"
          >
            重試
          </button>

          <a
            href="/"
            className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-6 py-3 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
          >
            返回首頁
          </a>
        </div>

        {error.digest && (
          <p className="mt-6 text-xs text-slate-500 dark:text-slate-500">
            錯誤代碼: {error.digest}
          </p>
        )}
      </div>
    </div>
  );
}
