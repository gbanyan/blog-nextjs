import { siteConfig } from '@/lib/config';

export const SUPPORTED_LOCALES = ['zh-TW', 'en'] as const;
export type Locale = (typeof SUPPORTED_LOCALES)[number];

export const DEFAULT_LOCALE: Locale = SUPPORTED_LOCALES.includes(
  siteConfig.defaultLocale as Locale
)
  ? (siteConfig.defaultLocale as Locale)
  : 'zh-TW';

export interface LocalizedDocumentLike {
  locale?: string;
  language?: string;
  translation_key?: string;
  translationKey?: string;
  translation_id?: string;
  translationId?: string;
  url?: string;
  status?: string;
}

export function isLocale(value: string | undefined): value is Locale {
  return !!value && (SUPPORTED_LOCALES as readonly string[]).includes(value);
}

export function normalizeLocale(value: string | undefined): Locale | undefined {
  if (isLocale(value)) return value;
  if (value?.toLowerCase() === 'zh-tw') return 'zh-TW';
  return value?.toLowerCase() === 'en' ? 'en' : undefined;
}

export function getDocumentLocale(document: LocalizedDocumentLike): Locale {
  return normalizeLocale(document.locale || document.language) || DEFAULT_LOCALE;
}

export function getTranslationKey(document: LocalizedDocumentLike): string | undefined {
  return (
    document.translation_key ||
    document.translationKey ||
    document.translation_id ||
    document.translationId
  );
}

/**
 * The default locale keeps the existing public paths. Secondary locales use a
 * prefix so the routing lane can add a locale segment without changing the
 * content adapter's source-relative slug contract.
 */
export function localizedPath(path: string, locale: Locale): string {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  const withoutLocalePrefix = normalizedPath.replace(/^\/(?:zh-TW|en)(?=\/|$)/, '');
  const basePath = withoutLocalePrefix || '/';

  return locale === DEFAULT_LOCALE
    ? basePath
    : `/${locale}${basePath === '/' ? '' : basePath}`;
}

export function documentPath(
  document: LocalizedDocumentLike,
  locale: Locale = getDocumentLocale(document)
): string {
  return localizedPath(document.url || '/', locale);
}

export function absoluteUrl(path: string): string {
  return new URL(path, siteConfig.url).toString();
}

export function localeToOpenGraph(locale: Locale): string {
  return locale === 'zh-TW' ? 'zh_TW' : 'en_US';
}

export function localeToRss(locale: Locale): string {
  return locale === 'zh-TW' ? 'zh-TW' : 'en';
}

export function localizedEndpoint(path: string, locale: Locale): string {
  return absoluteUrl(localizedPath(path, locale));
}
