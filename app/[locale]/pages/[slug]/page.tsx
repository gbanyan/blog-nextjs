// Locale-aware static content page.
import { LocalizedLink } from '@/components/localized-link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { allPagesByLocale } from '@/lib/content';
import { getPageBySlug } from '@/lib/posts';
import { getTagSlug } from '@/lib/tags';
import { siteConfig } from '@/lib/config';
import { ReadingProgress } from '@/components/reading-progress';
import { PostLayout } from '@/components/post-layout';
import { ScrollReveal } from '@/components/scroll-reveal';
import { SectionDivider } from '@/components/section-divider';
import type { ComponentType } from 'react';
import { JsonLd } from '@/components/json-ld';
import { DevEnvDeviceHero } from '@/components/dev-env-device-hero';
import { HomeLabDeviceHero } from '@/components/homelab-device-hero';
import { MermaidRenderer } from '@/components/mermaid-renderer';
import { MarkdownBody } from '@/components/markdown-body';
import { metadataForDocument } from '@/lib/seo';
import {
  absoluteUrl,
  documentPath,
  getDocumentLocale,
  isLocale,
  type Locale,
} from '@/lib/locales';
import { getDictionary } from '@/lib/i18n/dictionaries';

export function generateStaticParams() {
  const params = allPagesByLocale.map((page) => ({
    locale: getDocumentLocale(page),
    slug: page.slug || page.flattenedPath,
  }));
  return params.length > 0 ? params : [{ locale: 'zh-TW', slug: '__placeholder__' }];
}

interface Props {
  params: Promise<{ locale: string; slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale: rawLocale, slug } = await params;
  if (!isLocale(rawLocale)) return { robots: { index: false, follow: false } };
  const locale: Locale = rawLocale;
  const dictionary = getDictionary(locale);
  const page = getPageBySlug(slug, locale);
  if (!page) return { robots: { index: false, follow: false } };

  return {
    ...metadataForDocument(page, allPagesByLocale),
    twitter: {
      card: siteConfig.twitterCard,
      title: page.title,
      description: page.description || page.title,
      images: [
        page.feature_image
          ? page.feature_image.replace('../assets', '/assets')
          : siteConfig.ogImage
      ]
    }
  };
}

export default async function StaticPage({ params }: Props) {
  const { locale: rawLocale, slug } = await params;
  if (!isLocale(rawLocale)) return notFound();
  const locale: Locale = rawLocale;
  const dictionary = getDictionary(locale);
  const page = getPageBySlug(slug, locale);

  if (!page) return notFound();

  const hasToc = /<h[23]/.test(page.body.html);

  // Declarative layout/hero metadata (TARGET #2) — no more slug string-matching.
  const isDevice = page.layout === 'device';
  const heroByKey: Record<string, ComponentType<{ ariaLabel: string }>> = {
    'dev-env': DevEnvDeviceHero,
    'homelab': HomeLabDeviceHero
  };
  const Hero = page.hero ? heroByKey[page.hero] : null;

  // Generate absolute URL for the page
  const pageUrl = absoluteUrl(documentPath(page, locale));

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
    inLanguage: getDocumentLocale(page),
    isPartOf: {
      '@type': 'WebSite',
      name: dictionary.brand.title,
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
      <PostLayout hasToc={hasToc} contentKey={slug} wide={isDevice} locale={locale}>
        <div className={isDevice ? 'space-y-4' : 'space-y-8'}>
          {/* Main content area for Pagefind indexing */}
          <div data-pagefind-body>
            <SectionDivider>
              <ScrollReveal>
                <header className={isDevice ? 'mb-4 space-y-3 text-center' : 'mb-6 space-y-4 text-center'}>
                  {page.published_at && (
                    <p className="type-small text-slate-500 dark:text-slate-400">
                      {new Date(page.published_at).toLocaleDateString(
                        getDocumentLocale(page)
                      )}
                    </p>
                  )}
                  <h1 className="type-display font-bold leading-tight text-slate-900 dark:text-slate-50">
                    {page.title}
                  </h1>
                  {page.tags && (
                    <div className="flex flex-wrap justify-center gap-2 pt-2" data-pagefind-meta="tags">
                      {page.tags.map((t) => (
                        <LocalizedLink
                          key={t}
                          href={`/tags/${encodeURIComponent(getTagSlug(t))}`}
                          className="tag-chip rounded-full bg-accent-soft px-3 py-1 text-sm text-accent-textLight dark:bg-slate-800 dark:text-slate-100"
                        >
                          #{t}
                        </LocalizedLink>
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
                  {Hero ? (
                  <Hero ariaLabel={page.hero === 'dev-env' ? dictionary.devices.devEnvAria : dictionary.devices.homeLabAria} />
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
                  <div>
                    <MarkdownBody html={page.body.html} />
                  </div>
                  <MermaidRenderer labels={dictionary.mermaid} />
                </article>
              </ScrollReveal>
            </SectionDivider>
          </div>
        </div>
      </PostLayout>
    </>
  );
}
