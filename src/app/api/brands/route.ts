import { NextResponse } from "next/server";
import { brands } from "@/data/brands";

export async function GET() {
  return NextResponse.json(
    {
      data: brands,
      meta: {
        total: brands.length,
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
