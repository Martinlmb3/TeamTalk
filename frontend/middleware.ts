import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Define role-based route access
// Key: route path, Value: allowed roles
const roleAccess: Record<string, string[]> = {
  '/admin': ['Admin'],
  '/coach/dashboard': ['Admin', 'Coach'],
  '/teams/create': ['Admin', 'Coach'],
  '/teams/manage': ['Admin', 'Coach', 'Captain'],
  '/users/manage': ['Admin'],
};

// Public routes that don't require authentication
const publicRoutes = ['/login', '/signup', '/auth/callback', '/'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow public routes
  if (publicRoutes.some(route => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  // Check if route requires specific roles
  const matchedRoute = Object.entries(roleAccess).find(([path]) =>
    pathname.startsWith(path)
  );

  if (matchedRoute) {
    const [, requiredRoles] = matchedRoute;

    try {
      // Get user role from the auth cookie/session
      const userRole = await getUserRole(request);

      if (!userRole) {
        // User not authenticated, redirect to login
        const url = new URL('/login', request.url);
        url.searchParams.set('redirect', pathname);
        return NextResponse.redirect(url);
      }

      if (!requiredRoles.includes(userRole)) {
        // User doesn't have required role
        return NextResponse.redirect(new URL('/unauthorized', request.url));
      }
    } catch (error) {
      console.error('Middleware error:', error);
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  return NextResponse.next();
}

/**
 * Helper function to get user role from request
 * Converts role number from backend (0-3) to role name string
 */
async function getUserRole(request: NextRequest): Promise<string | null> {
  try {
    // Get user data from Zustand persist cookie
    const authStorage = request.cookies.get('auth-storage')?.value;
    if (authStorage) {
      const parsed = JSON.parse(authStorage);
      const roleNumber = parsed?.state?.user?.role;

      if (roleNumber !== undefined && roleNumber !== null) {
        // Convert role number to string
        // Backend enum: Admin = 0, Coach = 1, Player = 2, Captain = 3
        return roleNumberToString(roleNumber);
      }
    }

    return null;
  } catch (error) {
    console.error('Error getting user role:', error);
    return null;
  }
}

/**
 * Convert backend role enum (number) to role name (string)
 */
function roleNumberToString(roleNumber: number): string | null {
  switch (roleNumber) {
    case 0:
      return 'Admin';
    case 1:
      return 'Coach';
    case 2:
      return 'Player';
    case 3:
      return 'Captain';
    default:
      return null;
  }
}

export const config = {
  // TEMPORARILY DISABLED - Zustand persists to localStorage, not cookies
  // Middleware cannot access localStorage (runs on server)
  // Only match specific protected routes for now
  matcher: [
    '/admin/:path*',
    '/coach/dashboard/:path*',
    '/teams/create',
    '/teams/manage/:path*',
    '/users/manage/:path*',
  ],
};
