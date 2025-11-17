import { siteConfig } from '@/lib/config';

export function Hero() {
  const { name, tagline, social } = siteConfig;
  const initial = name?.charAt(0)?.toUpperCase() || 'G';

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
          {(social.github ||
            social.twitter ||
            social.linkedin ||
            social.email ||
            social.mastodon ||
            social.gitea) && (
            <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-slate-500">
              {social.github && (
                <a
                  href={social.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full bg-white/70 px-3 py-1 shadow-sm ring-1 ring-slate-200 hover:bg-slate-50 dark:bg-slate-900/60 dark:ring-slate-700"
                >
                  GitHub
                </a>
              )}
              {social.twitter && (
                <a
                  href={`https://twitter.com/${social.twitter.replace('@', '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full bg-white/70 px-3 py-1 shadow-sm ring-1 ring-slate-200 hover:bg-slate-50 dark:bg-slate-900/60 dark:ring-slate-700"
                >
                  Twitter
                </a>
              )}
              {social.mastodon && (
                <a
                  href={social.mastodon}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full bg-white/70 px-3 py-1 shadow-sm ring-1 ring-slate-200 hover:bg-slate-50 dark:bg-slate-900/60 dark:ring-slate-700"
                >
                  Mastodon
                </a>
              )}
              {social.gitea && (
                <a
                  href={social.gitea}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full bg-white/70 px-3 py-1 shadow-sm ring-1 ring-slate-200 hover:bg-slate-50 dark:bg-slate-900/60 dark:ring-slate-700"
                >
                  Gitea
                </a>
              )}
              {social.linkedin && (
                <a
                  href={social.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full bg-white/70 px-3 py-1 shadow-sm ring-1 ring-slate-200 hover:bg-slate-50 dark:bg-slate-900/60 dark:ring-slate-700"
                >
                  LinkedIn
                </a>
              )}
              {social.email && (
                <a
                  href={`mailto:${social.email}`}
                  className="rounded-full bg-white/70 px-3 py-1 shadow-sm ring-1 ring-slate-200 hover:bg-slate-50 dark:bg-slate-900/60 dark:ring-slate-700"
                >
                  Email
                </a>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
