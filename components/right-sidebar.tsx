import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGithub, faMastodon, faLinkedin } from '@fortawesome/free-brands-svg-icons';
import { siteConfig } from '@/lib/config';
import { getAllTagsWithCount } from '@/lib/posts';
import { allPages } from 'contentlayer/generated';

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
      icon: faGithub,
      label: 'GitHub'
    },
    siteConfig.social.mastodon && {
      key: 'mastodon',
      href: siteConfig.social.mastodon,
      icon: faMastodon,
      label: 'Mastodon'
    },
    siteConfig.social.linkedin && {
      key: 'linkedin',
      href: siteConfig.social.linkedin,
      icon: faLinkedin,
      label: 'LinkedIn'
    }
  ].filter(Boolean) as { key: string; href: string; icon: any; label: string }[];

  return (
    <aside className="hidden lg:block text-sm">
      <div className="sticky top-20 flex flex-col gap-4">
        <section className="rounded-xl border bg-white px-4 py-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100">
          <div className="flex flex-col items-center">
            <Link
              href={aboutPage?.url || '/pages/關於作者'}
              aria-label="關於作者"
              className="mb-2 inline-block"
            >
              {avatarSrc ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={avatarSrc}
                  alt={siteConfig.name}
                  className="h-24 w-24 rounded-full border border-slate-200 object-cover dark:border-slate-700"
                />
              ) : (
                <div className="flex h-24 w-24 items-center justify-center rounded-full bg-slate-900 text-lg font-semibold text-slate-50 dark:bg-slate-100 dark:text-slate-900">
                  {siteConfig.name.charAt(0).toUpperCase()}
                </div>
              )}
            </Link>
            {socialItems.length > 0 && (
              <div className="flex items-center gap-3 text-base text-accent-textLight dark:text-accent-textDark">
                {socialItems.map((item) => (
                  <a
                    key={item.key}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={item.label}
                    className="transition hover:text-accent"
                  >
                    <FontAwesomeIcon icon={item.icon} className="h-4 w-4" />
                  </a>
                ))}
              </div>
            )}
            {siteConfig.aboutShort && (
              <p className="mt-2 max-w-[11rem] text-center text-[13px] text-slate-600 dark:text-slate-200">
                {siteConfig.aboutShort}
              </p>
            )}
          </div>
        </section>

        {tags.length > 0 && (
          <section className="rounded-xl border bg-white px-4 py-3 shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100">
            <h2 className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
              熱門標籤
            </h2>
            <div className="mt-2 flex flex-wrap gap-2 text-[13px]">
              {tags.map(({ tag, slug, count }) => {
                let sizeClass = '';
                if (count >= 5) sizeClass = 'font-semibold';
                else if (count >= 3) sizeClass = 'font-medium';

                return (
                  <Link
                    key={tag}
                    href={`/tags/${slug}`}
                    className={`${sizeClass} rounded-full bg-accent-soft px-2 py-0.5 text-accent-textLight transition hover:bg-accent hover:text-white dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700`}
                  >
                    {tag}
                  </Link>
                );
              })}
            </div>
            <div className="mt-2 text-right text-[11px]">
              <Link
                href="/tags"
                className="text-slate-500 hover:text-accent dark:text-slate-400 dark:hover:text-accent"
              >
                查看全部標籤 →
              </Link>
            </div>
          </section>
        )}
      </div>
    </aside>
  );
}
