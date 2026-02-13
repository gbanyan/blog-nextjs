'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { FaGithub, FaMastodon, FaLinkedin } from 'react-icons/fa';
import { FiTrendingUp, FiArrowRight } from 'react-icons/fi';
import { siteConfig } from '@/lib/config';
import { getAllTagsWithCount } from '@/lib/posts';
import { allPages } from 'contentlayer2/generated';
import dynamic from 'next/dynamic';

// Lazy load MastodonFeed - only load when sidebar is visible
const MastodonFeed = dynamic(() => import('./mastodon-feed').then(mod => ({ default: mod.MastodonFeed })), {
  ssr: false,
});

/** Shared sidebar content for desktop aside and mobile drawer */
export function RightSidebarContent({ forceLoadFeed = false }: { forceLoadFeed?: boolean }) {
  const [shouldLoadFeed, setShouldLoadFeed] = useState(forceLoadFeed);
  const feedRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (forceLoadFeed) {
      setShouldLoadFeed(true);
      return;
    }
    if (!feedRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setShouldLoadFeed(true);
          observer.disconnect();
        }
      },
      { rootMargin: '100px' }
    );

    observer.observe(feedRef.current);
    return () => observer.disconnect();
  }, [forceLoadFeed]);

  const tags = getAllTagsWithCount().slice(0, 5);

  const aboutPage =
    allPages.find((p) => p.title.includes('關於作者')) ??
    allPages.find((p) => p.slug === 'about-me');

  const avatarSrc = siteConfig.avatar;

  const socialItems = [
    siteConfig.social.github && {
      key: 'github',
      href: siteConfig.social.github,
      icon: FaGithub,
      label: 'GitHub'
    },
    siteConfig.social.mastodon && {
      key: 'mastodon',
      href: siteConfig.social.mastodon,
      icon: FaMastodon,
      label: 'Mastodon'
    },
    siteConfig.social.linkedin && {
      key: 'linkedin',
      href: siteConfig.social.linkedin,
      icon: FaLinkedin,
      label: 'LinkedIn'
    }
  ].filter(Boolean) as { key: string; href: string; icon: any; label: string }[];

  return (
    <div className="flex flex-col gap-4">
      <section className="motion-card group relative overflow-hidden rounded-xl border bg-white px-4 py-4 shadow-sm hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800/80">
          <div className="pointer-events-none absolute -left-10 -top-10 h-24 w-24 rounded-full bg-sky-300/35 blur-3xl mix-blend-soft-light motion-safe:animate-float-soft dark:bg-sky-500/25" />
          <div className="pointer-events-none absolute -bottom-12 right-[-2.5rem] h-28 w-28 rounded-full bg-indigo-300/30 blur-3xl mix-blend-soft-light motion-safe:animate-float-soft dark:bg-indigo-500/20" />

          <div className="relative flex flex-col items-center">
            <Link
              href={aboutPage?.url || '/pages/關於作者'}
              aria-label="關於作者"
              className="mb-2 inline-block transition-transform duration-300 ease-out group-hover:-translate-y-0.5"
            >
              {avatarSrc ? (
                <Image
                  src={avatarSrc}
                  alt={siteConfig.name}
                  width={96}
                  height={96}
                  unoptimized
                  className="h-24 w-24 rounded-full border border-slate-200 object-cover shadow-sm transition-transform duration-300 ease-out group-hover:scale-105 dark:border-slate-700"
                />
              ) : (
                <div className="flex h-24 w-24 items-center justify-center rounded-full bg-slate-900 text-lg font-semibold text-slate-50 shadow-sm transition-transform duration-300 ease-out group-hover:scale-105 dark:bg-slate-100 dark:text-slate-900">
                  {siteConfig.name.charAt(0).toUpperCase()}
                </div>
              )}
            </Link>
            {socialItems.length > 0 && (
              <div className="mt-2 flex items-center gap-3 text-lg text-accent-textLight dark:text-accent-textDark">
                {socialItems.map((item) => (
                  <a
                    key={item.key}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={item.label}
                    className="motion-link inline-flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-600 hover:-translate-y-0.5 hover:bg-accent-soft hover:text-accent dark:bg-slate-800 dark:text-slate-200"
                  >
                    <item.icon className="h-4 w-4" />
                  </a>
                ))}
              </div>
            )}
            {siteConfig.aboutShort && (
              <div className="type-body mt-3 space-y-1 text-center text-slate-600 dark:text-slate-200">
                {siteConfig.aboutShort.split(/\n+/).map((line, index) => (
                  <p key={`${line}-${index}`}>{line}</p>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Mastodon Feed - Lazy loaded when visible */}
        <div ref={feedRef}>
          {shouldLoadFeed && <MastodonFeed />}
        </div>

        {tags.length > 0 && (
          <section className="motion-card rounded-xl border bg-white px-4 py-3 shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100">
            <h2 className="type-small flex items-center gap-2 font-semibold uppercase tracking-[0.35em] text-slate-500 dark:text-slate-400">
              <FiTrendingUp className="h-3 w-3 text-orange-400" />
              熱門標籤
            </h2>
            <div className="mt-2 flex flex-wrap gap-2 text-base">
              {tags.map(({ tag, slug, count }) => {
                let sizeClass = '';
                if (count >= 5) sizeClass = 'font-semibold';
                else if (count >= 3) sizeClass = 'font-medium';

                return (
                  <Link
                    key={tag}
                    href={`/tags/${slug}`}
                    className={`${sizeClass} tag-chip rounded-full bg-accent-soft px-2 py-0.5 text-accent-textLight transition hover:bg-accent hover:text-white dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700`}
                  >
                    {tag}
                  </Link>
                );
              })}
            </div>
            <div className="mt-3 flex items-center justify-between type-small text-slate-500 dark:text-slate-400">
              <span className="inline-flex items-center gap-1">
                <FiArrowRight className="h-3 w-3" />
                一覽所有標籤
              </span>
              <Link
                href="/tags"
                className="motion-link text-accent-textLight hover:text-accent dark:text-accent-textDark"
              >
                前往
              </Link>
            </div>
          </section>
        )}
    </div>
  );
}

export function RightSidebar() {
  return (
    <aside className="hidden lg:block">
      <div className="sticky top-20">
        <RightSidebarContent />
      </div>
    </aside>
  );
}
