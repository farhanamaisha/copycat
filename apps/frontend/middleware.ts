// apps/frontend/middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PUBLIC_ROUTES = ["/", "/sign-in"];
const DASHBOARD_PREFIX = "/dashboard";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow public routes and static files through
  const isPublic = PUBLIC_ROUTES.includes(pathname);
  const isStatic =
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.includes(".");

  if (isPublic || isStatic) {
    return NextResponse.next();
  }

  // Check for access token in cookies (set by the store after login)
  const token =
    request.cookies.get("accessToken")?.value ??
    request.cookies.get("access_token")?.value;

  const isDashboard = pathname.startsWith(DASHBOARD_PREFIX);

  if (isDashboard && !token) {
    const signInUrl = new URL("/sign-in", request.url);
    signInUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(signInUrl);
  }

  // If already signed in and hitting sign-in, redirect to dashboard
  if (pathname === "/sign-in" && token) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\..*).)*",
  ],
};