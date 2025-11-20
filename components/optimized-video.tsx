import { HTMLAttributes } from 'react';
import clsx from 'clsx';

interface OptimizedVideoProps extends Omit<HTMLAttributes<HTMLVideoElement>, 'src'> {
  src: string;
  alt?: string;
  width?: number;
  height?: number;
  autoPlay?: boolean;
  loop?: boolean;
  muted?: boolean;
  playsInline?: boolean;
  controls?: boolean;
  poster?: string;
}

/**
 * Optimized video component that provides:
 * - Multiple format support (WebM and MP4) for better browser compatibility
 * - Proper accessibility attributes
 * - Automatic GIF-like behavior when autoPlay is enabled
 * - Lightweight alternative to GIF files with 80-95% file size reduction
 */
export function OptimizedVideo({
  src,
  alt,
  width,
  height,
  autoPlay = true,
  loop = true,
  muted = true,
  playsInline = true,
  controls = false,
  poster,
  className,
  ...props
}: OptimizedVideoProps) {
  // Remove file extension to get base path
  const basePath = src.replace(/\.(mp4|webm|gif)$/i, '');

  return (
    <video
      width={width}
      height={height}
      autoPlay={autoPlay}
      loop={loop}
      muted={muted}
      playsInline={playsInline}
      controls={controls}
      poster={poster}
      className={clsx('inline-block', className)}
      aria-label={alt}
      {...props}
    >
      {/* WebM for better compression (Chrome, Firefox, Edge) */}
      <source src={`${basePath}.webm`} type="video/webm" />

      {/* MP4 for Safari and older browsers */}
      <source src={`${basePath}.mp4`} type="video/mp4" />

      {/* Fallback message for browsers that don't support video */}
      <p className="text-slate-500 dark:text-slate-400">
        Your browser does not support the video tag.
        {alt && <span className="block mt-2">{alt}</span>}
      </p>
    </video>
  );
}
