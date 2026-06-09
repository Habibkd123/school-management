import { NextRequest, NextResponse } from "next/server";

// ─── Route Groups ─────────────────────────────────────────────────
// Routes jo sirf logged-IN users ke liye hain
const PROTECTED_ROUTES = ["/dashboard"];

// Routes jo sirf logged-OUT users ke liye hain (agar login ho to redirect)
const AUTH_ROUTES = [
  "/login",
  "/register",
  "/forget-password",
  "/reset-password",
  "/email-verification",
  "/two-step-verification",
];

// Next.js 16: middleware ka naam "proxy" ho gaya hai
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Token cookie se read karo (sm_access_token)
  const token = request.cookies.get("sm_access_token")?.value;

  const isProtected = PROTECTED_ROUTES.some((r) => pathname.startsWith(r));
  const isAuthRoute = AUTH_ROUTES.some((r) => pathname.startsWith(r));

  // ─── Case 1: Protected route + no token → Login pe bhejo ──────────
  if (isProtected && !token) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // ─── Case 2: Auth route + token exists → Dashboard pe bhejo ────────
  if (isAuthRoute && token) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all paths EXCEPT:
     * - _next/static, _next/image (Next.js internals)
     * - favicon, public static files
     * - api routes (handled by their own auth guards)
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\..*|api/).*)",
  ],
};
