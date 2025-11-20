'use client';

import { useEffect, useState } from 'react';
import { FaMastodon } from 'react-icons/fa';
import { FiArrowRight } from 'react-icons/fi';
import { siteConfig } from '@/lib/config';
import {
  parseMastodonUrl,
  stripHtml,
  truncateText,
  formatRelativeTime,
  fetchAccountId,
  fetchStatuses,
  type MastodonStatus
} from '@/lib/mastodon';

export function MastodonFeed() {
  const [statuses, setStatuses] = useState<MastodonStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const loadStatuses = async () => {
      const mastodonUrl = siteConfig.social.mastodon;

      if (!mastodonUrl) {
        setLoading(false);
        return;
      }

      try {
        // Parse the Mastodon URL
        const parsed = parseMastodonUrl(mastodonUrl);
        if (!parsed) {
          setError(true);
          setLoading(false);
          return;
        }

        const { instance, username } = parsed;

        // Fetch account ID
        const accountId = await fetchAccountId(instance, username);
        if (!accountId) {
          setError(true);
          setLoading(false);
          return;
        }

        // Fetch statuses (5 posts, exclude replies, include boosts)
        const fetchedStatuses = await fetchStatuses(instance, accountId, 5);
        setStatuses(fetchedStatuses);
      } catch (err) {
        console.error('Error loading Mastodon feed:', err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    loadStatuses();
  }, []);

  // Don't render if no Mastodon URL is configured
  if (!siteConfig.social.mastodon) {
    return null;
  }

  // Don't render if there's an error (fail silently)
  if (error) {
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
      {loading ? (
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="h-3 w-3/4 rounded bg-slate-200 dark:bg-slate-800"></div>
              <div className="mt-2 h-3 w-full rounded bg-slate-200 dark:bg-slate-800"></div>
              <div className="mt-2 h-2 w-1/3 rounded bg-slate-200 dark:bg-slate-800"></div>
            </div>
          ))}
        </div>
      ) : statuses.length === 0 ? (
        <p className="type-small text-slate-400 dark:text-slate-500">
          暫無動態
        </p>
      ) : (
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
      )}

      {/* Footer link */}
      {!loading && statuses.length > 0 && (
        <a
          href={siteConfig.social.mastodon}
          target="_blank"
          rel="noopener noreferrer"
          className="type-small mt-3 flex items-center justify-end gap-1.5 text-slate-500 transition-colors hover:text-accent-textLight dark:text-slate-400 dark:hover:text-accent-textDark"
        >
          查看更多
          <FiArrowRight className="h-3 w-3" />
        </a>
      )}
    </section>
  );
}
