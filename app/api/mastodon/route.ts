import { NextResponse } from 'next/server';
import { cacheLife } from 'next/cache';
import {
  parseMastodonUrl,
  fetchAccountId,
  fetchStatuses,
  type MastodonStatus,
} from '@/lib/mastodon';
import { siteConfig } from '@/lib/config';

/**
 * Mastodon status feed route.
 * Fetches server-side (no CORS / external network cost on the client) and
 * caches for 60s so repeated lazy loads don't hit the instance.
 */
async function getMastodonStatuses(): Promise<MastodonStatus[]> {
  'use cache';
  cacheLife({ revalidate: 60, stale: 60 });

  const mastodonUrl = siteConfig.social.mastodon;
  if (!mastodonUrl) return [];
  const parsed = parseMastodonUrl(mastodonUrl);
  if (!parsed) return [];
  const accountId = await fetchAccountId(parsed.instance, parsed.username);
  if (!accountId) return [];
  const statuses = await fetchStatuses(parsed.instance, accountId, 5);
  return statuses ?? [];
}

export async function GET() {
  try {
    const statuses = await getMastodonStatuses();
    return NextResponse.json({ statuses });
  } catch {
    return NextResponse.json({ statuses: [] });
  }
}
