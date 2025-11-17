import '../styles/globals.css';
import type { Metadata } from 'next';
import { siteConfig } from '@/lib/config';
import { LayoutShell } from '@/components/layout-shell';
import { ThemeProvider } from 'next-themes';

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
  }
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang={siteConfig.defaultLocale} suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <LayoutShell>{children}</LayoutShell>
        </ThemeProvider>
      </body>
    </html>
  );
}
