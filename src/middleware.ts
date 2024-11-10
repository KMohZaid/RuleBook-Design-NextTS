import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const RESTRICTED_PATHS = ['/dashboard', '/create', '/edit/:path*', '/api/edit/:path*', '/api/delete/:path*', '/create'];

export function middleware(req: NextRequest) {
  const cookieUsername = req.cookies.get('username')?.value;
  const cookiePassword = req.cookies.get('password')?.value;

  const matchRetrictDynamicPath = RESTRICTED_PATHS.reduce((acc, path) => {
    if (path.includes(':path*')) {
      return acc || req.nextUrl.pathname.startsWith(path.replace(':path*', ''));
    }
    return acc;
  }, false);

  const isRestrictedPath = matchRetrictDynamicPath || RESTRICTED_PATHS.includes(req.nextUrl.pathname);
  const isAdmin = cookieUsername === process.env.ADMIN_USER && cookiePassword === process.env.ADMIN_PASS;

  if (isRestrictedPath && !isAdmin) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  return NextResponse.next();
}

// Specify the paths to protect
export const config = {
  matcher: ['/dashboard', '/create', '/edit/:path*', '/api/edit/:path*', '/api/delete/:path*', '/create'],
};

