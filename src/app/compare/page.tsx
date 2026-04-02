import Link from "next/link";
import { brands, comparisons, getBrandBySlug } from "@/data/brands";
import { formatCurrency, formatInvestmentRange, categoryLabels } from "@/lib/types";
import type { FranchiseBrand } from "@/lib/types";
import type { Metadata } from "next";
import { computeProductionScores } from "@/lib/diligence";
import BrandSelector from "@/components/BrandSelector";

export const metadata: Metadata = {
  title: "Compare Franchise Brands",
  description:
    "Side-by-side franchise comparisons backed by FDD data. Compare investment costs, revenue, royalties, unit growth, and overall scores.",
};

/* ── Score bar component (ScoreAxis-style) ── */
function ScoreBar({ label, scoreA, scoreB, nameA, nameB }: {
  label: string;
  scoreA: number;
  scoreB: number;
  nameA: string;
  nameB: string;
}) {
  const maxScore = 100;
  const pctA = (scoreA / maxScore) * 100;
  const pctB = (scoreB / maxScore) * 100;

  return (
    <div className="hover-score-row">
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-xs font-medium text-muted">{nameA}: {scoreA}</span>
        <span className="text-[11px] font-semibold text-foreground">{label}</span>
        <span className="text-xs font-medium text-muted">{nameB}: {scoreB}</span>
      </div>
      <div className="flex items-center gap-1">
        {/* Brand A bar (grows right to left) */}
        <div className="flex-1 h-2 bg-surface rounded-full overflow-hidden flex justify-end">
          <div
            className="h-full bg-accent rounded-full animate-fill"
            style={{ width: `${pctA}%` }}
          />
        </div>
        <div className="w-px h-4 bg-border-strong shrink-0" />
        {/* Brand B bar (grows left to right) */}
        <div className="flex-1 h-2 bg-surface rounded-full overflow-hidden">
          <div
            className="h-full bg-cyan rounded-full animate-fill"
            style={{ width: `${pctB}%` }}
          />
        </div>
      </div>
    </div>
  );
}

/* ── Metric row ── */
function MetricRow({ label, valueA, valueB }: {
  label: string;
  valueA: string;
  valueB: string;
}) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-border/50 last:border-0 hover-item">
      <span className="text-base text-foreground font-semibold w-1/3 text-left">{valueA}</span>
      <span className="text-xs font-bold text-muted uppercase tracking-wider w-1/3 text-center">{label}</span>
      <span className="text-base text-foreground font-semibold w-1/3 text-right">{valueB}</span>
    </div>
  );
}

/* ── Comparison table row with winner highlight ── */
function CompareRow({
  label,
  valueA,
  valueB,
  winnerSide,
  hint,
}: {
  label: string;
  valueA: string;
  valueB: string;
  winnerSide?: "A" | "B" | "tie" | null;
  hint?: string;
}) {
  return (
    <tr className="border-b border-border/50 last:border-0">
      <td className="py-4 px-4 sm:px-6">
        <div className="text-xs font-bold text-muted uppercase tracking-wider">{label}</div>
        {hint && <div className="text-[11px] text-muted/70 mt-0.5">{hint}</div>}
      </td>
      <td
        className={`py-4 px-4 sm:px-6 text-base font-semibold text-center ${
          winnerSide === "A" ? "bg-success/5 text-success" : "text-foreground"
        }`}
      >
        {winnerSide === "A" && (
          <span className="inline-block mr-1.5 text-success text-sm">▲</span>
        )}
        {valueA}
      </td>
      <td
        className={`py-4 px-4 sm:px-6 text-base font-semibold text-center ${
          winnerSide === "B" ? "bg-success/5 text-success" : "text-foreground"
        }`}
      >
        {winnerSide === "B" && (
          <span className="inline-block mr-1.5 text-success text-sm">▲</span>
        )}
        {valueB}
      </td>
    </tr>
  );
}

/* ── Determine numeric winner ── */
function winner(a: number | null, b: number | null, higherIsBetter: boolean): "A" | "B" | "tie" | null {
  if (a === null || b === null) return null;
  if (a === b) return "tie";
  if (higherIsBetter) return a > b ? "A" : "B";
  return a < b ? "A" : "B";
}

/* ── Winner declaration ── */
function declareWinner(brandA: FranchiseBrand, brandB: FranchiseBrand, scoreA: number, scoreB: number): { label: string; side: "A" | "B" | null } {
  const diff = scoreA - scoreB;
  if (diff > 0.4) return { label: `${brandA.name} edges ahead overall`, side: "A" };
  if (diff < -0.4) return { label: `${brandB.name} edges ahead overall`, side: "B" };
  // Near-tie — break on revenue transparency
  const rA = brandA.item19?.grossRevenueAvg ?? 0;
  const rB = brandB.item19?.grossRevenueAvg ?? 0;
  if (rA > rB * 1.1) return { label: `${brandA.name} leads on revenue disclosure`, side: "A" };
  if (rB > rA * 1.1) return { label: `${brandB.name} leads on revenue disclosure`, side: "B" };
  return { label: "Too close to call — review details below", side: null };
}

