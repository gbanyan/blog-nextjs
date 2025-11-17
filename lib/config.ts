export const siteConfig = {
  name: process.env.NEXT_PUBLIC_SITE_NAME || 'Your Name',
  title: process.env.NEXT_PUBLIC_SITE_TITLE || 'Your Personal Site',
  description:
    process.env.NEXT_PUBLIC_SITE_DESCRIPTION ||
    'Personal homepage and blog.',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
  author: process.env.NEXT_PUBLIC_SITE_AUTHOR || 'Your Name',
  tagline:
    process.env.NEXT_PUBLIC_SITE_TAGLINE ||
    '這裡是我的個人首頁與技術 Blog。',
  postsPerPage:
    Number(process.env.NEXT_PUBLIC_POSTS_PER_PAGE) > 0
      ? Number(process.env.NEXT_PUBLIC_POSTS_PER_PAGE)
      : 5,
  defaultLocale: process.env.NEXT_PUBLIC_DEFAULT_LOCALE || 'zh-TW',
  avatar: process.env.NEXT_PUBLIC_SITE_AVATAR_URL || '',
  social: {
    twitter: process.env.NEXT_PUBLIC_TWITTER_HANDLE || '',
    github: process.env.NEXT_PUBLIC_GITHUB_URL || '',
    linkedin: process.env.NEXT_PUBLIC_LINKEDIN_URL || '',
    email: process.env.NEXT_PUBLIC_EMAIL_CONTACT || '',
    mastodon: process.env.NEXT_PUBLIC_MASTODON_URL || '',
    gitea: process.env.NEXT_PUBLIC_GITEA_URL || ''
  },
  theme: {
    accent: process.env.NEXT_PUBLIC_COLOR_ACCENT || '#2563eb',
    accentSoft: process.env.NEXT_PUBLIC_COLOR_ACCENT_SOFT || '#dbeafe',
    accentTextLight:
      process.env.NEXT_PUBLIC_COLOR_ACCENT_TEXT_LIGHT || '#1d4ed8',
    accentTextDark:
      process.env.NEXT_PUBLIC_COLOR_ACCENT_TEXT_DARK || '#93c5fd'
  },
  ogImage: process.env.NEXT_PUBLIC_OG_DEFAULT_IMAGE || '/assets/og-default.jpg',
  twitterCard:
    (process.env.NEXT_PUBLIC_TWITTER_CARD_TYPE as
      | 'summary'
      | 'summary_large_image'
      | undefined) || 'summary_large_image',
  analyticsId: process.env.NEXT_PUBLIC_ANALYTICS_ID || ''
};
