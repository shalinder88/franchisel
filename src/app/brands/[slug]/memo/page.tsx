import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { getBrandBySlug } from "@/data/brands";
import {
  generateMemo,
  generateInterviewQuestions,
} from "@/lib/diligence";
import { formatInvestmentRange, formatCurrency } from "@/lib/types";
import PrintButton from "@/components/PrintButton";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const brand = getBrandBySlug(slug);
  if (!brand) return { title: "Not Found" };
  return {
    title: `${brand.name} — Buyer Memo`,
    description: `One-page buyer memo for ${brand.name}: investment snapshot, revenue, red flags, and questions to ask — sourced from the ${brand.fddYear} FDD.`,
    robots: { index: false },
  };
}

export default async function BuyerMemoPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const brand = getBrandBySlug(slug);
  if (!brand) notFound();

  const memo = generateMemo(brand);
  const interviewQs = generateInterviewQuestions(brand);

  const today = new Date().toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const criticalFlags = memo.autoFlags.filter((f) => f.severity === "critical");
  const warningFlags = memo.autoFlags.filter((f) => f.severity === "warning");
  const topFlags = [...criticalFlags, ...warningFlags].slice(0, 6);
  const topQuestions = interviewQs.slice(0, 6);

  const isGovVerified =
    brand.dataSource === "state_filing" || brand.dataSource === "fdd_verified";

  return (
    <div className="min-h-screen bg-background">
      {/* Print header */}
      <div className="hidden print:block px-8 pt-6 pb-4 border-b border-border">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-[10px] text-gray-500 uppercase tracking-wider">
              Franchisel.com — Buyer Memo
            </p>
            <h1 className="text-2xl font-bold mt-0.5">{brand.name}</h1>
            <p className="text-xs text-gray-500 mt-0.5">
              {brand.fddYear} FDD ·{" "}
              {isGovVerified ? "Government-filed source" : "Verified source"} ·
              Generated {today}
            </p>
          </div>
          <div className="text-right">
            <p className="text-[10px] text-gray-500 uppercase tracking-wider">
              Core Diligence Score
            </p>
            <p className="text-4xl font-black text-gray-900">
              {memo.overallScore}
              <span className="text-base font-normal text-gray-400">/10</span>
            </p>
          </div>
        </div>
      </div>

      {/* Screen nav */}
      <div className="border-b border-border bg-surface-alt print:hidden">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">
          <nav className="flex items-center gap-1.5 text-xs text-muted">
            <Link href="/" className="hover:text-accent">
              Home
            </Link>
            <span>/</span>
            <Link href="/brands" className="hover:text-accent">
              Brands
            </Link>
            <span>/</span>
            <Link href={`/brands/${slug}`} className="hover:text-accent">
              {brand.name}
            </Link>
            <span>/</span>
            <span className="text-foreground font-medium">Buyer Memo</span>
          </nav>
          <div className="flex items-center gap-2">
            <Link
              href={`/brands/${slug}/diligence`}
              className="text-xs text-accent hover:underline"
            >
              Full memo →
            </Link>
            <PrintButton />
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-8 print:px-0 print:py-0 space-y-5">
        {/* Header */}
        <div className="print:hidden">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                {brand.name}
              </h1>
              <p className="text-sm text-muted mt-0.5">
                Buyer memo · {brand.fddYear} FDD ·{" "}
                {isGovVerified ? (
                  <span className="text-success font-medium">
                    Government-filed source
                  </span>
                ) : (
                  "Verified source"
                )}
              </p>
            </div>
            <div className="text-right shrink-0">
              <p className="text-[10px] text-muted uppercase tracking-wider">
                Core Diligence Score
              </p>
              <p className="text-4xl font-black text-accent">
                {memo.overallScore}
                <span className="text-sm font-normal text-muted">/10</span>
              </p>
            </div>
          </div>
          <p className="text-xs text-muted mt-2 leading-relaxed">
            {memo.scoreRationale}
          </p>
        </div>

        {/* 2-col snapshot grid */}
        <div className="grid sm:grid-cols-2 gap-4">
          {/* Investment */}
          <div className="rounded-xl border border-border bg-background p-4">
            <p className="text-[10px] font-semibold text-muted uppercase tracking-wider mb-3">
              Investment — Items 5, 6, 7
            </p>
            <div className="space-y-1.5 text-sm">
              <div className="flex justify-between">
                <span className="text-muted">Total investment</span>
                <span className="font-semibold text-foreground">
                  {formatInvestmentRange(
                    brand.totalInvestmentLow,
                    brand.totalInvestmentHigh
                  )}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">Franchise fee</span>
                <span className="font-semibold text-foreground">
                  {brand.initialFranchiseFee > 0
                    ? formatCurrency(brand.initialFranchiseFee)
                    : "Not disclosed"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">Royalty rate</span>
                <span className="font-semibold text-foreground">
                  {brand.royaltyRate || "N/A"}
                </span>
              </div>
              {brand.item17?.initialTermYears && (
                <div className="flex justify-between">
                  <span className="text-muted">Initial term</span>
                  <span className="font-semibold text-foreground">
                    {brand.item17.initialTermYears} yrs
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Revenue */}
          <div className="rounded-xl border border-border bg-background p-4">
            <p className="text-[10px] font-semibold text-muted uppercase tracking-wider mb-3">
              Item 19 — Revenue Disclosure
            </p>
            {brand.item19?.grossRevenueAvg ? (
              <div className="space-y-1.5 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted">Avg gross revenue</span>
                  <span className="font-semibold text-foreground">
                    {formatCurrency(brand.item19.grossRevenueAvg)}
                  </span>
                </div>
                {brand.item19.grossRevenueMedian && (
                  <div className="flex justify-between">
                    <span className="text-muted">Median gross revenue</span>
                    <span className="font-semibold text-foreground">
                      {formatCurrency(brand.item19.grossRevenueMedian)}
                    </span>
                  </div>
                )}
                {brand.item19.unitsIncluded > 0 && (
                  <div className="flex justify-between">
                    <span className="text-muted">Units in sample</span>
                    <span className="font-semibold text-foreground">
                      {brand.item19.unitsIncluded}
                    </span>
                  </div>
                )}
                {memo.item19Analysis.impliedRoiYears !== null && (
                  <div className="flex justify-between pt-1.5 border-t border-border/50 mt-1.5">
                    <span className="text-muted text-xs">
                      Payback est. (15% margin)
                    </span>
                    <span className="font-semibold text-foreground text-xs">
                      {memo.item19Analysis.impliedRoiYears} yrs
                    </span>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-sm text-muted italic">
                No Item 19 revenue data disclosed in this FDD.
              </p>
            )}
          </div>

          {/* System health */}
          <div className="rounded-xl border border-border bg-background p-4">
            <p className="text-[10px] font-semibold text-muted uppercase tracking-wider mb-3">
              Item 20 — System Health
            </p>
            <div className="space-y-1.5 text-sm">
              <div className="flex justify-between">
                <span className="text-muted">Total units</span>
                <span className="font-semibold text-foreground">
                  {brand.totalUnits.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">Net growth (last year)</span>
                <span
                  className={`font-semibold ${brand.unitEconomics.netGrowth >= 0 ? "text-success" : "text-danger"}`}
                >
                  {brand.unitEconomics.netGrowth >= 0 ? "+" : ""}
                  {brand.unitEconomics.netGrowth}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">Annual turnover rate</span>
                <span
                  className={`font-semibold ${brand.unitEconomics.turnoverRate >= 15 ? "text-danger" : brand.unitEconomics.turnoverRate >= 8 ? "text-warning" : "text-foreground"}`}
                >
                  {brand.unitEconomics.turnoverRate}%
                </span>
              </div>
              {brand.item19Prior?.grossRevenueAvg &&
                brand.item19?.grossRevenueAvg && (
                  <div className="flex justify-between pt-1.5 border-t border-border/50 mt-1.5">
                    <span className="text-muted text-xs">
                      Revenue YoY ({brand.item19Prior.fddYear} → {brand.fddYear})
                    </span>
                    <span
                      className={`font-semibold text-xs ${
                        brand.item19.grossRevenueAvg >=
                        brand.item19Prior.grossRevenueAvg
                          ? "text-success"
                          : "text-danger"
                      }`}
                    >
                      {brand.item19.grossRevenueAvg >=
                      brand.item19Prior.grossRevenueAvg
                        ? "+"
                        : ""}
                      {(
                        ((brand.item19.grossRevenueAvg -
                          brand.item19Prior.grossRevenueAvg) /
                          brand.item19Prior.grossRevenueAvg) *
                        100
                      ).toFixed(1)}
                      %
                    </span>
                  </div>
                )}
            </div>
          </div>

          {/* Contract terms */}
          <div className="rounded-xl border border-border bg-background p-4">
            <p className="text-[10px] font-semibold text-muted uppercase tracking-wider mb-3">
              Contract Terms — Item 17
            </p>
            {brand.item17 ? (
              <div className="space-y-1.5 text-sm">
                {brand.item17.initialTermYears && (
                  <div className="flex justify-between">
                    <span className="text-muted">Initial term</span>
                    <span className="font-semibold text-foreground">
                      {brand.item17.initialTermYears} years
                    </span>
                  </div>
                )}
                {brand.item17.renewalTermYears && (
                  <div className="flex justify-between">
                    <span className="text-muted">Renewal term</span>
                    <span className="font-semibold text-foreground">
                      {brand.item17.renewalTermYears} years
                    </span>
                  </div>
                )}
                {brand.item17.hasNonCompete !== undefined && (
                  <div className="flex justify-between">
                    <span className="text-muted">Non-compete clause</span>
                    <span
                      className={`font-semibold ${brand.item17.hasNonCompete ? "text-warning" : "text-success"}`}
                    >
                      {brand.item17.hasNonCompete ? "Yes" : "No"}
                    </span>
                  </div>
                )}
                {brand.item17.transferFee && (
                  <div className="flex justify-between">
                    <span className="text-muted">Transfer fee</span>
                    <span className="font-semibold text-foreground">
                      {brand.item17.transferFee}
                    </span>
                  </div>
                )}
                {!brand.item17.initialTermYears &&
                  !brand.item17.renewalTermYears &&
                  brand.item17.hasNonCompete === undefined && (
                    <p className="text-sm text-muted italic">
                      Item 17 data not extracted for this brand.
                    </p>
                  )}
              </div>
            ) : (
              <p className="text-sm text-muted italic">
                Item 17 data not extracted for this brand.
              </p>
            )}
          </div>
        </div>

        {/* Flags */}
        {topFlags.length > 0 && (
          <div className="rounded-xl border border-border bg-background overflow-hidden">
            <div className="px-4 py-2.5 border-b border-border bg-surface">
              <p className="text-[10px] font-semibold text-muted uppercase tracking-wider">
                Red Flags &amp; Key Signals
              </p>
            </div>
            <div className="divide-y divide-border">
              {topFlags.map((flag, i) => (
                <div key={i} className="px-4 py-3 flex gap-3 items-start">
                  <span
                    className={`shrink-0 text-[10px] font-bold px-1.5 py-0.5 rounded mt-0.5 ${
                      flag.severity === "critical"
                        ? "bg-danger/10 text-danger"
                        : flag.severity === "warning"
                          ? "bg-warning/10 text-warning"
                          : "bg-success/10 text-success"
                    }`}
                  >
                    {flag.severity === "critical"
                      ? "CRIT"
                      : flag.severity === "warning"
                        ? "WARN"
                        : "POS"}
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-foreground">
                      {flag.title}
                      <span className="text-[10px] font-mono text-muted ml-2">
                        {flag.item}
                      </span>
                    </p>
                    <p className="text-xs text-muted mt-0.5 leading-relaxed">
                      {flag.detail}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            {memo.autoFlags.length > 6 && (
              <div className="px-4 py-2 border-t border-border bg-surface text-xs text-muted">
                +{memo.autoFlags.length - 6} more signals in the{" "}
                <Link
                  href={`/brands/${slug}/diligence`}
                  className="text-accent hover:underline print:hidden"
                >
                  full diligence memo
                </Link>
                <span className="hidden print:inline">full diligence memo</span>
              </div>
            )}
          </div>
        )}

        {/* Interview questions */}
        {topQuestions.length > 0 && (
          <div className="rounded-xl border border-border bg-background overflow-hidden">
            <div className="px-4 py-2.5 border-b border-border bg-surface">
              <p className="text-[10px] font-semibold text-muted uppercase tracking-wider">
                Questions to Ask Existing Franchisees
              </p>
            </div>
            <ul className="divide-y divide-border">
              {topQuestions.map((q, i) => (
                <li key={i} className="px-4 py-3">
                  <p className="text-sm text-foreground font-medium leading-snug">
                    {q.question}
                  </p>
                  {q.lookFor && (
                    <p className="text-xs text-muted mt-0.5">{q.lookFor}</p>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Next steps */}
        <div className="rounded-xl border border-border bg-background p-4">
          <p className="text-[10px] font-semibold text-muted uppercase tracking-wider mb-3">
            Next Steps Before Signing
          </p>
          <div className="grid sm:grid-cols-2 gap-3 text-xs text-muted leading-relaxed">
            <div>
              <p className="font-semibold text-foreground mb-1">
                Validation calls
              </p>
              <ul className="space-y-1 list-disc list-inside">
                <li>Call 5–10 franchisees from Item 20 contact list</li>
                <li>Ask about support quality and territory disputes</li>
                <li>Ask if they would buy again at today&apos;s fee level</li>
              </ul>
            </div>
            <div>
              <p className="font-semibold text-foreground mb-1">
                Professional review
              </p>
              <ul className="space-y-1 list-disc list-inside">
                <li>Hire a franchise attorney to review the FDD + FA</li>
                <li>Get an accountant to model unit economics with real COGS</li>
                <li>Request audited financials (Item 21) if not included</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Footer nav */}
        <div className="flex items-center justify-between pt-2 border-t border-border print:hidden">
          <Link
            href={`/brands/${slug}`}
            className="text-sm text-accent hover:underline"
          >
            ← Back to {brand.name}
          </Link>
          <div className="flex gap-4">
            <Link
              href={`/brands/${slug}/diff`}
              className="text-sm text-accent hover:underline"
            >
              Filing changes →
            </Link>
            <Link
              href={`/brands/${slug}/diligence`}
              className="text-sm text-accent hover:underline"
            >
              Full diligence memo →
            </Link>
          </div>
        </div>

        <p className="text-[10px] text-muted border-t border-border pt-4">
          All figures sourced from the {brand.fddYear} Franchise Disclosure
          Document (
          {isGovVerified ? "government-filed, MN CARDS / WI DFI / CA DFPI" : "verified filing"}
          ). Payback estimates assume 15% net margin — editorial estimate only,
          not a guarantee. This memo is a first-pass summary; it is not legal or
          financial advice. Consult a franchise attorney and CPA before signing.
          Generated {today}.
        </p>
      </div>
    </div>
  );
}
