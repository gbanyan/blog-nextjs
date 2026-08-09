// Locale-aware projects page.
'use cache';

import { FaGithub } from 'react-icons/fa';
import { fetchPublicRepos } from '@/lib/github';
import { SidebarLayout } from '@/components/sidebar-layout';
import { getSidebarData } from '@/lib/sidebar-data';
import { RepoCard } from '@/components/repo-card';

import { siteConfig } from '@/lib/config';

import { cacheLife } from 'next/cache';
import { metadataForPath } from '@/lib/seo';
import { absoluteUrl, isLocale, localizedPath, type Locale } from '@/lib/locales';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getDictionary } from '@/lib/i18n/dictionaries';

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) return { robots: { index: false, follow: false } };
  const dictionary = getDictionary(rawLocale);
  return metadataForPath({
    title: dictionary.projects.title,
    description: dictionary.projects.description,
    path: '/projects',
    locale: rawLocale,
    openGraph: {
      images: [{ url: absoluteUrl(siteConfig.ogImage), alt: dictionary.projects.title }],
    },
    twitter: {
      card: siteConfig.twitterCard,
      title: dictionary.projects.title,
      description: dictionary.projects.description,
      images: [siteConfig.ogImage],
    },
  });
}

export default async function ProjectsPage({ params }: Props) {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) return notFound();
  const locale: Locale = rawLocale;
  const dictionary = getDictionary(locale);
  const { tags, aboutUrl, avatarSrc } = getSidebarData(locale);
  cacheLife({ revalidate: 3600 });
  const repos = await fetchPublicRepos();

  return (
    <section className="space-y-4">
      <SidebarLayout tags={tags} aboutUrl={aboutUrl} avatarSrc={avatarSrc} locale={locale}>
        <header className="space-y-1">
          <h1 className="type-title font-semibold text-slate-900 dark:text-slate-50">
            {dictionary.projects.title}
          </h1>
          <p className="type-small text-slate-500 dark:text-slate-400">
            {dictionary.projects.description}
            {repos.length > 0 && (
              <span className="ml-1">{dictionary.projects.count(repos.length)}</span>
            )}
          </p>
        </header>

        {repos.length === 0 ? (
          <div className="mt-6 flex flex-col items-center gap-3 rounded-2xl border border-dashed border-slate-200 bg-slate-50/50 p-8 text-center dark:border-slate-700 dark:bg-slate-900/30">
            <FaGithub className="h-12 w-12 text-slate-400 dark:text-slate-500" />
            <p className="type-small text-slate-500 dark:text-slate-400">
              {dictionary.projects.empty}
            </p>
          </div>
        ) : (
          <ul className="mt-4 grid gap-4 sm:grid-cols-2">
            {repos.map((repo, index) => (
              <RepoCard
                key={repo.id}
                repo={repo}
                animationDelay={index * 50}
                locale={locale}
                labels={dictionary.repo}
              />
            ))}
          </ul>
        )}
      </SidebarLayout>
    </section>
  );
}
