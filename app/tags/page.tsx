import Link from 'next/link';
import type { Metadata } from 'next';
import { FiTag, FiTrendingUp } from 'react-icons/fi';
import { getAllTagsWithCount } from '@/lib/posts';
import { SectionDivider } from '@/components/section-divider';
import { ScrollReveal } from '@/components/scroll-reveal';
import { SidebarLayout } from '@/components/sidebar-layout';

export const metadata: Metadata = {
  title: '標籤索引'
};

export default function TagIndexPage() {
  const tags = getAllTagsWithCount();
  const topTags = tags.slice(0, 3);

  const colorClasses = [
    'from-rose-400/70 to-rose-200/40',
    'from-emerald-400/70 to-emerald-200/40',
    'from-sky-400/70 to-sky-200/40',
    'from-amber-400/70 to-amber-200/40',
    'from-violet-400/70 to-violet-200/40'
  ];

  return (
    <section className="space-y-6">
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
                  <h2 className="type-subtitle font-semibold text-slate-900 group-hover:text-blue-600 dark:text-slate-50 dark:group-hover:text-blue-400">
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
