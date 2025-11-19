import '../styles/globals.css';
import type { Metadata } from 'next';
import { siteConfig } from '@/lib/config';
import { LayoutShell } from '@/components/layout-shell';
import { ThemeProvider } from 'next-themes';
import { Playfair_Display } from 'next/font/google';

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-serif-eng',
  display: 'swap',
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
  }
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const theme = siteConfig.theme;

  return (
    <html lang={siteConfig.defaultLocale} suppressHydrationWarning className={playfair.variable}>
      <body>
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
      </body>
    </html>
  );
}
