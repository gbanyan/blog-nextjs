import { defineDocumentType, makeSource } from 'contentlayer2/source-files';
import { visit } from 'unist-util-visit';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import remarkGfm from 'remark-gfm';
import rehypePrettyCode from 'rehype-pretty-code';
import { rehypeCallouts } from './lib/rehype-callouts';

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
      /**
       * Rewrite markdown image src from relative "../assets/..." to
       * absolute "/assets/..." and add lazy loading for cross-browser performance.
       */
      () => (tree: any) => {
        visit(tree, 'element', (node: any) => {
          if (
            node.tagName === 'img' &&
            node.properties &&
            typeof node.properties.src === 'string'
          ) {
            const src: string = node.properties.src;
            if (src.startsWith('../assets/')) {
              node.properties.src = src.replace('../assets', '/assets');
            } else if (src.startsWith('assets/')) {
              node.properties.src = '/' + src.replace(/^\/?/, '');
            }
            // Lazy load images for better LCP and bandwidth (Chrome, Firefox, Safari, Edge)
            node.properties.loading = 'lazy';
            node.properties.decoding = 'async';
          }
        });
      }
    ]
  },
  // we've configured TS paths; also silence noisy warning
  disableImportAliasWarning: true
});
