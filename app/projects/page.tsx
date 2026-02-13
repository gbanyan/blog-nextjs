import { FaGithub } from 'react-icons/fa';
import { fetchPublicRepos } from '@/lib/github';
import { SidebarLayout } from '@/components/sidebar-layout';
import { RepoCard } from '@/components/repo-card';

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
            {repos.length > 0 && (
              <span className="ml-1">共 {repos.length} 個專案</span>
            )}
          </p>
        </header>

        {repos.length === 0 ? (
          <div className="mt-6 flex flex-col items-center gap-3 rounded-2xl border border-dashed border-slate-200 bg-slate-50/50 p-8 text-center dark:border-slate-700 dark:bg-slate-900/30">
            <FaGithub className="h-12 w-12 text-slate-400 dark:text-slate-500" />
            <p className="type-small text-slate-500 dark:text-slate-400">
              目前沒有可顯示的 GitHub 專案，或暫時無法連線到 GitHub。
            </p>
          </div>
        ) : (
          <ul className="mt-4 grid gap-4 sm:grid-cols-2">
            {repos.map((repo, index) => (
              <RepoCard
                key={repo.id}
                repo={repo}
                animationDelay={index * 50}
              />
            ))}
          </ul>
        )}
      </SidebarLayout>
    </section>
  );
}

