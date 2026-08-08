/**
 * NOTE (TARGET #4): `contentlayer2` (and its predecessor `contentlayer`) is
 * **unmaintained**. We keep it because the existing pipeline works, but be
 * aware of the workarounds required to keep it building:
 *   - `disableImportAliasWarning: true` — silences a warning caused by the
 *     import-alias heuristics of the unmaintained package.
 *   - `typeFieldName` on `documentTypeName` — workaround for the package's
 *     handling of `type` fields in markdown frontmatter.
 *   - `scripts/sync-assets` (see package.json) — custom copy of content
 *     assets, because Contentlayer2's built-in asset handling is buggy.
 *   - The `@contentlayer/generated` / `contentlayer2/generated` import is
 *     generated at build time by `contentlayer2 build`.
 *
 * This is a **migration candidate**: if this breaks, the natural replacement
 * is `@content-collections` (content-collections) or a small hand-rolled
 * markdown pipeline (remark/rehype + glob), which removes the dependency on
 * this unmaintained package entirely.
 */
import { defineDocumentType, makeSource } from 'contentlayer2/source-files';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import remarkGfm from 'remark-gfm';
import rehypePrettyCode from 'rehype-pretty-code';
import { rehypeCallouts } from './lib/rehype-callouts';
import { rehypeOptimizeImages } from './lib/rehype-optimize-images';

export const Post = defineDocumentType(() => ({
  name: 'Post',
  filePathPattern: `posts/**/*.md`,
  contentType: 'markdown',
  fields: {
    title: { type: 'string', required: true },
    slug: { type: 'string', required: false },
    tags: { type: 'list', of: { type: 'string' }, required: false },
    published_at: { type: 'date', required: false },
    description: { type: 'string', required: false },
    // extras from Ghost frontmatter
    type: { type: 'string', required: false },
    ghost_id: { type: 'string', required: false },
    status: { type: 'string', required: false },
    visibility: { type: 'string', required: false },
    featured: { type: 'boolean', required: false },
    created_at: { type: 'date', required: false },
    updated_at: { type: 'date', required: false },
    custom_excerpt: { type: 'string', required: false },
    authors: { type: 'list', of: { type: 'string' }, required: false },
    feature_image: { type: 'string', required: false }
  },
  computedFields: {
    url: {
      type: 'string',
      resolve: (doc) =>
        `/blog/${doc.slug || doc._raw.flattenedPath.replace('posts/', '')}`
    },
    flattenedPath: {
      type: 'string',
      resolve: (doc) => doc._raw.flattenedPath.replace('posts/', '')
    }
  }
}));

export const Page = defineDocumentType(() => ({
  name: 'Page',
  filePathPattern: `pages/**/*.md`,
  contentType: 'markdown',
  fields: {
    title: { type: 'string', required: true },
    slug: { type: 'string', required: false },
    description: { type: 'string', required: false },
    // extras from Ghost frontmatter
    type: { type: 'string', required: false },
    ghost_id: { type: 'string', required: false },
    status: { type: 'string', required: false },
    visibility: { type: 'string', required: false },
    featured: { type: 'boolean', required: false },
    created_at: { type: 'date', required: false },
    updated_at: { type: 'date', required: false },
    published_at: { type: 'date', required: false },
    custom_excerpt: { type: 'string', required: false },
    tags: { type: 'list', of: { type: 'string' }, required: false },
    authors: { type: 'list', of: { type: 'string' }, required: false },
    feature_image: { type: 'string', required: false },
    // Declarative layout/hero/nav metadata (see TARGET #2 — replaces fragile
    // slug/title string-matching in page.tsx / site-header.tsx).
    layout: { type: 'string', required: false },      // 'default' | 'device'
    nav_category: { type: 'string', required: false }, // nav group: 'about' | 'device'
    nav_label: { type: 'string', required: false },    // nav display label
    hero: { type: 'string', required: false },         // hero component key: 'dev-env' | 'homelab'
    icon: { type: 'string', required: false }          // nav IconKey
  },
  computedFields: {
    url: {
      type: 'string',
      resolve: (doc) =>
        `/pages/${doc.slug || doc._raw.flattenedPath.replace('pages/', '')}`
    },
    flattenedPath: {
      type: 'string',
      resolve: (doc) => doc._raw.flattenedPath.replace('pages/', '')
    }
  }
}));

export default makeSource({
  // Use git submodule `content` (personal-blog) as content source
  contentDirPath: 'content',
  documentTypes: [Post, Page],
  contentDirExclude: ['Arc 瀏覽器使用心得.md'],
  fieldOptions: {
    // Avoid using frontmatter `type` at all; we use filePathPattern
    typeFieldName: '__ignoredType'
  },
  markdown: {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [
      rehypeCallouts,
      [
        rehypePrettyCode,
        {
          theme: {
            dark: 'github-dark',
            light: 'github-light',
          },
          keepBackground: false,
        },
      ],
      rehypeSlug,
      [rehypeAutolinkHeadings, { behavior: 'wrap' }],
      rehypeOptimizeImages,
    ]
  },
  // we've configured TS paths; also silence noisy warning
  disableImportAliasWarning: true
});
