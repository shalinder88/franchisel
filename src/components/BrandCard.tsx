import Link from "next/link";
import type { FranchiseBrand } from "@/lib/types";
import { getOverallScore, categoryLabels } from "@/lib/types";
import InvestmentRange from "./InvestmentRange";
import RedFlagBadge from "./RedFlagBadge";

interface BrandCardProps {
  brand: FranchiseBrand;
}

function scoreColor(score: number): string {
  if (score >= 8) return "text-success";
  if (score >= 6) return "text-accent";
  if (score >= 4) return "text-warning";
  return "text-danger";
}

function scoreBg(score: number): string {
  if (score >= 8) return "bg-success-light";
  if (score >= 6) return "bg-accent-light";
  if (score >= 4) return "bg-warning-light";
  return "bg-danger-light";
}

export default function BrandCard({ brand }: BrandCardProps) {
  const overall = getOverallScore(brand.scores);
  const criticalCount = brand.redFlags.filter((f) => f.severity === "critical").length;
  const warningCount = brand.redFlags.filter((f) => f.severity === "warning").length;
  const infoCount = brand.redFlags.filter((f) => f.severity === "info").length;

  return (
    <Link
      href={`/brands/${brand.slug}`}
      className="block border border-border rounded-xl p-5 hover-glow bg-background"
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="min-w-0">
          <h3 className="text-base font-semibold text-foreground truncate">{brand.name}</h3>
          <span className="inline-block mt-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-surface text-muted border border-border">
            {categoryLabels[brand.category]}
          </span>
        </div>
        <div
          className={`shrink-0 flex items-center justify-center w-11 h-11 rounded-xl text-lg font-bold tabular-nums ${scoreBg(overall)} ${scoreColor(overall)}`}
        >
          {overall.toFixed(1)}
        </div>
      </div>

      {/* Tagline */}
      <p className="text-sm text-muted leading-relaxed mb-4 line-clamp-2">{brand.tagline}</p>

      {/* Investment */}
      <div className="mb-4">
        <InvestmentRange low={brand.totalInvestmentLow} high={brand.totalInvestmentHigh} compact />
      </div>

      {/* Footer row */}
      <div className="flex items-center justify-between gap-2 pt-3 border-t border-border">
        {/* Red flags */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {criticalCount > 0 && <RedFlagBadge severity="critical" count={criticalCount} />}
          {warningCount > 0 && <RedFlagBadge severity="warning" count={warningCount} />}
          {infoCount > 0 && <RedFlagBadge severity="info" count={infoCount} />}
          {brand.redFlags.length === 0 && (
            <span className="text-xs text-muted">No flags</span>
          )}
        </div>

        {/* Community reviews */}
        <span className="text-xs text-muted whitespace-nowrap">
          <svg className="inline w-3.5 h-3.5 mr-0.5 -mt-px" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z" />
          </svg>
          {brand.communityReviews} reviews
        </span>
      </div>
    </Link>
  );
}
