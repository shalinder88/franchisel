import { NextRequest, NextResponse } from "next/server";
import { brands } from "@/data/brands";
import {
  getOverallScore,
  formatCurrency,
  formatInvestmentRange,
} from "@/lib/types";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slugA: string; slugB: string }> }
) {
  const { slugA, slugB } = await params;
  const brandA = brands.find((b) => b.slug === slugA);
  const brandB = brands.find((b) => b.slug === slugB);

  if (!brandA || !brandB) {
    const missing = [];
    if (!brandA) missing.push(slugA);
    if (!brandB) missing.push(slugB);
    return NextResponse.json(
      {
        error: "Brand not found",
        message: `No franchise brand found for: ${missing.join(", ")}`,
      },
      { status: 404 }
    );
  }

  const scoreA = getOverallScore(brandA.scores);
  const scoreB = getOverallScore(brandB.scores);

  const comparison = {
    brandA: {
      slug: brandA.slug,
      name: brandA.name,
      category: brandA.category,
      overallScore: scoreA,
      scores: brandA.scores,
      investmentRange: formatInvestmentRange(
        brandA.totalInvestmentLow,
        brandA.totalInvestmentHigh
      ),
      totalInvestmentLow: brandA.totalInvestmentLow,
      totalInvestmentHigh: brandA.totalInvestmentHigh,
      royaltyRate: brandA.royaltyRate,
      initialFranchiseFee: formatCurrency(brandA.initialFranchiseFee),
      totalUnits: brandA.totalUnits,
      unitGrowthRate: brandA.unitEconomics.threeYearGrowthRate,
      turnoverRate: brandA.unitEconomics.turnoverRate,
      hasItem19: brandA.hasItem19,
      avgRevenue: brandA.item19?.grossRevenueAvg
        ? formatCurrency(brandA.item19.grossRevenueAvg)
        : null,
      redFlagCount: brandA.redFlags.length,
      criticalRedFlags: brandA.redFlags.filter((f) => f.severity === "critical")
        .length,
      communityReviews: brandA.communityReviews,
      communityAvgSatisfaction: brandA.communityAvgSatisfaction ?? null,
    },
    brandB: {
      slug: brandB.slug,
      name: brandB.name,
      category: brandB.category,
      overallScore: scoreB,
      scores: brandB.scores,
      investmentRange: formatInvestmentRange(
        brandB.totalInvestmentLow,
        brandB.totalInvestmentHigh
      ),
      totalInvestmentLow: brandB.totalInvestmentLow,
      totalInvestmentHigh: brandB.totalInvestmentHigh,
      royaltyRate: brandB.royaltyRate,
      initialFranchiseFee: formatCurrency(brandB.initialFranchiseFee),
      totalUnits: brandB.totalUnits,
      unitGrowthRate: brandB.unitEconomics.threeYearGrowthRate,
      turnoverRate: brandB.unitEconomics.turnoverRate,
      hasItem19: brandB.hasItem19,
      avgRevenue: brandB.item19?.grossRevenueAvg
        ? formatCurrency(brandB.item19.grossRevenueAvg)
        : null,
      redFlagCount: brandB.redFlags.length,
      criticalRedFlags: brandB.redFlags.filter((f) => f.severity === "critical")
        .length,
      communityReviews: brandB.communityReviews,
      communityAvgSatisfaction: brandB.communityAvgSatisfaction ?? null,
    },
    deltas: {
      overallScore: Number((scoreA - scoreB).toFixed(1)),
      investmentMidpoint:
        (brandA.totalInvestmentLow + brandA.totalInvestmentHigh) / 2 -
        (brandB.totalInvestmentLow + brandB.totalInvestmentHigh) / 2,
      totalUnits: brandA.totalUnits - brandB.totalUnits,
      turnoverRate: Number(
        (brandA.unitEconomics.turnoverRate - brandB.unitEconomics.turnoverRate).toFixed(1)
      ),
    },
  };

  return NextResponse.json(
    {
      data: comparison,
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
