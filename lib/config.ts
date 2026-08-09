import {
  defaultLocale as fallbackLocale,
  isLocale,
  type Locale,
} from '@/lib/i18n/config';

const configuredLocale = process.env.NEXT_PUBLIC_DEFAULT_LOCALE;

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
    '個人首頁與技術筆記',
  postsPerPage:
    Number(process.env.NEXT_PUBLIC_POSTS_PER_PAGE) > 0
      ? Number(process.env.NEXT_PUBLIC_POSTS_PER_PAGE)
      : 5,
  defaultLocale: (isLocale(configuredLocale)
    ? configuredLocale
    : fallbackLocale) as Locale,
  avatar: process.env.NEXT_PUBLIC_SITE_AVATAR_URL || '',
  aboutShort:
    process.env.NEXT_PUBLIC_SITE_ABOUT_SHORT ||
    '醫師／寫作／技術分享',
  social: {
    twitter: process.env.NEXT_PUBLIC_TWITTER_HANDLE || '',
    github: process.env.NEXT_PUBLIC_GITHUB_URL || '',
    linkedin: process.env.NEXT_PUBLIC_LINKEDIN_URL || '',
    email: process.env.NEXT_PUBLIC_EMAIL_CONTACT || '',
    mastodon: process.env.NEXT_PUBLIC_MASTODON_URL || '',
    gitea: process.env.NEXT_PUBLIC_GITEA_URL || ''
  },
  theme: {
    accent: process.env.NEXT_PUBLIC_COLOR_ACCENT || '#7c3aed',
    accentSoft: process.env.NEXT_PUBLIC_COLOR_ACCENT_SOFT || '#f3e8ff',
    accentTextLight:
      process.env.NEXT_PUBLIC_COLOR_ACCENT_TEXT_LIGHT || '#6d28d9',
    accentTextDark:
      process.env.NEXT_PUBLIC_COLOR_ACCENT_TEXT_DARK || '#c4b5fd'
  },
  navIconOverrides: {
    titles: {
      homelab: 'server',
      '開發工作環境': 'device',
      '關於本站': 'menu'
    },
    slugs: {}
  },
  ogImage: process.env.NEXT_PUBLIC_OG_DEFAULT_IMAGE || '/assets/og-default.png',
  twitterCard:
    (process.env.NEXT_PUBLIC_TWITTER_CARD_TYPE as
      | 'summary'
      | 'summary_large_image'
      | undefined) || 'summary_large_image',
  analyticsId: process.env.NEXT_PUBLIC_ANALYTICS_ID || ''
};
