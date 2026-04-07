import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getBrandBySlug } from "@/data/brands";
import WatchButton from "@/components/WatchButton";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Rocky Rococo Pizza and Pasta Franchise · 2025 FDD Deep Dive · franchiese",
  description:
    "The most complete Rocky Rococo Pizza and Pasta franchise analysis on the internet. 167-page 2025 WI DFI filing #638785 fully extracted. Fee stack, contract burdens, financial health, and the FA-vs-FDA noncompete trap.",
};

/* ─── primitives (mirrors Ivybrook page) ─── */

function Sparkline({ points, width = 220, height = 56, stroke = "var(--accent)", fill = "rgba(6,182,212,0.12)" }: { points: number[]; width?: number; height?: number; stroke?: string; fill?: string }) {
  if (points.length === 0) return null;
  const min = Math.min(...points);
  const max = Math.max(...points);
  const range = max - min || 1;
  const stepX = width / (points.length - 1 || 1);
  const path = points.map((p, i) => { const x = i * stepX; const y = height - ((p - min) / range) * (height - 8) - 4; return `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`; }).join(" ");
  const area = `${path} L${width.toFixed(1)},${height.toFixed(1)} L0,${height.toFixed(1)} Z`;
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      <path d={area} fill={fill} />
      <path d={path} stroke={stroke} strokeWidth={2} fill="none" strokeLinecap="round" strokeLinejoin="round" />
      {points.map((p, i) => { const x = i * stepX; const y = height - ((p - min) / range) * (height - 8) - 4; return <circle key={i} cx={x} cy={y} r={3} fill={stroke} />; })}
    </svg>
  );
}

function HBar({ value, max, color = "var(--accent)", height = 10 }: { value: number; max: number; color?: string; height?: number }) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));
  return (
    <div className="w-full bg-surface-alt rounded-full overflow-hidden" style={{ height }}>
      <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: color }} />
    </div>
  );
}

function MiniStat({ label, value, delta, tone }: { label: string; value: string; delta?: string; tone?: "accent" | "success" | "warning" | "danger" }) {
  const toneClass = tone === "success" ? "text-success" : tone === "warning" ? "text-warning" : tone === "danger" ? "text-danger" : tone === "accent" ? "text-accent" : "text-foreground";
  return (
    <div className="rounded-xl border border-border bg-surface p-3">
      <div className="text-[10px] uppercase tracking-wider text-muted">{label}</div>
      <div className={`text-xl font-bold mt-1 ${toneClass}`}>{value}</div>
      {delta && <div className="text-[10px] text-muted mt-0.5">{delta}</div>}
    </div>
  );
}

/* ─── Page ─── */

