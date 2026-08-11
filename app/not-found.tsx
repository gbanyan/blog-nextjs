'use client';

// Root (global) not-found boundary. Unknown URLs on a fully-static build
// are served from this prerendered page — the [locale]/not-found chunk
// only engages for on-demand routes. Locale is detected from the real
// address-bar path after mount (usePathname reports the '/' root context
// inside a root not-found, and the page is prerendered at build so client
// heuristics like hooks are unavailable during SSR). The pre-hydration
// markup is the zh-TW default; the first frame after mount flips to the
// matched locale. Site chrome is absent by design — root pages have no
// shared layout.
import '@/styles/globals.css';

import { useMounted } from '@/lib/use-mounted';
import { getLocaleFromPathname } from '@/lib/locale-switcher';
import { getDictionary } from '@/lib/i18n/dictionaries';

export default function NotFound() {
  const mounted = useMounted();
  const pathname = mounted ? window.location.pathname : '/';
  const locale = getLocaleFromPathname(pathname);
  const dictionary = getDictionary(locale);
  const home = locale === 'en' ? '/en' : '/';

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-white px-4">
      <div className="max-w-md text-center">
        <h1 className="type-display mb-2 text-6xl font-bold text-slate-300">
          404
        </h1>
        <h2 className="mb-4 text-xl font-semibold text-slate-800">
          {dictionary.errors.notFoundTitle}
        </h2>
        <p className="mb-8 text-slate-600">
          {dictionary.errors.notFoundDescription}
        </p>
        <a
          href={home}
          className="inline-flex items-center rounded-lg bg-slate-800 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-slate-700"
        >
          {dictionary.common.backHome}
        </a>
      </div>
    </div>
  );
}
