// contentlayer.config.ts
import { defineDocumentType, makeSource } from "contentlayer/source-files";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import remarkGfm from "remark-gfm";
var Post = defineDocumentType(() => ({
  name: "Post",
  filePathPattern: `posts/**/*.md`,
  contentType: "markdown",
  fields: {
    title: { type: "string", required: true },
    slug: { type: "string", required: false },
    tags: { type: "list", of: { type: "string" }, required: false },
    published_at: { type: "date", required: false },
    description: { type: "string", required: false },
    // extras from Ghost frontmatter
    type: { type: "string", required: false },
    ghost_id: { type: "string", required: false },
    status: { type: "string", required: false },
    visibility: { type: "string", required: false },
    featured: { type: "boolean", required: false },
    created_at: { type: "date", required: false },
    updated_at: { type: "date", required: false },
    custom_excerpt: { type: "string", required: false },
    authors: { type: "list", of: { type: "string" }, required: false },
    feature_image: { type: "string", required: false }
  },
  computedFields: {
    url: {
      type: "string",
      resolve: (doc) => `/blog/${doc.slug || doc._raw.flattenedPath.replace("posts/", "")}`
    },
    flattenedPath: {
      type: "string",
      resolve: (doc) => doc._raw.flattenedPath.replace("posts/", "")
    }
  }
}));
var Page = defineDocumentType(() => ({
  name: "Page",
  filePathPattern: `pages/**/*.md`,
  contentType: "markdown",
  fields: {
    title: { type: "string", required: true },
    slug: { type: "string", required: false },
    description: { type: "string", required: false },
    // extras from Ghost frontmatter
    type: { type: "string", required: false },
    ghost_id: { type: "string", required: false },
    status: { type: "string", required: false },
    visibility: { type: "string", required: false },
    featured: { type: "boolean", required: false },
    created_at: { type: "date", required: false },
    updated_at: { type: "date", required: false },
    published_at: { type: "date", required: false },
    custom_excerpt: { type: "string", required: false },
    tags: { type: "list", of: { type: "string" }, required: false },
    authors: { type: "list", of: { type: "string" }, required: false },
    feature_image: { type: "string", required: false }
  },
  computedFields: {
    url: {
      type: "string",
      resolve: (doc) => `/pages/${doc.slug || doc._raw.flattenedPath.replace("pages/", "")}`
    },
    flattenedPath: {
      type: "string",
      resolve: (doc) => doc._raw.flattenedPath.replace("pages/", "")
    }
  }
}));
var contentlayer_config_default = makeSource({
  // Use the existing blog repo as content source
  contentDirPath: "../Blog \u6587\u7AE0\u539F\u7A3F",
  documentTypes: [Post, Page],
  contentDirExclude: ["Arc \u700F\u89BD\u5668\u4F7F\u7528\u5FC3\u5F97.md"],
  fieldOptions: {
    // Avoid using frontmatter `type` at all; we use filePathPattern
    typeFieldName: "__ignoredType"
  },
  markdown: {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [
      rehypeSlug,
      [rehypeAutolinkHeadings, { behavior: "wrap" }]
    ]
  },
  // we've configured TS paths; also silence noisy warning
  disableImportAliasWarning: true
});
export {
  Page,
  Post,
  contentlayer_config_default as default
};
//# sourceMappingURL=compiled-contentlayer-config-BANOE2CG.mjs.map
