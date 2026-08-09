'use client';

import { useEffect, useRef } from 'react';

// Matrix-style characters: katakana, numbers, Latin
const CHARS = 'ｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜﾝ0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';

interface MatrixRainProps {
  /** Opacity 0-1 for fade out control */
  opacity?: number;
  className?: string;
}

interface Drop {
  x: number;
  y: number;
  speed: number;
  chars: string[];
  charIndex: number;
  charTimer: number;
}

const FONT_SIZE = 14;
const TRAIL_LENGTH = 7;
const CHAR_CHANGE_INTERVAL = 0.08;
const LEAD_COLOR = 'rgb(34, 197, 94)';
const TRAIL_COLORS = Array.from({ length: TRAIL_LENGTH }, (_, index) =>
  `rgba(34, 197, 94, ${(1 - (index + 1) * 0.12) * 0.4})`
);

export function MatrixRain({
  opacity = 1,
  className = '',
}: MatrixRainProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let drops: Drop[] = [];

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const nextWidth = Math.max(0, Math.floor(rect.width));
      const nextHeight = Math.max(0, Math.floor(rect.height));
      const dpr = Math.min(window.devicePixelRatio || 1, 2);

      if (nextWidth === width && nextHeight === height) return;

      width = nextWidth;
      height = nextHeight;
      canvas.width = Math.max(1, Math.floor(width * dpr));
      canvas.height = Math.max(1, Math.floor(height * dpr));
      // Reset the transform after changing the backing dimensions. Using
      // setTransform also prevents repeated resize events from compounding
      // the scale and making the drawing drift outside the canvas.
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.font = `${FONT_SIZE}px "JetBrains Mono", "SF Mono", "Fira Code", monospace`;
      ctx.textBaseline = 'top';

      const columns = Math.ceil(width / FONT_SIZE);
      drops = Array.from({ length: columns }, (_, index) => ({
        x: index * FONT_SIZE,
        y: Math.random() * -100,
        speed: 0.15 + Math.random() * 0.4,
        chars: Array.from({ length: 20 }, () =>
          CHARS[Math.floor(Math.random() * CHARS.length)]
        ),
        charIndex: Math.floor(Math.random() * 20),
        charTimer: Math.random() * CHAR_CHANGE_INTERVAL,
      }));
    };

    resize();
    const resizeObserver = new ResizeObserver(resize);

    let animationId: number;
    let lastTime: number | null = null;

    const draw = (timestamp: number) => {
      const delta =
        lastTime !== null
          ? Math.min((timestamp - lastTime) / 1000, 0.05)
          : 1 / 60;
      lastTime = timestamp;

      ctx.fillStyle = 'rgba(15, 23, 42, 0.05)';
      ctx.fillRect(0, 0, width, height);

      // Batch each trail level so fillStyle changes happen once per level,
      // instead of once per character on every frame.
      ctx.fillStyle = LEAD_COLOR;
      drops.forEach((drop) => {
        ctx.fillText(drop.chars[drop.charIndex], drop.x, drop.y);
      });

      for (let trail = 1; trail <= TRAIL_LENGTH; trail += 1) {
        ctx.fillStyle = TRAIL_COLORS[trail - 1];
        drops.forEach((drop) => {
          const index = (drop.charIndex - trail + 20) % 20;
          ctx.fillText(drop.chars[index], drop.x, drop.y - trail * FONT_SIZE);
        });
      }

      drops.forEach((drop) => {
        drop.y += drop.speed * FONT_SIZE * delta * 60;
        drop.charTimer += delta;

        if (drop.charTimer >= CHAR_CHANGE_INTERVAL) {
          drop.charIndex =
            (drop.charIndex + Math.floor(drop.charTimer / CHAR_CHANGE_INTERVAL)) % 20;
          drop.charTimer %= CHAR_CHANGE_INTERVAL;
        }

        if (drop.y > height + TRAIL_LENGTH * FONT_SIZE) {
          drop.y = -Math.random() * 100;
          drop.charIndex = Math.floor(Math.random() * 20);
        }
      });

      animationId = requestAnimationFrame(draw);
    };

    animationId = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animationId);
      resizeObserver.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{
        opacity,
        transition: 'opacity 0.6s ease-out',
        display: 'block',
      }}
      aria-hidden="true"
      role="img"
    />
  );
}
