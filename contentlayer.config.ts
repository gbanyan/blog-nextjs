import { defineDocumentType, makeSource } from 'contentlayer/source-files';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import remarkGfm from 'remark-gfm';

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
    feature_image: { type: 'string', required: false }
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
  // Use the existing blog repo as content source
  contentDirPath: '../Blog 文章原稿',
  documentTypes: [Post, Page],
  contentDirExclude: ['Arc 瀏覽器使用心得.md'],
  fieldOptions: {
    // Avoid using frontmatter `type` at all; we use filePathPattern
    typeFieldName: '__ignoredType'
  },
  markdown: {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [
      rehypeSlug,
      [rehypeAutolinkHeadings, { behavior: 'wrap' }]
    ]
  },
  // we've configured TS paths; also silence noisy warning
  disableImportAliasWarning: true
});
