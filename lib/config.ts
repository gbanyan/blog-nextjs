export const siteConfig = {
  name: process.env.NEXT_PUBLIC_SITE_NAME || 'Your Name',
  title: process.env.NEXT_PUBLIC_SITE_TITLE || 'Your Personal Site',
  description:
    process.env.NEXT_PUBLIC_SITE_DESCRIPTION ||
    'Personal homepage and blog.',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
  author: process.env.NEXT_PUBLIC_SITE_AUTHOR || 'Your Name'
};
