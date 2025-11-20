export default function BlogPostLoading() {
  return (
    <article className="container mx-auto max-w-4xl px-4 py-12">
      {/* Header skeleton */}
      <header className="mb-12 space-y-4">
        <div className="h-4 w-24 animate-pulse rounded bg-slate-200 dark:bg-slate-700"></div>
        <div className="h-12 w-3/4 animate-pulse rounded bg-slate-300 dark:bg-slate-600"></div>
        <div className="flex gap-4">
          <div className="h-4 w-32 animate-pulse rounded bg-slate-200 dark:bg-slate-700"></div>
          <div className="h-4 w-32 animate-pulse rounded bg-slate-200 dark:bg-slate-700"></div>
        </div>
      </header>

      {/* Cover image skeleton */}
      <div className="mb-12 aspect-video w-full animate-pulse rounded-2xl bg-slate-200 dark:bg-slate-700"></div>

      {/* Content skeleton */}
      <div className="prose prose-slate mx-auto space-y-4 dark:prose-invert">
        <div className="space-y-3">
          <div className="h-4 w-full animate-pulse rounded bg-slate-200 dark:bg-slate-700"></div>
          <div className="h-4 w-full animate-pulse rounded bg-slate-200 dark:bg-slate-700"></div>
          <div className="h-4 w-5/6 animate-pulse rounded bg-slate-200 dark:bg-slate-700"></div>
        </div>

        <div className="h-8 w-2/3 animate-pulse rounded bg-slate-300 dark:bg-slate-600"></div>

        <div className="space-y-3">
          <div className="h-4 w-full animate-pulse rounded bg-slate-200 dark:bg-slate-700"></div>
          <div className="h-4 w-full animate-pulse rounded bg-slate-200 dark:bg-slate-700"></div>
          <div className="h-4 w-4/5 animate-pulse rounded bg-slate-200 dark:bg-slate-700"></div>
        </div>

        <div className="space-y-3">
          <div className="h-4 w-full animate-pulse rounded bg-slate-200 dark:bg-slate-700"></div>
          <div className="h-4 w-full animate-pulse rounded bg-slate-200 dark:bg-slate-700"></div>
          <div className="h-4 w-3/4 animate-pulse rounded bg-slate-200 dark:bg-slate-700"></div>
        </div>
      </div>
    </article>
  );
}
