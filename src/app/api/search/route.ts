import { NextRequest, NextResponse } from "next/server";
import { brands } from "@/data/brands";
import { categoryLabels, type FranchiseCategory } from "@/lib/types";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const query = searchParams.get("q")?.trim().toLowerCase();

  if (!query || query.length === 0) {
    return NextResponse.json(
      {
        error: "Missing query parameter",
        message: 'Provide a search query via the "q" parameter (e.g. /api/search?q=pizza).',
      },
      { status: 400 }
    );
  }

  const results = brands.filter((brand) => {
    const categoryLabel = categoryLabels[brand.category as FranchiseCategory]?.toLowerCase() ?? "";
    return (
      brand.name.toLowerCase().includes(query) ||
      brand.category.toLowerCase().includes(query) ||
      categoryLabel.includes(query) ||
      brand.description.toLowerCase().includes(query) ||
      brand.tagline.toLowerCase().includes(query) ||
      (brand.subcategory?.toLowerCase().includes(query) ?? false)
    );
  });

  return NextResponse.json(
    {
      data: results,
      meta: {
        query,
        total: results.length,
        attribution: "Franchisel — Independent Franchise Due Diligence Intelligence",
        generatedAt: new Date().toISOString(),
      },
    },
    {
      headers: {
        "Cache-Control": "public, s-maxage=300, stale-while-revalidate=3600",
      },
    }
  );
}
