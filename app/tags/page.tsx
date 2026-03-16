import Link from 'next/link';
import type { Metadata } from 'next';
import { FiTag, FiTrendingUp } from 'react-icons/fi';
import { getAllTagsWithCount } from '@/lib/posts';
import { SectionDivider } from '@/components/section-divider';
import { ScrollReveal } from '@/components/scroll-reveal';
import { SidebarLayout } from '@/components/sidebar-layout';
import { siteConfig } from '@/lib/config';
import { JsonLd } from '@/components/json-ld';

export const metadata: Metadata = {
  title: '標籤索引',
  description: '瀏覽所有標籤，探索不同主題的文章。',
  alternates: {
    canonical: `${siteConfig.url}/tags`
  }
};

export default function TagIndexPage() {
  const tags = getAllTagsWithCount();
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
    name: '標籤索引',
    description: '瀏覽所有標籤，探索不同主題的文章。',
    url: `${siteConfig.url}/tags`,
    inLanguage: siteConfig.defaultLocale,
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: tags.map((tag, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: tag.tag,
        url: `${siteConfig.url}/tags/${tag.slug}`,
        item: {
          '@type': 'Thing',
          name: tag.tag,
          description: `${tag.count} 篇文章`
        }
      }))
    }
  };

  return (
    <section className="space-y-6">
      <JsonLd data={collectionPageSchema} />
      <SidebarLayout>
        <SectionDivider>
          <ScrollReveal>
            <div className="motion-card rounded-2xl border border-white/40 bg-white/60 p-8 text-center shadow-lg backdrop-blur-md dark:border-white/10 dark:bg-slate-900/60">
              <div className="inline-flex items-center gap-2 text-accent">
                <FiTag className="h-5 w-5" />
                <span className="type-small uppercase tracking-[0.4em] text-slate-500 dark:text-slate-400">
                  標籤索引
                </span>
              </div>
              <h1 className="type-title mt-2 font-semibold text-slate-900 dark:text-slate-50">
                共 {tags.length} 組主題，任你探索
              </h1>
              <p className="type-small mt-2 text-slate-600 dark:text-slate-300">
                熱度最高的標籤：
                {topTags.map((t) => t.tag).join('、')}
              </p>
            </div>
          </ScrollReveal>
        </SectionDivider>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {tags.map(({ tag, slug, count }, index) => {
            const color = colorClasses[index % colorClasses.length];
            return (
              <Link
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
                    {count} 篇
                  </span>
                </div>
                <span className="mt-1 inline-flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
                  <FiTrendingUp className="h-3 w-3 text-orange-400" />
                  熱度 #{index + 1}
                </span>
              </Link>
            );
          })}
        </div>
      </SidebarLayout>
    </section>
  );
}
