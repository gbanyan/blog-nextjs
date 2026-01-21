'use client';

import Link from 'next/link';
import Image from 'next/image';
import { FaGithub, FaMastodon, FaLinkedin } from 'react-icons/fa';
import { FiTrendingUp, FiArrowRight } from 'react-icons/fi';
import { siteConfig } from '@/lib/config';
import { getAllTagsWithCount } from '@/lib/posts';
import { allPages } from 'contentlayer2/generated';
import { MastodonFeed } from './mastodon-feed';
import { Card, Avatar, Chip } from '@heroui/react';

export function RightSidebar() {
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
  ].filter(Boolean) as { key: string; href: string; icon: React.ComponentType<{ className?: string }>; label: string }[];

  return (
    <aside className="hidden lg:block">
      <div className="sticky top-20 flex flex-col gap-4">
        <Card className="motion-card group relative overflow-hidden rounded-xl border px-4 py-4 dark:border-slate-800">
          <div className="pointer-events-none absolute -left-10 -top-10 h-24 w-24 rounded-full bg-sky-300/35 blur-3xl mix-blend-soft-light motion-safe:animate-float-soft dark:bg-sky-500/25" />
          <div className="pointer-events-none absolute -bottom-12 right-[-2.5rem] h-28 w-28 rounded-full bg-indigo-300/30 blur-3xl mix-blend-soft-light motion-safe:animate-float-soft dark:bg-indigo-500/20" />

          <Card.Content className="relative flex flex-col items-center p-0">
            <Link
              href={aboutPage?.url || '/pages/關於作者'}
              aria-label="關於作者"
              className="mb-2 inline-block transition-transform duration-300 ease-out group-hover:-translate-y-0.5"
            >
              <Avatar className="h-24 w-24 border border-slate-200 shadow-sm transition-transform duration-300 ease-out group-hover:scale-105 dark:border-slate-700">
                {avatarSrc ? (
                  <Avatar.Image asChild>
                    <Image
                      src={avatarSrc}
                      alt={siteConfig.name}
                      width={96}
                      height={96}
                      unoptimized
                      className="h-full w-full object-cover"
                    />
                  </Avatar.Image>
                ) : null}
                <Avatar.Fallback className="text-lg font-semibold">
                  {siteConfig.name.charAt(0).toUpperCase()}
                </Avatar.Fallback>
              </Avatar>
            </Link>
            {socialItems.length > 0 && (
              <div className="mt-2 flex items-center gap-3 text-lg text-[var(--color-accent-text-light)] dark:text-[var(--color-accent-text-dark)]">
                {socialItems.map((item) => (
                  <a
                    key={item.key}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={item.label}
                    className="motion-link inline-flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-600 hover:-translate-y-0.5 hover:bg-[var(--color-accent-soft)] hover:text-[var(--color-accent)] dark:bg-slate-800 dark:text-slate-200"
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
          </Card.Content>
        </Card>

        {/* Mastodon Feed */}
        <MastodonFeed />

        {tags.length > 0 && (
          <Card className="motion-card rounded-xl border px-4 py-3 dark:border-slate-800">
            <Card.Header className="p-0">
              <Card.Title className="type-small flex items-center gap-2 font-semibold uppercase tracking-[0.35em] text-slate-500 dark:text-slate-400">
                <FiTrendingUp className="h-3 w-3 text-orange-400" />
                熱門標籤
              </Card.Title>
            </Card.Header>
            <Card.Content className="p-0">
              <div className="mt-2 flex flex-wrap gap-2 text-base">
                {tags.map(({ tag, slug, count }) => {
                  let fontWeight = 'font-normal';
                  if (count >= 5) fontWeight = 'font-semibold';
                  else if (count >= 3) fontWeight = 'font-medium';

                  return (
                    <Link key={tag} href={`/tags/${slug}`}>
                      <Chip
                        color="accent"
                        variant="soft"
                        size="sm"
                        className={`${fontWeight} tag-chip cursor-pointer rounded-full bg-[var(--color-accent-soft)] px-2 py-0.5 text-[var(--color-accent-text-light)] transition hover:bg-[var(--color-accent)] hover:text-white dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700`}
                      >
                        {tag}
                      </Chip>
                    </Link>
                  );
                })}
              </div>
            </Card.Content>
            <Card.Footer className="mt-3 flex items-center justify-between p-0 type-small text-slate-500 dark:text-slate-400">
              <span className="inline-flex items-center gap-1">
                <FiArrowRight className="h-3 w-3" />
                一覽所有標籤
              </span>
              <Link
                href="/tags"
                className="motion-link text-[var(--color-accent-text-light)] hover:text-[var(--color-accent)] dark:text-[var(--color-accent-text-dark)]"
              >
                前往
              </Link>
            </Card.Footer>
          </Card>
        )}
      </div>
    </aside>
  );
}
