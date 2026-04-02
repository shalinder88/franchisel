import { notFound } from "next/navigation";
import Link from "next/link";
import { getBrandBySlug } from "@/data/brands";
import {
  generateMemo,
  computeDownsideEconomics,
  getItem19ComparabilityFlags,
  generateInterviewQuestions,
  computeCompositeScores,
  computeManagementSignal,
  computeTerritoryRisk,
  computeSupplierRisk,
  type DiligenceFlag,
  type YoYDiff,
  type EconomicsScenario,
  type Item19ComparabilityFlag,
  type InterviewQuestion,
} from "@/lib/diligence";
import { formatInvestmentRange, formatCurrency } from "@/lib/types";
import PrintButton from "./PrintButton";
import WatchButton from "@/components/WatchButton";
import type { Metadata } from "next";

export const dynamic = 'force-dynamic';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const brand = getBrandBySlug(slug);
  if (!brand) return {};
  return {
    title: `${brand.name} — Diligence Memo`,
    description: `FDD-based first-pass diligence memo for ${brand.name}. Item 19 analysis, unit trend, red flags, and contract terms — all cited to the filed FDD.`,
    robots: { index: false }, // memo pages are gated content
  };
}

// ── Components ─────────────────────────────────────────────────────────────

function SeverityBadge({ severity }: { severity: DiligenceFlag["severity"] }) {
  if (severity === "critical") {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-danger-light text-danger text-xs font-bold">
        ⚠ Critical
      </span>
    );
  }
  if (severity === "warning") {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-warning-light text-warning text-xs font-bold">
        △ Warning
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-success-light text-success text-xs font-bold">
      ✓ Positive
    </span>
  );
}

function SectionHeader({ label, citation }: { label: string; citation?: string }) {
  return (
    <div className="flex items-baseline justify-between mb-3">
      <h2 className="text-xs font-bold text-muted uppercase tracking-widest">{label}</h2>
      {citation && (
        <span className="text-[10px] text-muted/60 font-mono">{citation}</span>
      )}
    </div>
  );
}

function TrendPill({ trend }: { trend: string }) {
  const map: Record<string, { label: string; cls: string }> = {
    growing:     { label: "↑ Growing",     cls: "bg-success-light text-success" },
    stable:      { label: "→ Stable",      cls: "bg-surface text-muted" },
    contracting: { label: "↓ Contracting", cls: "bg-danger-light text-danger" },
    unknown:     { label: "? Unknown",     cls: "bg-surface text-muted" },
  };
  const { label, cls } = map[trend] ?? map.unknown;
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${cls}`}>
      {label}
    </span>
  );
}

function DirectionPill({ direction }: { direction: "up" | "down" | "flat" | "growing" | "shrinking" }) {
  if (direction === "up" || direction === "growing") {
    return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-success-light text-success">↑ Up</span>;
  }
  if (direction === "down" || direction === "shrinking") {
    return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-danger-light text-danger">↓ Down</span>;
  }
  return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-surface text-muted">→ Flat</span>;
}

function SampleBadge({ quality }: { quality: string }) {
  const map: Record<string, { label: string; cls: string }> = {
    strong:  { label: "Sample: Strong",  cls: "bg-success-light text-success" },
    partial: { label: "Sample: Partial", cls: "bg-warning-light text-warning" },
    weak:    { label: "Sample: Weak",    cls: "bg-danger-light text-danger" },
    none:    { label: "Not Disclosed",   cls: "bg-surface text-muted" },
  };
  const { label, cls } = map[quality] ?? map.none;
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${cls}`}>
      {label}
    </span>
  );
}

// ── Page ───────────────────────────────────────────────────────────────────

