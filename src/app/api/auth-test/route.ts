import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");

  if (!authHeader) {
    return NextResponse.json({ error: "No auth header", headers: Object.fromEntries(request.headers.entries()) });
  }

  try {
    const base64 = authHeader.split(" ")[1];
    const decoded = atob(base64);
    const colonIndex = decoded.indexOf(":");
    const username = decoded.substring(0, colonIndex);
    const password = decoded.substring(colonIndex + 1);

    return NextResponse.json({
      authHeader: authHeader.substring(0, 20) + "...",
      decoded: decoded.substring(0, 5) + "***",
      username,
      passwordLength: password.length,
      envUser: process.env.ADMIN_USER || "(fallback: admin)",
      envPass: process.env.ADMIN_PASS ? "set" : "(fallback)",
      match: username === (process.env.ADMIN_USER || "admin") && password === (process.env.ADMIN_PASS || "franchisel2026"),
    });
  } catch (e) {
    return NextResponse.json({ error: String(e) });
  }
}
