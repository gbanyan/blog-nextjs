/**
 * Renders the build-time rehype HTML output directly.
 *
 * Image handling is a single pass, done at build time in
 * `lib/rehype-optimize-images.ts` (src rewrite + intrinsic width/height +
 * lazy loading + sizes hint). We intentionally do NOT re-parse the HTML
 * with html-react-parser nor re-wrap every `<img>` in `next/image` at
 * runtime — that was duplicated parsing work with no additional benefit
 * (see TARGET #1).
 */
export function MarkdownBody({ html }: { html: string }) {
  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}
