import Link from 'next/link';
import { fetchPublicRepos } from '@/lib/github';
import { SidebarLayout } from '@/components/sidebar-layout';

export const revalidate = 3600;

export const metadata = {
  title: 'GitHub 專案',
};

export default async function ProjectsPage() {
  const repos = await fetchPublicRepos();

  return (
    <section className="space-y-4">
      <SidebarLayout>
        <header className="space-y-1">
          <h1 className="type-title font-semibold text-slate-900 dark:text-slate-50">
            GitHub 專案
          </h1>
          <p className="type-small text-slate-500 dark:text-slate-400">
            從我的 GitHub 帳號自動抓取公開的程式庫與專案。
          </p>
        </header>

        {repos.length === 0 ? (
          <p className="mt-4 type-small text-slate-500 dark:text-slate-400">
            目前沒有可顯示的 GitHub 專案，或暫時無法連線到 GitHub。
          </p>
        ) : (
          <ul className="mt-4 grid gap-4 sm:grid-cols-2">
            {repos.map((repo) => (
              <li
                key={repo.id}
                className="flex h-full flex-col rounded-lg border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
              >
                <div className="flex items-start justify-between gap-2">
                  <Link
                    href={repo.htmlUrl}
                    prefetch={false}
                    target="_blank"
                    rel="noreferrer"
                    className="type-base font-semibold text-slate-900 transition-colors hover:text-accent dark:text-slate-50"
                  >
                    {repo.name}
                  </Link>
                  {repo.stargazersCount > 0 && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-700 dark:bg-amber-900/40 dark:text-amber-300">
                      ★ {repo.stargazersCount}
                    </span>
                  )}
                </div>

                {repo.description && (
                  <p className="mt-2 flex-1 type-small text-slate-600 dark:text-slate-300">
                    {repo.description}
                  </p>
                )}

                <div className="mt-3 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                  <span>{repo.language ?? '其他'}</span>
                  <span suppressHydrationWarning>
                    更新於{' '}
                    {repo.updatedAt
                      ? new Date(repo.updatedAt).toLocaleDateString('zh-TW')
                      : '未知'}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </SidebarLayout>
    </section>
  );
}

