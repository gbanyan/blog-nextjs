'use client';

import { useEffect, useMemo, useRef } from 'react';
import { useTheme } from 'next-themes';

const REQUIRED_ENV_KEYS = [
  'NEXT_PUBLIC_GISCUS_REPO',
  'NEXT_PUBLIC_GISCUS_REPO_ID',
  'NEXT_PUBLIC_GISCUS_CATEGORY',
  'NEXT_PUBLIC_GISCUS_CATEGORY_ID',
] as const;

function getMissingEnvKeys(config: Record<string, string | undefined>) {
  return REQUIRED_ENV_KEYS.filter((key) => !config[key]);
}

export function GiscusComments() {
  const ref = useRef<HTMLDivElement>(null);
  const { resolvedTheme } = useTheme();

  const config = useMemo(
    () => ({
      NEXT_PUBLIC_GISCUS_REPO: process.env.NEXT_PUBLIC_GISCUS_REPO,
      NEXT_PUBLIC_GISCUS_REPO_ID: process.env.NEXT_PUBLIC_GISCUS_REPO_ID,
      NEXT_PUBLIC_GISCUS_CATEGORY: process.env.NEXT_PUBLIC_GISCUS_CATEGORY,
      NEXT_PUBLIC_GISCUS_CATEGORY_ID: process.env.NEXT_PUBLIC_GISCUS_CATEGORY_ID,
      NEXT_PUBLIC_GISCUS_MAPPING: process.env.NEXT_PUBLIC_GISCUS_MAPPING ?? 'pathname',
      NEXT_PUBLIC_GISCUS_STRICT: process.env.NEXT_PUBLIC_GISCUS_STRICT ?? '0',
      NEXT_PUBLIC_GISCUS_REACTIONS_ENABLED: process.env.NEXT_PUBLIC_GISCUS_REACTIONS_ENABLED ?? '1',
      NEXT_PUBLIC_GISCUS_INPUT_POSITION: process.env.NEXT_PUBLIC_GISCUS_INPUT_POSITION ?? 'bottom',
      NEXT_PUBLIC_GISCUS_LANG: process.env.NEXT_PUBLIC_GISCUS_LANG ?? 'zh-TW',
      NEXT_PUBLIC_GISCUS_THEME_LIGHT: process.env.NEXT_PUBLIC_GISCUS_THEME_LIGHT ?? 'light',
      NEXT_PUBLIC_GISCUS_THEME_DARK: process.env.NEXT_PUBLIC_GISCUS_THEME_DARK ?? 'dark_dimmed',
    }),
    []
  );

  const missingEnvKeys = getMissingEnvKeys(config);
  const theme =
    resolvedTheme === 'dark'
      ? config.NEXT_PUBLIC_GISCUS_THEME_DARK
      : config.NEXT_PUBLIC_GISCUS_THEME_LIGHT;

  useEffect(() => {
    if (!ref.current || missingEnvKeys.length > 0) return;

    ref.current.innerHTML = '';
    const script = document.createElement('script');
    script.src = 'https://giscus.app/client.js';
    script.async = true;
    script.crossOrigin = 'anonymous';

    script.setAttribute('data-repo', config.NEXT_PUBLIC_GISCUS_REPO!);
    script.setAttribute('data-repo-id', config.NEXT_PUBLIC_GISCUS_REPO_ID!);
    script.setAttribute('data-category', config.NEXT_PUBLIC_GISCUS_CATEGORY!);
    script.setAttribute('data-category-id', config.NEXT_PUBLIC_GISCUS_CATEGORY_ID!);
    script.setAttribute('data-mapping', config.NEXT_PUBLIC_GISCUS_MAPPING);
    script.setAttribute('data-strict', config.NEXT_PUBLIC_GISCUS_STRICT);
    script.setAttribute('data-reactions-enabled', config.NEXT_PUBLIC_GISCUS_REACTIONS_ENABLED);
    script.setAttribute('data-emit-metadata', '0');
    script.setAttribute('data-input-position', config.NEXT_PUBLIC_GISCUS_INPUT_POSITION);
    script.setAttribute('data-theme', theme);
    script.setAttribute('data-lang', config.NEXT_PUBLIC_GISCUS_LANG);
    script.setAttribute('data-loading', 'lazy');

    ref.current.appendChild(script);
  }, [config, missingEnvKeys.length, theme]);

  if (missingEnvKeys.length > 0) {
    if (process.env.NODE_ENV === 'development') {
      return (
        <section className="rounded-2xl border border-dashed border-amber-400/60 bg-amber-50/70 p-6 text-sm text-amber-900 dark:border-amber-500/50 dark:bg-amber-950/30 dark:text-amber-200">
          Giscus 尚未完成設定。請在 `.env.local` 補齊：{missingEnvKeys.join(', ')}
        </section>
      );
    }
    return null;
  }

  return (
    <section className="space-y-4 rounded-2xl border border-slate-200/60 bg-slate-50/50 p-6 dark:border-slate-800 dark:bg-slate-900/30">
      <h2 className="type-subtitle font-semibold text-slate-900 dark:text-slate-50">留言討論</h2>
      <div ref={ref} />
    </section>
  );
}
