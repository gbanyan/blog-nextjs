import type { Page as VelitePage, Post as VelitePost } from '../.velite/index.js';
import { pages as velitePages, posts as velitePosts } from '../.velite/index.js';
import { getDocumentLocale, localizedPath } from '@/lib/locales';

/**
 * The stable shape consumed by the application. Dates intentionally retain
 * the value emitted by Velite instead of being normalized to a new value.
 */
export type ContentDate = Date | string;
export const DEFAULT_LOCALE = 'zh-TW' as const;
export type ContentLocale = typeof DEFAULT_LOCALE | 'en';

export interface RawDocumentData {
  sourceFilePath: string;
  sourceFileName: string;
  sourceFileDir: string;
  contentType: 'markdown';
  flattenedPath: string;
}

export interface MarkdownBody {
  raw: string;
  html: string;
  /** Compatibility alias for consumers that read a compiled body as code. */
  code: string;
}

interface SharedContentFields {
  title: string;
  locale: ContentLocale;
  /** Stable key shared by the source document and its translations. */
  translationId: string;
  /** Public camelCase alias used by locale-aware consumers. */
  translationKey: string;
  /** Deterministic pairing metadata for switchers and SEO. */
  pairing: { key: string; locale: ContentLocale };
  /** Original frontmatter field, retained for data consumers. */
  translation_id?: string;
  slug?: string;
  translation_key?: string;
  description?: string;
  type?: string;
  ghost_id?: string;
  status?: string;
  visibility?: string;
  featured?: boolean;
  created_at?: ContentDate;
  updated_at?: ContentDate;
  published_at?: ContentDate;
  custom_excerpt?: string;
  authors?: string[];
  feature_image?: string;
  tags?: string[];
  body: MarkdownBody;
  _id: string;
  _raw: RawDocumentData;
  flattenedPath: string;
  url: string;
}

export interface Post extends SharedContentFields {
  __ignoredType: 'Post';
}

export interface Page extends SharedContentFields {
  __ignoredType: 'Page';
  layout?: string;
  nav_category?: string;
  nav_label?: string;
  hero?: string;
  icon?: string;
}

type VeliteDocument = VelitePost | VelitePage;

function removeCollectionPrefix(sourcePath: string, collection: 'posts' | 'pages') {
  const prefix = `${collection}/`;
  return sourcePath.startsWith(prefix) ? sourcePath.slice(prefix.length) : sourcePath;
}

function removeMarkdownExtension(path: string) {
  return path.endsWith('.md') ? path.slice(0, -3) : path;
}

function sourceFilePath(sourcePath: string) {
  return sourcePath.endsWith('.md') ? sourcePath : `${sourcePath}.md`;
}

function sourceFileName(path: string) {
  return path.slice(path.lastIndexOf('/') + 1);
}

function sourceFileDir(path: string) {
  const separator = path.lastIndexOf('/');
  return separator === -1 ? '' : path.slice(0, separator);
}

function translationId(
  sourcePath: string,
  collection: 'posts' | 'pages',
  explicitId?: string
) {
  if (explicitId) return explicitId;

  const contentPath = removeMarkdownExtension(sourcePath);
  const relativePath = removeCollectionPrefix(contentPath, collection);
  const segments = relativePath.split('/');
  const localeSegment = segments[0];
  const stablePath = localeSegment === 'en' ? segments.slice(1).join('/') : relativePath;
  return `${collection}/${stablePath}`;
}

function adaptDocument(document: VelitePost, collection: 'posts'): Post;
function adaptDocument(document: VelitePage, collection: 'pages'): Page;
function adaptDocument(document: VeliteDocument, collection: 'posts' | 'pages'): Post | Page {
  const contentPath = removeMarkdownExtension(document.sourcePath);
  const flattenedPath = removeCollectionPrefix(contentPath, collection);
  const filePath = sourceFilePath(contentPath);
  const rawBody = document.raw;
  const htmlBody = document.body;
  const stableTranslationId = translationId(
    document.sourcePath,
    collection,
    document.translation_id ?? document.translation_key
  );

  const { sourcePath: _sourcePath, raw: _rawBody, body: _body, ...fields } = document;
  const locale = (document.locale ?? DEFAULT_LOCALE) as ContentLocale;
  const adapted = {
    ...fields,
    locale,
    translationId: stableTranslationId,
    translationKey: stableTranslationId,
    pairing: { key: stableTranslationId, locale },
    body: {
      raw: rawBody,
      html: htmlBody,
      code: htmlBody
    },
    _id: filePath,
    _raw: {
      sourceFilePath: filePath,
      sourceFileName: sourceFileName(filePath),
      sourceFileDir: sourceFileDir(filePath),
      contentType: 'markdown' as const,
      flattenedPath: contentPath
    },
    __ignoredType: collection === 'posts' ? ('Post' as const) : ('Page' as const),
    flattenedPath,
    url: localizedPath(
      `/${collection === 'posts' ? 'blog' : 'pages'}/${document.slug || flattenedPath}`,
      getDocumentLocale(document)
    )
  };

  return adapted as unknown as Post | Page;
}

export const allPostsByLocale: Post[] = velitePosts.map((post) => adaptDocument(post, 'posts'));
export const allPagesByLocale: Page[] = velitePages.map((page) => adaptDocument(page, 'pages'));

/** Existing exports remain the default Chinese content for route compatibility. */
export const allPosts: Post[] = allPostsByLocale.filter(
  (post) => post.locale === DEFAULT_LOCALE
);
export const allPages: Page[] = allPagesByLocale.filter(
  (page) => page.locale === DEFAULT_LOCALE
);

export function getPostsByLocale(locale: ContentLocale = DEFAULT_LOCALE): Post[] {
  return allPostsByLocale.filter((post) => post.locale === locale);
}

export function getPagesByLocale(locale: ContentLocale = DEFAULT_LOCALE): Page[] {
  return allPagesByLocale.filter((page) => page.locale === locale);
}

export interface TranslationPair<T extends Post | Page> {
  source: T;
  translation?: T;
}

export function getTranslationPair<T extends Post | Page>(
  document: T,
  documents: readonly T[]
): TranslationPair<T> {
  const source = documents.find(
    (candidate) =>
      candidate.translationId === document.translationId && candidate.locale === DEFAULT_LOCALE
  );
  const translation = documents.find(
    (candidate) =>
      candidate.translationId === document.translationId && candidate.locale !== DEFAULT_LOCALE
  );

  return { source: source ?? document, translation };
}

export function getPostTranslationPair(post: Post): TranslationPair<Post> {
  return getTranslationPair(post, allPostsByLocale);
}

export function getPageTranslationPair(page: Page): TranslationPair<Page> {
  return getTranslationPair(page, allPagesByLocale);
}
