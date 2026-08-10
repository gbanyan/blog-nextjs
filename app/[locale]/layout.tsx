import '../../styles/globals.css';
import type { Metadata } from 'next';
import { siteConfig } from '@/lib/config';
import { getAllPostsSorted } from '@/lib/posts';
import { LayoutShell } from '@/components/layout-shell';
import { ThemeProvider } from 'next-themes';
import { Cormorant_Garamond, LXGW_WenKai_TC } from 'next/font/google';
import { JsonLd } from '@/components/json-ld';
import NextTopLoader from 'nextjs-toploader';
import { notFound } from 'next/navigation';
import { isLocale, locales, type Locale } from '@/lib/i18n/config';
import { DEFAULT_LOCALE, absoluteUrl, localeToOpenGraph, localizedPath } from '@/lib/locales';
import { getDictionary } from '@/lib/i18n/dictionaries';

const cormorantGaramond = Cormorant_Garamond({
  weight: 'variable',
  subsets: ['latin'],
  variable: '--font-display-latin',
  display: 'swap',
});

const lxgwWenKai = LXGW_WenKai_TC({
  weight: ['400', '700'],
  subsets: ['latin'],
  variable: '--font-display-cjk',
  display: 'swap',
  preload: false,
  adjustFontFallback: false,
});

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  const locale = isLocale(rawLocale) ? rawLocale : DEFAULT_LOCALE;
  const dictionary = getDictionary(locale);
  const canonical = absoluteUrl(localizedPath('/', locale));

  return {
    title: {
      default: dictionary.brand.title,
      template: `%s | ${dictionary.brand.title}`,
    },
    description: dictionary.brand.description,
    metadataBase: new URL(siteConfig.url),
    alternates: {
      canonical,
      languages: {
        [DEFAULT_LOCALE]: absoluteUrl('/'),
        en: absoluteUrl('/en'),
        'x-default': absoluteUrl('/'),
      },
      types: {
        'application/rss+xml': absoluteUrl(localizedPath('/feed.xml', locale)),
      },
    },
    creator: siteConfig.author,
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    openGraph: {
      type: 'website',
      title: dictionary.brand.title,
      description: dictionary.brand.description,
      url: canonical,
      siteName: dictionary.brand.title,
      locale: localeToOpenGraph(locale),
      images: [
        {
          url: siteConfig.ogImage,
          width: 1200,
          height: 630,
          alt: dictionary.brand.title,
        },
      ],
    },
    twitter: {
      card: siteConfig.twitterCard,
      creator: siteConfig.social.twitter || undefined,
      title: dictionary.brand.title,
      description: dictionary.brand.description,
      images: [siteConfig.ogImage],
    },
    icons: {
      icon: '/favicon.png',
      apple: '/favicon.png',
    },
  };
}

export function generateStaticParams(): { locale: Locale }[] {
  return locales.map((locale) => ({ locale }));
}

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dictionary = getDictionary(locale);
  const theme = siteConfig.theme;
  const recentPosts = (await getAllPostsSorted(locale))
    .slice(0, 5)
    .map((p) => ({ title: p.title, url: p.url }));

  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: dictionary.brand.title,
    description: dictionary.brand.description,
    url: siteConfig.url,
    inLanguage: locale,
    author: {
      '@type': 'Person',
      name: siteConfig.author,
      url: siteConfig.url,
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${siteConfig.url}${localizedPath('/blog', locale)}?search={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };

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
    <html lang={locale} suppressHydrationWarning className={`${cormorantGaramond.variable} ${lxgwWenKai.variable}`}>
      <body>
        <NextTopLoader
          color={theme.accent}
          height={3}
          showSpinner={false}
          speed={200}
          shadow={`0 0 10px ${theme.accent}, 0 0 5px ${theme.accent}`}
        />
        <JsonLd data={websiteSchema} />
        <JsonLd data={organizationSchema} />
        <style
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
              <LayoutShell recentPosts={recentPosts} locale={locale}>{children}</LayoutShell>
          </ThemeProvider>
      </body>
    </html>
  );
}