export default async function DiligencePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const brand = getBrandBySlug(slug);
  if (!brand) notFound();

  const memo = generateMemo(brand);
  const downsideEcon = computeDownsideEconomics(brand);
  const item19Flags = getItem19ComparabilityFlags(brand);
  const interviewQs = generateInterviewQuestions(brand);
  const compositeScores = computeCompositeScores(brand);
  const mgmtSignal = computeManagementSignal(brand);
  const territoryRisk = computeTerritoryRisk(brand);
  const supplierRisk = computeSupplierRisk(brand);
  const criticalCount = memo.autoFlags.filter((f) => f.severity === "critical").length;
  const warningCount = memo.autoFlags.filter((f) => f.severity === "warning").length;

  return (
    <div className="min-h-screen bg-background">
      {/* ── Print header (visible only on print) ── */}
      <div className="hidden print:block px-8 pt-8 pb-4 border-b border-border">
        <p className="text-xs text-muted">Franchisel.com — FDD Diligence Memo</p>
        <h1 className="text-2xl font-bold mt-1">{brand.name}</h1>
        <p className="text-xs text-muted mt-1">
          Generated {memo.generatedDate} · {memo.fddYear} FDD ·{" "}
          {memo.dataSource === "state_filing" ? "Government-filed source" : "Verified source"}
        </p>
      </div>

      {/* ── Screen header ── */}
      <header className="print:hidden border-b border-border bg-surface-alt">
        <div className="max-w-4xl mx-auto px-6 py-5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <Link href={`/brands/${brand.slug}`} className="text-muted hover:text-accent transition-colors shrink-0">
              ← Back
            </Link>
            <div className="w-px h-4 bg-border shrink-0" />
            <div className="min-w-0">
              <h1 className="text-base font-bold text-foreground truncate">{brand.name}</h1>
              <p className="text-xs text-muted">{memo.fddYear} FDD Diligence Memo</p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {criticalCount > 0 && (
              <span className="px-2.5 py-1 rounded-full bg-danger-light text-danger text-xs font-bold">
                {criticalCount} Critical
              </span>
            )}
            {warningCount > 0 && (
              <span className="px-2.5 py-1 rounded-full bg-warning-light text-warning text-xs font-bold">
                {warningCount} Warnings
              </span>
            )}
            <WatchButton
              slug={brand.slug}
              name={brand.name}
              snapshotScore={memo.overallScore}
              snapshotRevenue={brand.item19?.grossRevenueAvg}
              variant="icon"
              className="print:hidden"
            />
            <PrintButton />
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-8 print:px-0 print:py-0 space-y-6">

        {/* ── Score + source strip ── */}
        <div className="flex flex-wrap items-center gap-3 p-4 rounded-xl bg-surface border border-border">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-black text-accent">{memo.overallScore}</span>
            <span className="text-sm text-muted">/ 10</span>
          </div>
          <div className="w-px h-6 bg-border" />
          <p className="text-sm text-muted flex-1">{memo.scoreRationale}</p>
          <div className="shrink-0">
            <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
              memo.dataSource === "state_filing" ? "bg-success-light text-success" : "bg-surface text-muted border border-border"
            }`}>
              {memo.dataSource === "state_filing" ? "Gov FDD ✓" : "Verified"}
            </span>
          </div>

          {/* Composite score badges */}
          {Object.entries(compositeScores).some(([, v]) => v !== null) && (
            <div className="w-full pt-3 border-t border-border/50 grid grid-cols-3 sm:grid-cols-6 gap-2">
              {([
                ["systemHealth", "Sys Health"],
                ["franchisorStrength", "Fin Strength"],
                ["economicBurden", "Econ Burden"],
                ["supportVsTake", "Support"],
                ["contractFriction", "Contract"],
                ["changeScore", "Change"],
              ] as [keyof typeof compositeScores, string][]).map(([key, label]) => {
                const val = compositeScores[key];
                if (val === null || val === undefined) return null;
                const normalized = key === "changeScore" ? (val + 10) / 2 : val;
                return (
                  <div key={key} className="text-center">
                    <p className="text-[9px] text-muted uppercase tracking-wider mb-0.5">{label}</p>
                    <p className={`text-base font-bold ${normalized >= 7 ? "text-success" : normalized <= 3 ? "text-danger" : "text-foreground"}`}>
                      {key === "changeScore" && val > 0 ? "+" : ""}{val}
                    </p>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* ── Flags ── */}
        <section>
          <SectionHeader label="Red Flags & Key Signals" />
          <div className="space-y-2">
            {memo.autoFlags.map((flag, i) => (
              <div
                key={i}
                className={`flex gap-3 p-3.5 rounded-lg border ${
                  flag.severity === "critical"
                    ? "bg-danger-light/30 border-danger/20"
                    : flag.severity === "warning"
                    ? "bg-warning-light/30 border-warning/20"
                    : "bg-success-light/30 border-success/20"
                }`}
              >
                <div className="shrink-0 pt-0.5">
                  <SeverityBadge severity={flag.severity} />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-semibold text-foreground">{flag.title}</span>
                    <span className="text-[10px] font-mono text-muted/70">{flag.item}</span>
                  </div>
                  <p className="text-xs text-muted mt-0.5 leading-relaxed">{flag.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Investment ── */}
        <section className="rounded-xl border border-border bg-background p-5">
          <SectionHeader label="Investment Overview" citation="Items 5, 6, 7" />
          <p className="text-sm text-foreground leading-relaxed mb-3">{memo.investmentSummary}</p>
          {memo.investmentBreakeven && (
            <p className="text-xs text-muted leading-relaxed border-t border-border/50 pt-3 mt-3">
              <span className="font-semibold text-foreground">Payback estimate: </span>
              {memo.investmentBreakeven}
            </p>
          )}
        </section>

        {/* ── Item 19 ── */}
        <section className="rounded-xl border border-border bg-background p-5">
          <SectionHeader label="Item 19 — Revenue" citation={memo.item19Analysis.citations[0]} />
          <div className="flex items-start gap-3 mb-3">
            <p className="text-sm font-semibold text-foreground flex-1 leading-snug">
              {memo.item19Analysis.headline}
            </p>
            <SampleBadge quality={memo.item19Analysis.sampleQuality} />
          </div>
          <p className="text-sm text-muted leading-relaxed">{memo.item19Analysis.detail}</p>
          {memo.item19Analysis.impliedRoiYears !== null && (
            <div className="mt-4 flex items-center gap-4 pt-3 border-t border-border/50">
              <div>
                <p className="text-[10px] text-muted uppercase tracking-wider">Est. Payback</p>
                <p className="text-lg font-bold text-foreground">{memo.item19Analysis.impliedRoiYears}yr</p>
              </div>
              <p className="text-xs text-muted/70">At 15% net margin — editorial estimate only</p>
            </div>
          )}
        </section>

        {/* ── Item 20 ── */}
        <section className="rounded-xl border border-border bg-background p-5">
          <SectionHeader label="Item 20 — System Health" citation={memo.item20Analysis.citations[0]} />
          <div className="flex items-start gap-3 mb-3">
            <p className="text-sm font-semibold text-foreground flex-1 leading-snug">
              {memo.item20Analysis.headline}
            </p>
            <TrendPill trend={memo.item20Analysis.trend} />
          </div>
          <p className="text-sm text-muted leading-relaxed">{memo.item20Analysis.detail}</p>

          {/* Mini unit stats */}
          <div className="mt-4 grid grid-cols-3 gap-3 pt-3 border-t border-border/50">
            <div>
              <p className="text-[10px] text-muted uppercase tracking-wider">Total Units</p>
              <p className="text-base font-bold text-foreground">{brand.totalUnits.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-[10px] text-muted uppercase tracking-wider">Net Growth</p>
              <p className={`text-base font-bold ${brand.unitEconomics.netGrowth >= 0 ? "text-success" : "text-danger"}`}>
                {brand.unitEconomics.netGrowth >= 0 ? "+" : ""}{brand.unitEconomics.netGrowth}
              </p>
            </div>
            <div>
              <p className="text-[10px] text-muted uppercase tracking-wider">Turnover</p>
              <p className={`text-base font-bold ${brand.unitEconomics.turnoverRate >= 15 ? "text-danger" : brand.unitEconomics.turnoverRate >= 8 ? "text-warning" : "text-foreground"}`}>
                {brand.unitEconomics.turnoverRate}%
              </p>
            </div>
          </div>
        </section>

        {/* ── Year-over-Year Diff ── */}
        {(memo.yoyDiff.unitTrajectory || memo.yoyDiff.hasPriorData) && (
          <section className="rounded-xl border border-border bg-background p-5">
            <SectionHeader
              label="Year-over-Year Trends"
              citation={memo.yoyDiff.hasPriorData ? `${memo.yoyDiff.revenueChange!.priorYear} → ${memo.fddYear} FDD` : `${memo.fddYear} FDD`}
            />

            {/* Revenue YoY — only when prior year data exists */}
            {memo.yoyDiff.revenueChange && (
              <div className="mb-4">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-semibold text-foreground">Avg Revenue</span>
                  <DirectionPill direction={memo.yoyDiff.revenueChange.direction} />
                  <span className={`text-xs font-bold ${
                    memo.yoyDiff.revenueChange.changePct > 0 ? "text-success" : memo.yoyDiff.revenueChange.changePct < 0 ? "text-danger" : "text-muted"
                  }`}>
                    {memo.yoyDiff.revenueChange.changePct > 0 ? "+" : ""}{memo.yoyDiff.revenueChange.changePct}%
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-lg bg-surface p-3">
                    <p className="text-[10px] text-muted uppercase tracking-wider mb-1">{memo.yoyDiff.revenueChange.priorYear} FDD</p>
                    <p className="text-base font-bold text-muted">{formatCurrency(memo.yoyDiff.revenueChange.priorAvg)}</p>
                  </div>
                  <div className="rounded-lg bg-surface p-3 ring-1 ring-accent/20">
                    <p className="text-[10px] text-muted uppercase tracking-wider mb-1">{memo.fddYear} FDD (Current)</p>
                    <p className="text-base font-bold text-foreground">{formatCurrency(memo.yoyDiff.revenueChange.currentAvg)}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Unit trajectory */}
            {memo.yoyDiff.unitTrajectory && (
              <div className={memo.yoyDiff.hasPriorData ? "pt-3 border-t border-border/50" : ""}>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-semibold text-foreground">Unit Count</span>
                  <DirectionPill direction={memo.yoyDiff.unitTrajectory.direction} />
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div className="text-center">
                    <p className="text-[10px] text-muted uppercase tracking-wider">Opened</p>
                    <p className="text-base font-bold text-success">+{memo.yoyDiff.unitTrajectory.opened}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-[10px] text-muted uppercase tracking-wider">Closed</p>
                    <p className={`text-base font-bold ${memo.yoyDiff.unitTrajectory.closed > 0 ? "text-danger" : "text-muted"}`}>
                      -{memo.yoyDiff.unitTrajectory.closed}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-[10px] text-muted uppercase tracking-wider">Net</p>
                    <p className={`text-base font-bold ${memo.yoyDiff.unitTrajectory.net >= 0 ? "text-success" : "text-danger"}`}>
                      {memo.yoyDiff.unitTrajectory.net >= 0 ? "+" : ""}{memo.yoyDiff.unitTrajectory.net}
                    </p>
                  </div>
                </div>
                {memo.yoyDiff.unitTrajectory.turnoverRate > 0 && (
                  <p className="text-xs text-muted mt-2">
                    Turnover rate: <span className={`font-semibold ${
                      memo.yoyDiff.unitTrajectory.turnoverRate >= 15 ? "text-danger" :
                      memo.yoyDiff.unitTrajectory.turnoverRate >= 8 ? "text-warning" : "text-foreground"
                    }`}>{memo.yoyDiff.unitTrajectory.turnoverRate}%</span>
                    {memo.yoyDiff.unitTrajectory.turnoverRate >= 15 ? " — high (industry avg 5–10%)" :
                     memo.yoyDiff.unitTrajectory.turnoverRate >= 8 ? " — above avg (industry avg 5–10%)" : ""}
                  </p>
                )}
              </div>
            )}

            {!memo.yoyDiff.hasPriorData && (
              <p className="text-xs text-muted mt-2 pt-2 border-t border-border/50">
                Prior-year Item 19 revenue data not available. Unit data above covers the reporting period in the {memo.fddYear} FDD.
              </p>
            )}
          </section>
        )}

        {/* ── Contract terms ── */}
        <section className="rounded-xl border border-border bg-background p-5">
          <SectionHeader label="Key Contract Terms" citation="Item 17" />
          <div className="divide-y divide-border/50">
            {memo.contractHighlights.map((row) => (
              <div key={row.label} className="flex items-center justify-between py-2.5">
                <span className="text-xs text-muted font-medium">{row.label}</span>
                <span className={`text-sm font-semibold ${row.flag ? "text-warning" : "text-foreground"}`}>
                  {row.flag && <span className="mr-1">△</span>}
                  {row.value}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* ── Item 19 Comparability Flags ── */}
        {(brand.dataSource === "fdd_verified" || brand.dataSource === "state_filing") && (
        <section className="rounded-xl border border-border bg-background p-5">
          <SectionHeader label="Item 19 Data Quality Flags" citation="Item 19" />
          <div className="space-y-2">
            {item19Flags.map((flag: Item19ComparabilityFlag, i: number) => (
              <div key={i} className={`flex items-start gap-2.5 px-3 py-2.5 rounded-lg ${
                flag.severity === "warning" ? "bg-warning/8 border border-warning/20" :
                flag.severity === "ok" ? "bg-success/5 border border-success/15" :
                "bg-surface border border-border/50"
              }`}>
                <span className={`text-xs font-bold mt-0.5 ${
                  flag.severity === "warning" ? "text-warning" :
                  flag.severity === "ok" ? "text-success" : "text-muted"
                }`}>{flag.severity === "warning" ? "⚠" : flag.severity === "ok" ? "✓" : "ℹ"}</span>
                <div>
                  <p className={`text-xs font-semibold ${flag.severity === "warning" ? "text-warning" : flag.severity === "ok" ? "text-success" : "text-foreground"}`}>{flag.label}</p>
                  <p className="text-[11px] text-muted mt-0.5 leading-relaxed">{flag.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
        )}

        {/* Scenario Economics removed — core product shows FDD-reported economics only.
           Illustrative models create implied earnings claims per FTC guidance. */}

        {/* ── Franchisee Interview Questions ── */}
        {interviewQs.length > 0 && (
        <section className="rounded-xl border border-border bg-background p-5">
          <SectionHeader label="Franchisee Interview Questions" citation="Item 20 contacts" />
          <p className="text-[11px] text-muted mb-3">Use Item 20 to get current franchisee contact info. Call at least 3-5. Ask these questions:</p>
          <div className="space-y-2.5">
            {interviewQs.filter((q: InterviewQuestion) => q.priority !== "standard").slice(0, 6).map((q: InterviewQuestion, i: number) => (
              <div key={i} className={`rounded-lg p-3 border ${
                q.priority === "critical" ? "border-danger/25 bg-danger/5" : "border-warning/20 bg-warning/5"
              }`}>
                <div className="flex items-center gap-1.5 mb-1">
                  <span className={`text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full ${
                    q.priority === "critical" ? "bg-danger/15 text-danger" : "bg-warning/15 text-warning"
                  }`}>{q.priority}</span>
                  <span className="text-[10px] text-muted">{q.sourcedFrom}</span>
                </div>
                <p className="text-xs font-medium text-foreground leading-relaxed">{q.question}</p>
                <p className="text-[10px] text-muted mt-1"><span className="font-semibold">Look for: </span>{q.lookFor}</p>
              </div>
            ))}
            {interviewQs.filter((q: InterviewQuestion) => q.priority === "standard").slice(0, 2).map((q: InterviewQuestion, i: number) => (
              <div key={i} className="rounded-lg p-3 border border-border bg-surface">
                <p className="text-xs font-medium text-foreground leading-relaxed">{q.question}</p>
                <p className="text-[10px] text-muted mt-1"><span className="font-semibold">Look for: </span>{q.lookFor}</p>
              </div>
            ))}
          </div>
        </section>
        )}

        {/* ── Management Quality (Item 2) ── */}
        {brand.managementData && mgmtSignal.level !== "unknown" && (
        <section className={`rounded-xl border p-5 ${
          mgmtSignal.level === "strong" ? "border-success/25 bg-success/5" :
          mgmtSignal.level === "weak"   ? "border-warning/25 bg-warning/5" :
          "border-border bg-surface"
        }`}>
          <h2 className="text-sm font-bold text-foreground mb-2">
            Management Team — Item 2 (Business Experience)
          </h2>
          <div className="flex items-center gap-3 mb-2">
            <span className={`text-2xl font-black tabular-nums ${
              mgmtSignal.level === "strong" ? "text-success" :
              mgmtSignal.level === "weak"   ? "text-warning" : "text-foreground"
            }`}>{mgmtSignal.score ?? "—"}<span className="text-sm font-normal text-muted">/10</span></span>
            <span className={`text-xs font-semibold ${
              mgmtSignal.level === "strong" ? "text-success" :
              mgmtSignal.level === "weak"   ? "text-warning" : "text-foreground"
            }`}>{mgmtSignal.label}</span>
          </div>
          <p className="text-xs text-muted leading-relaxed mb-2">{mgmtSignal.rationale}</p>
          <div className="flex flex-wrap gap-2 text-[10px]">
            {brand.managementData.execCount != null && (
              <span className="px-2 py-0.5 rounded-full bg-background border border-border text-muted">
                {brand.managementData.execCount} senior exec{brand.managementData.execCount !== 1 ? "s" : ""}
              </span>
            )}
            {brand.managementData.hasFranchiseExp && (
              <span className="px-2 py-0.5 rounded-full bg-success/10 border border-success/20 text-success">franchise exp.</span>
            )}
            {brand.managementData.hasStableLeadership && (
              <span className="px-2 py-0.5 rounded-full bg-success/10 border border-success/20 text-success">stable leadership</span>
            )}
            {brand.managementData.hasLeadershipChanges && (
              <span className="px-2 py-0.5 rounded-full bg-warning/10 border border-warning/20 text-warning">recent changes</span>
            )}
          </div>
          <p className="text-[10px] text-muted mt-2">Item 2 · {brand.fddYear} FDD · confidence: {brand.managementData.extractionConfidence ?? "medium"}</p>
        </section>
        )}

        {/* ── Territory Risk (Item 12) ── */}
        {brand.item12 && territoryRisk.level !== "unknown" && (
        <section className={`rounded-xl border p-5 ${
          territoryRisk.level === "low"      ? "border-success/25 bg-success/5" :
          territoryRisk.level === "critical" ? "border-danger/25 bg-danger/5" :
          territoryRisk.level === "high"     ? "border-warning/25 bg-warning/5" :
          "border-border bg-surface"
        }`}>
          <h2 className="text-sm font-bold text-foreground mb-2">Territory — Item 12</h2>
          <div className="flex items-center gap-3 mb-2">
            <span className={`text-2xl font-black tabular-nums ${
              territoryRisk.level === "low"      ? "text-success" :
              territoryRisk.level === "critical" ? "text-danger" :
              territoryRisk.level === "high"     ? "text-warning" : "text-foreground"
            }`}>{territoryRisk.score ?? "—"}<span className="text-sm font-normal text-muted">/10</span></span>
            <span className={`text-xs font-semibold ${
              territoryRisk.level === "low"      ? "text-success" :
              territoryRisk.level === "critical" ? "text-danger" :
              territoryRisk.level === "high"     ? "text-warning" : "text-foreground"
            }`}>{territoryRisk.label}</span>
          </div>
          <p className="text-xs text-muted leading-relaxed mb-2">{territoryRisk.rationale}</p>
          <div className="flex flex-wrap gap-2 text-[10px]">
            {brand.item12.exclusiveTerritory != null && (
              <span className={`px-2 py-0.5 rounded-full border ${brand.item12.exclusiveTerritory ? "bg-success/10 border-success/20 text-success" : "bg-danger/10 border-danger/20 text-danger"}`}>
                {brand.item12.exclusiveTerritory ? "✓ Exclusive territory" : "✗ No exclusive territory"}
              </span>
            )}
            {brand.item12.franchisorMayCompete && (
              <span className="px-2 py-0.5 rounded-full bg-warning/10 border border-warning/20 text-warning">Franchisor may compete</span>
            )}
            {brand.item12.onlineSalesReserved && (
              <span className="px-2 py-0.5 rounded-full bg-warning/10 border border-warning/20 text-warning">Online sales reserved</span>
            )}
            {brand.item12.territoryType && brand.item12.territoryType !== "none" && (
              <span className="px-2 py-0.5 rounded-full bg-background border border-border text-muted capitalize">{brand.item12.territoryType} territory</span>
            )}
          </div>
          <p className="text-[10px] text-muted mt-2">Item 12 · {brand.fddYear} FDD</p>
        </section>
        )}

        {/* ── Supplier Dependence (Item 8) ── */}
        {brand.item8 && supplierRisk.level !== "unknown" && (
        <section className={`rounded-xl border p-5 ${
          supplierRisk.level === "low"      ? "border-success/30 bg-success/3" :
          supplierRisk.level === "critical" ? "border-danger/30 bg-danger/5" :
          supplierRisk.level === "high"     ? "border-warning/30 bg-warning/5" :
          "border-border bg-background"
        }`}>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-bold text-foreground">
              Supplier Dependence — Item 8
            </h2>
            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${
              supplierRisk.level === "low"      ? "bg-success/10 text-success border-success/20" :
              supplierRisk.level === "critical" ? "bg-danger/10 text-danger border-danger/20" :
              supplierRisk.level === "high"     ? "bg-warning/10 text-warning border-warning/20" :
              "bg-accent/10 text-accent border-accent/20"
            }`}>{supplierRisk.label} · {supplierRisk.score}/10</span>
          </div>
          <p className="text-sm text-muted mb-3">{supplierRisk.rationale}</p>
          <div className="flex flex-wrap gap-1.5">
            {brand.item8.hasRequiredPurchases && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-warning/10 text-warning border border-warning/20">Required purchases</span>
            )}
            {brand.item8.approvedSupplierList && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-warning/10 text-warning border border-warning/20">Approved supplier list</span>
            )}
            {brand.item8.franchisorReceivesSupplierRevenue && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-danger/10 text-danger border border-danger/20">⚠ Franchisor supplier revenue</span>
            )}
            {brand.item8.specificationsOnly && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-success/10 text-success border border-success/20">Spec-based sourcing</span>
            )}
            {brand.item8.alternativeSupplierPossible && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-success/10 text-success border border-success/20">Alt suppliers allowed</span>
            )}
            {(brand.item8.mandatoryCategories ?? []).map((c) => (
              <span key={c} className="text-xs px-2 py-0.5 rounded-full bg-surface border border-border text-muted">
                {c.replace(/_/g, " ")}
              </span>
            ))}
          </div>
          <p className="text-[10px] text-muted mt-2">Item 8 · {brand.fddYear} FDD</p>
        </section>
        )}

        {/* ── Broker / FSO Conflict of Interest ── */}
        {brand.brokerData?.usesBrokers && (
        <section className="rounded-xl border border-warning/30 bg-warning/5 p-5">
          <h2 className="text-sm font-bold text-warning mb-2">⚑ Broker Conflict-of-Interest Alert</h2>
          <p className="text-xs text-muted leading-relaxed mb-2">
            This FDD discloses that franchises may be sold through franchise brokers or Franchise
            Sales Organizations (FSOs).{" "}
            {brand.brokerData.paysReferralFee && (
              <span className="font-medium text-warning">
                The franchisor pays referral fees to brokers who bring buyers — this is a conflict
                of interest. The broker is financially incentivized to recommend this brand
                regardless of your specific situation.
              </span>
            )}
          </p>
          {brand.brokerData.brokerNetworks && brand.brokerData.brokerNetworks.length > 0 && (
            <p className="text-xs text-muted">
              <span className="font-semibold text-foreground">Named networks: </span>
              {brand.brokerData.brokerNetworks.join(", ")}
            </p>
          )}
          {brand.brokerData.feeDisclosureNote && (
            <p className="text-xs text-muted mt-1 italic">
              FDD language: &ldquo;{brand.brokerData.feeDisclosureNote}&rdquo;
            </p>
          )}
          <p className="text-xs text-muted mt-2 font-medium">
            Action: Ask any consultant/broker directly whether they receive a commission from
            this franchisor. Always verify this independently against the FDD Items 5-6.
          </p>
        </section>
        )}

        {/* ── Disclosure / citations ── */}
        <section className="rounded-xl border border-border/50 bg-surface p-4">
          <p className="text-[10px] text-muted leading-relaxed">
            <span className="font-semibold text-foreground">Data sources: </span>
            {memo.fddYear} Franchise Disclosure Document filed with{" "}
            {brand.dataSource === "state_filing" ? "a state franchise regulator (government record)" : "franchisor"}.
            Source: {brand.sourceNotes ?? "filed FDD"}. ·{" "}
            <span className="font-semibold text-foreground">Payback estimates and margin assumptions are editorial — not from the FDD.</span>{" "}
            This memo does not constitute legal or financial advice. Consult a franchise attorney and accountant before signing.
            Generated {memo.generatedDate} by Franchisel.com.
          </p>
        </section>

        {/* ── Actions ── */}
        <div className="print:hidden flex flex-wrap gap-3 pb-8">
          <Link
            href={`/brands/${brand.slug}`}
            className="px-4 py-2 rounded-lg border border-border text-sm font-medium text-muted hover:text-foreground hover:border-foreground transition-all"
          >
            ← Full Brand Profile
          </Link>
          <Link
            href={`/compare?brandA=${brand.slug}`}
            className="px-4 py-2 rounded-lg bg-accent text-white text-sm font-semibold hover:brightness-110 transition-all"
          >
            Compare This Brand →
          </Link>
        </div>
      </main>
    </div>
  );
}