export default function RockyRococoPage() {
  const brand = getBrandBySlug("rocky-rococo-pizza-and-pasta");
  if (!brand) return notFound();

  const royaltyPct = 5;
  const marketingFundPct = 0.75;
  const recurringPct = royaltyPct + marketingFundPct;

  const incomeStatement = [
    { year: 2022, revenue: 900330, ni: 15245, ocf: -16038 },
    { year: 2023, revenue: 1284610, ni: 65220, ocf: 56202 },
    { year: 2024, revenue: 1382868, ni: 70626, ocf: 148606 },
  ];

  const balanceSheet = [
    { year: 2022, assets: 546013, equity: 310854, cash: 464742 },
    { year: 2023, assets: 630889, equity: 376074, cash: 520944 },
    { year: 2024, assets: 766410, equity: 446700, cash: 669550 },
  ];

  const yearlyOutlets = [
    { year: 2022, franchised: 18, affiliate: 8, predecessor: 6, total: 32 },
    { year: 2023, franchised: 21, affiliate: 7, predecessor: 3, total: 31 },
    { year: 2024, franchised: 24, affiliate: 7, predecessor: 0, total: 31 },
  ];

  const stateOutlets = [
    { state: "WI", franchised: 23, affiliate: 7 },
    { state: "MN", franchised: 1, affiliate: 0 },
  ];

  const feeStack = [
    { label: "Initial franchise fee (1st store)", value: "$25,000", note: "$17,500 second store · two installments via Franchise Deposit Agreement" },
    { label: "Royalty", value: "5% of weekly gross sales", note: "Retroactive step-down to 3.5% if FY gross sales below $425,000 (52-wk) or $433,173 (53-wk). Refund within 30 days of FY-end if franchisee current." },
    { label: "Marketing Fund", value: "Up to 0.75%", note: "Currently collected. Fund is explicitly unaudited. RFC may pay its own staff salaries from Fund." },
    { label: "Local Ad Fund", value: "Up to 3.5%", note: "Tiered by media type (1.5%/2.5%/3.5%). NOT currently collected; reinstateable on 30 days notice." },
    { label: "Grand opening advertising", value: "≥ $5,000", note: "30 days pre to 30 days post opening" },
    { label: "Computer system", value: "≈ $10,000", note: "Initial; ongoing upgrades required at franchisee expense" },
    { label: "Transfer fee", value: "50% of then-current initial fee", note: "Plus full transferee re-training and remodel" },
    { label: "Audit cost shift", value: "Trigger at 2% deficiency", note: "Above 2% understatement, franchisee pays accountants + attorneys + interest" },
    { label: "Interest on overdue", value: "1.5%/month or max legal", note: "" },
    { label: "Indemnification", value: "Uncapped", note: "11 broad subparts including 'active or passive negligence of RFC'" },
  ];

  const investmentRows = [
    { label: "Initial Franchise Fee", low: 25000, high: 25000 },
    { label: "Equipment & Fixtures", low: 80000, high: 300000 },
    { label: "Leasehold Improvements", low: 80000, high: 325000 },
    { label: "Opening Inventory", low: 4000, high: 12000 },
    { label: "Security Deposits", low: 0, high: 4000 },
    { label: "Promotion (grand opening)", low: 5000, high: 5000 },
    { label: "Pre-Opening Training", low: 1000, high: 5000 },
    { label: "Misc. (legal, permits)", low: 1000, high: 4500 },
    { label: "Additional Funds (3 mos.)", low: 10000, high: 20000 },
    { label: "Insurance", low: 5000, high: 5000 },
  ];

  const redFlags = [
    { sev: "high", title: "FA vs FDA post-term noncompete contradiction", body: "Franchise Agreement says 1 yr / 5 miles. Franchise Deposit Agreement says 1 yr / 50 miles. A prospective franchisee who drops out during the 180-day FDA site-search window without ever operating a restaurant is locked out of effectively the entire WI/MN regional market for 12 months." },
    { sev: "high", title: "No Item 19 financial performance representation", body: "RFC makes no FPR. All unit economics diligence must come from Item 20 franchisee outreach. There are no charts, no averages, no medians, no quartiles." },
    { sev: "med", title: "Royalty step-down implies many stores miss $425K threshold", body: "FY2024 royalty revenue was flat vs FY2023 ($1.063M vs $1.063M) despite the franchised count growing from 21 to 24. This is consistent with a material number of stores triggering the 3.5% step-down." },
    { sev: "med", title: "Related-party management fees = 170% of operating income", body: "RFC paid $167,977 in management/consulting fees to related entities in FY2024 — vs operating income of $98,258. The Hester family controls both sides." },
    { sev: "med", title: "Zero-rent related-party facility lease", body: "RFC operates from a facility leased by a related party at zero rent. This is an unquantified SG&A subsidy that could disappear." },
    { sev: "med", title: "Marketing Fund explicitly unaudited; 29.5% of spend on PR", body: "Fund is not audited. Only an unaudited annual statement is prepared on request. FY2024 mix: 66.83% advertising / 3.63% admin / 29.53% public relations." },
    { sev: "med", title: "Renewal FA may have 'materially different' terms", body: "Renewal is conditioned on signing the then-current Franchise Agreement, which the FDD explicitly says may contain 'materially different terms and conditions than the original contract.'" },
    { sev: "low", title: "1-mile territory with mall + CBD carveouts", body: "The 1-mile radius is voided inside major regional shopping malls and central business districts in RFC's sole judgment — RFC can place another Rocky Rococo inside your nominally protected zone." },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* breadcrumb */}
      <nav className="max-w-7xl mx-auto px-6 pt-6 pb-2">
        <ol className="flex items-center gap-2 text-sm text-muted">
          <li><Link href="/" className="hover:text-accent">Home</Link></li>
          <li>›</li>
          <li><Link href="/brands" className="hover:text-accent">Brands</Link></li>
          <li>›</li>
          <li className="text-foreground font-medium">Rocky Rococo Pizza and Pasta</li>
        </ol>
      </nav>

      {/* HERO */}
      <section className="hero-mesh border-b border-border">
        <div className="max-w-7xl mx-auto px-6 pt-8 pb-14">
          <div className="grid lg:grid-cols-3 gap-8 items-start">
            <div className="lg:col-span-2">
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className="px-3 py-1 text-xs font-medium rounded-full bg-accent-light text-accent border border-accent/20">
                  Food & Beverage · Quick-service Pizza
                </span>
                <span className="px-3 py-1 text-xs font-medium rounded-full bg-success-light text-success border border-success/20">
                  ✓ Verified · 2025 FDD
                </span>
                <span className="px-3 py-1 text-xs font-medium rounded-full bg-cyan-light text-cyan border border-cyan/20">
                  167-page deep extract
                </span>
                <span className="px-3 py-1 text-xs font-medium rounded-full bg-warning-light text-warning border border-warning/20">
                  No Item 19 · WI/MN only
                </span>
              </div>
              <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-foreground">
                Rocky Rococo Pizza and Pasta
              </h1>
              <p className="text-lg text-muted mt-2">
                Regional pan-pizza & pasta franchise · 31 outlets in Wisconsin and Minnesota · founded 1982, franchising since 1995 · headquartered Oconomowoc, WI
              </p>
              <p className="text-sm text-muted mt-4 max-w-3xl leading-relaxed">
                The most complete Rocky Rococo analysis on the internet. Built from the full 167-page 2025 FDD (WI DFI filing #638785, issued April 24, 2025). Family-controlled (Hester family) regional system with a clean Vrakas audit, zero litigation, zero bankruptcy, and a hidden FA-vs-FDA post-term noncompete trap that every prospect should resolve in writing before signing.
              </p>

              <div className="flex flex-wrap gap-2 mt-5">
                <a href="#fees" className="px-3 py-1.5 text-xs font-medium rounded-md bg-surface border border-border hover:border-accent text-foreground">Fee stack ↓</a>
                <a href="#investment" className="px-3 py-1.5 text-xs font-medium rounded-md bg-surface border border-border hover:border-accent text-foreground">Investment ↓</a>
                <a href="#financials" className="px-3 py-1.5 text-xs font-medium rounded-md bg-surface border border-border hover:border-accent text-foreground">Franchisor financials ↓</a>
                <a href="#growth" className="px-3 py-1.5 text-xs font-medium rounded-md bg-surface border border-border hover:border-accent text-foreground">Growth & footprint ↓</a>
                <a href="#contract" className="px-3 py-1.5 text-xs font-medium rounded-md bg-surface border border-border hover:border-accent text-foreground">Contract burden ↓</a>
                <a href="#redflags" className="px-3 py-1.5 text-xs font-medium rounded-md bg-surface border border-border hover:border-accent text-foreground">Red flags ↓</a>
                <a href="#diligence" className="px-3 py-1.5 text-xs font-medium rounded-md bg-surface border border-border hover:border-accent text-foreground">Diligence questions ↓</a>
              </div>
            </div>

            <div className="rounded-2xl border border-border bg-surface p-5 lg:sticky lg:top-6">
              <div className="text-[11px] uppercase tracking-wider text-muted mb-3">Snapshot</div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div><div className="text-[10px] text-muted uppercase">Total outlets</div><div className="text-2xl font-bold text-foreground">31</div></div>
                <div><div className="text-[10px] text-muted uppercase">Franchised</div><div className="text-2xl font-bold text-foreground">24</div></div>
                <div><div className="text-[10px] text-muted uppercase">States</div><div className="text-2xl font-bold text-foreground">2</div></div>
                <div><div className="text-[10px] text-muted uppercase">Term</div><div className="text-2xl font-bold text-foreground">15 + 15</div></div>
              </div>
              <div className="mt-4 pt-4 border-t border-border">
                <WatchButton slug="rocky-rococo-pizza-and-pasta" name="Rocky Rococo Pizza and Pasta" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* AT-A-GLANCE STAT STRIP */}
      <section className="max-w-7xl mx-auto px-6 -mt-8 mb-10">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
          <MiniStat label="Outlets (end 2024)" value="31" delta="24 franchised + 7 affiliate" tone="accent" />
          <MiniStat label="Net new 2024" value="0" delta="growth offset by predecessor wind-down" />
          <MiniStat label="Franchise fee" value="$25K" delta="$17.5K second store" />
          <MiniStat label="Initial investment" value="$211K–$705K" delta="free-standing 'substantially higher'" />
          <MiniStat label="Recurring %" value={`${recurringPct}%`} delta="5% royalty + 0.75% Marketing Fund" />
          <MiniStat label="Royalty step-down" value="3.5%" delta="if FY gross < $425K" tone="warning" />
          <MiniStat label="Term" value="15 yrs" delta="+ 1× 15-yr renewal, no fee" />
          <MiniStat label="Item 19 FPR" value="None" delta="negative disclosure" tone="warning" />
          <MiniStat label="FY2024 revenue" value="$1.38M" delta="net income $70.6K" tone="success" />
          <MiniStat label="Cash 12/30/24" value="$670K" delta="zero long-term debt" tone="success" />
          <MiniStat label="Auditor" value="Vrakas, S.C." delta="clean opinion · 03/06/2025" tone="success" />
          <MiniStat label="Litigation / BK" value="None" delta="exceptionally clean record" tone="success" />
        </div>
      </section>

      {/* FEE STACK */}
      <section id="fees" className="max-w-7xl mx-auto px-6 py-10">
        <div className="flex items-center gap-3 mb-6">
          <div className="h-8 w-1 rounded bg-accent" />
          <h2 className="text-2xl font-bold text-foreground">Fee stack · Items 5 & 6</h2>
          <span className="px-2 py-0.5 text-[10px] uppercase tracking-wider rounded bg-warning-light text-warning border border-warning/20">Royalty has retro safety valve</span>
        </div>

        <div className="rounded-2xl border border-border bg-surface overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-surface-alt border-b border-border">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-muted text-xs uppercase tracking-wider">Fee</th>
                <th className="text-left px-4 py-3 font-medium text-muted text-xs uppercase tracking-wider">Amount</th>
                <th className="text-left px-4 py-3 font-medium text-muted text-xs uppercase tracking-wider">Notes</th>
              </tr>
            </thead>
            <tbody>
              {feeStack.map((f) => (
                <tr key={f.label} className="border-b border-border last:border-0">
                  <td className="px-4 py-3 text-foreground font-medium">{f.label}</td>
                  <td className="px-4 py-3 text-foreground font-mono">{f.value}</td>
                  <td className="px-4 py-3 text-xs text-muted">{f.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-5 grid lg:grid-cols-2 gap-5">
          <div className="rounded-2xl border border-border bg-success-light/30 p-5">
            <div className="text-xs uppercase tracking-wider text-success font-semibold mb-2">Distinctive · Royalty step-down</div>
            <p className="text-sm text-foreground leading-relaxed">
              If a restaurant fails to clear <span className="font-bold">$425,000</span> in annual gross sales, the 5% royalty is retroactively reduced to <span className="font-bold">3.5%</span> for that fiscal year and the difference is refunded within 30 days of year-end. The franchisee must be current on all fees to receive the refund. This is unusual for QSR pizza and provides a real downside cushion — but it also implies that a meaningful portion of the system trades below the $425K threshold (FY2024 royalty revenue was flat vs FY2023 despite +3 stores).
            </p>
          </div>
          <div className="rounded-2xl border border-border bg-warning/5 p-5">
            <div className="text-xs uppercase tracking-wider text-warning font-semibold mb-2">⚠ Marketing Fund mechanics</div>
            <p className="text-sm text-foreground leading-relaxed">
              The Marketing Fund is explicitly <span className="font-bold">unaudited</span>. RFC may use Fund money for its own staff salaries, administrative overhead, and to pay interest on Fund borrowings. RFC is not obligated to spend Fund money in the franchisee's local area. FY2024 spending mix: 66.83% advertising/marketing, 3.63% administration, <span className="text-warning font-bold">29.53% public relations</span>.
            </p>
          </div>
        </div>
      </section>

      {/* INVESTMENT */}
      <section id="investment" className="bg-surface-alt border-y border-border">
        <div className="max-w-7xl mx-auto px-6 py-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-8 w-1 rounded bg-accent" />
            <h2 className="text-2xl font-bold text-foreground">Initial investment · Item 7</h2>
            <span className="px-2 py-0.5 text-[10px] uppercase tracking-wider rounded bg-cyan-light text-cyan border border-cyan/20">$211K – $705K</span>
          </div>

          <div className="rounded-2xl border border-border bg-surface p-5">
            <div className="space-y-3">
              {investmentRows.map((r) => (
                <div key={r.label}>
                  <div className="flex items-baseline justify-between text-sm mb-1">
                    <span className="text-foreground">{r.label}</span>
                    <span className="font-mono text-muted">
                      ${(r.low / 1000).toFixed(0)}K – ${(r.high / 1000).toFixed(0)}K
                    </span>
                  </div>
                  <HBar value={r.high} max={325000} color="var(--accent)" height={8} />
                </div>
              ))}
              <div className="pt-3 mt-3 border-t border-border flex items-baseline justify-between">
                <span className="text-base font-bold text-foreground">Total</span>
                <span className="font-mono font-bold text-foreground">$211,000 – $705,500</span>
              </div>
            </div>
            <div className="mt-5 text-[11px] text-muted leading-relaxed">
              Three format footprints — enclosed mall (~900 sf), strip-center mall (~2,800 sf), free-standing (~3,800 sf). RFC explicitly does not project free-standing costs and warns they are "substantially higher" than the disclosed range. Additional funds estimate assumes owner-operated business with no salary/draw, only 3 months. RFC warns prospects "can expect to put additional cash into the business during at least the first 3 to 9 months, and sometimes longer." No financing offered direct or indirect.
            </div>
          </div>
        </div>
      </section>

      {/* FINANCIALS */}
      <section id="financials" className="max-w-7xl mx-auto px-6 py-10">
        <div className="flex items-center gap-3 mb-6 flex-wrap">
          <div className="h-8 w-1 rounded bg-accent" />
          <h2 className="text-2xl font-bold text-foreground">Franchisor financials · Item 21 / Exhibit FIN</h2>
          <span className="px-2 py-0.5 text-[10px] uppercase tracking-wider rounded bg-cyan-light text-cyan border border-cyan/20">Auditor: Vrakas, S.C.</span>
          <span className="px-2 py-0.5 text-[10px] uppercase tracking-wider rounded bg-success-light text-success border border-success/20">Clean opinion · no going concern</span>
        </div>

        <div className="grid lg:grid-cols-3 gap-5 mb-6">
          <div className="lg:col-span-2 rounded-2xl border border-border bg-surface p-5">
            <div className="text-xs uppercase tracking-wider text-muted mb-3">Revenue & net income · FY2022–2024</div>
            <div className="grid grid-cols-3 gap-4">
              {incomeStatement.map((r) => (
                <div key={r.year} className="rounded-lg bg-surface-alt border border-border p-3">
                  <div className="text-[10px] text-muted">FY{r.year}</div>
                  <div className="text-xl font-bold text-foreground mt-1">${(r.revenue / 1e6).toFixed(2)}M</div>
                  <div className="text-[10px] text-muted">total revenue</div>
                  <div className={`mt-2 text-sm font-semibold ${r.ni > 0 ? "text-success" : "text-danger"}`}>${(r.ni / 1000).toFixed(0)}K</div>
                  <div className="text-[10px] text-muted">net income</div>
                </div>
              ))}
            </div>
            <div className="mt-5">
              <Sparkline points={incomeStatement.map((r) => r.revenue)} width={520} height={70} />
              <div className="text-[10px] text-muted mt-1 text-center">Revenue trend · $0.90M → $1.28M → $1.38M (+54% over 3 years)</div>
            </div>
            <div className="mt-4 grid grid-cols-3 gap-2 text-[11px] text-muted">
              <div>Royalty FY24: <span className="text-warning font-semibold">flat vs FY23</span></div>
              <div>Operating CF FY24: <span className="text-success font-semibold">+$148.6K</span></div>
              <div>FY22 OCF: <span className="text-danger font-semibold">−$16.0K</span></div>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-surface p-5">
            <div className="text-xs uppercase tracking-wider text-muted mb-3">Equity · 2022–2024</div>
            <div className="space-y-2 text-sm">
              {balanceSheet.map((b) => (
                <div key={b.year}>
                  <div className="flex items-baseline justify-between">
                    <span className="text-muted text-xs">FY{b.year}</span>
                    <span className="font-semibold text-foreground">${(b.equity / 1000).toFixed(0)}K</span>
                  </div>
                  <HBar value={b.equity} max={500000} color="var(--success)" height={8} />
                </div>
              ))}
            </div>
            <div className="mt-4 text-[11px] text-muted leading-relaxed">
              Steady equity growth. Cash is 87% of total assets. Zero long-term debt. Total liabilities are dominated by the unaudited Marketing Fund liability, gift card float, and accounts payable.
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
          <MiniStat label="Total assets 12/30/24" value="$766K" delta="vs $631K (12/25/23)" tone="success" />
          <MiniStat label="Cash 12/30/24" value="$670K" delta="2.1× current liabilities" tone="success" />
          <MiniStat label="Retained earnings" value="$507K" delta="growth across all 3 years" tone="success" />
          <MiniStat label="Long-term debt" value="$0" delta="only $2K deferred tax" tone="success" />
        </div>

        <div className="grid lg:grid-cols-2 gap-5">
          <div className="rounded-2xl border border-border bg-surface p-5">
            <div className="text-xs uppercase tracking-wider text-muted mb-3">Auditor's opinion (Exhibit FIN)</div>
            <p className="text-sm text-foreground leading-relaxed">
              <span className="font-semibold">Vrakas, S.C.</span> of Brookfield, Wisconsin audited the financial statements as of December 30, 2024, December 25, 2023, and December 26, 2022 and issued an <span className="text-success font-semibold">unqualified (clean) opinion</span> dated <span className="font-semibold">March 6, 2025</span>. Going concern was evaluated by management and not flagged by the auditor. Three-year trend across all key statements available. Fiscal year is a 52-53 week period ending the last Monday in December.
            </p>
          </div>

          <div className="rounded-2xl border border-border bg-warning/5 p-5">
            <div className="text-xs uppercase tracking-wider text-warning font-semibold mb-2">⚠ Related party concentration</div>
            <p className="text-sm text-foreground leading-relaxed">
              Note 5 discloses that RFC paid <span className="font-bold">$167,977</span> in management/consulting fees to related parties in FY2024 — that's <span className="font-bold">170%</span> of operating income. The Hester family controls both the franchisor and the affiliate operating entities. The Company also operates from a facility leased by a related party at <span className="font-bold">zero rent</span>. If that subsidy ended, SG&A would rise materially and reported franchisor profitability would compress.
            </p>
          </div>
        </div>
      </section>

      {/* GROWTH & FOOTPRINT */}
      <section id="growth" className="bg-surface-alt border-y border-border">
        <div className="max-w-7xl mx-auto px-6 py-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-8 w-1 rounded bg-accent" />
            <h2 className="text-2xl font-bold text-foreground">Growth & footprint · Item 20</h2>
            <span className="px-2 py-0.5 text-[10px] uppercase tracking-wider rounded bg-success-light text-success border border-success/20">0 terminations · 0 non-renewals · 3 yrs</span>
          </div>

          <div className="grid lg:grid-cols-3 gap-5 mb-6">
            <div className="lg:col-span-2 rounded-2xl border border-border bg-surface p-5">
              <div className="text-xs uppercase tracking-wider text-muted mb-3">Outlet trajectory by type</div>
              <div className="grid grid-cols-3 gap-3 mb-4">
                {yearlyOutlets.map((g) => (
                  <div key={g.year} className="rounded-lg bg-surface-alt border border-border p-3">
                    <div className="text-[10px] text-muted">end {g.year}</div>
                    <div className="text-2xl font-bold text-foreground">{g.total}</div>
                    <div className="text-[10px] text-muted mt-1">
                      {g.franchised} franchised<br />{g.affiliate} affiliate<br />{g.predecessor} predecessor
                    </div>
                  </div>
                ))}
              </div>
              <Sparkline points={yearlyOutlets.map((g) => g.franchised)} width={520} height={70} />
              <div className="text-[10px] text-muted mt-1 text-center">Franchised trajectory · 18 → 21 → 24 (+33% over 3 years)</div>
              <div className="mt-3 text-[11px] text-muted leading-relaxed">
                System total is flat at 31 because franchised growth is offset by the wind-down of predecessor-franchised units. Of the 4 franchised additions in 2024, all 4 were predecessor-to-franchised transfers — zero new openings in 2024. Projected FY2025: 3 new franchised openings (2 WI, 1 MN).
              </div>
            </div>

            <div className="rounded-2xl border border-border bg-surface p-5">
              <div className="text-xs uppercase tracking-wider text-muted mb-3">By state · end 2024</div>
              <div className="space-y-3">
                {stateOutlets.map((s) => (
                  <div key={s.state}>
                    <div className="flex items-baseline justify-between text-sm">
                      <span className="text-foreground font-mono">{s.state}</span>
                      <span className="font-semibold text-foreground">{s.franchised + s.affiliate}</span>
                    </div>
                    <HBar value={s.franchised + s.affiliate} max={30} color="var(--accent)" height={10} />
                    <div className="text-[10px] text-muted mt-1">{s.franchised} franchised · {s.affiliate} affiliate</div>
                  </div>
                ))}
              </div>
              <div className="mt-4 text-[11px] text-muted leading-relaxed">
                Geographic concentration is extreme. All affiliate units are in Wisconsin. Single Minnesota unit (Brooklyn Park).
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <MiniStat label="Terminations 3-yr" value="0" tone="success" />
            <MiniStat label="Non-renewals 3-yr" value="0" tone="success" />
            <MiniStat label="Reacquisitions 3-yr" value="0" tone="success" />
            <MiniStat label="Transfers 3-yr" value="3" delta="all WI, 1/year" />
          </div>
        </div>
      </section>

      {/* CONTRACT BURDEN */}
      <section id="contract" className="max-w-7xl mx-auto px-6 py-10">
        <div className="flex items-center gap-3 mb-6">
          <div className="h-8 w-1 rounded bg-accent" />
          <h2 className="text-2xl font-bold text-foreground">Contract burden · Item 17 + Franchise Agreement</h2>
        </div>

        <div className="grid lg:grid-cols-2 gap-5">
          <div className="rounded-2xl border border-border bg-surface p-5">
            <div className="text-xs uppercase tracking-wider text-muted mb-3">Term, renewal, transfer</div>
            <ul className="space-y-2 text-sm text-foreground">
              <li><span className="text-muted">Term:</span> 15 years</li>
              <li><span className="text-muted">Renewal:</span> 15 years, no fee, but signing the then-current FA which may have <span className="text-warning font-semibold">"materially different terms"</span></li>
              <li><span className="text-muted">Transfer fee:</span> 50% of then-current initial franchise fee</li>
              <li><span className="text-muted">Right of first refusal:</span> Yes, RFC may match any offer</li>
              <li><span className="text-muted">Death/disability window:</span> 6 months to assign to approved buyer/heir</li>
              <li><span className="text-muted">Operations Manual:</span> RFC may change unilaterally</li>
            </ul>
          </div>

          <div className="rounded-2xl border border-border bg-surface p-5">
            <div className="text-xs uppercase tracking-wider text-muted mb-3">Termination & dispute resolution</div>
            <ul className="space-y-2 text-sm text-foreground">
              <li><span className="text-muted">Curable defaults:</span> 60-day cure (10 days for non-payment)</li>
              <li><span className="text-muted">Franchisee termination:</span> None except FDA 180-day site window</li>
              <li><span className="text-muted">Dispute resolution:</span> AAA binding arbitration at RFC's nearest office</li>
              <li><span className="text-muted">Governing law:</span> Wisconsin</li>
              <li><span className="text-muted">Jury waiver:</span> Yes (FA Sect. XXX)</li>
              <li><span className="text-muted">Non-arbitrable:</span> <span className="text-success font-semibold">Wisconsin Franchise Investment Law and Wisconsin Fair Dealership Act claims</span> are explicitly carved out</li>
            </ul>
          </div>

          <div className="lg:col-span-2 rounded-2xl border border-danger/30 bg-danger/5 p-5">
            <div className="text-xs uppercase tracking-wider text-danger font-semibold mb-2">⚠ Post-term noncompete trap — FA vs FDA contradiction</div>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div className="rounded-lg bg-surface border border-border p-3">
                <div className="text-[10px] uppercase text-muted">Franchise Agreement (post-operation)</div>
                <div className="text-foreground font-bold mt-1">1 year / 5-mile radius</div>
                <div className="text-[11px] text-muted mt-1">FA Sect. XVI.D (p.122)</div>
              </div>
              <div className="rounded-lg bg-surface border border-border p-3">
                <div className="text-[10px] uppercase text-muted">Franchise Deposit Agreement (pre-operation)</div>
                <div className="text-foreground font-bold mt-1">1 year / 50-mile radius</div>
                <div className="text-[11px] text-muted mt-1">FDA.5</div>
              </div>
            </div>
            <p className="text-sm text-foreground mt-3 leading-relaxed">
              These two variants live in two different contracts you sign at different times. A prospective franchisee who terminates under the FDA's 180-day site-search window — without ever operating a restaurant — is contractually locked out of effectively the entire WI/MN regional pan-pizza/pasta market for 12 months under the 50-mile radius. Enforceability under Wisconsin public policy is uncertain because the WI Fair Dealership Act protections may not attach pre-operation. <span className="font-bold">Get clarification in writing before signing the FDA.</span>
            </p>
          </div>
        </div>
      </section>

      {/* RED FLAGS */}
      <section id="redflags" className="bg-surface-alt border-y border-border">
        <div className="max-w-7xl mx-auto px-6 py-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-8 w-1 rounded bg-accent" />
            <h2 className="text-2xl font-bold text-foreground">Red flags · {redFlags.length} surfaced</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {redFlags.map((f, i) => (
              <div
                key={i}
                className={`rounded-2xl border p-5 ${
                  f.sev === "high"
                    ? "border-danger/40 bg-danger/5"
                    : f.sev === "med"
                    ? "border-warning/40 bg-warning/5"
                    : "border-border bg-surface"
                }`}
              >
                <div className="flex items-start gap-3">
                  <span
                    className={`px-2 py-0.5 text-[10px] uppercase tracking-wider rounded font-semibold ${
                      f.sev === "high"
                        ? "bg-danger text-white"
                        : f.sev === "med"
                        ? "bg-warning text-white"
                        : "bg-muted text-white"
                    }`}
                  >
                    {f.sev === "high" ? "High" : f.sev === "med" ? "Medium" : "Low"}
                  </span>
                  <div className="flex-1">
                    <div className="text-sm font-bold text-foreground">{f.title}</div>
                    <p className="text-xs text-muted mt-2 leading-relaxed">{f.body}</p>
                  </div>
                </div>
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

        <div className="grid md:grid-cols-2 gap-4">
          {[
            "Get the FA-vs-FDA noncompete contradiction (5 mi vs 50 mi) clarified in writing before signing the Franchise Deposit Agreement. Which radius actually controls if I drop out during the 180-day site-search window?",
            "How many of the 24 franchised stores triggered the 3.5% royalty step-down in FY2024? Royalty revenue was flat vs FY2023 despite +3 stores.",
            "Will the zero-rent related-party facility lease continue indefinitely? What is the implied subsidy value?",
            "Why is 29.53% of FY2024 Marketing Fund spending categorized as 'public relations'? What are those PR programs?",
            "Will the Marketing Fund ever be audited? Can a franchisee request an independent audit?",
            "Who is on the management/consulting payroll receiving $167,977 in related-party fees in FY2024? Is this expected to grow?",
            "Provide names and current contact info for at least 5 franchisees operating below the $425,000 royalty threshold so I can verify the step-down mechanic in practice.",
            "What 'materially different terms' have appeared in renewal FAs over the last 5 years compared to the original FA?",
            "Confirm whether RFC has placed an additional Rocky Rococo inside another franchisee's nominal 1-mile zone using the mall or CBD carveouts.",
            "Provide the actual P&L of the Mayfair Mall training-store affiliate so I can model the brand at scale.",
          ].map((q, i) => (
            <div key={i} className="rounded-xl border border-border bg-surface p-4">
              <div className="flex items-start gap-3">
                <span className="text-accent font-bold">{i + 1}.</span>
                <p className="text-sm text-foreground leading-relaxed">{q}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* PROVENANCE */}
      <section className="bg-surface-alt border-t border-border">
        <div className="max-w-7xl mx-auto px-6 py-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-8 w-1 rounded bg-accent" />
            <h2 className="text-2xl font-bold text-foreground">Extraction provenance</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
            <div className="rounded-xl border border-border bg-surface p-4">
              <div className="text-[10px] uppercase tracking-wider text-muted mb-1">Source document</div>
              <div className="text-foreground font-medium">WI DFI filing #638785</div>
              <div className="text-xs text-muted mt-1">167-page PDF, issued April 24, 2025</div>
            </div>
            <div className="rounded-xl border border-border bg-surface p-4">
              <div className="text-[10px] uppercase tracking-wider text-muted mb-1">Pipeline</div>
              <div className="text-foreground font-medium">automation_v1 (shadow-live)</div>
              <div className="text-xs text-muted mt-1">A1 → A2 (4 depth passes) → A3 → B1–B5 → merged publish</div>
            </div>
            <div className="rounded-xl border border-border bg-surface p-4">
              <div className="text-[10px] uppercase tracking-wider text-muted mb-1">Coverage</div>
              <div className="text-foreground font-medium">23 / 23 items · 5 / 5 exhibits</div>
              <div className="text-xs text-muted mt-1">8 unresolveds · 4 contradictions (3 reconciled · 1 unresolved)</div>
            </div>
            <div className="rounded-xl border border-border bg-surface p-4">
              <div className="text-[10px] uppercase tracking-wider text-muted mb-1">Audit</div>
              <div className="text-foreground font-medium">Vrakas, S.C. · clean opinion</div>
              <div className="text-xs text-muted mt-1">Report dated March 6, 2025 · no going concern</div>
            </div>
            <div className="rounded-xl border border-border bg-surface p-4">
              <div className="text-[10px] uppercase tracking-wider text-muted mb-1">FY end convention</div>
              <div className="text-foreground font-medium">52-53 week year</div>
              <div className="text-xs text-muted mt-1">Last Monday in December</div>
            </div>
            <div className="rounded-xl border border-border bg-surface p-4">
              <div className="text-[10px] uppercase tracking-wider text-muted mb-1">Last refresh</div>
              <div className="text-foreground font-medium">2026-04-07</div>
              <div className="text-xs text-muted mt-1">runs/shadow-live-rocky-rococo-2025/</div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER CTA */}
      <section className="max-w-7xl mx-auto px-6 py-8 text-center">
        <Link
          href="/brands"
          className="inline-block px-5 py-2.5 text-sm font-medium rounded-md border border-border bg-surface hover:border-accent text-foreground"
        >
          ← Back to all brands
        </Link>
      </section>
    </div>
  );
}
