import { siteConfig } from '@/lib/config';
import { FaGithub, FaTwitter, FaMastodon, FaGit, FaLinkedin } from 'react-icons/fa';
import { FiMail, FiFeather } from 'react-icons/fi';
import { MetaItem } from './meta-item';

export function Hero() {
  const { name, tagline, social } = siteConfig;
  const initial = name?.charAt(0)?.toUpperCase() || 'G';

  const items = [
    social.github && {
      key: 'github',
      href: social.github,
      label: 'GitHub',
      icon: FaGithub
    },
    social.twitter && {
      key: 'twitter',
      href: `https://twitter.com/${social.twitter.replace('@', '')}`,
      label: 'Twitter',
      icon: FaTwitter
    },
    social.mastodon && {
      key: 'mastodon',
      href: social.mastodon,
      label: 'Mastodon',
      icon: FaMastodon
    },
    social.gitea && {
      key: 'gitea',
      href: social.gitea,
      label: 'Gitea',
      icon: FaGit
    },
    social.linkedin && {
      key: 'linkedin',
      href: social.linkedin,
      label: 'LinkedIn',
      icon: FaLinkedin
    },
    social.email && {
      key: 'email',
      href: `mailto:${social.email}`,
      label: 'Email',
      icon: FiMail
    }
  ].filter(Boolean) as {
    key: string;
    href: string;
    label: string;
    icon: any;
  }[];

  return (
    <section className="motion-card group relative mb-8 overflow-hidden rounded-xl border bg-gradient-to-r from-sky-50 via-indigo-50 to-slate-50 px-6 py-6 shadow-sm dark:border-slate-800 dark:from-slate-900 dark:via-slate-950 dark:to-slate-900">
      <div className="pointer-events-none absolute -left-16 -top-16 h-40 w-40 rounded-full bg-sky-300/40 blur-3xl mix-blend-soft-light motion-safe:animate-float-soft dark:bg-sky-500/25" />
      <div className="pointer-events-none absolute -bottom-20 right-[-3rem] h-44 w-44 rounded-full bg-indigo-300/35 blur-3xl mix-blend-soft-light motion-safe:animate-float-soft dark:bg-indigo-500/25" />

      <div className="relative flex items-center gap-4 motion-safe:animate-fade-in-up">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-900 text-xl font-semibold text-slate-50 shadow-md transition-transform duration-300 ease-out group-hover:scale-105 dark:bg-slate-100 dark:text-slate-900">
          {initial}
        </div>
        <div>
          <h1 className="hero-title type-display font-bold tracking-tight">
            <span className="hero-title__sweep" aria-hidden="true" />
            {name}
          </h1>
          <div className="mt-1">
            <MetaItem icon={FiFeather}>
              {tagline}
            </MetaItem>
          </div>
          {items.length > 0 && (
            <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-slate-500">
              {items.map((item) => (
                <a
                  key={item.key}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="motion-link flex items-center gap-2 rounded-full bg-white/80 px-3 py-1 text-slate-600 shadow-sm ring-1 ring-slate-200 hover:-translate-y-0.5 hover:bg-accent-soft hover:text-accent hover:shadow-md dark:bg-slate-900/80 dark:text-slate-200 dark:ring-slate-700"
                >
                  <item.icon className="h-3.5 w-3.5 text-accent" />
                  <span>{item.label}</span>
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
