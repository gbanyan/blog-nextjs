'use client';

import { useState, useEffect, useCallback } from 'react';

// 眼睛 (霍德爾之目) - 雙鷹勾眼
const ASCII_ART = [
  '      /\\     /\\',
  '     /  \\   /  \\',
  '    |  > | |  > |',
  '     \\  /   \\  /',
  '      \\/     \\/',
];

interface TerminalWindowProps {
  title: string;
  tagline: string;
  /** Skip typing animation, show all at once */
  reducedMotion?: boolean;
  className?: string;
}

type Phase =
  | 'prompt'
  | 'typing-line1'
  | 'typing-line2'
  | 'prompt2'
  | 'typing-ascii'
  | 'done';

export function TerminalWindow({
  title,
  tagline,
  reducedMotion = false,
  className = '',
}: TerminalWindowProps) {
  const [phase, setPhase] = useState<Phase>('prompt');
  const [displayedPrompt, setDisplayedPrompt] = useState('');
  const [displayedLine1, setDisplayedLine1] = useState('');
  const [displayedLine2, setDisplayedLine2] = useState('');
  const [displayedPrompt2, setDisplayedPrompt2] = useState('');
  const [displayedAscii, setDisplayedAscii] = useState<string[]>([]);
  const [showCursor, setShowCursor] = useState(true);

  const prompt = 'cat ~/welcome.txt';
  const prompt2 = 'fastfetch';
  const line1 = `${title}`;
  const line2 = tagline;

  const charDelay = reducedMotion ? 0 : 50;
  const lineDelay = reducedMotion ? 0 : 400;
  const asciiLineDelay = reducedMotion ? 0 : 80;

  const typeString = useCallback(
    (
      str: string,
      setter: (s: string) => void,
      onComplete?: () => void
    ) => {
      if (reducedMotion) {
        setter(str);
        onComplete?.();
        return;
      }
      let i = 0;
      const id = setInterval(() => {
        if (i <= str.length) {
          setter(str.slice(0, i));
          i++;
        } else {
          clearInterval(id);
          onComplete?.();
        }
      }, charDelay);
      return () => clearInterval(id);
    },
    [charDelay, reducedMotion]
  );

  useEffect(() => {
    if (phase === 'prompt') {
      const cleanup = typeString(prompt, setDisplayedPrompt, () => {
        setTimeout(() => setPhase('typing-line1'), lineDelay);
      });
      return cleanup;
    }
  }, [phase, prompt, typeString, lineDelay]);

  useEffect(() => {
    if (phase === 'typing-line1') {
      const cleanup = typeString(line1, setDisplayedLine1, () => {
        setTimeout(() => setPhase('typing-line2'), lineDelay);
      });
      return cleanup;
    }
  }, [phase, line1, typeString, lineDelay]);

  useEffect(() => {
    if (phase === 'typing-line2') {
      const cleanup = typeString(line2, setDisplayedLine2, () => {
        setTimeout(() => setPhase('prompt2'), lineDelay);
      });
      return cleanup;
    }
  }, [phase, line2, typeString, lineDelay]);

  useEffect(() => {
    if (phase === 'prompt2') {
      setDisplayedPrompt2('');
      const cleanup = typeString(prompt2, setDisplayedPrompt2, () => {
        setTimeout(() => setPhase('typing-ascii'), lineDelay);
      });
      return cleanup;
    }
  }, [phase, prompt2, typeString, lineDelay]);

  useEffect(() => {
    if (phase === 'typing-ascii') {
      if (reducedMotion) {
        setDisplayedAscii(ASCII_ART);
        setTimeout(() => setPhase('done'), lineDelay);
        return;
      }
      let lineIndex = 0;
      const id = setInterval(() => {
        if (lineIndex < ASCII_ART.length) {
          setDisplayedAscii((prev) => [...prev, ASCII_ART[lineIndex]]);
          lineIndex++;
        } else {
          clearInterval(id);
          setTimeout(() => setPhase('done'), lineDelay);
        }
      }, asciiLineDelay);
      return () => clearInterval(id);
    }
  }, [phase, asciiLineDelay, lineDelay, reducedMotion]);

  // Blinking cursor
  useEffect(() => {
    if (!reducedMotion && phase !== 'done') {
      const id = setInterval(() => setShowCursor((c) => !c), 530);
      return () => clearInterval(id);
    }
    setShowCursor(true);
  }, [phase, reducedMotion]);

  return (
    <div
      className={`overflow-hidden rounded-xl border border-slate-700/50 bg-slate-900 shadow-xl ${className}`}
      role="img"
      aria-label={`終端機：${title} - ${tagline}`}
    >
      {/* macOS-style title bar */}
      <div className="flex items-center gap-2 border-b border-slate-700/50 px-4 py-2.5">
        <div className="flex gap-1.5">
          <span className="h-3 w-3 rounded-full bg-red-500/90" />
          <span className="h-3 w-3 rounded-full bg-amber-500/90" />
          <span className="h-3 w-3 rounded-full bg-emerald-500/90" />
        </div>
        <span className="ml-4 font-mono text-xs text-slate-400">
          gbanyan@blog — zsh
        </span>
      </div>

      {/* Terminal content */}
      <div className="px-4 py-4 font-mono text-sm">
        <div className="text-slate-300">
          <span className="text-emerald-400">~</span>
          <span className="text-slate-500"> $ </span>
          <span>{displayedPrompt}</span>
          {phase === 'prompt' && showCursor && (
            <span className="ml-0.5 inline-block h-4 w-0.5 animate-pulse bg-emerald-400" />
          )}
        </div>

        {displayedLine1 && (
          <div className="mt-2 text-slate-100">
            {displayedLine1}
            {phase === 'typing-line1' && showCursor && (
              <span className="ml-0.5 inline-block h-4 w-0.5 animate-pulse bg-emerald-400" />
            )}
          </div>
        )}

        {displayedLine2 && (
          <div className="mt-1 text-slate-300">
            {displayedLine2}
            {phase === 'typing-line2' && showCursor && (
              <span className="ml-0.5 inline-block h-4 w-0.5 animate-pulse bg-emerald-400" />
            )}
          </div>
        )}

        {(phase === 'prompt2' || phase === 'typing-ascii' || displayedPrompt2 || displayedAscii.length > 0) && (
          <div className="mt-2 text-slate-300">
            <span className="text-emerald-400">~</span>
            <span className="text-slate-500"> $ </span>
            <span>{displayedPrompt2}</span>
            {phase === 'prompt2' && showCursor && (
              <span className="ml-0.5 inline-block h-4 w-0.5 animate-pulse bg-emerald-400" />
            )}
          </div>
        )}

        {displayedAscii.length > 0 && (
          <div className="mt-2 text-emerald-400/90 whitespace-pre">
            {displayedAscii.map((line, i) => (
              <div key={i}>{line}</div>
            ))}
            {phase === 'typing-ascii' && showCursor && (
              <span className="inline-block h-4 w-0.5 animate-pulse bg-emerald-400" />
            )}
          </div>
        )}

        {phase === 'done' && (
          <div className="mt-2 text-slate-300">
            <span className="text-emerald-400">~</span>
            <span className="text-slate-500"> $ </span>
            <span className="inline-block h-4 w-4 animate-pulse border-l-2 border-emerald-400" />
          </div>
        )}
      </div>
    </div>
  );
}
