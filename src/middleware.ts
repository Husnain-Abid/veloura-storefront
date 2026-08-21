import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getSession } from './lib/auth';

export async function middleware(request: NextRequest) {
  const session = await getSession();

  // Protect account routes
  if (request.nextUrl.pathname.startsWith('/account')) {
    if (!session && request.nextUrl.pathname !== '/account/login' && request.nextUrl.pathname !== '/account/register') {
      return NextResponse.redirect(new URL('/account/login', request.url));
    }
  }

  // Protect checkout
  if (request.nextUrl.pathname.startsWith('/checkout')) {
    if (!session) {
      return NextResponse.redirect(new URL('/account/login', request.url));
    }
  }

  // Protect admin routes
  if (request.nextUrl.pathname.startsWith('/admin')) {
    if (request.nextUrl.pathname !== '/admin/login') {
      if (!session || session.role !== 'admin') {
        return NextResponse.redirect(new URL('/admin/login', request.url));
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/account/:path*', '/checkout/:path*', '/admin/:path*'],
};
