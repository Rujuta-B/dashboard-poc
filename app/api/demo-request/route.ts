import { cookies, headers } from 'next/headers';
import { NextResponse } from 'next/server';

/**
 * Next.js 15 Async Request APIs Demo
 * 
 * In Next.js 15, request-specific APIs like cookies(), headers(), params, and searchParams
 * are now fully async, allowing better optimization and streaming support.
 */

export async function GET() {
  // Async cookies() API
  const cookieStore = await cookies();
  const theme = cookieStore.get('theme')?.value || 'light';
  
  // Async headers() API
  const headersList = await headers();
  const userAgent = headersList.get('user-agent') || 'unknown';
  const referer = headersList.get('referer') || 'direct';
  
  return NextResponse.json({
    message: 'Next.js 15 Async Request APIs Demo',
    data: {
      cookies: {
        theme,
        description: 'Cookies are now accessed asynchronously'
      },
      headers: {
        userAgent,
        referer,
        description: 'Headers are now accessed asynchronously'
      },
      timestamp: new Date().toISOString()
    }
  });
}

export async function POST(request: Request) {
  const body = await request.json();
  
  // Async cookies() - set a cookie
  const cookieStore = await cookies();
  if (body.theme) {
    cookieStore.set('theme', body.theme, {
      maxAge: 60 * 60 * 24 * 365, // 1 year
      path: '/',
    });
  }
  
  return NextResponse.json({
    success: true,
    message: `Theme set to ${body.theme}`,
    timestamp: new Date().toISOString()
  });
}
