import Link from 'next/link';
import Image from 'next/image';
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
      <div className="flex gap-6 pt-4">
        <aside className="hidden shrink-0 lg:block lg:w-44">
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
                {page.tags.map((t) => (
                  <Link
                    key={t}
                    href={`/tags/${encodeURIComponent(
                      t.toLowerCase().replace(/\s+/g, '-')
                    )}`}
                    className="rounded-full bg-accent-soft px-2 py-0.5 text-xs text-accent-textLight transition hover:bg-accent hover:text-white dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700"
                  >
                    #{t}
                  </Link>
                ))}
              </div>
            )}
          </header>
          <article className="prose prose-lg prose-slate max-w-none dark:prose-dark">
              {page.feature_image && (
                <Image
                  src={page.feature_image.replace('../assets', '/assets')}
                  alt={page.title}
                  width={1200}
                  height={600}
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
