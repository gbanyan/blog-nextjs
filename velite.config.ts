import { defineCollection, defineConfig, s } from 'velite';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypePrettyCode from 'rehype-pretty-code';
import rehypeSlug from 'rehype-slug';
import remarkGfm from 'remark-gfm';
import { visit } from 'unist-util-visit';

import { rehypeCallouts } from './lib/rehype-callouts';
import { rehypeOptimizeImages } from './lib/rehype-optimize-images';

// Velite 0.4 hard-codes remark-rehype's allowDangerousHtml=true. The existing
// rendered-content contract drops raw HTML blocks, so remove them before
// Velite's internal conversion.
const remarkRemoveRawHtml = () => (tree: any) => {
  visit(tree, 'html', (_node, index, parent) => {
    if (!parent || typeof index !== 'number') return;
    parent.children.splice(index, 1);
    return ['skip', index];
  });
};

const markdown = {
  // Keep this explicit even though Velite enables GFM by default.
  gfm: true,
  // Asset URLs and dimensions are owned by our existing rehype plugin and
  // sync-assets step; do not let Velite copy or rewrite linked files.
  copyLinkedFiles: false,
  remarkPlugins: [remarkGfm, remarkRemoveRawHtml],
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
  ],
} satisfies Parameters<typeof s.markdown>[0];

const date = s.coerce.date().optional();
const locale = s.enum(['zh-TW', 'en']).default('zh-TW');

const sharedFields = {
  locale,
  translation_id: s.string().optional(),
  slug: s.string().optional(),
  // Optional, explicit locale pairing for the SEO/routing layer.
  translation_key: s.string().optional(),
  translation_status: s.enum(['source', 'placeholder', 'translated']).optional(),
  is_placeholder: s.boolean().optional(),
  description: s.string().optional(),
  type: s.string().optional(),
  ghost_id: s.string().optional(),
  status: s.string().optional(),
  visibility: s.string().optional(),
  featured: s.boolean().optional(),
  created_at: date,
  updated_at: date,
  published_at: date,
  custom_excerpt: s.string().optional(),
  authors: s.array(s.string()).optional(),
  feature_image: s.string().optional(),
  // Velite's built-in fields provide the source-relative path and raw body.
  sourcePath: s.path(),
  raw: s.raw(),
  body: s.markdown(markdown),
};

export const posts = defineCollection({
  name: 'Post',
  pattern: ['posts/**/*.md', '!**/Arc 瀏覽器使用心得.md'],
  schema: s.object({
    title: s.string(),
    ...sharedFields,
    tags: s.array(s.string()).optional(),
  }),
});

export const pages = defineCollection({
  name: 'Page',
  pattern: ['pages/**/*.md', '!**/Arc 瀏覽器使用心得.md'],
  schema: s.object({
    title: s.string(),
    ...sharedFields,
    tags: s.array(s.string()).optional(),
    layout: s.string().optional(),
    nav_category: s.string().optional(),
    nav_label: s.string().optional(),
    hero: s.string().optional(),
    icon: s.string().optional(),
  }),
});

export default defineConfig({
  root: 'content',
  strict: true,
  collections: { posts, pages },
  output: {
    data: '.velite',
    // Keep Velite's cleanable asset workspace away from public/assets. The
    // existing sync-assets step owns the public URL mirror.
    assets: '.velite/assets',
    base: '/assets/',
    clean: true,
  },
});
