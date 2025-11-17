import { siteConfig } from '@/lib/config';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faGithub,
  faTwitter,
  faMastodon,
  faGitAlt,
  faLinkedin
} from '@fortawesome/free-brands-svg-icons';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';

export function Hero() {
  const { name, tagline, social } = siteConfig;
  const initial = name?.charAt(0)?.toUpperCase() || 'G';

  const items = [
    social.github && {
      key: 'github',
      href: social.github,
      label: 'GitHub',
      icon: faGithub
    },
    social.twitter && {
      key: 'twitter',
      href: `https://twitter.com/${social.twitter.replace('@', '')}`,
      label: 'Twitter',
      icon: faTwitter
    },
    social.mastodon && {
      key: 'mastodon',
      href: social.mastodon,
      label: 'Mastodon',
      icon: faMastodon
    },
    social.gitea && {
      key: 'gitea',
      href: social.gitea,
      label: 'Gitea',
      icon: faGitAlt
    },
    social.linkedin && {
      key: 'linkedin',
      href: social.linkedin,
      label: 'LinkedIn',
      icon: faLinkedin
    },
    social.email && {
      key: 'email',
      href: `mailto:${social.email}`,
      label: 'Email',
      icon: faEnvelope
    }
  ].filter(Boolean) as {
    key: string;
    href: string;
    label: string;
    icon: any;
  }[];

  return (
    <section className="mb-8 rounded-xl border bg-gradient-to-r from-slate-50 to-slate-100 px-6 py-6 shadow-sm dark:border-slate-800 dark:from-slate-900 dark:to-slate-950">
      <div className="flex items-center gap-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-900 text-2xl font-semibold text-slate-50 dark:bg-slate-100 dark:text-slate-900">
          {initial}
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            {name}
          </h1>
          <p className="mt-1 max-w-2xl text-sm text-slate-700 dark:text-slate-100">
            {tagline}
          </p>
          {items.length > 0 && (
            <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-slate-500">
              {items.map((item) => (
                <a
                  key={item.key}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 rounded-full bg-white/80 px-3 py-1 shadow-sm ring-1 ring-slate-200 hover:bg-slate-50 dark:bg-slate-900/80 dark:ring-slate-700"
                >
                  <FontAwesomeIcon icon={item.icon} className="h-3.5 w-3.5" />
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
