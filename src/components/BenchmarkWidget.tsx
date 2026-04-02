import type { CohortBenchmarks, CohortBenchmark } from "@/lib/diligence";
import { formatCurrency } from "@/lib/types";

function verdictLabel(v: CohortBenchmark["verdict"]): string {
  switch (v) {
    case "top_quartile": return "Top 25%";
    case "above_avg":    return "Above avg";
    case "average":      return "Average";
    case "below_avg":    return "Below avg";
    case "bottom_quartile": return "Bottom 25%";
    default:             return "No data";
  }
}

function verdictColors(v: CohortBenchmark["verdict"]): { bar: string; badge: string; text: string } {
  switch (v) {
    case "top_quartile":    return { bar: "bg-success", badge: "bg-success/15 text-success border-success/20", text: "text-success" };
    case "above_avg":       return { bar: "bg-success", badge: "bg-success/10 text-success border-success/15", text: "text-success" };
    case "average":         return { bar: "bg-accent", badge: "bg-accent/10 text-accent border-accent/20", text: "text-accent" };
    case "below_avg":       return { bar: "bg-warning", badge: "bg-warning/15 text-warning border-warning/20", text: "text-warning" };
    case "bottom_quartile": return { bar: "bg-danger", badge: "bg-danger/15 text-danger border-danger/20", text: "text-danger" };
    default:                return { bar: "bg-muted", badge: "bg-surface text-muted border-border", text: "text-muted" };
  }
}

function formatValue(b: CohortBenchmark): string {
  if (b.value === null) return "—";
  if (b.unit === "$") return formatCurrency(b.value);
  if (b.unit === "%") return `${b.value}%`;
  return `${b.value}${b.unit}`;
}

/** Summary headline — pick the single strongest signal */
function summaryHeadline(benchmarks: CohortBenchmark[], brandName: string): string | null {
  const ranked = benchmarks.filter((b) => b.percentile !== null);
  if (ranked.length === 0) return null;
  const best = [...ranked].sort((a, b) => {
    const scoreA = a.direction === "higher_is_better" ? (a.percentile ?? 0) : (100 - (a.percentile ?? 100));
    const scoreB = b.direction === "higher_is_better" ? (b.percentile ?? 0) : (100 - (b.percentile ?? 100));
    return scoreB - scoreA;
  })[0];
  const score = best.direction === "higher_is_better" ? (best.percentile ?? 0) : (100 - (best.percentile ?? 100));
  if (score >= 75) return `${brandName} ranks in the top 25% of peers for ${best.metric.toLowerCase()}`;
  if (score >= 50) return `${brandName} ranks above average among peers for ${best.metric.toLowerCase()}`;
  return null;
}

interface Props {
  benchmarks: CohortBenchmarks;
  brandName: string;
}

export default function BenchmarkWidget({ benchmarks, brandName }: Props) {
  const visible = benchmarks.benchmarks.filter((b) => b.percentile !== null);
  if (visible.length === 0) return null;

  const headline = summaryHeadline(visible, brandName);

  return (
    <div className="space-y-4">
      {/* Context + headline */}
      <div className="flex items-start justify-between gap-4">
        <p className="text-xs text-muted">
          Ranked within{" "}
          <span className="font-medium text-foreground">{benchmarks.category}</span> franchises
          at a <span className="font-medium text-foreground">{benchmarks.investmentTier}</span> investment tier.
          All data from government-filed FDDs.
        </p>
      </div>

      {headline && (
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-success/8 border border-success/15">
          <svg className="w-3.5 h-3.5 text-success shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" />
          </svg>
          <p className="text-xs text-success font-medium">{headline}</p>
        </div>
      )}

      {/* Metric bars */}
      <div className="rounded-xl border border-border bg-background overflow-hidden divide-y divide-border">
        {visible.map((b, i) => {
          const colors = verdictColors(b.verdict);
          // Bar width: for lower_is_better, invert so a low percentile = long green bar
          const barPct = b.direction === "higher_is_better"
            ? (b.percentile ?? 0)
            : (100 - (b.percentile ?? 0));

          return (
            <div key={i} className="px-5 py-3.5">
              <div className="flex items-center justify-between mb-1.5">
                <div>
                  <span className="text-sm font-medium text-foreground">{b.metric}</span>
                  <span className="text-xs text-muted ml-2">{b.peerLabel}</span>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-sm font-semibold text-foreground">{formatValue(b)}</span>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold border ${colors.badge}`}>
                    {verdictLabel(b.verdict)}
                  </span>
                </div>
              </div>
              {/* Progress bar */}
              <div className="h-1.5 bg-surface rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${colors.bar}`}
                  style={{ width: `${barPct}%`, opacity: 0.7 }}
                />
              </div>
              <div className="flex justify-between mt-0.5">
                <span className="text-[10px] text-muted">
                  {b.direction === "higher_is_better" ? "Low" : "High cost"}
                </span>
                <span className="text-[10px] text-muted">
                  {b.percentile}th percentile · {b.peerCount} peers
                </span>
                <span className="text-[10px] text-muted">
                  {b.direction === "higher_is_better" ? "High" : "Low cost"}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      <p className="text-[10px] text-muted">
        Percentile rank vs. comparable franchises in the same category and investment tier.
        For revenue and growth: higher percentile = better. For fees and investment: lower percentile = better (bar shows relative advantage).
      </p>
    </div>
  );
}
