import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  // Verify auth (middleware handles /admin pages, but API needs check too)
  const authHeader = request.headers.get("authorization");
  if (!authHeader || !isValidAuth(authHeader)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    // In v1, we just return success and the brand data
    // The actual write would be to a database or file system
    // For now, export JSON for manual insertion into brands.ts
    return NextResponse.json({
      success: true,
      message: "Brand data received. Export JSON and add to brands.ts manually, then rebuild.",
      brand: body,
    });
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }
}

function isValidAuth(authHeader: string): boolean {
  if (!authHeader.startsWith("Basic ")) return false;
  const credentials = atob(authHeader.split(" ")[1]);
  const [username, password] = credentials.split(":");
  return username === (process.env.ADMIN_USER || "admin") && password === (process.env.ADMIN_PASS || "franchisel2026");
}
