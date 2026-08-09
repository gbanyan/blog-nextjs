import { isLocale, type Locale } from '@/lib/locales';
import { localizedSitemapXml } from '@/lib/seo';

export function generateStaticParams() {
  return [{ locale: 'en' }, { locale: 'zh-TW' }];
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ locale: string }> }
) {
  const { locale } = await params;
  if (!isLocale(locale)) return new Response('Not Found', { status: 404 });

  return new Response(localizedSitemapXml(locale as Locale), {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}
