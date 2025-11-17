import { siteConfig } from '@/lib/config';

export function SiteFooter() {
  const { social } = siteConfig;

  return (
    <footer className="border-t py-4 text-center text-sm text-gray-500 dark:text-slate-400">
      <div>
        © {new Date().getFullYear()} {siteConfig.author}
      </div>
      {(social.github ||
        social.twitter ||
        social.linkedin ||
        social.email ||
        social.mastodon ||
        social.gitea) && (
        <div className="mt-1 space-x-3">
          {social.github && (
            <a
              href={social.github}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline"
            >
              GitHub
            </a>
          )}
          {social.twitter && (
            <a
              href={`https://twitter.com/${social.twitter.replace('@', '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline"
            >
              Twitter
            </a>
          )}
          {social.linkedin && (
            <a
              href={social.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline"
            >
              LinkedIn
            </a>
          )}
          {social.mastodon && (
            <a
              href={social.mastodon}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline"
            >
              Mastodon
            </a>
          )}
          {social.gitea && (
            <a
              href={social.gitea}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline"
            >
              Gitea
            </a>
          )}
          {social.email && (
            <a
              href={`mailto:${social.email}`}
              className="hover:underline"
            >
              Email
            </a>
          )}
        </div>
      )}
    </footer>
  );
}
