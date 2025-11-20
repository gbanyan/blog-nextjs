import { FaMastodon } from 'react-icons/fa';
import { FiArrowRight } from 'react-icons/fi';
import { siteConfig } from '@/lib/config';
import {
  parseMastodonUrl,
  stripHtml,
  truncateText,
  formatRelativeTime,
  type MastodonStatus
} from '@/lib/mastodon';

/**
 * Fetch user's Mastodon account ID from username with ISR
 */
async function fetchAccountId(instance: string, username: string): Promise<string | null> {
  try {
    const response = await fetch(
      `https://${instance}/api/v1/accounts/lookup?acct=${username}`,
      {
        next: { revalidate: 1800 } // Revalidate every 30 minutes
      }
    );

    if (!response.ok) return null;

    const account = await response.json();
    return account.id;
  } catch (error) {
    console.error('Error fetching Mastodon account:', error);
    return null;
  }
}

/**
 * Fetch user's recent statuses from Mastodon with ISR
 */
async function fetchStatuses(
  instance: string,
  accountId: string,
  limit: number = 5
): Promise<MastodonStatus[]> {
  try {
    const response = await fetch(
      `https://${instance}/api/v1/accounts/${accountId}/statuses?limit=${limit}&exclude_replies=true`,
      {
        next: { revalidate: 1800 } // Revalidate every 30 minutes
      }
    );

    if (!response.ok) return [];

    const statuses = await response.json();
    return statuses;
  } catch (error) {
    console.error('Error fetching Mastodon statuses:', error);
    return [];
  }
}

/**
 * Server Component for Mastodon feed with ISR
 */
export async function MastodonFeed() {
  const mastodonUrl = siteConfig.social.mastodon;

  // Don't render if no Mastodon URL is configured
  if (!mastodonUrl) {
    return null;
  }

  let statuses: MastodonStatus[] = [];

  try {
    // Parse the Mastodon URL
    const parsed = parseMastodonUrl(mastodonUrl);
    if (!parsed) {
      return null;
    }

    const { instance, username } = parsed;

    // Fetch account ID
    const accountId = await fetchAccountId(instance, username);
    if (!accountId) {
      return null;
    }

    // Fetch statuses (5 posts, exclude replies, include boosts)
    statuses = await fetchStatuses(instance, accountId, 5);
  } catch (err) {
    console.error('Error loading Mastodon feed:', err);
    // Fail silently - don't render component on error
    return null;
  }

  // Don't render if no statuses
  if (statuses.length === 0) {
    return null;
  }

  return (
    <section className="motion-card group rounded-xl border bg-white px-4 py-3 shadow-sm hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-900/90">
      {/* Header */}
      <div className="type-small mb-3 flex items-center gap-2 font-semibold uppercase tracking-[0.35em] text-slate-500 dark:text-slate-400">
        <FaMastodon className="h-4 w-4 text-purple-500 dark:text-purple-400" />
        微網誌
      </div>

      {/* Content */}
      <div className="space-y-3">
        {statuses.map((status) => {
          // Handle boosts (reblogs)
          const displayStatus = status.reblog || status;
          const content = stripHtml(displayStatus.content);
          const truncated = truncateText(content, 180);
          const relativeTime = formatRelativeTime(status.created_at);
          const hasMedia = displayStatus.media_attachments.length > 0;

          return (
            <article key={status.id} className="group/post">
              <a
                href={status.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block space-y-1.5 transition-opacity hover:opacity-70"
              >
                {/* Boost indicator */}
                {status.reblog && (
                  <div className="type-small flex items-center gap-1 text-slate-400 dark:text-slate-500">
                    <FiArrowRight className="h-2.5 w-2.5 rotate-90" />
                    <span>轉推了</span>
                  </div>
                )}

                {/* Content */}
                <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-200">
                  {truncated}
                </p>

                {/* Media indicator */}
                {hasMedia && (
                  <div className="type-small text-slate-400 dark:text-slate-500">
                    📎 包含 {displayStatus.media_attachments.length} 個媒體
                  </div>
                )}

                {/* Timestamp */}
                <time
                  className="type-small block text-slate-400 dark:text-slate-500"
                  dateTime={status.created_at}
                >
                  {relativeTime}
                </time>
              </a>
            </article>
          );
        })}
      </div>

      {/* Footer link */}
      <a
        href={siteConfig.social.mastodon}
        target="_blank"
        rel="noopener noreferrer"
        className="type-small mt-3 flex items-center justify-end gap-1.5 text-slate-500 transition-colors hover:text-accent-textLight dark:text-slate-400 dark:hover:text-accent-textDark"
      >
        查看更多
        <FiArrowRight className="h-3 w-3" />
      </a>
    </section>
  );
}
