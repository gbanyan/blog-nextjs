import { generateLlms } from '@/lib/machine-readable';
import { isLocale, type Locale } from '@/lib/locales';

export function generateStaticParams() {
  return [{ locale: 'en' }, { locale: 'zh-TW' }];
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ locale: string }> }
) {
  const { locale } = await params;
  if (!isLocale(locale)) return new Response('Not Found', { status: 404 });

  return new Response(generateLlms(locale as Locale), {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=86400, s-maxage=86400',
    },
  });
}
