import { ImageResponse } from '@vercel/og';
import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // Get parameters
    const title = searchParams.get('title') || 'Blog Post';
    const description = searchParams.get('description') || '';
    const tags = searchParams.get('tags')?.split(',').slice(0, 3) || [];

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
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
              個人部落格
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
                      backgroundColor: '#1e293b',
                      color: '#94a3b8',
                      padding: '8px 20px',
                      borderRadius: '20px',
                      fontSize: '20px',
                      border: '1px solid #334155',
                    }}
                  >
                    #{tag.trim()}
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
              gbanyan.net
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (e: any) {
    console.error('Error generating OG image:', e);
    return new Response(`Failed to generate image: ${e.message}`, {
      status: 500,
    });
  }
}
