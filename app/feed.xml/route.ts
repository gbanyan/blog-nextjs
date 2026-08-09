import { generateRss } from '@/lib/machine-readable';
import { DEFAULT_LOCALE } from '@/lib/locales';

export async function GET() {
  return new Response(generateRss(DEFAULT_LOCALE), {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}
