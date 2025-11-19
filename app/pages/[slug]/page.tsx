import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { allPages } from 'contentlayer2/generated';
import { getPageBySlug } from '@/lib/posts';
import { siteConfig } from '@/lib/config';
import { ReadingProgress } from '@/components/reading-progress';
import { PostLayout } from '@/components/post-layout';
import { ScrollReveal } from '@/components/scroll-reveal';
import { SectionDivider } from '@/components/section-divider';

export function generateStaticParams() {
  return allPages.map((page) => ({
    slug: page.slug || page.flattenedPath
  }));
}

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const page = getPageBySlug(slug);
  if (!page) return {};

  return {
    title: page.title,
    description: page.description || page.title
  };
}

export default async function StaticPage({ params }: Props) {
  const { slug } = await params;
  const page = getPageBySlug(slug);

  if (!page) return notFound();

  const hasToc = /<h[23]/.test(page.body.html);

  return (
    <>
      <ReadingProgress />
      <PostLayout hasToc={hasToc}>
        <div className="space-y-8">
          <SectionDivider>
            <ScrollReveal>
              <header className="mb-6 space-y-4 text-center">
                {page.published_at && (
                  <p className="type-small text-slate-500 dark:text-slate-500">
                    {new Date(page.published_at).toLocaleDateString(
                      siteConfig.defaultLocale
                    )}
                  </p>
                )}
                <h1 className="type-display font-bold leading-tight text-slate-900 dark:text-slate-50">
                  {page.title}
                </h1>
                {page.tags && (
                  <div className="flex flex-wrap justify-center gap-2 pt-2">
                    {page.tags.map((t) => (
                      <Link
                        key={t}
                        href={`/tags/${encodeURIComponent(
                          t.toLowerCase().replace(/\s+/g, '-')
                        )}`}
                        className="tag-chip rounded-full bg-accent-soft px-3 py-1 text-sm text-accent-textLight dark:bg-slate-800 dark:text-slate-100"
                      >
                        #{t}
                      </Link>
                    ))}
                  </div>
                )}
              </header>
            </ScrollReveal>
          </SectionDivider>

          <SectionDivider>
            <ScrollReveal>
              <article className="prose prose-lg prose-slate mx-auto max-w-none dark:prose-dark">
                {page.feature_image && (
                  <div className="-mx-4 mb-8 transition-all duration-500 sm:-mx-12 lg:-mx-20 group-[.toc-open]:lg:-mx-4">
                    <Image
                      src={page.feature_image.replace('../assets', '/assets')}
                      alt={page.title}
                      width={1200}
                      height={600}
                      className="w-full rounded-xl shadow-lg"
                    />
                  </div>
                )}
                <div dangerouslySetInnerHTML={{ __html: page.body.html }} />
              </article>
            </ScrollReveal>
          </SectionDivider>
        </div>
      </PostLayout>
    </>
  );
}
