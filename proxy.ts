import { NextRequest, NextResponse } from 'next/server';
import { defaultLocale, isLocale } from '@/lib/i18n/config';

const LOCALE_HEADER = 'x-locale';

export function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const firstSegment = pathname.split('/')[1];
  const locale = isLocale(firstSegment) ? firstSegment : defaultLocale;
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set(LOCALE_HEADER, locale);

  if (isLocale(firstSegment)) {
    return NextResponse.next({ request: { headers: requestHeaders } });
  }

  const url = request.nextUrl.clone();
  url.pathname = `/${defaultLocale}${pathname === '/' ? '' : pathname}`;

  return NextResponse.rewrite(url, {
    request: { headers: requestHeaders },
  });
}

export const config = {
  matcher: [
    '/((?!api(?:/|$)|_next(?:/|$)|assets(?:/|$)|robots\\.txt$|sitemap\\.xml$|feed\\.xml$|llms\\.txt$|ai\\.txt$|.*\\.[^/]+$).*)',
  ],
};
