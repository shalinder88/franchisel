"use client";

import type { Metadata } from "next";
import Link from "next/link";
import { useState, useMemo } from "react";

// ── Types ────────────────────────────────────────────────────────────────────

interface Inputs {
  grossRevenue: number;
  royaltyPct: number;
  marketingPct: number;
  techFeeMonthly: number;
  cogsPct: number;
  laborPct: number;
  rentMonthly: number;
  otherOpexPct: number;
  totalInvestment: number;
  loanAmount: number;
  loanRateApr: number;
  loanTermYears: number;
}

interface Results {
  grossRevenue: number;
  royalties: number;
  marketingFund: number;
  techFees: number;
  totalFranchisorFees: number;
  effectiveFeeRate: number;
  cogs: number;
  labor: number;
  rent: number;
  otherOpex: number;
  totalOperatingCosts: number;
  operatingIncome: number;
  annualDebtService: number;
  netIncome: number;
  breakEvenRevenue: number;
  paybackYears: number | null;
  cashOnCashReturn: number | null;
}

// ── Calculator helpers ───────────────────────────────────────────────────────

function calcAnnualPayment(principal: number, annualRate: number, years: number): number {
  if (principal <= 0 || years <= 0) return 0;
  if (annualRate === 0) return principal / years;
  const r = annualRate / 100 / 12;
  const n = years * 12;
  const monthly = (principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
  return monthly * 12;
}

function calcResults(inputs: Inputs): Results {
  const {
    grossRevenue,
    royaltyPct,
    marketingPct,
    techFeeMonthly,
    cogsPct,
    laborPct,
    rentMonthly,
    otherOpexPct,
    totalInvestment,
    loanAmount,
    loanRateApr,
    loanTermYears,
  } = inputs;

  const royalties = grossRevenue * (royaltyPct / 100);
  const marketingFund = grossRevenue * (marketingPct / 100);
  const techFees = techFeeMonthly * 12;
  const totalFranchisorFees = royalties + marketingFund + techFees;
  const effectiveFeeRate = grossRevenue > 0 ? (totalFranchisorFees / grossRevenue) * 100 : 0;

  const cogs = grossRevenue * (cogsPct / 100);
  const labor = grossRevenue * (laborPct / 100);
  const rent = rentMonthly * 12;
  const otherOpex = grossRevenue * (otherOpexPct / 100);
  const totalOperatingCosts = cogs + labor + rent + otherOpex + totalFranchisorFees;

  const operatingIncome = grossRevenue - totalOperatingCosts;

  const annualDebtService = calcAnnualPayment(loanAmount, loanRateApr, loanTermYears);
  const netIncome = operatingIncome - annualDebtService;

  // Break-even: fixed costs / (1 - variable cost rate)
  const fixedCosts = rent + techFees + annualDebtService;
  const variableRate =
    royaltyPct / 100 +
    marketingPct / 100 +
    cogsPct / 100 +
    laborPct / 100 +
    otherOpexPct / 100;
  const breakEvenRevenue = variableRate < 1 ? fixedCosts / (1 - variableRate) : 0;

  const equityInvested = totalInvestment - loanAmount;
  const paybackYears =
    equityInvested > 0 && netIncome > 0 ? equityInvested / netIncome : null;
  const cashOnCashReturn =
    equityInvested > 0 && netIncome !== 0 ? (netIncome / equityInvested) * 100 : null;

  return {
    grossRevenue,
    royalties,
    marketingFund,
    techFees,
    totalFranchisorFees,
    effectiveFeeRate,
    cogs,
    labor,
    rent,
    otherOpex,
    totalOperatingCosts,
    operatingIncome,
    annualDebtService,
    netIncome,
    breakEvenRevenue,
    paybackYears,
    cashOnCashReturn,
  };
}

// ── UI helpers ───────────────────────────────────────────────────────────────

function fmt(n: number): string {
  if (Math.abs(n) >= 1_000_000)
    return `$${(n / 1_000_000).toFixed(2)}M`;
  if (Math.abs(n) >= 1_000)
    return `$${Math.round(n).toLocaleString()}`;
  return `$${Math.round(n)}`;
}

function fmtPct(n: number): string {
  return `${n.toFixed(1)}%`;
}

function income_color(v: number) {
  if (v > 0) return "text-green-600";
  if (v < 0) return "text-red-600";
  return "text-amber-600";
}

// ── Input row component ──────────────────────────────────────────────────────

function Row({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-medium text-foreground">
        {label}
        {hint && <span className="ml-1 font-normal text-muted">({hint})</span>}
      </label>
      {children}
    </div>
  );
}

function NumberInput({
  value,
  onChange,
  min = 0,
  max,
  step = 1,
  prefix,
  suffix,
}: {
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
  step?: number;
  prefix?: string;
  suffix?: string;
}) {
  return (
    <div className="relative flex items-center">
      {prefix && (
        <span className="absolute left-3 text-xs text-muted pointer-events-none">{prefix}</span>
      )}
      <input
        type="number"
        value={value}
        min={min}
        max={max}
        step={step}
        onChange={(e) => {
          const v = parseFloat(e.target.value);
          if (!isNaN(v)) onChange(Math.min(max ?? Infinity, Math.max(min, v)));
        }}
        className={`w-full rounded-lg border border-border bg-background text-sm text-foreground py-2 focus:outline-none focus:ring-2 focus:ring-accent/40 ${prefix ? "pl-7" : "pl-3"} ${suffix ? "pr-8" : "pr-3"}`}
      />
      {suffix && (
        <span className="absolute right-3 text-xs text-muted pointer-events-none">{suffix}</span>
      )}
    </div>
  );
}

// ── Result bar ───────────────────────────────────────────────────────────────

function ResultRow({
  label,
  value,
  isNegative = false,
  isBold = false,
  indent = false,
}: {
  label: string;
  value: string;
  isNegative?: boolean;
  isBold?: boolean;
  indent?: boolean;
}) {
  return (
    <div
      className={`flex justify-between items-center py-1.5 ${indent ? "pl-4" : ""} ${isBold ? "font-semibold border-t border-border mt-1 pt-2" : ""}`}
    >
      <span className={`text-sm ${indent ? "text-muted" : "text-foreground"}`}>{label}</span>
      <span
        className={`text-sm font-medium tabular-nums ${isNegative ? "text-red-600" : isBold ? "text-foreground" : "text-foreground"}`}
      >
        {isNegative && value !== "$0" ? `(${value})` : value}
      </span>
    </div>
  );
}

// ── Defaults ─────────────────────────────────────────────────────────────────

const DEFAULTS: Inputs = {
  grossRevenue: 500_000,
  royaltyPct: 6,
  marketingPct: 2,
  techFeeMonthly: 300,
  cogsPct: 30,
  laborPct: 30,
  rentMonthly: 5_000,
  otherOpexPct: 5,
  totalInvestment: 350_000,
  loanAmount: 200_000,
  loanRateApr: 8.5,
  loanTermYears: 10,
};

const PRESETS: { name: string; inputs: Partial<Inputs> }[] = [
  {
    name: "Food / QSR",
    inputs: { grossRevenue: 750_000, royaltyPct: 6, marketingPct: 3, techFeeMonthly: 500, cogsPct: 35, laborPct: 28, rentMonthly: 8_000, otherOpexPct: 5, totalInvestment: 600_000, loanAmount: 400_000 },
  },
  {
    name: "Service (home)",
    inputs: { grossRevenue: 400_000, royaltyPct: 8, marketingPct: 2, techFeeMonthly: 200, cogsPct: 20, laborPct: 40, rentMonthly: 1_500, otherOpexPct: 5, totalInvestment: 180_000, loanAmount: 100_000 },
  },
  {
    name: "Fitness Studio",
    inputs: { grossRevenue: 600_000, royaltyPct: 7, marketingPct: 2, techFeeMonthly: 400, cogsPct: 5, laborPct: 35, rentMonthly: 10_000, otherOpexPct: 6, totalInvestment: 500_000, loanAmount: 300_000 },
  },
  {
    name: "Retail",
    inputs: { grossRevenue: 450_000, royaltyPct: 5, marketingPct: 2, techFeeMonthly: 350, cogsPct: 40, laborPct: 20, rentMonthly: 6_000, otherOpexPct: 5, totalInvestment: 280_000, loanAmount: 150_000 },
  },
];

// ── Main page ─────────────────────────────────────────────────────────────────

export default function FddCalculatorPage() {
  const [inputs, setInputs] = useState<Inputs>(DEFAULTS);
  const set = (key: keyof Inputs) => (v: number) =>
    setInputs((prev) => ({ ...prev, [key]: v }));

  const results = useMemo(() => calcResults(inputs), [inputs]);

  const applyPreset = (preset: (typeof PRESETS)[0]) => {
    setInputs((prev) => ({
      ...prev,
      ...preset.inputs,
      loanRateApr: prev.loanRateApr,
      loanTermYears: prev.loanTermYears,
    }));
  };

  const netIncomeColor =
    results.netIncome > 0
      ? "text-green-600"
      : results.netIncome < 0
        ? "text-red-600"
        : "text-amber-600";

  return (
    <>
      {/* Header */}
      <div className="border-b border-border bg-surface-alt">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <nav className="flex items-center gap-1.5 text-xs text-muted">
            <Link href="/" className="hover:text-accent transition-colors">Home</Link>
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
            <span className="text-foreground font-medium">FDD Financial Calculator</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Hero */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-3">
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-accent-light text-accent text-xs font-semibold">
              Free Tool
            </span>
            <span className="text-muted text-xs">No signup required</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            Franchise Scenario Calculator
          </h1>
          <p className="mt-2 text-base text-muted max-w-2xl leading-relaxed">
            Model franchise economics using your own assumptions. All inputs are user-provided — this
            tool does not use FDD data and does not produce financial performance representations.
          </p>
          <div className="mt-3 rounded-lg bg-warning/10 border border-warning/20 px-4 py-3">
            <p className="text-xs text-warning font-semibold">ASSUMPTION-BASED SCENARIO TOOL — NOT FDD-REPORTED RESULTS</p>
            <p className="text-xs text-muted mt-1">
              Output is based entirely on your inputs, not actual franchise performance data. Results are illustrative scenarios
              for educational purposes only. They are not projections, forecasts, or guarantees. Consult a franchise attorney
              and accountant before making investment decisions.
            </p>
          </div>
        </div>

        {/* Presets */}
        <div className="flex flex-wrap gap-2 mb-6">
          <span className="text-xs text-muted self-center">Example inputs — replace with your own research:</span>
          {PRESETS.map((p) => (
            <button
              key={p.name}
              onClick={() => applyPreset(p)}
              className="px-3 py-1.5 rounded-lg border border-border text-xs font-medium text-foreground hover:border-accent hover:text-accent transition-colors bg-background"
            >
              {p.name}
            </button>
          ))}
          <button
            onClick={() => setInputs(DEFAULTS)}
            className="px-3 py-1.5 rounded-lg border border-border text-xs font-medium text-muted hover:border-border hover:text-foreground transition-colors bg-background"
          >
            Reset
          </button>
        </div>

        <div className="grid lg:grid-cols-[1fr_380px] gap-8">
          {/* ── Left: Inputs ── */}
          <div className="space-y-8">
            {/* Revenue */}
            <section className="border border-border rounded-xl p-5 bg-background space-y-4">
              <h2 className="text-sm font-semibold text-foreground">Revenue</h2>
              <Row label="Annual Gross Revenue" hint="from Item 19 or franchisee interviews">
                <NumberInput value={inputs.grossRevenue} onChange={set("grossRevenue")} step={10_000} prefix="$" />
              </Row>
            </section>

            {/* Franchisor fees */}
            <section className="border border-border rounded-xl p-5 bg-background space-y-4">
              <h2 className="text-sm font-semibold text-foreground">Franchisor Fees <span className="text-xs font-normal text-muted">(from Item 6)</span></h2>
              <div className="grid sm:grid-cols-3 gap-4">
                <Row label="Royalty Rate">
                  <NumberInput value={inputs.royaltyPct} onChange={set("royaltyPct")} min={0} max={30} step={0.5} suffix="%" />
                </Row>
                <Row label="Marketing Fund">
                  <NumberInput value={inputs.marketingPct} onChange={set("marketingPct")} min={0} max={15} step={0.5} suffix="%" />
                </Row>
                <Row label="Tech / Software Fee" hint="monthly">
                  <NumberInput value={inputs.techFeeMonthly} onChange={set("techFeeMonthly")} min={0} step={50} prefix="$" />
                </Row>
              </div>
              <div className="text-xs text-muted bg-surface rounded-lg px-3 py-2">
                Effective franchisor fee rate:{" "}
                <span className="font-semibold text-foreground">{fmtPct(results.effectiveFeeRate)}</span>
                {" "}of gross revenue — {fmt(results.totalFranchisorFees)}/year
              </div>
            </section>

            {/* Operating costs */}
            <section className="border border-border rounded-xl p-5 bg-background space-y-4">
              <h2 className="text-sm font-semibold text-foreground">Operating Costs</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <Row label="Cost of Goods Sold" hint="% of revenue">
                  <NumberInput value={inputs.cogsPct} onChange={set("cogsPct")} min={0} max={80} step={1} suffix="%" />
                </Row>
                <Row label="Labor" hint="% of revenue">
                  <NumberInput value={inputs.laborPct} onChange={set("laborPct")} min={0} max={80} step={1} suffix="%" />
                </Row>
                <Row label="Rent / Lease" hint="monthly">
                  <NumberInput value={inputs.rentMonthly} onChange={set("rentMonthly")} min={0} step={250} prefix="$" />
                </Row>
                <Row label="Other Operating Costs" hint="% of revenue">
                  <NumberInput value={inputs.otherOpexPct} onChange={set("otherOpexPct")} min={0} max={30} step={0.5} suffix="%" />
                </Row>
              </div>
              <p className="text-xs text-muted">
                Other includes utilities, insurance, supplies, marketing, and misc. admin costs.
              </p>
            </section>

            {/* Investment & financing */}
            <section className="border border-border rounded-xl p-5 bg-background space-y-4">
              <h2 className="text-sm font-semibold text-foreground">Investment & Financing <span className="text-xs font-normal text-muted">(from Item 7)</span></h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <Row label="Total Investment" hint="Item 7 midpoint">
                  <NumberInput value={inputs.totalInvestment} onChange={set("totalInvestment")} step={10_000} prefix="$" />
                </Row>
                <Row label="Loan Amount">
                  <NumberInput value={inputs.loanAmount} onChange={(v) => set("loanAmount")(Math.min(v, inputs.totalInvestment))} step={10_000} prefix="$" />
                </Row>
                <Row label="Loan APR">
                  <NumberInput value={inputs.loanRateApr} onChange={set("loanRateApr")} min={0} max={30} step={0.25} suffix="%" />
                </Row>
                <Row label="Loan Term">
                  <NumberInput value={inputs.loanTermYears} onChange={set("loanTermYears")} min={1} max={25} step={1} suffix="yrs" />
                </Row>
              </div>
              <div className="text-xs text-muted bg-surface rounded-lg px-3 py-2">
                Cash invested (equity): <span className="font-semibold text-foreground">{fmt(inputs.totalInvestment - inputs.loanAmount)}</span>
                {" "}— Annual debt service: <span className="font-semibold text-foreground">{fmt(results.annualDebtService)}</span>
              </div>
            </section>
          </div>

          {/* ── Right: Results ── */}
          <div className="space-y-4 lg:sticky lg:top-20 lg:self-start">
            {/* Income statement card */}
            <div className="border border-border rounded-xl p-5 bg-background">
              <h2 className="text-sm font-semibold text-foreground mb-3">Scenario P&L</h2>

              <ResultRow label="Gross Revenue" value={fmt(results.grossRevenue)} />

              <div className="mt-2 mb-1">
                <span className="text-[10px] font-semibold uppercase tracking-wide text-muted">Franchisor Fees</span>
              </div>
              <ResultRow label="Royalties" value={fmt(results.royalties)} isNegative indent />
              <ResultRow label="Marketing Fund" value={fmt(results.marketingFund)} isNegative indent />
              <ResultRow label="Technology Fees" value={fmt(results.techFees)} isNegative indent />

              <div className="mt-2 mb-1">
                <span className="text-[10px] font-semibold uppercase tracking-wide text-muted">Operating Costs</span>
              </div>
              <ResultRow label="Cost of Goods" value={fmt(results.cogs)} isNegative indent />
              <ResultRow label="Labor" value={fmt(results.labor)} isNegative indent />
              <ResultRow label="Rent / Lease" value={fmt(results.rent)} isNegative indent />
              <ResultRow label="Other Opex" value={fmt(results.otherOpex)} isNegative indent />

              <ResultRow
                label="Illustrative Operating Result"
                value={fmt(Math.abs(results.operatingIncome))}
                isNegative={results.operatingIncome < 0}
                isBold
              />
              <ResultRow label="Debt Service" value={fmt(results.annualDebtService)} isNegative indent />

              <div className={`mt-3 flex justify-between items-center rounded-lg px-3 py-3 ${results.netIncome >= 0 ? "bg-green-50 border border-green-200" : "bg-red-50 border border-red-200"}`}>
                <span className="text-sm font-bold text-foreground">Illustrative Cash Flow*</span>
                <span className={`text-lg font-bold tabular-nums ${netIncomeColor}`}>
                  {results.netIncome < 0 ? `(${fmt(Math.abs(results.netIncome))})` : fmt(results.netIncome)}
                </span>
              </div>
              <p className="text-[10px] text-muted mt-2">*Assumption-based scenario using your inputs. Not FDD-reported results. Not a projection of actual franchise performance.</p>
            </div>

            {/* Key metrics */}
            <div className="border border-border rounded-xl p-5 bg-background space-y-3">
              <h2 className="text-sm font-semibold text-foreground">Key Metrics</h2>

              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-lg bg-surface p-3">
                  <p className="text-[10px] font-medium uppercase tracking-wide text-muted mb-1">Break-Even Revenue</p>
                  <p className="text-base font-bold text-foreground">{fmt(results.breakEvenRevenue)}</p>
                  <p className="text-[10px] text-muted mt-0.5">
                    {results.grossRevenue >= results.breakEvenRevenue
                      ? `${fmtPct(((results.grossRevenue - results.breakEvenRevenue) / results.grossRevenue) * 100)} above break-even`
                      : `${fmtPct(((results.breakEvenRevenue - results.grossRevenue) / results.breakEvenRevenue) * 100)} below break-even`}
                  </p>
                </div>

                <div className="rounded-lg bg-surface p-3">
                  <p className="text-[10px] font-medium uppercase tracking-wide text-muted mb-1">Effective Fee Rate</p>
                  <p className={`text-base font-bold ${results.effectiveFeeRate > 12 ? "text-red-600" : results.effectiveFeeRate > 9 ? "text-amber-600" : "text-green-600"}`}>
                    {fmtPct(results.effectiveFeeRate)}
                  </p>
                  <p className="text-[10px] text-muted mt-0.5">of gross revenue to franchisor</p>
                </div>

                <div className="rounded-lg bg-surface p-3">
                  <p className="text-[10px] font-medium uppercase tracking-wide text-muted mb-1">Payback Period</p>
                  <p className={`text-base font-bold ${results.paybackYears === null || results.paybackYears > 10 ? "text-red-600" : results.paybackYears > 5 ? "text-amber-600" : "text-green-600"}`}>
                    {results.paybackYears === null
                      ? "Never"
                      : results.paybackYears > 25
                        ? ">25 yrs"
                        : `${results.paybackYears.toFixed(1)} yrs`}
                  </p>
                  <p className="text-[10px] text-muted mt-0.5">to recover cash invested</p>
                </div>

                <div className="rounded-lg bg-surface p-3">
                  <p className="text-[10px] font-medium uppercase tracking-wide text-muted mb-1">Cash-on-Cash Return</p>
                  <p className={`text-base font-bold ${results.cashOnCashReturn === null || results.cashOnCashReturn < 0 ? "text-red-600" : results.cashOnCashReturn < 10 ? "text-amber-600" : "text-green-600"}`}>
                    {results.cashOnCashReturn === null ? "N/A" : fmtPct(results.cashOnCashReturn)}
                  </p>
                  <p className="text-[10px] text-muted mt-0.5">annual return on equity invested</p>
                </div>
              </div>
            </div>

            {/* Disclaimer */}
            <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-xs text-amber-900 leading-relaxed">
              <strong>Important:</strong> This calculator produces estimates only. Results
              depend entirely on the accuracy of your inputs. Actual results will differ.
              This is not financial or investment advice. Consult a qualified franchise
              attorney and accountant before investing.
            </div>

            {/* CTA */}
            <div className="rounded-xl border border-accent/20 bg-accent-light p-4 text-sm">
              <p className="font-semibold text-foreground mb-1">Want verified FDD numbers?</p>
              <p className="text-xs text-muted mb-3">
                Compare verified franchise data across 2,474 brands — fees, revenue, closure rates,
                all sourced from government filings.
              </p>
              <Link
                href="/brands"
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-accent text-white text-xs font-semibold rounded-lg hover:brightness-110 transition-all"
              >
                Browse Franchise Database
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                </svg>
              </Link>
            </div>
          </div>
        </div>

        {/* Educational context */}
        <div className="mt-12 border-t border-border pt-10">
          <h2 className="text-lg font-semibold text-foreground mb-4">How to Use This Calculator</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 text-sm">
            <div>
              <h3 className="font-semibold text-foreground mb-2">Finding Your Revenue Input</h3>
              <p className="text-muted leading-relaxed">
                Use the <strong>median</strong> figure from Item 19 as your base case revenue — not
                the mean, which is often skewed by top performers. If Item 19 is absent, ask
                franchisees directly for their annual gross revenue range.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-2">Understanding the Fee Burden</h3>
              <p className="text-muted leading-relaxed">
                The "effective fee rate" combines all franchisor-directed costs — royalty, marketing
                fund, and tech fees — as a percentage of revenue. Anything above 10% significantly
                compresses your margin and raises the break-even threshold.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-2">The Break-Even Test</h3>
              <p className="text-muted leading-relaxed">
                A sound franchise investment covers debt service and pays you an acceptable salary
                even at 25th percentile revenue. Run the numbers at your downside scenario — if the
                business only works at median or above, the margin of safety may be insufficient.
              </p>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/guides/item-19-financial-performance-representations" className="text-sm text-accent hover:underline">
              Guide: Reading Item 19 correctly
            </Link>
            <span className="text-muted">·</span>
            <Link href="/guides/understanding-franchise-fees" className="text-sm text-accent hover:underline">
              Guide: Understanding the total fee burden
            </Link>
            <span className="text-muted">·</span>
            <Link href="/guides/franchise-due-diligence-checklist" className="text-sm text-accent hover:underline">
              Due diligence checklist
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
