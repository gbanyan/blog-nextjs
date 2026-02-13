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
}

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

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio ?? 1, 2);
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
    };

    resize();
    window.addEventListener('resize', resize);

    const fontSize = 14;
    const columns = Math.floor(canvas.getBoundingClientRect().width / fontSize);
    const drops: Drop[] = Array.from({ length: columns }, (_, i) => ({
      x: i * fontSize,
      y: Math.random() * -100,
      speed: 0.15 + Math.random() * 0.4,
      chars: Array.from({ length: 20 }, () =>
        CHARS[Math.floor(Math.random() * CHARS.length)]
      ),
      charIndex: Math.floor(Math.random() * 20),
    }));

    let animationId: number;

    const draw = () => {
      const rect = canvas.getBoundingClientRect();
      ctx.fillStyle = 'rgba(15, 23, 42, 0.05)';
      ctx.fillRect(0, 0, rect.width, rect.height);

      ctx.font = `${fontSize}px "JetBrains Mono", "SF Mono", "Fira Code", monospace`;

      drops.forEach((drop) => {
        // Bright green for leading char
        ctx.fillStyle = 'rgba(34, 197, 94, 1)';
        ctx.fillText(drop.chars[drop.charIndex], drop.x, drop.y);

        // Dimmer trailing chars
        for (let i = 1; i < 8; i++) {
          const idx = (drop.charIndex - i + 20) % 20;
          const alpha = 1 - i * 0.12;
          ctx.fillStyle = `rgba(34, 197, 94, ${alpha * 0.4})`;
          ctx.fillText(
            drop.chars[idx],
            drop.x,
            drop.y - i * fontSize
          );
        }

        drop.y += drop.speed * fontSize;
        if (drop.y > rect.height + 100) {
          drop.y = -50;
          drop.charIndex = (drop.charIndex + 1) % 20;
        } else {
          drop.charIndex = (drop.charIndex + 1) % 20;
        }
      });

      animationId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{
        opacity,
        transition: 'opacity 0.6s ease-out',
        background: 'rgb(15, 23, 42)',
      }}
      aria-hidden="true"
    />
  );
}
