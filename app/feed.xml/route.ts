import { allPosts } from 'contentlayer2/generated';
import { siteConfig } from '@/lib/config';

export async function GET() {
  const sortedPosts = allPosts
    .filter((post) => post.status === 'published')
    .sort((a, b) => {
      const dateA = a.published_at ? new Date(a.published_at).getTime() : 0;
      const dateB = b.published_at ? new Date(b.published_at).getTime() : 0;
      return dateB - dateA;
    })
    .slice(0, 20); // Latest 20 posts

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>${escapeXml(siteConfig.name)}</title>
    <link>${siteUrl}</link>
    <description>${escapeXml(siteConfig.description)}</description>
    <language>${siteConfig.defaultLocale.replace('_', '-')}</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${siteUrl}/feed.xml" rel="self" type="application/rss+xml"/>
    ${sortedPosts
      .map((post) => {
        const postUrl = `${siteUrl}${post.url}`;
        const pubDate = post.published_at
          ? new Date(post.published_at).toUTCString()
          : new Date(post.created_at || Date.now()).toUTCString();

        return `
    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${postUrl}</link>
      <guid isPermaLink="true">${postUrl}</guid>
      <description>${escapeXml(post.description || post.custom_excerpt || post.title)}</description>
      ${post.body?.html ? `<content:encoded><![CDATA[${post.body.html}]]></content:encoded>` : ''}
      <pubDate>${pubDate}</pubDate>
      ${post.authors?.map((author) => `<author>${escapeXml(author)}</author>`).join('\n      ') || ''}
      ${post.tags?.map((tag) => `<category>${escapeXml(tag)}</category>`).join('\n      ') || ''}
    </item>`;
      })
      .join('')}
  </channel>
</rss>`;

  return new Response(rss, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}

function escapeXml(unsafe: string): string {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}
