import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { allPages } from 'contentlayer/generated';
import { getPageBySlug } from '@/lib/posts';
import { siteConfig } from '@/lib/config';
import { ReadingProgress } from '@/components/reading-progress';
import { PostToc } from '@/components/post-toc';

export function generateStaticParams() {
  return allPages.map((page) => ({
    slug: page.slug || page.flattenedPath
  }));
}

interface Props {
  params: { slug: string };
}

export function generateMetadata({ params }: Props): Metadata {
  const slug = params.slug;
  const page = getPageBySlug(slug);
  if (!page) return {};

  return {
    title: page.title,
    description: page.description || page.title
  };
}

export default function StaticPage({ params }: Props) {
  const slug = params.slug;
  const page = getPageBySlug(slug);

  if (!page) return notFound();

  return (
    <>
      <ReadingProgress />
      <div className="mx-auto flex max-w-5xl gap-8 pt-4">
        <aside className="hidden w-56 shrink-0 lg:block">
          <PostToc />
        </aside>
        <div className="flex-1">
          <header className="mb-6 space-y-2">
            {page.published_at && (
              <p className="text-xs text-slate-500 dark:text-slate-500">
                {new Date(page.published_at).toLocaleDateString(
                  siteConfig.defaultLocale
                )}
              </p>
            )}
            <h1 className="text-2xl font-bold leading-tight text-slate-900 sm:text-3xl dark:text-slate-50">
              {page.title}
            </h1>
            {page.tags && (
              <div className="flex flex-wrap gap-2 pt-1">
                {page.tags.map((t, i) => {
                  const tagColorClasses = [
                    'bg-rose-100 text-rose-700 dark:bg-rose-900/60 dark:text-rose-200',
                    'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/60 dark:text-emerald-200',
                    'bg-sky-100 text-sky-700 dark:bg-sky-900/60 dark:text-sky-200',
                    'bg-amber-100 text-amber-700 dark:bg-amber-900/60 dark:text-amber-200',
                    'bg-violet-100 text-violet-700 dark:bg-violet-900/60 dark:text-violet-200'
                  ];
                  const color =
                    tagColorClasses[i % tagColorClasses.length];
                  return (
                    <Link
                      key={t}
                      href={`/tags/${encodeURIComponent(
                        t.toLowerCase().replace(/\s+/g, '-')
                      )}`}
                      className={`rounded-full px-2 py-0.5 text-xs transition ${color}`}
                    >
                      #{t}
                    </Link>
                  );
                })}
              </div>
            )}
          </header>
          <article className="prose prose-slate max-w-none dark:prose-dark">
            {page.feature_image && (
              // feature_image is stored as "../assets/xyz", serve from "/assets/xyz"
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={page.feature_image.replace('../assets', '/assets')}
                alt={page.title}
                className="my-4 rounded"
              />
            )}
            <div dangerouslySetInnerHTML={{ __html: page.body.html }} />
          </article>
        </div>
      </div>
    </>
  );
}
