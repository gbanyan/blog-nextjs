/**
 * Server-only sidebar data preparation.
 *
 * Pulling the full content records into a client bundle (via
 * `getAllTagsWithCount` or `allPages`) bloats the initial JS. Computing this
 * once on the server and passing only tiny serializable props keeps the client
 * bundle lean.
 */
import { getAllTagsWithCount } from '@/lib/tags';
import { allPages } from '@/lib/content';
import { siteConfig } from '@/lib/config';

export interface TagItem {
  tag: string;
  slug: string;
  count: number;
}

export interface SidebarData {
  /** Top tags, precomputed server-side. */
  tags: TagItem[];
  aboutUrl: string;
  avatarSrc: string;
}

export function getSidebarData(): SidebarData {
  const tags = getAllTagsWithCount().slice(0, 5);
  const aboutPage =
    allPages.find((p) => p.title.includes('關於作者')) ??
    allPages.find((p) => p.slug === 'about-me');

  return {
    tags,
    aboutUrl: aboutPage?.url ?? '/pages/關於作者',
    avatarSrc: siteConfig.avatar,
  };
}
