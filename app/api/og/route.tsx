import { readFileSync } from 'node:fs';
import path from 'node:path';

import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';
import { getDictionary } from '@/lib/i18n/dictionaries';
import { isLocale } from '@/lib/locales';
import { siteConfig } from '@/lib/config';

const FONT_DIR = path.join(process.cwd(), 'lib', 'og-fonts');
const fontCache = new Map<string, ArrayBuffer>();

function loadFontSync(filename: string): ArrayBuffer {
  const cached = fontCache.get(filename);
  if (cached) return cached;
  const buf = readFileSync(path.join(FONT_DIR, filename));
  const ab = buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength) as ArrayBuffer;
  fontCache.set(filename, ab);
  return ab;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // Get parameters
    const title = searchParams.get('title') || 'Blog Post';
    const description = searchParams.get('description') || '';
    const tags = searchParams.get('tags')?.split(',').slice(0, 3) || [];
    const localeParam = searchParams.get('locale');
    const brandTitle = isLocale(localeParam ?? undefined) ? getDictionary(localeParam as 'zh-TW' | 'en').brand.title : 'Personal blog';

    // Optional author + publication date line on the card.
    const authorParam = searchParams.get('author');
    const dateParam = searchParams.get('date');
    const displayDate = dateParam
      ? new Date(dateParam).toLocaleDateString(localeParam === 'en' ? 'en-US' : 'zh-TW', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })
      : '';
    const metaText = [authorParam, displayDate].filter(Boolean).join(' · ');

    // Load CJK font for Chinese text rendering. Keep WOFF: the @vercel/og
    // version bundled with Next 16 rejects the WOFF2 signature (wOF2).
    const fontData = loadFontSync('noto-400.woff');
    const fontBoldData = loadFontSync('noto-700.woff');

    const imageResponse = new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            fontFamily: '"Noto Sans TC", sans-serif',
            backgroundColor: '#0f172a',
            backgroundImage: 'radial-gradient(circle at 25px 25px, #1e293b 2%, transparent 0%), radial-gradient(circle at 75px 75px, #1e293b 2%, transparent 0%)',
            backgroundSize: '100px 100px',
            padding: '80px',
          }}
        >
          {/* Header with gradient */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '20px',
            }}
          >
            <div
              style={{
                width: '8px',
                height: '60px',
                background: 'linear-gradient(135deg, #3b82f6, #60a5fa)',
                borderRadius: '4px',
              }}
            />
            <div
              style={{
                fontSize: '32px',
                fontWeight: 600,
                color: '#f8fafc',
                letterSpacing: '-0.02em',
              }}
            >
              {brandTitle}
            </div>
          </div>

          {/* Main content */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '24px',
              maxWidth: '900px',
            }}
          >
            {/* Title */}
            <div
              style={{
                fontSize: '72px',
                fontWeight: 700,
                color: '#f8fafc',
                lineHeight: 1.1,
                letterSpacing: '-0.03em',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
              }}
            >
              {title}
            </div>

            {/* Description */}
            {description && (
              <div
                style={{
                  fontSize: '28px',
                  color: '#cbd5e1',
                  lineHeight: 1.4,
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                }}
              >
                {description}
              </div>
            )}

            {/* Author · date */}
            {metaText && (
              <div
                style={{
                  fontSize: '24px',
                  color: '#94a3b8',
                }}
              >
                {metaText}
              </div>
            )}

            {/* Tags */}
            {tags.length > 0 && (
              <div
                style={{
                  display: 'flex',
                  gap: '12px',
                  flexWrap: 'wrap',
                }}
              >
                {tags.map((tag, i) => (
                  <div
                    key={i}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      backgroundColor: '#1e293b',
                      color: '#94a3b8',
                      padding: '8px 20px',
                      borderRadius: '20px',
                      fontSize: '20px',
                      border: '1px solid #334155',
                    }}
                  >
                    {`#${tag.trim()}`}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer with accent line */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              width: '100%',
            }}
          >
            <div
              style={{
                flex: 1,
                height: '2px',
                background: 'linear-gradient(90deg, #3b82f6, transparent)',
              }}
            />
            <div
              style={{
                fontSize: '24px',
                color: '#64748b',
              }}
            >
              {new URL(siteConfig.url).host}
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
        fonts: [
          { name: 'Noto Sans TC', data: fontData, weight: 400 as const, style: 'normal' as const },
          { name: 'Noto Sans TC', data: fontBoldData, weight: 700 as const, style: 'normal' as const },
        ],
      }
    );

    // Wrap response with cache headers for OG images (cache for 1 hour)
    return new Response(imageResponse.body, {
      headers: {
        'Content-Type': 'image/png',
        'Cache-Control': 'public, max-age=31536000, s-maxage=31536000, immutable',
      },
    });
  } catch (e: unknown) {
    // The build (PPR) attempts to prerender this dynamic route; re-throw the
    // control-flow interruption so Next bails out cleanly instead of logging
    // it as a real error.
    const interrupt =
      typeof e === 'object' &&
      e !== null &&
      'digest' in e &&
      e.digest === 'NEXT_PRERENDER_INTERRUPTED';
    if (interrupt) throw e;
    const message = e instanceof Error ? e.message : String(e);
    console.error('Error generating OG image:', e);
    return new Response(`Failed to generate image: ${message}`, {
      status: 500,
    });
  }
}
