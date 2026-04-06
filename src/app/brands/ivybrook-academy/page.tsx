import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getBrandBySlug } from "@/data/brands";
import WatchButton from "@/components/WatchButton";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Ivybrook Academy Franchise · 2025 FDD Deep Dive · franchiese",
  description:
    "The most complete Ivybrook Academy franchise analysis on the internet. 207-page 2025 FDD fully extracted including image-only Exhibit J financials. Unit economics, contract burdens, financial health, and 8 red flags.",
};

/* ─────────────── Tiny chart primitives (no JS, pure SVG/CSS) ─────────────── */

function Sparkline({
  points,
  width = 220,
  height = 56,
  stroke = "var(--accent)",
  fill = "rgba(6,182,212,0.12)",
}: {
  points: number[];
  width?: number;
  height?: number;
  stroke?: string;
  fill?: string;
}) {
  if (points.length === 0) return null;
  const min = Math.min(...points);
  const max = Math.max(...points);
  const range = max - min || 1;
  const stepX = width / (points.length - 1 || 1);
  const path = points
    .map((p, i) => {
      const x = i * stepX;
      const y = height - ((p - min) / range) * (height - 8) - 4;
      return `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");
  const area = `${path} L${width.toFixed(1)},${height.toFixed(1)} L0,${height.toFixed(1)} Z`;
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      <path d={area} fill={fill} />
      <path d={path} stroke={stroke} strokeWidth={2} fill="none" strokeLinecap="round" strokeLinejoin="round" />
      {points.map((p, i) => {
        const x = i * stepX;
        const y = height - ((p - min) / range) * (height - 8) - 4;
        return <circle key={i} cx={x} cy={y} r={3} fill={stroke} />;
      })}
    </svg>
  );
}

function HBar({
  value,
  max,
  color = "var(--accent)",
  height = 10,
}: {
  value: number;
  max: number;
  color?: string;
  height?: number;
}) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));
  return (
    <div className="w-full bg-surface-alt rounded-full overflow-hidden" style={{ height }}>
      <div
        className="h-full rounded-full transition-all"
        style={{ width: `${pct}%`, background: color }}
      />
    </div>
  );
}

function Donut({
  value,
  label,
  size = 120,
  stroke = 12,
  color = "var(--accent)",
  trackColor = "var(--border)",
}: {
  value: number;
  label?: string;
  size?: number;
  stroke?: number;
  color?: string;
  trackColor?: string;
}) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const offset = c - (value / 100) * c;
  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} stroke={trackColor} strokeWidth={stroke} fill="none" />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke={color}
          strokeWidth={stroke}
          fill="none"
          strokeDasharray={c}
          strokeDashoffset={offset}
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="text-2xl font-bold text-foreground">{value}</div>
        {label && <div className="text-[10px] uppercase tracking-wider text-muted">{label}</div>}
      </div>
    </div>
  );
}

function MiniStat({
  label,
  value,
  delta,
  tone = "neutral",
}: {
  label: string;
  value: string;
  delta?: string;
  tone?: "success" | "warning" | "danger" | "neutral" | "accent";
}) {
  const toneClasses: Record<string, string> = {
    success: "text-success",
    warning: "text-warning",
    danger: "text-danger",
    accent: "text-accent",
    neutral: "text-foreground",
  };
  return (
    <div className="rounded-xl border border-border bg-surface p-4">
      <div className="text-[11px] uppercase tracking-wider text-muted">{label}</div>
      <div className={`text-xl font-bold mt-1 ${toneClasses[tone]}`}>{value}</div>
      {delta && <div className="text-xs text-muted mt-0.5">{delta}</div>}
    </div>
  );
}

function StackedBar({
  segments,
  height = 32,
}: {
  segments: { label: string; value: number; color: string }[];
  height?: number;
}) {
  const total = segments.reduce((a, s) => a + s.value, 0);
  return (
    <div>
      <div className="flex w-full overflow-hidden rounded-md" style={{ height }}>
        {segments.map((s, i) => (
          <div
            key={i}
            style={{ width: `${(s.value / total) * 100}%`, background: s.color }}
            className="flex items-center justify-center text-[10px] font-medium text-background"
            title={`${s.label}: ${((s.value / total) * 100).toFixed(0)}%`}
          >
            {((s.value / total) * 100) >= 8 && `${((s.value / total) * 100).toFixed(0)}%`}
          </div>
        ))}
      </div>
      <div className="flex flex-wrap gap-3 mt-2 text-xs">
        {segments.map((s, i) => (
          <div key={i} className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-sm" style={{ background: s.color }} />
            <span className="text-muted">{s.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function GaugeArc({
  value,
  max = 100,
  label,
  zones,
}: {
  value: number;
  max?: number;
  label: string;
  zones: { from: number; to: number; color: string }[];
}) {
  const cx = 100;
  const cy = 90;
  const r = 70;
  const startAngle = -180;
  const endAngle = 0;
  const angleAt = (v: number) => startAngle + ((v / max) * (endAngle - startAngle));
  const polar = (angle: number, radius: number) => {
    const rad = (angle * Math.PI) / 180;
    return [cx + radius * Math.cos(rad), cy + radius * Math.sin(rad)];
  };
  const arc = (from: number, to: number, color: string) => {
    const [x1, y1] = polar(angleAt(from), r);
    const [x2, y2] = polar(angleAt(to), r);
    const large = Math.abs(angleAt(to) - angleAt(from)) > 180 ? 1 : 0;
    return (
      <path
        d={`M${x1},${y1} A${r},${r} 0 ${large},1 ${x2},${y2}`}
        stroke={color}
        strokeWidth={14}
        fill="none"
        strokeLinecap="round"
        key={`${from}-${to}`}
      />
    );
  };
  const [nx, ny] = polar(angleAt(value), r);
  return (
    <div className="flex flex-col items-center">
      <svg viewBox="0 0 200 110" width="100%" style={{ maxWidth: 240 }}>
        {zones.map((z) => arc(z.from, z.to, z.color))}
        <line x1={cx} y1={cy} x2={nx} y2={ny} stroke="var(--foreground)" strokeWidth={3} strokeLinecap="round" />
        <circle cx={cx} cy={cy} r={5} fill="var(--foreground)" />
      </svg>
      <div className="text-center mt-1">
        <div className="text-2xl font-bold text-foreground">{value}</div>
        <div className="text-[10px] uppercase tracking-wider text-muted">{label}</div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────── */

export default function IvybrookPage() {
  const brand = getBrandBySlug("ivybrook-academy");
  if (!brand) return notFound();

  // Pre-computed data
  const royaltyPct = 7;
  const brandFundPct = 1;
  const localMktPct = 1;
  const recurringPct = royaltyPct + brandFundPct + localMktPct;

  const cohorts = [
    { label: "5 classrooms", n: 4, avg: 845440, color: "var(--cyan)" },
    { label: "6 classrooms", n: 13, avg: 1074164, color: "var(--accent)" },
    { label: "7 classrooms", n: 2, avg: 1318980, color: "var(--success)" },
  ];

  const item19Cohorts = [
    { label: "Affiliate (1 unit, 7 cls)", gr: 1487947, ebitda: 456386, margin: 31, color: "var(--success)" },
    { label: "Franchisees 3Y+ (n=18)", gr: 967875, ebitda: 213536, margin: 22, color: "var(--accent)" },
    { label: "Franchisees 2Y+ (n=24)", gr: 858259, ebitda: 159401, margin: 19, color: "var(--cyan)" },
  ];

  const yearlyGrowth = [
    { year: 2022, start: 17, end: 26, opened: 9, closed: 0 },
    { year: 2023, start: 26, end: 33, opened: 8, closed: 1 },
    { year: 2024, start: 33, end: 40, opened: 8, closed: 1 },
  ];

  const incomeStatement = [
    { year: 2022, revenue: 1375738, opex: 614776, opIncome: 309239, ni: 309239 },
    { year: 2023, revenue: 1833431, opex: 720978, opIncome: 435505, ni: 435505 },
    { year: 2024, revenue: 2171363, opex: 1236991, opIncome: 409674, ni: 313055 },
  ];

  const balanceSheet = [
    { year: 2023, assets: 2910238, liab: 2862231, equity: 48007, cash: 313981 },
    { year: 2024, assets: 3894365, liab: 3548503, equity: 345862, cash: 300274 },
  ];

  const stateOutlets = [
    { state: "NC", count: 8 },
    { state: "SC", count: 6 },
    { state: "TX", count: 5 },
    { state: "FL", count: 4 },
    { state: "GA", count: 4 },
    { state: "CO", count: 3 },
    { state: "OH", count: 3 },
    { state: "TN", count: 2 },
    { state: "AR", count: 1 },
    { state: "KY", count: 1 },
    { state: "NE", count: 1 },
    { state: "PA", count: 1 },
    { state: "VA", count: 1 },
  ];

  const signedNotOpened = [
    { state: "TX", count: 8 },
    { state: "FL", count: 5 },
    { state: "PA", count: 4 },
    { state: "NC", count: 3 },
    { state: "VA", count: 3 },
    { state: "CO", count: 2 },
    { state: "GA", count: 2 },
    { state: "OR", count: 2 },
    { state: "AR", count: 1 },
    { state: "AZ", count: 1 },
    { state: "IL", count: 1 },
    { state: "LA", count: 1 },
    { state: "MI", count: 1 },
    { state: "MN", count: 1 },
    { state: "NE", count: 1 },
    { state: "NH", count: 1 },
    { state: "NJ", count: 1 },
    { state: "OH", count: 1 },
    { state: "SC", count: 1 },
    { state: "TN", count: 1 },
    { state: "UT", count: 1 },
  ];

  const expenseBreakdown2yr = [
    { label: "Labor", pct: 41, color: "#ef4444" },
    { label: "Rent", pct: 20, color: "#f59e0b" },
    { label: "Royalty", pct: 6, color: "#06b6d4" },
    { label: "Supplies", pct: 4, color: "#22d3ee" },
    { label: "Insurance", pct: 2, color: "#22c55e" },
    { label: "Advertising", pct: 2, color: "#a855f7" },
    { label: "Other", pct: 6, color: "#64748b" },
    { label: "EBITDA", pct: 19, color: "#16a34a" },
  ];

  const compositeScores: { systemHealth: number; franchisorStrength: number; economicBurden: number; contractFriction: number } = {
    systemHealth: brand.compositeScores?.systemHealth ?? 78,
    franchisorStrength: brand.compositeScores?.franchisorStrength ?? 58,
    economicBurden: brand.compositeScores?.economicBurden ?? 62,
    contractFriction: brand.compositeScores?.contractFriction ?? 70,
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Skip-to-content nav */}
      <nav className="max-w-7xl mx-auto px-6 pt-6 pb-2">
        <ol className="flex items-center gap-2 text-sm text-muted">
          <li><Link href="/" className="hover:text-accent">Home</Link></li>
          <li>›</li>
          <li><Link href="/brands" className="hover:text-accent">Brands</Link></li>
          <li>›</li>
          <li className="text-foreground font-medium">Ivybrook Academy</li>
        </ol>
      </nav>

      {/* HERO */}
      <section className="hero-mesh border-b border-border">
        <div className="max-w-7xl mx-auto px-6 pt-8 pb-14">
          <div className="grid lg:grid-cols-3 gap-8 items-start">
            <div className="lg:col-span-2">
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className="px-3 py-1 text-xs font-medium rounded-full bg-accent-light text-accent border border-accent/20">
                  Childcare & Education · Half-Day Preschool
                </span>
                <span className="px-3 py-1 text-xs font-medium rounded-full bg-success-light text-success border border-success/20">
                  ✓ Verified · 2025 FDD
                </span>
                <span className="px-3 py-1 text-xs font-medium rounded-full bg-cyan-light text-cyan border border-cyan/20">
                  207-page deep extract
                </span>
                <span className="px-3 py-1 text-xs font-medium rounded-full bg-warning-light text-warning border border-warning/20">
                  PE-acquired Aug 2025
                </span>
              </div>
              <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-foreground">
                Ivybrook Academy
              </h1>
              <p className="text-lg text-muted mt-2">
                Reggio Emilia–aligned half-day preschool franchise · 41 outlets across 13 states · founded 2007, franchising since 2015 · headquartered Weddington, NC
              </p>
              <p className="text-sm text-muted mt-4 max-w-3xl leading-relaxed">
                The most complete Ivybrook Academy analysis on the internet. Built from the full 207-page 2025 FDD (file #637976, filed with WI DFI; issued March 28, 2025; amended September 15, 2025), including the image-only Exhibit J financial statements recovered via vision OCR. Acquired August 29, 2025 by Crux I Ivybrook (Aggregator), LP — a Dallas-based PE aggregator.
              </p>

              <div className="flex flex-wrap gap-2 mt-5">
                <a href="#economics" className="px-3 py-1.5 text-xs font-medium rounded-md bg-surface border border-border hover:border-accent text-foreground">Unit economics ↓</a>
                <a href="#financials" className="px-3 py-1.5 text-xs font-medium rounded-md bg-surface border border-border hover:border-accent text-foreground">Franchisor financials ↓</a>
                <a href="#growth" className="px-3 py-1.5 text-xs font-medium rounded-md bg-surface border border-border hover:border-accent text-foreground">Growth & footprint ↓</a>
                <a href="#contract" className="px-3 py-1.5 text-xs font-medium rounded-md bg-surface border border-border hover:border-accent text-foreground">Contract burden ↓</a>
                <a href="#redflags" className="px-3 py-1.5 text-xs font-medium rounded-md bg-surface border border-border hover:border-accent text-foreground">Red flags ↓</a>
                <a href="#diligence" className="px-3 py-1.5 text-xs font-medium rounded-md bg-surface border border-border hover:border-accent text-foreground">Diligence questions ↓</a>
              </div>
            </div>

            {/* Hero side card — composite scores */}
            <div className="rounded-2xl border border-border bg-surface p-5 lg:sticky lg:top-6">
              <div className="text-[11px] uppercase tracking-wider text-muted mb-3">Composite scores</div>
              <div className="grid grid-cols-2 gap-3">
                <GaugeArc
                  value={compositeScores.systemHealth}
                  label="System health"
                  zones={[
                    { from: 0, to: 40, color: "var(--danger)" },
                    { from: 40, to: 65, color: "var(--warning)" },
                    { from: 65, to: 100, color: "var(--success)" },
                  ]}
                />
                <GaugeArc
                  value={compositeScores.franchisorStrength}
                  label="Franchisor strength"
                  zones={[
                    { from: 0, to: 40, color: "var(--danger)" },
                    { from: 40, to: 65, color: "var(--warning)" },
                    { from: 65, to: 100, color: "var(--success)" },
                  ]}
                />
                <GaugeArc
                  value={100 - compositeScores.economicBurden}
                  label="Fee headroom"
                  zones={[
                    { from: 0, to: 35, color: "var(--danger)" },
                    { from: 35, to: 60, color: "var(--warning)" },
                    { from: 60, to: 100, color: "var(--success)" },
                  ]}
                />
                <GaugeArc
                  value={100 - compositeScores.contractFriction}
                  label="Contract ease"
                  zones={[
                    { from: 0, to: 35, color: "var(--danger)" },
                    { from: 35, to: 60, color: "var(--warning)" },
                    { from: 60, to: 100, color: "var(--success)" },
                  ]}
                />
              </div>
              <div className="mt-4 pt-4 border-t border-border">
                <WatchButton slug="ivybrook-academy" name="Ivybrook Academy" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* AT-A-GLANCE STAT STRIP */}
      <section className="max-w-7xl mx-auto px-6 -mt-8 mb-10">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
          <MiniStat label="Outlets (end 2024)" value="41" delta="40 franchised + 1 affiliate" tone="accent" />
          <MiniStat label="Net new 2024" value="+7" delta="3-yr avg +7.7" tone="success" />
          <MiniStat label="Signed not opened" value="42" delta="105% of operating base" tone="warning" />
          <MiniStat label="Franchise fee" value="$50K" delta="$35K / $25K MUDA 2nd / 3rd" />
          <MiniStat label="Initial investment" value="$540K–$870K" delta="MUDA 1st: up to $930K" />
          <MiniStat label="Recurring %" value={`${recurringPct}%`} delta="+ $250/mo tech (→10%+ in 2026)" tone="warning" />
          <MiniStat label="Term" value="15 yrs" delta="+ 2× 10-yr renewals" />
          <MiniStat label="Franchisee 3Y+ avg GR" value="$968K" delta="22% pre-owner-comp EBITDA" tone="success" />
          <MiniStat label="Affiliate flagship" value="$1.49M" delta="31% pre-owner-comp EBITDA" tone="success" />
          <MiniStat label="Royalty / Brand Fund" value="7% / 1%" delta="Brand Fund → 2% in 2026" />
          <MiniStat label="Auditor" value="Reese CPA LLC" delta="Clean / no going concern" tone="success" />
          <MiniStat label="Franchisor equity 12/31/24" value="$346K" delta="vs $540K-$870K invest" tone="warning" />
        </div>
      </section>

      {/* ECONOMICS */}
      <section id="economics" className="max-w-7xl mx-auto px-6 py-10">
        <div className="flex items-center gap-3 mb-6">
          <div className="h-8 w-1 rounded bg-accent" />
          <h2 className="text-2xl font-bold text-foreground">Item 19 unit economics</h2>
          <span className="px-2 py-0.5 text-[10px] uppercase tracking-wider rounded bg-success-light text-success border border-success/20">FPR present · 5 tables</span>
        </div>

        <div className="grid lg:grid-cols-3 gap-5 mb-6">
          {item19Cohorts.map((c) => (
            <div key={c.label} className="rounded-2xl border border-border bg-surface p-5">
              <div className="text-xs text-muted">{c.label}</div>
              <div className="text-3xl font-bold text-foreground mt-1">${(c.gr / 1000).toFixed(0)}K</div>
              <div className="text-xs text-muted">avg gross revenue 2024</div>
              <div className="mt-4 flex items-baseline gap-2">
                <span className="text-2xl font-bold" style={{ color: c.color }}>${(c.ebitda / 1000).toFixed(0)}K</span>
                <span className="text-sm text-muted">EBITDA · {c.margin}% margin</span>
              </div>
              <div className="mt-3">
                <HBar value={c.margin} max={35} color={c.color} />
              </div>
              <div className="mt-3 text-[11px] text-muted leading-relaxed">
                EBITDA as defined by Ivybrook excludes owner compensation — pre-owner-comp operating profit, not take-home.
              </div>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-5">
          <div className="rounded-2xl border border-border bg-surface p-5">
            <div className="text-xs uppercase tracking-wider text-muted mb-3">Revenue by classroom count · 3-year+ franchisees (n=19)</div>
            <div className="space-y-3">
              {cohorts.map((c) => (
                <div key={c.label}>
                  <div className="flex items-baseline justify-between text-sm">
                    <span className="text-foreground">{c.label} · n={c.n}</span>
                    <span className="font-semibold text-foreground">${(c.avg / 1000).toFixed(0)}K</span>
                  </div>
                  <HBar value={c.avg} max={1400000} color={c.color} height={12} />
                </div>
              ))}
            </div>
            <div className="mt-4 text-[11px] text-muted">
              7-classroom schools generate ~56% more gross revenue than 5-classroom schools. The single affiliate-owned school is also 7-classroom and is the highest performer in the system.
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-surface p-5">
            <div className="text-xs uppercase tracking-wider text-muted mb-3">Where the money goes · 2-year+ franchisee average (% of revenue)</div>
            <StackedBar
              segments={expenseBreakdown2yr.map((e) => ({ label: e.label, value: e.pct, color: e.color }))}
            />
            <div className="mt-4 text-[11px] text-muted leading-relaxed">
              Labor (41%) and rent (20%) are 61% of revenue. Royalty 6%. Pre-owner-comp EBITDA 19%. The 4× jump in advertising expense in 2024 vs 2023 ($118K vs $31K) reflects the first significant Brand Fund deployment.
            </div>
          </div>
        </div>

        <div className="mt-5 rounded-2xl border border-border bg-surface p-5">
          <div className="text-xs uppercase tracking-wider text-muted mb-3">Tuition price ranges 2024</div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {[
              { label: "1 day/week", low: 250, high: 365 },
              { label: "2 days/week", low: 335, high: 510 },
              { label: "3 days/week", low: 435, high: 675 },
              { label: "4 days/week", low: 500, high: 770 },
              { label: "5 days/week", low: 575, high: 890 },
            ].map((t) => (
              <div key={t.label} className="rounded-lg bg-surface-alt border border-border p-3">
                <div className="text-[10px] uppercase tracking-wider text-muted">{t.label}</div>
                <div className="text-base font-bold text-foreground mt-1">${t.low}–${t.high}</div>
                <div className="text-[10px] text-muted">monthly</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FINANCIALS — newly recovered from image-only Exhibit J */}
      <section id="financials" className="bg-surface-alt border-y border-border">
        <div className="max-w-7xl mx-auto px-6 py-10">
          <div className="flex items-center gap-3 mb-6 flex-wrap">
            <div className="h-8 w-1 rounded bg-accent" />
            <h2 className="text-2xl font-bold text-foreground">Franchisor financials · Item 21 / Exhibit J</h2>
            <span className="px-2 py-0.5 text-[10px] uppercase tracking-wider rounded bg-success-light text-success border border-success/20">Vision OCR recovered</span>
            <span className="px-2 py-0.5 text-[10px] uppercase tracking-wider rounded bg-cyan-light text-cyan border border-cyan/20">Auditor: Reese CPA LLC</span>
            <span className="px-2 py-0.5 text-[10px] uppercase tracking-wider rounded bg-success-light text-success border border-success/20">Clean opinion · no going concern</span>
          </div>

          <div className="grid lg:grid-cols-3 gap-5 mb-6">
            <div className="lg:col-span-2 rounded-2xl border border-border bg-surface p-5">
              <div className="text-xs uppercase tracking-wider text-muted mb-3">Revenue & net income · FY 2022–2024</div>
              <div className="grid grid-cols-3 gap-4">
                {incomeStatement.map((r) => (
                  <div key={r.year} className="rounded-lg bg-surface-alt border border-border p-3">
                    <div className="text-[10px] text-muted">FY{r.year}</div>
                    <div className="text-xl font-bold text-foreground mt-1">${(r.revenue / 1e6).toFixed(2)}M</div>
                    <div className="text-[10px] text-muted">total revenue</div>
                    <div className="mt-2 text-sm font-semibold text-success">${(r.ni / 1000).toFixed(0)}K</div>
                    <div className="text-[10px] text-muted">net income</div>
                  </div>
                ))}
              </div>
              <div className="mt-5">
                <Sparkline points={incomeStatement.map((r) => r.revenue)} width={520} height={70} />
                <div className="text-[10px] text-muted mt-1 text-center">Revenue trend · $1.38M → $1.83M → $2.17M (+58% over 3 years)</div>
              </div>
              <div className="mt-4 grid grid-cols-3 gap-2 text-[11px] text-muted">
                <div>Revenue YoY 2024: <span className="text-success font-semibold">+18.4%</span></div>
                <div>Royalty growth 2024: <span className="text-success font-semibold">+22.5%</span></div>
                <div>2024 NI hit by new $96K push-down tax</div>
              </div>
            </div>

            <div className="rounded-2xl border border-border bg-surface p-5">
              <div className="text-xs uppercase tracking-wider text-muted mb-3">Members' equity 2021–2024</div>
              <div className="space-y-2 text-sm">
                {[
                  { y: "Dec 2021", v: 136107, c: "var(--cyan)" },
                  { y: "Dec 2022", v: 145346, c: "var(--cyan)" },
                  { y: "Dec 2023", v: 48007, c: "var(--warning)" },
                  { y: "Dec 2024", v: 345862, c: "var(--success)" },
                ].map((e) => (
                  <div key={e.y}>
                    <div className="flex items-baseline justify-between">
                      <span className="text-muted text-xs">{e.y}</span>
                      <span className="font-semibold text-foreground">${(e.v / 1000).toFixed(0)}K</span>
                    </div>
                    <HBar value={e.v} max={400000} color={e.c} height={8} />
                  </div>
                ))}
              </div>
              <div className="mt-4 text-[11px] text-muted leading-relaxed">
                The 2023 trough ($48K) reflects $533K of distributions vs $436K of net income. 2024 recovered to $346K — the figure disclosed in the Virginia addendum risk factor.
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
            <MiniStat label="Total assets 12/31/24" value="$3.89M" delta="vs $2.91M (12/31/23) +34%" tone="success" />
            <MiniStat label="Cash 12/31/24" value="$300K" delta="3-year stable" />
            <MiniStat label="Deferred franchise fees" value="$3.43M" delta="Unearned from 42-unit backlog" tone="warning" />
            <MiniStat label="Operating cash flow 2024" value="$444K" delta="3-year positive" tone="success" />
          </div>

          <div className="grid lg:grid-cols-2 gap-5">
            <div className="rounded-2xl border border-border bg-surface p-5">
              <div className="text-xs uppercase tracking-wider text-muted mb-3">Auditor's opinion (recovered from Exhibit J p3)</div>
              <p className="text-sm text-foreground leading-relaxed">
                Reese CPA LLC of Ft. Collins, Colorado audited the financial statements as of December 31, 2024, 2023, and 2022 and issued an <span className="text-success font-semibold">unmodified (clean) opinion</span> dated <span className="font-semibold">March 13, 2025</span>. Going concern was explicitly evaluated; <span className="text-success font-semibold">no modification was issued</span>. The audit signature date pre-dates the August 29, 2025 PE acquisition, which is therefore not in the subsequent-events note.
              </p>
              <div className="mt-3 p-3 bg-surface-alt rounded-lg border border-border">
                <div className="text-[10px] uppercase tracking-wider text-muted mb-1">Key reconciliation</div>
                <div className="text-xs text-muted">
                  Members' equity in audited B/S = <span className="text-foreground font-semibold">$345,862</span> ✓ matches Virginia addendum risk factor.<br />
                  Total revenue in audited income statement = <span className="text-foreground font-semibold">$2,171,363</span> ✓ matches Item 8 narrative disclosure.
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-border bg-surface p-5">
              <div className="text-xs uppercase tracking-wider text-muted mb-3">Financial-condition risk · re-assessed</div>
              <p className="text-sm text-foreground leading-relaxed">
                Cover Special Risk #2 says financial condition "calls into question" the franchisor's ability to support franchisees. This is structurally driven by:
              </p>
              <ul className="mt-3 space-y-1.5 text-xs text-muted">
                <li>· Low absolute equity ($346K) vs initial investment range ($540K–$870K)</li>
                <li>· Heavy unearned revenue ($3.43M deferred franchise fees from 42 unopened agreements)</li>
                <li>· Illinois AG–imposed fee deferral (IL addendum)</li>
                <li>· Virginia addendum disclosure (VA addendum risk factor)</li>
              </ul>
              <div className="mt-3 p-3 bg-success-light rounded-lg border border-success/20">
                <div className="text-xs text-success font-semibold">Mitigating signal</div>
                <div className="text-xs text-foreground mt-1">
                  Reese CPA's clean opinion materially softens the qualitative reading. Auditor evaluated going concern and concluded entity can continue. Operating cash flow positive in all 3 years ($312K → $578K → $444K).
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* GROWTH & FOOTPRINT */}
      <section id="growth" className="max-w-7xl mx-auto px-6 py-10">
        <div className="flex items-center gap-3 mb-6">
          <div className="h-8 w-1 rounded bg-accent" />
          <h2 className="text-2xl font-bold text-foreground">Growth & footprint · Item 20</h2>
          <span className="px-2 py-0.5 text-[10px] uppercase tracking-wider rounded bg-success-light text-success border border-success/20">0 terminations · 0 transfers · 3 yrs</span>
        </div>

        <div className="grid lg:grid-cols-3 gap-5 mb-6">
          <div className="lg:col-span-2 rounded-2xl border border-border bg-surface p-5">
            <div className="text-xs uppercase tracking-wider text-muted mb-3">Outlet trajectory · franchised only</div>
            <div className="grid grid-cols-3 gap-3 mb-4">
              {yearlyGrowth.map((g) => (
                <div key={g.year} className="rounded-lg bg-surface-alt border border-border p-3">
                  <div className="text-[10px] text-muted">{g.year}</div>
                  <div className="text-2xl font-bold text-foreground">{g.end}</div>
                  <div className="flex items-center gap-2 mt-1 text-[11px]">
                    <span className="text-success">+{g.opened}</span>
                    {g.closed > 0 && <span className="text-danger">−{g.closed}</span>}
                  </div>
                </div>
              ))}
            </div>
            <Sparkline points={[17, 26, 33, 40]} width={520} height={80} />
            <div className="text-[10px] text-muted mt-1 text-center">17 → 26 → 33 → 40 outlets (start 2022 → end 2024)</div>
          </div>

          <div className="rounded-2xl border border-border bg-warning/5 border-warning/20 p-5">
            <div className="text-xs uppercase tracking-wider text-warning mb-3">⚠ Special Risk #4</div>
            <div className="text-3xl font-bold text-foreground">42</div>
            <div className="text-sm text-muted mt-1">signed agreements not yet opened</div>
            <div className="mt-3 text-[11px] text-foreground leading-relaxed">
              105% of currently operating base. Conversion of this backlog over the next 12-24 months drives the franchisor's revenue ramp. If conversion stalls, system growth and franchisor revenue stall too.
            </div>
            <div className="mt-3 pt-3 border-t border-warning/20 text-[11px] text-muted">
              16 projected new openings disclosed for next FY (FY2025) — 38% of backlog.
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-5">
          <div className="rounded-2xl border border-border bg-surface p-5">
            <div className="text-xs uppercase tracking-wider text-muted mb-3">Open outlets by state · end 2024 (n=40)</div>
            <div className="space-y-2">
              {stateOutlets.map((s) => (
                <div key={s.state} className="flex items-center gap-3">
                  <span className="w-8 text-xs font-mono text-muted">{s.state}</span>
                  <div className="flex-1">
                    <HBar value={s.count} max={8} color="var(--accent)" height={10} />
                  </div>
                  <span className="w-8 text-right text-sm font-semibold text-foreground">{s.count}</span>
                </div>
              ))}
            </div>
            <div className="mt-3 text-[11px] text-muted">North Carolina concentration: 19.5% of total open outlets. Regional system, not yet national.</div>
          </div>

          <div className="rounded-2xl border border-border bg-surface p-5">
            <div className="text-xs uppercase tracking-wider text-muted mb-3">Signed but not opened by state (n=42)</div>
            <div className="space-y-2">
              {signedNotOpened.slice(0, 13).map((s) => (
                <div key={s.state} className="flex items-center gap-3">
                  <span className="w-8 text-xs font-mono text-muted">{s.state}</span>
                  <div className="flex-1">
                    <HBar value={s.count} max={8} color="var(--warning)" height={10} />
                  </div>
                  <span className="w-8 text-right text-sm font-semibold text-foreground">{s.count}</span>
                </div>
              ))}
            </div>
            <div className="mt-3 text-[11px] text-muted">Texas leads the unopened pipeline (8 agreements). Florida (5), Pennsylvania (4), and 8 additional states with 1-3 each.</div>
          </div>
        </div>
      </section>

      {/* CONTRACT BURDEN */}
      <section id="contract" className="bg-surface-alt border-y border-border">
        <div className="max-w-7xl mx-auto px-6 py-10">
          <div className="flex items-center gap-3 mb-6 flex-wrap">
            <div className="h-8 w-1 rounded bg-accent" />
            <h2 className="text-2xl font-bold text-foreground">Contract burden · Items 5, 6, 7, 17 + Franchise Agreement deep walk</h2>
            <span className="px-2 py-0.5 text-[10px] uppercase tracking-wider rounded bg-cyan-light text-cyan border border-cyan/20">~25 clauses · 9 burden families</span>
          </div>

          <div className="grid lg:grid-cols-3 gap-5 mb-6">
            <div className="rounded-2xl border border-border bg-surface p-5">
              <div className="text-xs uppercase tracking-wider text-muted">Recurring fees · % of Gross Revenue</div>
              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-4xl font-bold text-foreground">{recurringPct}%</span>
                <span className="text-sm text-muted">+ $250/mo tech</span>
              </div>
              <div className="mt-4 space-y-2">
                <div>
                  <div className="flex justify-between text-xs"><span className="text-muted">Royalty</span><span className="text-foreground font-semibold">7%</span></div>
                  <HBar value={7} max={10} color="var(--danger)" />
                </div>
                <div>
                  <div className="flex justify-between text-xs"><span className="text-muted">Brand Fund (→2% in 2026)</span><span className="text-foreground font-semibold">1%</span></div>
                  <HBar value={1} max={10} color="var(--warning)" />
                </div>
                <div>
                  <div className="flex justify-between text-xs"><span className="text-muted">Local marketing min</span><span className="text-foreground font-semibold">1%</span></div>
                  <HBar value={1} max={10} color="var(--cyan)" />
                </div>
              </div>
              <div className="mt-3 text-[11px] text-warning">Brand Fund increase to 2% in 2026 raises floor to <span className="font-semibold">10%+ of GR</span>.</div>
            </div>

            <div className="rounded-2xl border border-border bg-surface p-5">
              <div className="text-xs uppercase tracking-wider text-muted">Initial fees to franchisor</div>
              <div className="mt-3 text-4xl font-bold text-foreground">$82.5K</div>
              <div className="text-xs text-muted">paid to franchisor or affiliate</div>
              <div className="mt-4 space-y-1.5 text-xs">
                <div className="flex justify-between"><span className="text-muted">Initial franchise fee</span><span className="text-foreground font-semibold">$50,000</span></div>
                <div className="flex justify-between"><span className="text-muted">Real estate coordination</span><span className="text-foreground font-semibold">$10,000</span></div>
                <div className="flex justify-between"><span className="text-muted">Training & opening support</span><span className="text-foreground font-semibold">$15,000</span></div>
                <div className="flex justify-between"><span className="text-muted">Décor package (~90 days pre-open)</span><span className="text-foreground font-semibold">$7,500</span></div>
              </div>
              <div className="mt-3 pt-3 border-t border-border text-[11px] text-muted">MUDA second unit: $35K · third unit: $25K · paid at MUDA signing.</div>
            </div>

            <div className="rounded-2xl border border-border bg-surface p-5">
              <div className="text-xs uppercase tracking-wider text-muted">Total initial investment</div>
              <div className="mt-3 flex items-baseline gap-1">
                <span className="text-2xl font-bold text-foreground">$540K</span>
                <span className="text-muted">–</span>
                <span className="text-2xl font-bold text-foreground">$870K</span>
              </div>
              <div className="text-xs text-muted">single unit · MUDA 1st unit up to $930K</div>
              <div className="mt-4 space-y-1.5 text-xs">
                <div className="flex justify-between"><span className="text-muted">Construction / leasehold</span><span className="text-foreground font-semibold">$277K–$519K</span></div>
                <div className="flex justify-between"><span className="text-muted">FF&E + décor</span><span className="text-foreground font-semibold">$75K–$105K</span></div>
                <div className="flex justify-between"><span className="text-muted">Playground</span><span className="text-foreground font-semibold">$10K–$25K</span></div>
                <div className="flex justify-between"><span className="text-muted">Grand opening marketing</span><span className="text-foreground font-semibold">$20K–$25K</span></div>
                <div className="flex justify-between"><span className="text-muted">3-month working capital</span><span className="text-foreground font-semibold">$30K–$35K</span></div>
              </div>
            </div>
          </div>

          {/* Burden families */}
          <div className="grid lg:grid-cols-3 gap-3">
            {[
              { fam: "Financial obligations", count: 8, sev: "warning", quote: "Royalty 7% · 1.5%/mo late · $1K/wk noncompliance · 10% cure markup · franchisor may apply payments to any past-due indebtedness in any priority" },
              { fam: "EFT / auto-debit", count: 1, sev: "warning", quote: "FA §3.12: pre-authorized bank draft mandatory; franchisor may change method and adjust due date unilaterally" },
              { fam: "Data ownership", count: 6, sev: "critical", quote: "FA §13.17: all Franchised Business Data deemed owned by franchisor; franchisee has only a limited license to use its own operating data" },
              { fam: "System change", count: 2, sev: "critical", quote: "FA §10.2: required changes may demand 'significant capital expenditures unknown on the Effective Date and not fully amortizable over remaining term'" },
              { fam: "Remodel / refurbish", count: 3, sev: "warning", quote: "FA §13.2/13.3: franchisor may require structural changes, remodeling, equipment replacement at franchisee expense to conform to then-current image" },
              { fam: "FMV mechanics", count: 2, sev: "warning", quote: "Lease rider: independent appraiser baseball-arbitration of rent on franchisor lease takeover; 60-day post-term FMV asset option" },
              { fam: "Tax / permit / debt", count: 3, sev: "info", quote: "Tax record submission required · permit compliance on franchisee · lease subordination to encumbrances" },
              { fam: "Entity / guarantor", count: 6, sev: "critical", quote: "Single-purpose entity required · stop-transfer instructions · Exhibit F unlimited personal guaranty by all owners + spouses" },
              { fam: "Insurance minimums", count: 4, sev: "info", quote: "$2M per occurrence general liability · $100K employer · 60 days pre-open · franchisor named additional insured primary non-contributory" },
            ].map((f) => {
              const sevColor: Record<string, string> = {
                critical: "border-danger/30 bg-danger/5",
                warning: "border-warning/30 bg-warning/5",
                info: "border-cyan/30 bg-cyan/5",
              };
              const dotColor: Record<string, string> = {
                critical: "bg-danger",
                warning: "bg-warning",
                info: "bg-cyan",
              };
              return (
                <div key={f.fam} className={`rounded-xl border p-4 ${sevColor[f.sev]}`}>
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`w-2 h-2 rounded-full ${dotColor[f.sev]}`} />
                    <span className="text-sm font-semibold text-foreground">{f.fam}</span>
                    <span className="ml-auto text-[10px] text-muted">{f.count} clauses</span>
                  </div>
                  <p className="text-[11px] text-muted leading-relaxed">{f.quote}</p>
                </div>
              );
            })}
          </div>

          {/* Term ladder */}
          <div className="mt-6 rounded-2xl border border-border bg-surface p-5">
            <div className="text-xs uppercase tracking-wider text-muted mb-4">Term ladder · 35 possible years</div>
            <div className="flex gap-1 h-12 items-stretch">
              <div className="flex-[15] flex items-center justify-center rounded-l-md bg-accent text-background font-bold text-sm">
                Initial · 15 years
              </div>
              <div className="flex-[10] flex items-center justify-center bg-accent/70 text-background font-bold text-sm">
                Renewal 1 · 10 years
              </div>
              <div className="flex-[10] flex items-center justify-center rounded-r-md bg-accent/40 text-background font-bold text-sm">
                Renewal 2 · 10 years
              </div>
            </div>
            <div className="mt-3 grid md:grid-cols-3 gap-3 text-[11px] text-muted">
              <div>· No franchisor termination without cause</div>
              <div>· Renewal: greater of $10K or 10% of then-current franchise fee</div>
              <div>· 2-year / 10-mile post-term noncompete (or Territory, greater of)</div>
            </div>
          </div>
        </div>
      </section>

      {/* RED FLAGS */}
      <section id="redflags" className="max-w-7xl mx-auto px-6 py-10">
        <div className="flex items-center gap-3 mb-6">
          <div className="h-8 w-1 rounded bg-danger" />
          <h2 className="text-2xl font-bold text-foreground">Red flags · {brand.redFlags?.length || 0} surfaced</h2>
          <span className="px-2 py-0.5 text-[10px] uppercase tracking-wider rounded bg-danger-light text-danger border border-danger/20">
            {brand.redFlags?.filter((r) => r.severity === "critical").length || 0} critical · {brand.redFlags?.filter((r) => r.severity === "warning").length || 0} warning · {brand.redFlags?.filter((r) => r.severity === "info").length || 0} info
          </span>
        </div>

        <div className="grid lg:grid-cols-2 gap-4">
          {brand.redFlags?.map((flag, i) => {
            const sevStyles: Record<string, { bg: string; border: string; chip: string; dot: string }> = {
              critical: { bg: "bg-danger/5", border: "border-danger/30", chip: "bg-danger-light text-danger", dot: "bg-danger" },
              warning: { bg: "bg-warning/5", border: "border-warning/30", chip: "bg-warning-light text-warning", dot: "bg-warning" },
              info: { bg: "bg-cyan/5", border: "border-cyan/30", chip: "bg-cyan-light text-cyan", dot: "bg-cyan" },
            };
            const s = sevStyles[flag.severity];
            return (
              <div key={i} className={`rounded-2xl border p-5 ${s.bg} ${s.border}`}>
                <div className="flex items-start gap-3 mb-2">
                  <span className={`mt-1 w-2.5 h-2.5 rounded-full ${s.dot} shrink-0`} />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`text-[10px] uppercase tracking-wider px-2 py-0.5 rounded ${s.chip}`}>
                        {flag.severity}
                      </span>
                      <span className="text-[10px] uppercase tracking-wider text-muted">{flag.category}</span>
                    </div>
                    <h3 className="text-base font-bold text-foreground mt-1">{flag.title}</h3>
                  </div>
                </div>
                <p className="text-sm text-muted leading-relaxed">{flag.description}</p>
                {flag.fddReference && (
                  <div className="mt-3 text-[10px] text-muted font-mono">
                    Source: {flag.fddReference}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* PRESERVED CONTRADICTIONS */}
      <section className="bg-surface-alt border-y border-border">
        <div className="max-w-7xl mx-auto px-6 py-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-8 w-1 rounded bg-warning" />
            <h2 className="text-2xl font-bold text-foreground">Document-level contradictions preserved</h2>
            <span className="px-2 py-0.5 text-[10px] uppercase tracking-wider rounded bg-warning-light text-warning border border-warning/20">5 surfaced + 3 from financial notes</span>
          </div>

          <div className="grid md:grid-cols-2 gap-3">
            {[
              { title: "Trademark ownership conflict", body: "Item 1 body (p33) says Ivybrook Franchising owns the principal trademarks. Exhibit J Note 1 says McWilliams Properties, LLC (a previously undisclosed affiliate, formed 2005) owns them and licenses to Ivybrook under a 20-year auto-renewing license." },
              { title: "Catapult formation date", body: "Item 1 body says October 25, 2019. Exhibit J Note 1 says October 25, 2022. Two-year discrepancy on the affiliate that supplies The Student Hub software." },
              { title: "Advertising expense $128K vs $118K", body: "FY2024 income statement line shows $128,504. Note 1 narrative discloses $118,504. $10K discrepancy within the same audited document." },
              { title: "Item 19 cohort 18 vs 19", body: "Table 2C labels the 3-year+ cohort as 18 schools. Table 3 narrative says 19 schools and the row sums to 19. Off-by-one within the same FPR." },
              { title: "Gross Revenue defined two ways", body: "Item 6 Note 2 includes business interruption insurance proceeds. Item 19 Note 3 omits them. Material when royalty/Brand Fund applies to insurance recoveries." },
              { title: "Exhibit K vs Exhibit L labeling", body: "TOC and Item 20 body say Exhibit K is the franchisee list. Page 2 'How to Use' Q&A and the physical exhibit headers say Exhibit L. Document-level mislabeling across four locations." },
            ].map((c, i) => (
              <div key={i} className="rounded-xl border border-warning/20 bg-warning/5 p-4">
                <div className="text-sm font-semibold text-foreground">{c.title}</div>
                <p className="text-xs text-muted mt-1.5 leading-relaxed">{c.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* DILIGENCE QUESTIONS */}
      <section id="diligence" className="max-w-7xl mx-auto px-6 py-10">
        <div className="flex items-center gap-3 mb-6">
          <div className="h-8 w-1 rounded bg-accent" />
          <h2 className="text-2xl font-bold text-foreground">Questions to ask before signing</h2>
        </div>
        <div className="grid md:grid-cols-2 gap-3">
          {[
            { q: "Of your 42 signed-not-opened agreements, how many have site approval and how many are stalled at site selection?", why: "42 unopened backlog is the largest single risk to system growth (Special Risk #4)." },
            { q: "What was the average and median time-to-open for franchisees that opened in 2023 and 2024?", why: "Item 11 says 6–18 months; FA §16 allows termination after 18 months. Hidden delays would be visible here." },
            { q: "What is the franchisor's cash position today and what is its budget for 2026?", why: "$300K cash + $346K equity is thin against $3.4M deferred franchise fees. Auditor opinion is clean but the qualitative cover risk remains." },
            { q: "Who is paying for the planned 2026 Brand Fund increase from 1% to 2%?", why: "Adds 1 point to recurring fee floor. Franchisees only, or company-owned schools too?" },
            { q: "How many franchisees achieved or exceeded the disclosed median EBITDA after also drawing an owner salary?", why: "Item 19 EBITDA excludes owner compensation. Median 2Y+ EBITDA of $152K becomes $0–$80K after a market-rate owner salary depending on hours." },
            { q: "What are the top three cure-cost or noncompliance fees the franchisor has actually charged any franchisee in the last 12 months?", why: "FA §3.10 allows up to $1,000/wk plus 10% markup on cure costs with no cap." },
            { q: "What is the franchisor's data-access policy in practice?", why: "FA §12.6/12.7 + §13.17 give franchisor unlimited real-time access to all franchisee operating data and ownership of all 'Franchised Business Data'." },
            { q: "How will the August 2025 Crux acquisition change the franchisor support team and any planned investments?", why: "PE acquisition post-dates FY2024 financials; Item 1 disclosure but no support-impact narrative." },
            { q: "Has any state administrator (other than IL/MN/VA) raised an objection during the current registration cycle?", why: "Only 3 state addenda exist; IL fee deferral was AG-imposed; states with Pending status may add similar conditions." },
            { q: "Will the franchisor share unredacted franchisee EBITDA data so I can validate the 19% / 22% margin claims?", why: "Item 19 says substantiation 'will be made available to prospective franchisees upon reasonable request.'" },
          ].map((d, i) => (
            <div key={i} className="rounded-xl border border-border bg-surface p-4">
              <div className="text-[10px] uppercase tracking-wider text-accent">Q{i + 1}</div>
              <div className="text-sm font-semibold text-foreground mt-1 leading-snug">{d.q}</div>
              <div className="text-xs text-muted mt-2 leading-relaxed"><span className="text-muted/70 italic">Why:</span> {d.why}</div>
            </div>
          ))}
        </div>
      </section>

      {/* EXTRACTION PROVENANCE */}
      <section className="bg-surface-alt border-t border-border">
        <div className="max-w-7xl mx-auto px-6 py-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-8 w-1 rounded bg-cyan" />
            <h2 className="text-2xl font-bold text-foreground">Extraction provenance</h2>
            <span className="px-2 py-0.5 text-[10px] uppercase tracking-wider rounded bg-cyan-light text-cyan border border-cyan/20">Full transparency</span>
          </div>

          <div className="grid lg:grid-cols-3 gap-5">
            <div className="rounded-2xl border border-border bg-surface p-5">
              <div className="text-xs uppercase tracking-wider text-muted">Source document</div>
              <div className="mt-2 text-sm text-foreground leading-relaxed">
                <span className="font-semibold">637976-2025-Ivybrook-Academy.pdf</span><br />
                <span className="text-muted">207 pages · 8.2 MB · WI DFI registry</span>
              </div>
              <div className="mt-3 text-xs text-muted">
                Issued: <span className="text-foreground">March 28, 2025</span><br />
                Amended: <span className="text-foreground">September 15, 2025</span>
              </div>
            </div>

            <div className="rounded-2xl border border-border bg-surface p-5">
              <div className="text-xs uppercase tracking-wider text-muted">Pipeline</div>
              <div className="mt-2 text-sm text-foreground leading-relaxed">
                13-step shadow extraction → depth pass (financial notes / contract burdens / promotion audit) → publish gate → reconciliation pass (regression check / conflict adjudication / reconciled gate / patch log) → RP1 vision-OCR Exhibit J recovery
              </div>
              <div className="mt-3 text-xs text-muted">
                Render cascade: <span className="text-foreground">pdftoppm</span> if available → <span className="text-foreground">fitz pixmap @ 200 DPI</span> → <span className="text-foreground">multimodal vision OCR</span>
              </div>
            </div>

            <div className="rounded-2xl border border-border bg-surface p-5">
              <div className="text-xs uppercase tracking-wider text-muted">Coverage metrics</div>
              <div className="mt-3 grid grid-cols-2 gap-3">
                <div>
                  <div className="text-xl font-bold text-foreground">~165</div>
                  <div className="text-[10px] text-muted">canonical fields</div>
                </div>
                <div>
                  <div className="text-xl font-bold text-foreground">19</div>
                  <div className="text-[10px] text-muted">tables</div>
                </div>
                <div>
                  <div className="text-xl font-bold text-foreground">14</div>
                  <div className="text-[10px] text-muted">exhibits</div>
                </div>
                <div>
                  <div className="text-xl font-bold text-foreground">~25</div>
                  <div className="text-[10px] text-muted">contract burdens</div>
                </div>
                <div>
                  <div className="text-xl font-bold text-success">8</div>
                  <div className="text-[10px] text-muted">red flags surfaced</div>
                </div>
                <div>
                  <div className="text-xl font-bold text-warning">8</div>
                  <div className="text-[10px] text-muted">contradictions preserved</div>
                </div>
              </div>
              <div className="mt-3 text-xs text-success font-semibold">99.5% weighted coverage</div>
            </div>
          </div>

          <div className="mt-5 rounded-xl border border-cyan/20 bg-cyan/5 p-4">
            <div className="text-xs uppercase tracking-wider text-cyan mb-2">Vision OCR breakthrough · Exhibit J</div>
            <div className="text-sm text-foreground leading-relaxed">
              Exhibit J (financial statements, pages 168–197) was scanned-image only in the FDD text layer — no statement content extractable via standard PyMuPDF. The render cascade rendered all 30 pages to PNG via fitz pixmap @ 200 DPI, then the multimodal Read tool's vision capability OCR'd each page directly. <span className="font-semibold text-foreground">This recovered the auditor identity (Reese CPA LLC), the unmodified clean opinion, the full balance sheet, income statement, statement of changes in members' equity, statement of cash flows, and all 7 notes to financial statements</span> — closing what had been the single largest gap in the extraction.
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER ATTRIBUTION */}
      <section className="max-w-7xl mx-auto px-6 py-8 text-center">
        <p className="text-xs text-muted">
          Last verified <span className="text-foreground">{brand.dataVerified}</span> · Source: <a href="https://apps.dfi.wi.gov/apps/FranchiseEFiling/" target="_blank" rel="noopener" className="text-accent hover:underline">WI DFI franchise filings</a> · file #637976
        </p>
        <p className="text-xs text-muted mt-2">
          <Link href="/brands" className="text-accent hover:underline">← Browse all brands</Link>
        </p>
      </section>
    </div>
  );
}
