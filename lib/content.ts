import type { Page as VelitePage, Post as VelitePost } from '../.velite/index.js';
import { pages as velitePages, posts as velitePosts } from '../.velite/index.js';
import { getDocumentLocale, localizedPath } from '@/lib/locales';

/**
 * The stable shape consumed by the application. Dates intentionally retain
 * the value emitted by Velite instead of being normalized to a new value.
 */
export type ContentDate = Date | string;

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
  slug?: string;
  locale?: string;
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

function adaptDocument(document: VelitePost, collection: 'posts'): Post;
function adaptDocument(document: VelitePage, collection: 'pages'): Page;
function adaptDocument(document: VeliteDocument, collection: 'posts' | 'pages'): Post | Page {
  const contentPath = removeMarkdownExtension(document.sourcePath);
  const flattenedPath = removeCollectionPrefix(contentPath, collection);
  const filePath = sourceFilePath(contentPath);
  const rawBody = document.raw;
  const htmlBody = document.body;

  const { sourcePath: _sourcePath, raw: _rawBody, body: _body, ...fields } = document;
  const adapted = {
    ...fields,
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

export const allPosts: Post[] = velitePosts.map((post) => adaptDocument(post, 'posts'));
export const allPages: Page[] = velitePages.map((page) => adaptDocument(page, 'pages'));