/* ── Verdict bullet builder ── */
function buildVerdict(brand: FranchiseBrand, other: FranchiseBrand): string[] {
  const pts: string[] = [];
  const investMid = (brand.totalInvestmentLow + brand.totalInvestmentHigh) / 2;
  const otherMid  = (other.totalInvestmentLow  + other.totalInvestmentHigh)  / 2;
  if (investMid < otherMid * 0.85) pts.push("You want a lower initial investment");
  if (brand.item19?.grossRevenueAvg && (!other.item19?.grossRevenueAvg || brand.item19.grossRevenueAvg > other.item19.grossRevenueAvg))
    pts.push("Disclosed revenue is a deciding factor for you");
  if (brand.item12?.exclusiveTerritory && !other.item12?.exclusiveTerritory)
    pts.push("Exclusive territory protection is a priority");
  if (!brand.item17?.mandatoryArbitration && other.item17?.mandatoryArbitration)
    pts.push("You want to keep all legal options open");
  if (!brand.item4?.hasBankruptcy && other.item4?.hasBankruptcy)
    pts.push("A clean bankruptcy history matters to you");
  if ((brand.item11?.totalTrainingHours ?? 0) > (other.item11?.totalTrainingHours ?? 0) + 20)
    pts.push("You value intensive initial training");
  if (brand.unitEconomics.netGrowth > 0 && other.unitEconomics.netGrowth <= 0)
    pts.push("You want a brand that is actively growing");
  if (brand.unitEconomics.turnoverRate < other.unitEconomics.turnoverRate - 3)
    pts.push("Franchisee retention and stability matter to you");
  if (brand.totalUnits > other.totalUnits * 1.5)
    pts.push("You prefer a larger, more established network");
  return pts.slice(0, 4);
}

/* ── Feature matrix ── */
type FeatureStatus = "yes" | "no" | "unknown";
function fs(val?: boolean | null): FeatureStatus {
  return val === true ? "yes" : val === false ? "no" : "unknown";
}

function FeatureCell({ status }: { status: FeatureStatus }) {
  if (status === "yes") return <td className="py-2.5 px-4 sm:px-6 text-center text-success font-bold text-sm">✓</td>;
  if (status === "no")  return <td className="py-2.5 px-4 sm:px-6 text-center text-danger/70 text-sm">✕</td>;
  return <td className="py-2.5 px-4 sm:px-6 text-center text-muted/40 text-sm">—</td>;
}

