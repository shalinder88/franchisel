import { NextRequest, NextResponse } from "next/server";
import { brands } from "@/data/brands";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const brand = brands.find((b) => b.slug === slug);

  if (!brand) {
    return NextResponse.json(
      {
        error: "Brand not found",
        message: `No franchise brand found with slug "${slug}".`,
      },
      { status: 404 }
    );
  }

  return NextResponse.json(
    {
      data: brand,
      meta: {
        attribution: "Franchisel — Independent Franchise Due Diligence Intelligence",
        dataSource: "Public FDD filings",
        generatedAt: new Date().toISOString(),
      },
    },
    {
      headers: {
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
      },
    }
  );
}
