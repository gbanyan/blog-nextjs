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

export function SiteFooter() {
  const { social } = siteConfig;

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
    <footer className="py-4 text-center text-sm text-gray-500 dark:text-slate-400">
      <div>
        © {new Date().getFullYear()} {siteConfig.author}
      </div>
      {items.length > 0 && (
        <div className="mt-2 flex justify-center gap-4 text-base">
          {items.map((item) => (
            <a
              key={item.key}
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={item.label}
              className="text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100"
            >
              <FontAwesomeIcon icon={item.icon} className="h-4 w-4" />
            </a>
          ))}
        </div>
      )}
    </footer>
  );
}
