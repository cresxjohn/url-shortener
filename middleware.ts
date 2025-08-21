import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { RESERVED_ROUTES } from '@/lib/constants';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Skip middleware for API routes, static files, and Next.js internals
  if (
    pathname.startsWith('/api/') ||
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/favicon.ico') ||
    pathname.startsWith('/static/') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  // Skip middleware for reserved routes (app routes)
  const pathSegment = pathname.slice(1); // Remove leading slash
  if (RESERVED_ROUTES.includes(pathSegment.toLowerCase()) || pathSegment === '') {
    return NextResponse.next();
  }

  // For any other path, treat it as a potential short code
  // The [shortCode]/route.ts will handle the redirect
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
