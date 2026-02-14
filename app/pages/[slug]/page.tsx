import { Link } from 'next-view-transitions';
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
import { JsonLd } from '@/components/json-ld';
import { DevEnvDeviceHero } from '@/components/dev-env-device-hero';

export function generateStaticParams() {
  const params = allPages.map((page) => ({
    slug: page.slug || page.flattenedPath
  }));
  return params.length > 0 ? params : [{ slug: '__placeholder__' }];
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

  // Generate absolute URL for the page
  const pageUrl = `${siteConfig.url}${page.url}`;

  // Get image URL if available
  const imageUrl = page.feature_image
    ? `${siteConfig.url}${page.feature_image.replace('../assets', '/assets')}`
    : `${siteConfig.url}${siteConfig.ogImage}`;

  // WebPage Schema
  const webPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: page.title,
    description: page.description || page.title,
    url: pageUrl,
    image: imageUrl,
    inLanguage: siteConfig.defaultLocale,
    isPartOf: {
      '@type': 'WebSite',
      name: siteConfig.title,
      url: siteConfig.url,
    },
    ...(page.published_at && {
      datePublished: page.published_at,
    }),
    ...(page.updated_at && {
      dateModified: page.updated_at,
    }),
  };

  return (
    <>
      <JsonLd data={webPageSchema} />
      <ReadingProgress />
      <PostLayout hasToc={hasToc} contentKey={slug} wide={slug === 'dev-env'}>
        <div className={slug === 'dev-env' ? 'space-y-4' : 'space-y-8'}>
          <SectionDivider>
            <ScrollReveal>
              <header className={slug === 'dev-env' ? 'mb-4 space-y-3 text-center' : 'mb-6 space-y-4 text-center'}>
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
              <article
                data-toc-content={slug}
                className="prose prose-lg prose-slate mx-auto max-w-none dark:prose-invert"
              >
                {slug === 'dev-env' ? (
                  <DevEnvDeviceHero />
                ) : (
                  page.feature_image && (
                    <div className="-mx-4 mb-8 transition-all duration-500 sm:-mx-12 lg:-mx-20 group-[.toc-open]:lg:-mx-4">
                      <Image
                        src={page.feature_image.replace('../assets', '/assets')}
                        alt={page.title}
                        width={1200}
                        height={600}
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1200px"
                        priority
                        className="w-full rounded-xl shadow-lg"
                      />
                    </div>
                  )
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
