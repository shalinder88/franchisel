import { NextRequest, NextResponse } from "next/server";
import { getBrandBySlug } from "@/data/brands";

export async function GET(_request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const brand = getBrandBySlug(slug);
  if (!brand) {
    return NextResponse.json({ error: "Brand not found" }, { status: 404 });
  }
  return NextResponse.json({ data: brand });
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const authHeader = request.headers.get("authorization");
  if (!authHeader || !isValidAuth(authHeader)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { slug } = await params;
  const brand = getBrandBySlug(slug);
  if (!brand) {
    return NextResponse.json({ error: "Brand not found" }, { status: 404 });
  }

  try {
    const body = await request.json();
    return NextResponse.json({
      success: true,
      message: "Brand update received. Export JSON and update brands.ts manually, then rebuild.",
      slug,
      updates: body,
    });
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const authHeader = request.headers.get("authorization");
  if (!authHeader || !isValidAuth(authHeader)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { slug } = await params;
  return NextResponse.json({
    success: true,
    message: `Delete request received for ${slug}. Remove from brands.ts manually, then rebuild.`,
  });
}

function isValidAuth(authHeader: string): boolean {
  if (!authHeader.startsWith("Basic ")) return false;
  const credentials = atob(authHeader.split(" ")[1]);
  const [username, password] = credentials.split(":");
  return username === (process.env.ADMIN_USER || "admin") && password === (process.env.ADMIN_PASS || "franchisel2026");
}
