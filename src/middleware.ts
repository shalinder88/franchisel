import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  // Only protect /admin routes
  if (!request.nextUrl.pathname.startsWith("/admin")) {
    return NextResponse.next();
  }

  const authHeader = request.headers.get("authorization");

  if (!authHeader || !authHeader.startsWith("Basic ")) {
    return new NextResponse("Authentication required", {
      status: 401,
      headers: { "WWW-Authenticate": 'Basic realm="Franchisel Admin"' },
    });
  }

  try {
    const base64 = authHeader.split(" ")[1];
    const binaryString = atob(base64);
    const bytes = Uint8Array.from(binaryString, (c) => c.charCodeAt(0));
    const decoded = new TextDecoder().decode(bytes);
    const colonIndex = decoded.indexOf(":");
    const username = decoded.substring(0, colonIndex);
    const password = decoded.substring(colonIndex + 1);

    const validUser = process.env.ADMIN_USER || "admin";
    const validPass = process.env.ADMIN_PASS || "franchisel2026";

    if (username !== validUser || password !== validPass) {
      return new NextResponse("Invalid credentials", {
        status: 401,
        headers: { "WWW-Authenticate": 'Basic realm="Franchisel Admin"' },
      });
    }
  } catch {
    return new NextResponse("Invalid credentials", {
      status: 401,
      headers: { "WWW-Authenticate": 'Basic realm="Franchisel Admin"' },
    });
  }

  // Auth passed — set cookie and continue
  const response = NextResponse.next();
  response.cookies.set("franchisel_admin", "1", {
    secure: true,
    sameSite: "lax",
    maxAge: 60 * 60 * 24,
    path: "/",
  });
  return response;
}

export const config = {
  matcher: ["/admin/:path*"],
};