/* ── Full dynamic comparison table ── */
function DynamicComparison({ brandA, brandB }: { brandA: FranchiseBrand; brandB: FranchiseBrand }) {
  const scoreA = (computeProductionScores(brandA).coreDiligence ?? 0);
  const scoreB = (computeProductionScores(brandB).coreDiligence ?? 0);
  const { label: winnerLabel, side: winnerSide } = declareWinner(brandA, brandB, scoreA, scoreB);
  const verdictA = buildVerdict(brandA, brandB);
  const verdictB = buildVerdict(brandB, brandA);

  const investLowA = brandA.totalInvestmentLow;
  const investLowB = brandB.totalInvestmentLow;
  const investHighA = brandA.totalInvestmentHigh;
  const investHighB = brandB.totalInvestmentHigh;
  const investMidA = (investLowA + investHighA) / 2;
  const investMidB = (investLowB + investHighB) / 2;

  const royaltyNumA = parseFloat(brandA.royaltyRate);
  const royaltyNumB = parseFloat(brandB.royaltyRate);
  const marketingNumA = parseFloat(brandA.marketingFundRate);
  const marketingNumB = parseFloat(brandB.marketingFundRate);

  const revenueA = brandA.item19?.grossRevenueAvg ?? null;
  const revenueB = brandB.item19?.grossRevenueAvg ?? null;

  const redFlagCountA = brandA.redFlags.length;
  const redFlagCountB = brandB.redFlags.length;

  return (
    <div className="border border-border rounded-2xl bg-background overflow-hidden hover-glow animate-fade-up">
      {/* Header */}
      <div className="bg-surface-alt border-b border-border px-6 py-5 sm:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center text-accent font-bold text-sm">
              {brandA.name.charAt(0)}
            </div>
            <div>
              <Link href={`/brands/${brandA.slug}`} className="text-lg font-bold text-foreground hover:text-accent transition-colors">
                {brandA.name}
              </Link>
              <p className="text-xs text-muted">{categoryLabels[brandA.category]}</p>
            </div>
          </div>

          <div className="flex flex-col items-center gap-2">
            <div className="flex items-center gap-3">
              <span className="text-2xl font-black text-accent">{scoreA}</span>
              <div className="px-3 py-1 rounded-full bg-surface border border-border text-xs font-bold text-muted uppercase tracking-wider">
                vs
              </div>
              <span className="text-2xl font-black text-cyan">{scoreB}</span>
            </div>
            <span className={`px-3 py-1 rounded-full text-xs font-bold ${
              winnerSide === "A" ? "bg-success-light text-success" :
              winnerSide === "B" ? "bg-cyan/10 text-cyan" :
              "bg-surface text-muted border border-border"
            }`}>
              {winnerLabel}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <Link href={`/brands/${brandB.slug}`} className="text-lg font-bold text-foreground hover:text-accent transition-colors">
                {brandB.name}
              </Link>
              <p className="text-xs text-muted">{categoryLabels[brandB.category]}</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-cyan/10 flex items-center justify-center text-cyan font-bold text-sm">
              {brandB.name.charAt(0)}
            </div>
          </div>
        </div>
      </div>

      {/* Comparison table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-surface/50">
              <th className="py-3 px-4 sm:px-6 text-left text-[11px] font-bold text-muted uppercase tracking-wider w-1/3">Metric</th>
              <th className="py-3 px-4 sm:px-6 text-center text-[11px] font-bold text-accent uppercase tracking-wider w-1/3">
                {brandA.name}
              </th>
              <th className="py-3 px-4 sm:px-6 text-center text-[11px] font-bold text-cyan uppercase tracking-wider w-1/3">
                {brandB.name}
              </th>
            </tr>
          </thead>
          <tbody>
            <CompareRow
              label="Overall Score"
              valueA={`${scoreA} / 10`}
              valueB={`${scoreB} / 10`}
              winnerSide={winner(scoreA, scoreB, true)}
              hint="Weighted composite score"
            />
            <CompareRow
              label="Total Investment"
              valueA={formatInvestmentRange(investLowA, investHighA)}
              valueB={formatInvestmentRange(investLowB, investHighB)}
              winnerSide={winner(investMidA, investMidB, false)}
              hint="Lower midpoint is better"
            />
            <CompareRow
              label="Royalty Rate"
              valueA={brandA.royaltyRate}
              valueB={brandB.royaltyRate}
              winnerSide={
                !isNaN(royaltyNumA) && !isNaN(royaltyNumB)
                  ? winner(royaltyNumA, royaltyNumB, false)
                  : null
              }
              hint="Lower is better"
            />
            <CompareRow
              label="Marketing Fund"
              valueA={brandA.marketingFundRate}
              valueB={brandB.marketingFundRate}
              winnerSide={
                !isNaN(marketingNumA) && !isNaN(marketingNumB)
                  ? winner(marketingNumA, marketingNumB, false)
                  : null
              }
              hint="Lower is better"
            />
            <CompareRow
              label="Item 19 Avg Revenue"
              valueA={revenueA !== null ? formatCurrency(revenueA) : "Not Disclosed"}
              valueB={revenueB !== null ? formatCurrency(revenueB) : "Not Disclosed"}
              winnerSide={winner(revenueA, revenueB, true)}
              hint="Higher is better — from government-filed FDD"
            />
            {(brandA.item19?.unitsIncluded != null || brandB.item19?.unitsIncluded != null) && (
              <CompareRow
                label="Units in Item 19 Sample"
                valueA={
                  brandA.item19?.unitsIncluded
                    ? `${brandA.item19.unitsIncluded.toLocaleString()} (${Math.round((brandA.item19.unitsIncluded / brandA.totalUnits) * 100)}% of system)`
                    : "—"
                }
                valueB={
                  brandB.item19?.unitsIncluded
                    ? `${brandB.item19.unitsIncluded.toLocaleString()} (${Math.round((brandB.item19.unitsIncluded / brandB.totalUnits) * 100)}% of system)`
                    : "—"
                }
                winnerSide={null}
                hint="Higher % = more representative sample"
              />
            )}
            {(brandA.item19?.grossRevenueMedian != null || brandB.item19?.grossRevenueMedian != null) && (
              <CompareRow
                label="Item 19 Median Revenue"
                valueA={brandA.item19?.grossRevenueMedian ? formatCurrency(brandA.item19.grossRevenueMedian) : "—"}
                valueB={brandB.item19?.grossRevenueMedian ? formatCurrency(brandB.item19.grossRevenueMedian) : "—"}
                winnerSide={winner(brandA.item19?.grossRevenueMedian ?? null, brandB.item19?.grossRevenueMedian ?? null, true)}
                hint="Median is more reliable than avg when skewed by top performers"
              />
            )}
            <CompareRow
              label="Total Units"
              valueA={brandA.totalUnits.toLocaleString()}
              valueB={brandB.totalUnits.toLocaleString()}
              winnerSide={winner(brandA.totalUnits, brandB.totalUnits, true)}
              hint="Larger network = stronger brand"
            />
            <CompareRow
              label="Net Unit Growth"
              valueA={
                brandA.unitEconomics.netGrowth >= 0
                  ? `+${brandA.unitEconomics.netGrowth}`
                  : `${brandA.unitEconomics.netGrowth}`
              }
              valueB={
                brandB.unitEconomics.netGrowth >= 0
                  ? `+${brandB.unitEconomics.netGrowth}`
                  : `${brandB.unitEconomics.netGrowth}`
              }
              winnerSide={winner(brandA.unitEconomics.netGrowth, brandB.unitEconomics.netGrowth, true)}
              hint="Net new units in period"
            />
            <CompareRow
              label="Red Flags"
              valueA={`${redFlagCountA} flag${redFlagCountA !== 1 ? "s" : ""}`}
              valueB={`${redFlagCountB} flag${redFlagCountB !== 1 ? "s" : ""}`}
              winnerSide={winner(redFlagCountA, redFlagCountB, false)}
              hint="Fewer is better"
            />
            <CompareRow
              label="Confidence Score"
              valueA={`${computeProductionScores(brandA).confidence} / 100`}
              valueB={`${computeProductionScores(brandB).confidence} / 100`}
              winnerSide={winner(computeProductionScores(brandA).confidence, computeProductionScores(brandB).confidence, true)}
              hint="Data completeness and extraction quality"
            />
            {/* ── Item 20: Unit Turnover ── */}
            <CompareRow
              label="Unit Turnover Rate"
              valueA={brandA.unitEconomics.turnoverRate > 0 ? `${brandA.unitEconomics.turnoverRate}%` : "0%"}
              valueB={brandB.unitEconomics.turnoverRate > 0 ? `${brandB.unitEconomics.turnoverRate}%` : "0%"}
              winnerSide={winner(brandA.unitEconomics.turnoverRate, brandB.unitEconomics.turnoverRate, false)}
              hint="Closed + transferred ÷ total — lower is healthier"
            />
            {/* ── Item 4: Bankruptcy ── */}
            {(brandA.item4 || brandB.item4) && (
              <CompareRow
                label="Bankruptcy History"
                valueA={brandA.item4 ? (brandA.item4.hasBankruptcy ? `Yes — ${(brandA.item4.bankruptcyType ?? "disclosed").replace("_", " ")}` : "None disclosed") : "—"}
                valueB={brandB.item4 ? (brandB.item4.hasBankruptcy ? `Yes — ${(brandB.item4.bankruptcyType ?? "disclosed").replace("_", " ")}` : "None disclosed") : "—"}
                winnerSide={
                  brandA.item4 && brandB.item4
                    ? winner(brandA.item4.hasBankruptcy ? 1 : 0, brandB.item4.hasBankruptcy ? 1 : 0, false)
                    : null
                }
                hint="Item 4 — franchisor or affiliate bankruptcies"
              />
            )}
            {/* ── Item 11: Training ── */}
            {(brandA.item11 || brandB.item11) && (
              <CompareRow
                label="Training Hours"
                valueA={brandA.item11?.totalTrainingHours ? `${brandA.item11.totalTrainingHours}h` : brandA.item11 ? "Varies" : "—"}
                valueB={brandB.item11?.totalTrainingHours ? `${brandB.item11.totalTrainingHours}h` : brandB.item11 ? "Varies" : "—"}
                winnerSide={
                  brandA.item11?.totalTrainingHours && brandB.item11?.totalTrainingHours
                    ? winner(brandA.item11.totalTrainingHours, brandB.item11.totalTrainingHours, true)
                    : null
                }
                hint="Item 11 — initial training hours (more = better support)"
              />
            )}
            {/* ── Item 12: Territory ── */}
            {(brandA.item12 || brandB.item12) && (
              <CompareRow
                label="Exclusive Territory"
                valueA={brandA.item12 ? (brandA.item12.exclusiveTerritory ? "Yes ✓" : "No") : "—"}
                valueB={brandB.item12 ? (brandB.item12.exclusiveTerritory ? "Yes ✓" : "No") : "—"}
                winnerSide={
                  brandA.item12 && brandB.item12
                    ? winner(brandA.item12.exclusiveTerritory ? 1 : 0, brandB.item12.exclusiveTerritory ? 1 : 0, true)
                    : null
                }
                hint="Item 12 — protected territory granted"
              />
            )}
            {/* ── Item 17: Contract Term + Arbitration + Non-compete ── */}
            {(brandA.item17 || brandB.item17) && (
              <CompareRow
                label="Initial Term"
                valueA={brandA.item17?.initialTermYears ? `${brandA.item17.initialTermYears} yrs` : "—"}
                valueB={brandB.item17?.initialTermYears ? `${brandB.item17.initialTermYears} yrs` : "—"}
                winnerSide={null}
                hint="Item 17 — initial franchise agreement length"
              />
            )}
            {(brandA.item17 || brandB.item17) && (
              <CompareRow
                label="Mandatory Arbitration"
                valueA={brandA.item17 ? (brandA.item17.mandatoryArbitration ? "Required" : "No") : "—"}
                valueB={brandB.item17 ? (brandB.item17.mandatoryArbitration ? "Required" : "No") : "—"}
                winnerSide={
                  brandA.item17 && brandB.item17
                    ? winner(brandA.item17.mandatoryArbitration ? 1 : 0, brandB.item17.mandatoryArbitration ? 1 : 0, false)
                    : null
                }
                hint="Item 17 — disputes must go to arbitration (limits your legal options)"
              />
            )}
            {(brandA.item17 || brandB.item17) && (
              <CompareRow
                label="Post-term Non-compete"
                valueA={
                  brandA.item17
                    ? brandA.item17.hasNonCompete
                      ? `${brandA.item17.nonCompeteYears ?? "?"}yr / ${brandA.item17.nonCompeteMiles ?? "?"}mi`
                      : "None"
                    : "—"
                }
                valueB={
                  brandB.item17
                    ? brandB.item17.hasNonCompete
                      ? `${brandB.item17.nonCompeteYears ?? "?"}yr / ${brandB.item17.nonCompeteMiles ?? "?"}mi`
                      : "None"
                    : "—"
                }
                winnerSide={
                  brandA.item17 && brandB.item17
                    ? winner(brandA.item17.hasNonCompete ? 1 : 0, brandB.item17.hasNonCompete ? 1 : 0, false)
                    : null
                }
                hint="Item 17 — restrictions after you exit the franchise"
              />
            )}
          </tbody>
        </table>
      </div>

      {/* ── Verdict: Choose X if / Choose Y if ── */}
      {(verdictA.length > 0 || verdictB.length > 0) && (
        <div className="px-6 py-6 sm:px-8 border-t border-border grid sm:grid-cols-2 gap-4">
          <div className="rounded-xl border border-accent/20 bg-accent/5 p-4">
            <p className="text-[10px] font-bold text-accent uppercase tracking-widest mb-2.5">
              Choose {brandA.name} if…
            </p>
            {verdictA.length > 0 ? (
              <ul className="space-y-1.5">
                {verdictA.map((pt, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-foreground leading-snug">
                    <span className="text-accent mt-px shrink-0">▸</span>
                    {pt}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-xs text-muted">Review the metrics above to decide.</p>
            )}
          </div>
          <div className="rounded-xl border border-cyan/20 bg-cyan/5 p-4">
            <p className="text-[10px] font-bold text-cyan uppercase tracking-widest mb-2.5">
              Choose {brandB.name} if…
            </p>
            {verdictB.length > 0 ? (
              <ul className="space-y-1.5">
                {verdictB.map((pt, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-foreground leading-snug">
                    <span className="text-cyan mt-px shrink-0">▸</span>
                    {pt}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-xs text-muted">Review the metrics above to decide.</p>
            )}
          </div>
        </div>
      )}

      {/* ── Feature matrix ── */}
      <div className="border-t border-border overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-surface/50">
              <th className="py-3 px-4 sm:px-6 text-left text-[11px] font-bold text-muted uppercase tracking-wider w-1/2">Feature</th>
              <th className="py-3 px-4 sm:px-6 text-center text-[11px] font-bold text-accent uppercase tracking-wider w-1/4">{brandA.name}</th>
              <th className="py-3 px-4 sm:px-6 text-center text-[11px] font-bold text-cyan uppercase tracking-wider w-1/4">{brandB.name}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/50">
            {[
              {
                label: "Item 19 Revenue Disclosed",
                a: fs(!!(brandA.item19?.grossRevenueAvg || brandA.item19?.grossRevenueMedian)),
                b: fs(!!(brandB.item19?.grossRevenueAvg || brandB.item19?.grossRevenueMedian)),
              },
              {
                label: "Exclusive Territory",
                a: fs(brandA.item12?.exclusiveTerritory),
                b: fs(brandB.item12?.exclusiveTerritory),
              },
              {
                label: "No Mandatory Arbitration",
                a: brandA.item17 ? fs(!brandA.item17.mandatoryArbitration) : "unknown" as FeatureStatus,
                b: brandB.item17 ? fs(!brandB.item17.mandatoryArbitration) : "unknown" as FeatureStatus,
              },
              {
                label: "Audited Financials (Item 21)",
                a: fs(brandA.item21?.hasAuditedFinancials),
                b: fs(brandB.item21?.hasAuditedFinancials),
              },
              {
                label: "No Going Concern Warning",
                a: brandA.item21 ? fs(!brandA.item21.goingConcernWarning) : "unknown" as FeatureStatus,
                b: brandB.item21 ? fs(!brandB.item21.goingConcernWarning) : "unknown" as FeatureStatus,
              },
              {
                label: "Franchisor Clean Auditor Opinion",
                a: brandA.item21?.auditorOpinion ? fs(brandA.item21.auditorOpinion === "clean") : "unknown" as FeatureStatus,
                b: brandB.item21?.auditorOpinion ? fs(brandB.item21.auditorOpinion === "clean") : "unknown" as FeatureStatus,
              },
              {
                label: "No Mandatory Supplier Lock-in",
                a: brandA.item8 ? fs(!brandA.item8.franchisorReceivesSupplierRevenue && (brandA.item8.alternativeSupplierPossible || brandA.item8.specificationsOnly || false)) : "unknown" as FeatureStatus,
                b: brandB.item8 ? fs(!brandB.item8.franchisorReceivesSupplierRevenue && (brandB.item8.alternativeSupplierPossible || brandB.item8.specificationsOnly || false)) : "unknown" as FeatureStatus,
              },
              {
                label: "Direct Sales (No FSO Brokers)",
                a: brandA.brokerData ? fs(!brandA.brokerData.usesBrokers) : "unknown" as FeatureStatus,
                b: brandB.brokerData ? fs(!brandB.brokerData.usesBrokers) : "unknown" as FeatureStatus,
              },
              {
                label: "National Distribution (25+ States)",
                a: brandA.stateConcentration
                  ? fs(brandA.stateConcentration.coverageType === "national")
                  : (brandA.statesOfOperation >= 25 ? "yes" : brandA.statesOfOperation > 0 ? "no" : "unknown") as FeatureStatus,
                b: brandB.stateConcentration
                  ? fs(brandB.stateConcentration.coverageType === "national")
                  : (brandB.statesOfOperation >= 25 ? "yes" : brandB.statesOfOperation > 0 ? "no" : "unknown") as FeatureStatus,
              },
              {
                label: "No Geographic Concentration Risk",
                a: brandA.stateConcentration ? fs(!brandA.stateConcentration.highlyConcentrated) : "unknown" as FeatureStatus,
                b: brandB.stateConcentration ? fs(!brandB.stateConcentration.highlyConcentrated) : "unknown" as FeatureStatus,
              },
              {
                label: "Exclusive Territory (Item 12)",
                a: brandA.item12?.exclusiveTerritory != null
                  ? fs(brandA.item12.exclusiveTerritory)
                  : "unknown" as FeatureStatus,
                b: brandB.item12?.exclusiveTerritory != null
                  ? fs(brandB.item12.exclusiveTerritory)
                  : "unknown" as FeatureStatus,
              },
              {
                label: "Franchisor Cannot Compete in Territory",
                a: brandA.item12?.franchisorMayCompete != null
                  ? fs(!brandA.item12.franchisorMayCompete)
                  : "unknown" as FeatureStatus,
                b: brandB.item12?.franchisorMayCompete != null
                  ? fs(!brandB.item12.franchisorMayCompete)
                  : "unknown" as FeatureStatus,
              },
              {
                label: "Online Sales Not Reserved by Franchisor",
                a: brandA.item12?.onlineSalesReserved != null
                  ? fs(!brandA.item12.onlineSalesReserved)
                  : "unknown" as FeatureStatus,
                b: brandB.item12?.onlineSalesReserved != null
                  ? fs(!brandB.item12.onlineSalesReserved)
                  : "unknown" as FeatureStatus,
              },
              {
                label: "Experienced Management (Item 2)",
                a: brandA.managementData
                  ? fs((brandA.managementData.managementQualityScore ?? 0) >= 6)
                  : "unknown" as FeatureStatus,
                b: brandB.managementData
                  ? fs((brandB.managementData.managementQualityScore ?? 0) >= 6)
                  : "unknown" as FeatureStatus,
              },
              {
                label: "Franchise-Experienced Leadership",
                a: brandA.managementData
                  ? fs(brandA.managementData.hasFranchiseExp === true)
                  : "unknown" as FeatureStatus,
                b: brandB.managementData
                  ? fs(brandB.managementData.hasFranchiseExp === true)
                  : "unknown" as FeatureStatus,
              },
              {
                label: "Low Supplier Lock-In (Item 8)",
                a: brandA.item8?.lockInScore != null
                  ? fs(brandA.item8.lockInScore <= 4)
                  : "unknown" as FeatureStatus,
                b: brandB.item8?.lockInScore != null
                  ? fs(brandB.item8.lockInScore <= 4)
                  : "unknown" as FeatureStatus,
              },
              {
                label: "No Franchisor Supplier Revenue (Item 8)",
                a: brandA.item8 ? fs(!brandA.item8.franchisorReceivesSupplierRevenue) : "unknown" as FeatureStatus,
                b: brandB.item8 ? fs(!brandB.item8.franchisorReceivesSupplierRevenue) : "unknown" as FeatureStatus,
              },
              {
                label: "No Bankruptcy History (Item 4)",
                a: brandA.item4 ? fs(!brandA.item4.hasBankruptcy) : "unknown" as FeatureStatus,
                b: brandB.item4 ? fs(!brandB.item4.hasBankruptcy) : "unknown" as FeatureStatus,
              },
              {
                label: "Annual Conference",
                a: fs(brandA.item11?.hasAnnualConference),
                b: fs(brandB.item11?.hasAnnualConference),
              },
              {
                label: "Field Support",
                a: fs(brandA.item11?.hasFieldSupport),
                b: fs(brandB.item11?.hasFieldSupport),
              },
              {
                label: "Technology System",
                a: fs(brandA.item11?.hasTechnologySystem),
                b: fs(brandB.item11?.hasTechnologySystem),
              },
              {
                label: "Renewal Option",
                a: fs((brandA.item17?.renewalCount ?? 0) > 0),
                b: fs((brandB.item17?.renewalCount ?? 0) > 0),
              },
            ].map((row) => (
              <tr key={row.label}>
                <td className="py-2.5 px-4 sm:px-6 text-xs font-medium text-muted">{row.label}</td>
                <FeatureCell status={row.a} />
                <FeatureCell status={row.b} />
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Score breakdown bars */}
      <div className="px-6 py-6 sm:px-8 border-t border-border">
        <h3 className="text-xs font-bold text-muted uppercase tracking-wider mb-4">Diligence Score Breakdown (0–100)</h3>
        <div className="space-y-3">
          <ScoreBar label="System Health" scoreA={computeProductionScores(brandA).systemHealth ?? 0} scoreB={computeProductionScores(brandB).systemHealth ?? 0} nameA={brandA.name} nameB={brandB.name} />
          <ScoreBar label="Franchisor Strength" scoreA={computeProductionScores(brandA).franchisorStrength ?? 0} scoreB={computeProductionScores(brandB).franchisorStrength ?? 0} nameA={brandA.name} nameB={brandB.name} />
          <ScoreBar label="Contract Burden" scoreA={computeProductionScores(brandA).contractBurden ?? 0} scoreB={computeProductionScores(brandB).contractBurden ?? 0} nameA={brandA.name} nameB={brandB.name} />
          <ScoreBar label="Economics" scoreA={computeProductionScores(brandA).economics ?? 0} scoreB={computeProductionScores(brandB).economics ?? 0} nameA={brandA.name} nameB={brandB.name} />
          <ScoreBar label="Confidence" scoreA={computeProductionScores(brandA).confidence} scoreB={computeProductionScores(brandB).confidence} nameA={brandA.name} nameB={brandB.name} />
        </div>
      </div>

      {/* Links */}
      <div className="px-6 pb-6 sm:px-8 flex flex-col sm:flex-row items-center gap-3">
        <Link
          href={`/brands/${brandA.slug}`}
          className="text-sm font-semibold text-accent hover:underline"
        >
          View {brandA.name} Profile &rarr;
        </Link>
        <span className="hidden sm:inline text-border">|</span>
        <Link
          href={`/brands/${brandB.slug}`}
          className="text-sm font-semibold text-accent hover:underline"
        >
          View {brandB.name} Profile &rarr;
        </Link>
      </div>
    </div>
  );
}

/* ── Page ── */
export default async function ComparePage({
  searchParams,
}: {
  searchParams: Promise<{ brandA?: string; brandB?: string }>;
}) {
  const params = await searchParams;
  const slugA = params.brandA ?? "";
  const slugB = params.brandB ?? "";

  const activeBrandA = slugA ? getBrandBySlug(slugA) : null;
  const activeBrandB = slugB ? getBrandBySlug(slugB) : null;
  const hasCustomComparison = !!(activeBrandA && activeBrandB);

  // Build sorted brand list for selectors
  const brandOptions = [...brands]
    .map((b) => ({ slug: b.slug, name: b.name }))
    .sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div className="min-h-screen">
      {/* ── Hero ── */}
      <section className="hero-mesh border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent-light text-accent text-xs font-semibold mb-6">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
            </svg>
            FDD-Backed Comparisons
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-foreground">
            Compare Franchise Brands
          </h1>
          <p className="mt-4 text-lg text-muted max-w-2xl mx-auto leading-relaxed">
            Side-by-side comparisons of investment costs, revenue potential, unit growth, and franchisee
            satisfaction — all sourced from actual Franchise Disclosure Documents.
          </p>
        </div>
      </section>

      {/* ── Full comparison view (when both brands selected) ── */}
      {hasCustomComparison ? (
        <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex items-center justify-between mb-6">
            <Link href="/compare" className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-accent transition-colors">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
              Back to Compare
            </Link>
            <BrandSelector
              brands={brandOptions}
              initialA={slugA}
              initialB={slugB}
            />
          </div>
          <DynamicComparison brandA={activeBrandA} brandB={activeBrandB} />
        </section>
      ) : (
        <>
          {/* ── Build Your Own Comparison ── */}
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-4">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-foreground">Build Your Own Comparison</h2>
              <p className="mt-2 text-sm text-muted">
                Select any two franchise brands for an instant side-by-side analysis.
              </p>
            </div>
            <BrandSelector
              brands={brandOptions}
              initialA={slugA}
              initialB={slugB}
            />
          </section>

      {/* ── Invalid slug warning ── */}
          {(slugA || slugB) && (
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
              <div className="rounded-xl bg-warning-light border border-warning/20 px-6 py-4 text-sm text-foreground">
                {!activeBrandA && slugA && (
                  <p>Could not find brand &ldquo;{slugA}&rdquo;. Please select a valid brand from the dropdowns above.</p>
                )}
                {!activeBrandB && slugB && (
                  <p>Could not find brand &ldquo;{slugB}&rdquo;. Please select a valid brand from the dropdowns above.</p>
                )}
              </div>
            </section>
          )}

          {/* ── Pre-built comparisons ── */}
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="mb-10">
            <h2 className="text-2xl font-bold text-foreground">Featured Comparisons</h2>
            <p className="mt-2 text-sm text-muted">Data-driven head-to-head analysis of popular franchise brands.</p>
          </div>

          <div className="space-y-12">
            {comparisons.map((comp, idx) => {
              const brandA = getBrandBySlug(comp.slugA);
              const brandB = getBrandBySlug(comp.slugB);
              if (!brandA || !brandB) return null;

              const scoreA = (computeProductionScores(brandA).coreDiligence ?? 0);
              const scoreB = (computeProductionScores(brandB).coreDiligence ?? 0);

              return (
                <div
                  key={idx}
                  className="border border-border rounded-2xl bg-background overflow-hidden hover-glow"
                >
                  {/* Header */}
                  <div className="bg-surface-alt border-b border-border px-6 py-5 sm:px-8">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                      <div className="flex items-center gap-3 text-center sm:text-left">
                        <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center text-accent font-bold text-sm">
                          {brandA.name.charAt(0)}
                        </div>
                        <div>
                          <Link href={`/brands/${brandA.slug}`} className="text-lg font-bold text-foreground hover:text-accent transition-colors">
                            {brandA.name}
                          </Link>
                          <p className="text-xs text-muted">{categoryLabels[brandA.category]}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="text-2xl font-black text-accent">{scoreA}</span>
                        <div className="px-3 py-1 rounded-full bg-surface border border-border text-xs font-bold text-muted uppercase tracking-wider">
                          vs
                        </div>
                        <span className="text-2xl font-black text-cyan">{scoreB}</span>
                      </div>

                      <div className="flex items-center gap-3 text-center sm:text-right">
                        <div>
                          <Link href={`/brands/${brandB.slug}`} className="text-lg font-bold text-foreground hover:text-accent transition-colors">
                            {brandB.name}
                          </Link>
                          <p className="text-xs text-muted">{categoryLabels[brandB.category]}</p>
                        </div>
                        <div className="w-10 h-10 rounded-xl bg-cyan/10 flex items-center justify-center text-cyan font-bold text-sm">
                          {brandB.name.charAt(0)}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Body */}
                  <div className="px-6 py-6 sm:px-8">
                    {/* Key metrics */}
                    <div className="mb-6">
                      <MetricRow
                        label="Investment"
                        valueA={formatInvestmentRange(brandA.totalInvestmentLow, brandA.totalInvestmentHigh)}
                        valueB={formatInvestmentRange(brandB.totalInvestmentLow, brandB.totalInvestmentHigh)}
                      />
                      <MetricRow
                        label="Avg Revenue"
                        valueA={brandA.item19?.grossRevenueAvg ? formatCurrency(brandA.item19.grossRevenueAvg) : "Not disclosed"}
                        valueB={brandB.item19?.grossRevenueAvg ? formatCurrency(brandB.item19.grossRevenueAvg) : "Not disclosed"}
                      />
                      <MetricRow
                        label="Total Units"
                        valueA={brandA.totalUnits.toLocaleString()}
                        valueB={brandB.totalUnits.toLocaleString()}
                      />
                      <MetricRow
                        label="Royalty"
                        valueA={brandA.royaltyRate}
                        valueB={brandB.royaltyRate}
                      />
                    </div>

                    {/* Score comparison bars */}
                    <div className="space-y-3 mb-6">
                      <h3 className="text-xs font-bold text-muted uppercase tracking-wider mb-3">Score Breakdown</h3>
                      <ScoreBar label="System Health" scoreA={computeProductionScores(brandA).systemHealth ?? 0} scoreB={computeProductionScores(brandB).systemHealth ?? 0} nameA={brandA.name} nameB={brandB.name} />
                      <ScoreBar label="Franchisor Strength" scoreA={computeProductionScores(brandA).franchisorStrength ?? 0} scoreB={computeProductionScores(brandB).franchisorStrength ?? 0} nameA={brandA.name} nameB={brandB.name} />
                      <ScoreBar label="Contract Burden" scoreA={computeProductionScores(brandA).contractBurden ?? 0} scoreB={computeProductionScores(brandB).contractBurden ?? 0} nameA={brandA.name} nameB={brandB.name} />
                      <ScoreBar label="Economics" scoreA={computeProductionScores(brandA).economics ?? 0} scoreB={computeProductionScores(brandB).economics ?? 0} nameA={brandA.name} nameB={brandB.name} />
                      <ScoreBar label="Confidence" scoreA={computeProductionScores(brandA).confidence} scoreB={computeProductionScores(brandB).confidence} nameA={brandA.name} nameB={brandB.name} />
                    </div>

                    {/* Verdict */}
                    <div className="bg-surface rounded-xl p-4 border border-border/50">
                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full bg-accent/10 flex items-center justify-center shrink-0 mt-0.5">
                          <svg className="w-3.5 h-3.5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <div>
                          <p className="text-xs font-bold text-muted uppercase tracking-wider mb-1">Verdict</p>
                          <p className="text-sm text-foreground leading-relaxed">{comp.verdict}</p>
                        </div>
                      </div>
                    </div>

                    {/* Highlights */}
                    {comp.highlights.length > 0 && (
                      <div className="mt-4 flex flex-wrap gap-2">
                        {comp.highlights.map((h, i) => (
                          <span key={i} className="inline-flex items-center px-2.5 py-1 rounded-md bg-surface text-xs text-muted border border-border/50">
                            {h}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Links */}
                    <div className="mt-5 flex flex-col sm:flex-row items-center gap-3">
                      <Link
                        href={`/compare?brandA=${comp.slugA}&brandB=${comp.slugB}`}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-accent text-white text-sm font-semibold hover:brightness-110 transition-all"
                      >
                        Full Side-by-Side Comparison
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
                      </Link>
                      <Link href={`/brands/${brandA.slug}`} className="text-sm text-muted hover:text-accent transition-colors">
                        {brandA.name} Profile
                      </Link>
                      <span className="hidden sm:inline text-border/50">|</span>
                      <Link href={`/brands/${brandB.slug}`} className="text-sm text-muted hover:text-accent transition-colors">
                        {brandB.name} Profile
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        </>
      )}

      {/* ── CTA ── */}
      <section className="border-t border-border">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h2 className="text-2xl font-bold text-foreground">Want a Custom Comparison?</h2>
          <p className="mt-3 text-muted leading-relaxed">
            Need a detailed side-by-side analysis of two specific franchise brands not shown here?
            Our research team can prepare a custom comparison report based on the latest FDD filings.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="mailto:research@franchisel.com?subject=Custom%20Comparison%20Request"
              className="inline-flex items-center gap-2 px-6 py-3 bg-accent text-white text-sm font-semibold rounded-xl hover:brightness-110 transition-all"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
              </svg>
              Contact Us
            </a>
            <Link
              href="/reports"
              className="inline-flex items-center gap-2 px-6 py-3 border border-border text-sm font-semibold text-foreground rounded-xl hover:bg-surface transition-all"
            >
              View Reports
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
