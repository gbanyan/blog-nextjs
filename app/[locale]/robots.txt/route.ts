import { localizedRobots } from '@/app/robots';
import { isLocale } from '@/lib/locales';

export function generateStaticParams() {
  return [{ locale: 'en' }, { locale: 'zh-TW' }];
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ locale: string }> }
) {
  const { locale } = await params;
  if (!isLocale(locale)) return new Response('Not Found', { status: 404 });

  const metadata = localizedRobots(locale, `/${locale}/sitemap.xml`);
  const rules = Array.isArray(metadata.rules) ? metadata.rules : [metadata.rules];
  const lines = [
    ...rules.flatMap((rule) => {
      const userAgents = Array.isArray(rule.userAgent) ? rule.userAgent : [rule.userAgent];
      return [
        ...userAgents.map((userAgent) => `User-agent: ${userAgent}`),
        ...(rule.allow ? (Array.isArray(rule.allow) ? rule.allow : [rule.allow]).map((path) => `Allow: ${path}`) : []),
        ...(rule.disallow ? (Array.isArray(rule.disallow) ? rule.disallow : [rule.disallow]).map((path) => `Disallow: ${path}`) : []),
        '',
      ];
    }),
    `Sitemap: ${metadata.sitemap}`,
    `Host: ${metadata.host}`,
  ];

  return new Response(lines.join('\n'), {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=86400, s-maxage=86400',
    },
  });
}
