'use client';

import { useState, useEffect } from 'react';
import { MatrixRain } from './matrix-rain';
import { TerminalWindow } from './terminal-window';

interface HeroSectionProps {
  title: string;
  tagline: string;
}

type Phase = 'matrix' | 'transition' | 'terminal';

const MIN_MATRIX_DURATION = 1500;
const MAX_MATRIX_DURATION = 6000;
const TRANSITION_DURATION = 600;

export function HeroSection({ title, tagline }: HeroSectionProps) {
  const [phase, setPhase] = useState<Phase>('matrix');
  const [matrixOpacity, setMatrixOpacity] = useState(1);
  const [terminalOpacity, setTerminalOpacity] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mq.matches);
  }, []);

  const handleMatrixComplete = () => {
    setPhase('transition');
    setMatrixOpacity(0);
    setTerminalOpacity(1);
  };

  useEffect(() => {
    if (phase !== 'matrix') return;

    const startTime = Date.now();
    let maxTimerId: ReturnType<typeof setTimeout>;
    let minTimerId: ReturnType<typeof setTimeout>;

    const scheduleTransition = () => {
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, MIN_MATRIX_DURATION - elapsed);
      if (remaining > 0) {
        minTimerId = setTimeout(handleMatrixComplete, remaining);
      } else {
        handleMatrixComplete();
      }
    };

    const onLoad = () => {
      window.removeEventListener('load', onLoad);
      clearTimeout(maxTimerId);
      scheduleTransition();
    };

    if (document.readyState === 'complete') {
      scheduleTransition();
    } else {
      window.addEventListener('load', onLoad);
      maxTimerId = setTimeout(() => {
        window.removeEventListener('load', onLoad);
        handleMatrixComplete();
      }, MAX_MATRIX_DURATION);
    }

    return () => {
      window.removeEventListener('load', onLoad);
      clearTimeout(maxTimerId);
      clearTimeout(minTimerId);
    };
  }, [phase]);

  useEffect(() => {
    if (phase === 'transition') {
      const id = setTimeout(() => setPhase('terminal'), TRANSITION_DURATION);
      return () => clearTimeout(id);
    }
  }, [phase]);

  // Skip Matrix entirely if user prefers reduced motion
  useEffect(() => {
    if (reducedMotion) {
      setPhase('terminal');
      setMatrixOpacity(0);
      setTerminalOpacity(1);
    }
  }, [reducedMotion]);

  return (
    <div className="relative min-h-[280px] w-full overflow-hidden rounded-2xl sm:min-h-[320px] lg:min-h-[360px] xl:min-h-[400px]">
      {/* Matrix rain - full area, fades out */}
      {!reducedMotion && (
        <div
          className="absolute inset-0 transition-opacity duration-[600ms] ease-out"
          style={{ opacity: matrixOpacity }}
          aria-hidden="true"
        >
          <MatrixRain className="h-full w-full" />
        </div>
      )}

      {/* Terminal - fades in over Matrix, responsive width */}
      <div
        className="relative z-10 mx-auto w-full max-w-2xl px-4 py-6 transition-opacity duration-[600ms] ease-out sm:max-w-3xl lg:max-w-4xl xl:max-w-5xl"
        style={{ opacity: reducedMotion ? 1 : terminalOpacity }}
      >
        <TerminalWindow
          title={title}
          tagline={tagline}
          reducedMotion={reducedMotion}
        />
      </div>
    </div>
  );
}
