import { NextRequest, NextResponse } from "next/server";

function isValidAuth(authHeader: string): boolean {
  if (!authHeader.startsWith("Basic ")) return false;
  const credentials = atob(authHeader.split(" ")[1]);
  const [username, password] = credentials.split(":");
  const validUser = process.env.ADMIN_USER || "admin";
  const validPass = process.env.ADMIN_PASS || "franchisel2026";
  return username === validUser && password === validPass;
}

export function middleware(request: NextRequest) {
  const isAdminRoute = request.nextUrl.pathname.startsWith("/admin");
  const isBrandPage = request.nextUrl.pathname.startsWith("/brands/");

  // Admin routes: require Basic Auth, set admin cookie on success
  if (isAdminRoute) {
    const authHeader = request.headers.get("authorization");

    if (!authHeader || !isValidAuth(authHeader)) {
      return new NextResponse("Authentication required", {
        status: 401,
        headers: { "WWW-Authenticate": 'Basic realm="Franchisel Admin"' },
      });
    }

    // Set admin cookie so brand pages can detect admin access
    const response = NextResponse.next();
    response.cookies.set("franchisel_admin", "1", {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      maxAge: 60 * 60 * 24, // 24 hours
      path: "/",
    });
    return response;
  }

  // Brand pages: check for admin cookie, pass it as a header for server components
  if (isBrandPage) {
    const adminCookie = request.cookies.get("franchisel_admin");
    if (adminCookie?.value === "1") {
      const response = NextResponse.next();
      response.headers.set("x-admin-access", "1");
      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/brands/:path*"],
};
