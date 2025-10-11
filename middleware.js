import { NextResponse } from "next/server";

export async function middleware(request) {
  // Call the auth check API
  let authResponse;
  try {
    authResponse = await fetch(`${request.nextUrl.origin}/api/auth/check`, {
      headers: {
        Cookie: request.headers.get("cookie") || "",
      },
      credentials: "include", // Ensure cookies are sent with the request
    });
  } catch (error) {
    console.error("Error calling /api/auth/check:", error.message);
    // Fallback to unauthenticated state if API call fails
    const redirectUrl = new URL("/auth?mode=signIn", request.url);
    redirectUrl.searchParams.set("redirectedFrom", request.nextUrl.pathname);
    return NextResponse.redirect(redirectUrl);
  }

  let isAuthenticated = false;
  let user = null;

  if (authResponse.ok) {
    try {
      const authData = await authResponse.json();
      isAuthenticated = authData.isAuthenticated;
      user = authData.user;
    } catch (error) {
      console.error("Error parsing /api/auth/check response:", error.message);
      // Fallback to unauthenticated state if JSON parsing fails
      const redirectUrl = new URL("/auth?mode=signIn", request.url);
      redirectUrl.searchParams.set("redirectedFrom", request.nextUrl.pathname);
      return NextResponse.redirect(redirectUrl);
    }
  } else {
    console.error(
      "Auth check API returned non-200 status:",
      authResponse.status
    );
  }

  const protectedRoutes = ["/dashboard", "/students"];
  const publicRoutes = ["/auth", "/", "/login", "/signup"];
  const path = request.nextUrl.pathname;

  const isProtectedRoute = protectedRoutes.some((route) =>
    path.startsWith(route)
  );
  const isPublicRoute = publicRoutes.includes(path);

  // Redirect unauthenticated users trying to access protected routes
  if (isProtectedRoute && !isAuthenticated) {
    const redirectUrl = new URL("/auth?mode=signIn", request.url);
    redirectUrl.searchParams.set("redirectedFrom", path);
    return NextResponse.redirect(redirectUrl);
  }

  // Redirect authenticated users trying to access public routes (except updateProfile)
  if (
    isPublicRoute &&
    isAuthenticated &&
    path.startsWith("/auth") &&
    !path.includes("updateProfile")
  ) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // Proceed with the request
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico
     * - Static assets (svg, png, jpg, etc.)
     * - API routes
     */
    "/((?!_next/static|_next/image|favicon.ico|api/|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
