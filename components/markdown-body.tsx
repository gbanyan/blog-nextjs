import Image from 'next/image';
import parse, { type DOMNode, Element, type HTMLReactParserOptions } from 'html-react-parser';

const DEFAULT_WIDTH = 1200;
const DEFAULT_HEIGHT = 675;
const DEFAULT_SIZES =
  '(max-width: 768px) 100vw, (max-width: 1200px) 800px, 800px';

function shouldSkipOptimization(src: string): boolean {
  return /\.(gif|svg)(\?.*)?$/i.test(src);
}

function toPositiveInt(value: string | undefined, fallback: number): number {
  const parsed = Number.parseInt(value ?? '', 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

const options: HTMLReactParserOptions = {
  replace(domNode: DOMNode) {
    if (!(domNode instanceof Element) || domNode.name !== 'img') {
      return;
    }

    const { src, alt, width, height, sizes, class: className } = domNode.attribs;
    if (!src) return;

    const w = toPositiveInt(width, DEFAULT_WIDTH);
    const h = toPositiveInt(height, DEFAULT_HEIGHT);
    const imageSizes = sizes || DEFAULT_SIZES;
    const unoptimized = shouldSkipOptimization(src);

    // Local assets go through next/image for AVIF/WebP + srcset.
    // External URLs stay unoptimized unless added to remotePatterns.
    const isLocal = src.startsWith('/') && !src.startsWith('//');

    return (
      <Image
        src={src}
        alt={alt ?? ''}
        width={w}
        height={h}
        sizes={imageSizes}
        className={className ? `${className} h-auto w-full max-w-full` : 'h-auto w-full max-w-full'}
        unoptimized={unoptimized || !isLocal}
      />
    );
  },
};

/**
 * Renders Contentlayer HTML and upgrades <img> tags to next/image.
 */
export function MarkdownBody({ html }: { html: string }) {
  return <>{parse(html, options)}</>;
}
