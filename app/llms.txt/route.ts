import { generateLlms } from '@/lib/machine-readable';
import { DEFAULT_LOCALE } from '@/lib/locales';

export async function GET() {
  return new Response(generateLlms(DEFAULT_LOCALE), {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=86400, s-maxage=86400',
    },
  });
}
