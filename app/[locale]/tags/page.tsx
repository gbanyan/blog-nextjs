// Locale-aware tag index.
import { LocalizedLink } from '@/components/localized-link';
import type { Metadata } from 'next';
import { FiTag, FiTrendingUp } from 'react-icons/fi';
import { getAllTagsWithCount } from '@/lib/tags';
import { SectionDivider } from '@/components/section-divider';
import { ScrollReveal } from '@/components/scroll-reveal';
import { SidebarLayout } from '@/components/sidebar-layout';
import { getSidebarData } from '@/lib/sidebar-data';
import { siteConfig } from '@/lib/config';
import { JsonLd } from '@/components/json-ld';
import { metadataForPath } from '@/lib/seo';
import { absoluteUrl, isLocale, localizedPath, type Locale } from '@/lib/locales';
import { notFound } from 'next/navigation';
import { getDictionary } from '@/lib/i18n/dictionaries';

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) return { robots: { index: false, follow: false } };
  const dictionary = getDictionary(rawLocale);
  return metadataForPath({
    title: dictionary.tags.title,
    description: dictionary.tags.description,
    path: '/tags',
    locale: rawLocale,
  });
}

export default async function TagIndexPage({ params }: Props) {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) return notFound();
  const locale: Locale = rawLocale;
  const dictionary = getDictionary(locale);
  const { tags: sidebarTags, aboutUrl, avatarSrc } = getSidebarData(locale);
  const tags = getAllTagsWithCount(locale);
  const topTags = tags.slice(0, 3);

  const colorClasses = [
    'from-accent/60 to-accent/20',
    'from-accent/50 to-accent/15',
    'from-accent/40 to-accent/10',
  ];

  // CollectionPage schema with ItemList
  const collectionPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: dictionary.tags.title,
    description: dictionary.tags.description,
    url: absoluteUrl(localizedPath('/tags', locale)),
    inLanguage: locale,
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: tags.map((tag, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: tag.tag,
        url: absoluteUrl(localizedPath(`/tags/${tag.slug}`, locale)),
        item: {
          '@type': 'Thing',
          name: tag.tag,
          description: dictionary.tags.count(tag.count)
        }
      }))
    }
  };

  return (
    <section className="space-y-6">
      <JsonLd data={collectionPageSchema} />
      <SidebarLayout tags={sidebarTags} aboutUrl={aboutUrl} avatarSrc={avatarSrc} locale={locale}>
        <SectionDivider>
          <ScrollReveal>
            <div className="motion-card rounded-2xl border border-white/40 bg-white/60 p-8 text-center shadow-lg backdrop-blur-md dark:border-white/10 dark:bg-slate-900/60">
              <div className="inline-flex items-center gap-2 text-accent">
                <FiTag className="h-5 w-5" />
                <span className="type-small uppercase tracking-[0.4em] text-slate-500 dark:text-slate-400">
                  {dictionary.tags.title}
                </span>
              </div>
              <h1 className="type-title mt-2 font-semibold text-slate-900 dark:text-slate-50">
                {dictionary.tags.explore(tags.length)}
              </h1>
              <p className="type-small mt-2 text-slate-600 dark:text-slate-300">
                {dictionary.tags.topTags}
                {topTags.map((t) => t.tag).join('、')}
              </p>
            </div>
          </ScrollReveal>
        </SectionDivider>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {tags.map(({ tag, slug, count }, index) => {
            const color = colorClasses[index % colorClasses.length];
            return (
              <LocalizedLink
                key={tag}
                href={`/tags/${slug}`}
                className="motion-card group flex flex-col rounded-2xl border border-white/40 bg-white/60 p-5 shadow-sm backdrop-blur-md transition-all hover:-translate-y-1 hover:shadow-xl dark:border-white/10 dark:bg-slate-900/60"
              >
                <span className={`mb-3 block h-1.5 w-16 rounded-full bg-gradient-to-r ${color}`} aria-hidden="true" />
                <div className="flex items-center justify-between">
                     <h2 className="type-subtitle font-semibold text-slate-900 group-hover:text-accent dark:text-slate-50 dark:group-hover:text-accent">
                    {tag}
                  </h2>
                  <span className="type-small text-slate-600 dark:text-slate-300">
                    {dictionary.tags.count(count)}
                  </span>
                </div>
                <span className="mt-1 inline-flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
                  <FiTrendingUp className="h-3 w-3 text-orange-400" />
                  {dictionary.tags.rank(index + 1)}
                </span>
              </LocalizedLink>
            );
          })}
        </div>
      </SidebarLayout>
    </section>
  );
}
