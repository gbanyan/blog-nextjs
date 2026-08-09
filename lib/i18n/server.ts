import { headers } from 'next/headers';
import { defaultLocale, isLocale, type Locale } from './config';

export async function getRequestLocale(): Promise<Locale> {
  const requestHeaders = await headers();
  const value = requestHeaders.get('x-locale') ?? undefined;
  return isLocale(value) ? value : defaultLocale;
}
