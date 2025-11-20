import { NextRequest, NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import { join } from 'path';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  try {
    const { path } = await params;
    const filePath = join(process.cwd(), 'public', '_pagefind', ...path);

    // Read the file
    const file = await readFile(filePath);

    // Determine content type
    const ext = path[path.length - 1].split('.').pop();
    const contentTypes: Record<string, string> = {
      'js': 'application/javascript',
      'css': 'text/css',
      'json': 'application/json',
      'wasm': 'application/wasm',
      'pf_meta': 'application/octet-stream',
      'pf_index': 'application/octet-stream',
      'pf_fragment': 'application/octet-stream',
    };

    const contentType = contentTypes[ext || ''] || 'application/octet-stream';

    return new NextResponse(file, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch (error) {
    console.error('Error serving Pagefind file:', error);
    return new NextResponse('File not found', { status: 404 });
  }
}
