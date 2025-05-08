import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

// Add more public paths as needed
const PUBLIC_PATHS = [
  '/login', 
  '/api/auth', 
  '/api/licenses/validate'
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Skip middleware for public files and paths
  if (
    pathname.includes('/_next') || 
    pathname.includes('/static') || 
    pathname.includes('/favicon.ico') ||
    pathname.includes('/public')
  ) {
    return NextResponse.next();
  }

  // Allow public access to login and auth API
  if (PUBLIC_PATHS.some(path => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  // Check for valid session
  const token = await getToken({ 
    req: request, 
    secret: process.env.NEXTAUTH_SECRET 
  });

  // Protect all dashboard pages and API routes
  if (!token) {
    // Handle root path redirect
    if (pathname === '/') {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    
    // Handle API routes
    if (pathname.startsWith('/api/')) {
      return new NextResponse(
        JSON.stringify({ error: 'Unauthorized' }), 
        {
          status: 401,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }
    
    // Handle dashboard and other protected pages
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

// Update matcher to include specific paths we want to protect
export const config = {
  matcher: [
    '/',
    '/dashboard/:path*',
    '/organizations/:path*',
    '/products/:path*',
    '/licenses/:path*', 
    '/analytics/:path*',
    '/api-docs/:path*',
    '/settings/:path*',
    '/api/:path*',
  ],
}; 