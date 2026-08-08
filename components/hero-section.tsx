import { MatrixRain } from './matrix-rain';
import { TerminalWindow } from './terminal-window';

/**
 * Server Component hero.
 *
 * The terminal is rendered fully visible at full opacity in the SSR HTML
 * (static mode), so the LCP element (the site title) paints immediately —
 * no 1.5s+ matrix animation gating the text. MatrixRain stays as an
 * ambient, low-opacity background layer that never blocks the copy.
 */
export function HeroSection({
  title,
  tagline,
}: {
  title: string;
  tagline: string;
}) {
  return (
    <div className="relative h-[360px] w-full overflow-hidden rounded-2xl sm:h-[400px] lg:h-[440px] xl:h-[480px]">
      <div className="absolute inset-0 opacity-40" aria-hidden="true">
        <MatrixRain />
      </div>
      <div className="relative z-10 mx-auto w-full max-w-2xl px-4 py-6 sm:max-w-3xl lg:max-w-4xl xl:max-w-5xl">
        <TerminalWindow title={title} tagline={tagline} static />
      </div>
    </div>
  );
}
