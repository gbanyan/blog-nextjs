import { Link } from 'next-view-transitions';
import { FiExternalLink } from 'react-icons/fi';
import type { RepoSummary } from '@/lib/github';
import { getLanguageColor } from '@/lib/github-lang-colors';

interface RepoCardProps {
  repo: RepoSummary;
  animationDelay?: number;
}

export function RepoCard({ repo, animationDelay = 0 }: RepoCardProps) {
  const langColor = getLanguageColor(repo.language);

  return (
    <li
      className={`motion-card group relative flex h-full flex-col rounded-2xl border border-white/40 bg-white/60 p-5 shadow-lg backdrop-blur-md transition-all hover:scale-[1.01] hover:shadow-xl dark:border-white/10 dark:bg-slate-900/60 ${animationDelay > 0 ? 'repo-card-enter' : ''}`}
      style={
        animationDelay > 0 ? { animationDelay: `${animationDelay}ms` } : undefined
      }
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-0.5 origin-left scale-x-0 bg-gradient-to-r from-blue-500 via-sky-400 to-indigo-500 opacity-80 transition-transform duration-300 ease-out group-hover:scale-x-100 dark:from-blue-400 dark:via-sky-300 dark:to-indigo-400" />
      <div className="flex items-start justify-between gap-2">
        <Link
          href={repo.htmlUrl}
          prefetch={false}
          target="_blank"
          rel="noreferrer"
          className="type-base inline-flex items-center gap-2 font-semibold text-slate-900 transition-colors hover:text-accent dark:text-slate-50 dark:hover:text-accent"
        >
          {repo.name}
          <FiExternalLink className="h-3.5 w-3.5 opacity-0 transition-opacity group-hover:opacity-100" />
        </Link>
        {repo.stargazersCount > 0 && (
          <span className="inline-flex shrink-0 items-center gap-1 rounded-lg bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-700 dark:bg-amber-900/40 dark:text-amber-300">
            ★ {repo.stargazersCount}
          </span>
        )}
      </div>

      {repo.description && (
        <p className="mt-2 flex-1 line-clamp-2 text-sm text-slate-600 group-hover:text-slate-800 dark:text-slate-300 dark:group-hover:text-slate-100">
          {repo.description}
        </p>
      )}

      <div className="mt-3 flex items-center justify-between gap-2 text-xs text-slate-500 dark:text-slate-400">
        <span className="inline-flex items-center gap-1.5">
          <span
            className="h-2 w-2 shrink-0 rounded-full"
            style={{ backgroundColor: langColor }}
            aria-hidden
          />
          {repo.language ?? '其他'}
        </span>
        <span suppressHydrationWarning>
          更新於{' '}
          {repo.updatedAt
            ? new Date(repo.updatedAt).toLocaleDateString('zh-TW')
            : '未知'}
        </span>
      </div>
    </li>
  );
}
