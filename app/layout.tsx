import '../styles/globals.css';
import type { Metadata } from 'next';
import { siteConfig } from '@/lib/config';
import { LayoutShell } from '@/components/layout-shell';
import { ThemeProvider } from 'next-themes';
import { Playfair_Display, LXGW_WenKai_TC } from 'next/font/google';
import { JsonLd } from '@/components/json-ld';
import { WebVitals } from '@/components/web-vitals';

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-serif-eng',
  display: 'swap',
});

const lxgwWenKai = LXGW_WenKai_TC({
  weight: ['400', '700'], // 只加载 Regular 和 Bold
  subsets: ['latin'],
  variable: '--font-serif-cn',
  display: 'swap',
  preload: true,
  adjustFontFallback: false, // 中文字体不需要 fallback 调整，使用系统字体作为 fallback
});

export const metadata: Metadata = {
  title: {
    default: siteConfig.title,
    template: `%s | ${siteConfig.title}`
  },
  description: siteConfig.description,
  metadataBase: new URL(siteConfig.url),
  openGraph: {
    title: siteConfig.title,
    description: siteConfig.description,
    url: siteConfig.url,
    siteName: siteConfig.title,
    images: [siteConfig.ogImage]
  },
  twitter: {
    card: siteConfig.twitterCard,
    site: siteConfig.social.twitter || undefined,
    title: siteConfig.title,
    description: siteConfig.description,
    images: [siteConfig.ogImage]
  },
  icons: {
    icon: '/favicon.png'
  },
  alternates: {
    types: {
      'application/rss+xml': `${siteConfig.url}/feed.xml`
    }
  }
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const theme = siteConfig.theme;

  // WebSite Schema
  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: siteConfig.title,
    description: siteConfig.description,
    url: siteConfig.url,
    inLanguage: siteConfig.defaultLocale,
    author: {
      '@type': 'Person',
      name: siteConfig.author,
      url: siteConfig.url,
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${siteConfig.url}/blog?search={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };

  // Organization Schema
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: siteConfig.name,
    url: siteConfig.url,
    logo: `${siteConfig.url}${siteConfig.avatar}`,
    sameAs: [
      siteConfig.social.github,
      siteConfig.social.twitter && `https://twitter.com/${siteConfig.social.twitter.replace('@', '')}`,
      siteConfig.social.mastodon,
    ].filter(Boolean),
  };

  return (
    <html lang={siteConfig.defaultLocale} suppressHydrationWarning className={`${playfair.variable} ${lxgwWenKai.variable}`}>
      <head>
        {/* Preconnect to Google Fonts for faster font loading */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>
        <JsonLd data={websiteSchema} />
        <JsonLd data={organizationSchema} />
        <style
          // Set CSS variables for accent colors (light + dark variants)
          dangerouslySetInnerHTML={{
            __html: `
              :root {
                --color-accent: ${theme.accent};
                --color-accent-soft: ${theme.accentSoft};
                --color-accent-text-light: ${theme.accentTextLight};
                --color-accent-text-dark: ${theme.accentTextDark};
              }
            `
          }}
        />
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <LayoutShell>{children}</LayoutShell>
        </ThemeProvider>
        <WebVitals />
      </body>
    </html>
  );
}
