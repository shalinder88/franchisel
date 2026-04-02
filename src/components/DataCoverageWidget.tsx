import type { FranchiseBrand } from "@/lib/types";

interface CoverageItem {
  label: string;
  item: string;
  present: boolean;
  note?: string;
}

interface DataCoverageWidgetProps {
  brand: FranchiseBrand;
}

export default function DataCoverageWidget({ brand }: DataCoverageWidgetProps) {
  const govVerified = brand.dataSource === "fdd_verified" || brand.dataSource === "state_filing";

  const items: CoverageItem[] = [
    {
      label: "Investment Range",
      item: "Items 5–7",
      present: brand.totalInvestmentLow > 0 || brand.totalInvestmentHigh > 0,
    },
    {
      label: "Item 19 Revenue",
      item: "Item 19",
      present: !!(brand.hasItem19 && brand.item19?.grossRevenueAvg),
      note: brand.hasItem19 && !brand.item19?.grossRevenueAvg ? "Disclosed but not extracted" : undefined,
    },
    {
      label: "Unit Count & Churn",
      item: "Item 20",
      present: brand.totalUnits > 0 || !!(brand.unitEconomics?.netGrowth !== undefined),
    },
    {
      label: "Franchisor Financials",
      item: "Item 21",
      present: !!(brand.item21?.hasAuditedFinancials || brand.item21?.franchisorRevenue),
    },
    {
      label: "Contract Terms",
      item: "Item 17",
      present: !!(brand.item17?.initialTermYears || brand.item17?.hasNonCompete !== undefined),
    },
    {
      label: "Territory Protection",
      item: "Item 12",
      present: !!(brand.item12?.exclusiveTerritory !== undefined || brand.item12?.territoryType),
    },
    {
      label: "Litigation Profile",
      item: "Item 3",
      present: !!(brand.litigation?.activeLawsuits !== undefined),
    },
    {
      label: "Supplier Restrictions",
      item: "Item 8",
      present: !!(brand.item8?.hasRequiredPurchases !== undefined),
    },
    {
      label: "Financing Terms",
      item: "Item 10",
      present: !!(brand.item10?.offersFinancing !== undefined || brand.item10?.thirdPartyOnly !== undefined),
    },
    {
      label: "Training & Support",
      item: "Item 11",
      present: !!(brand.item11?.totalTrainingHours || brand.item11?.hasFieldSupport !== undefined),
    },
    {
      label: "YoY Filing Diffs",
      item: "Multi-year",
      present: !!(brand.item19Prior?.grossRevenueAvg || (brand.unitEconomics?.yearlyNetGrowth && brand.unitEconomics.yearlyNetGrowth.length >= 2)),
      note: "Available when 2+ annual filings exist",
    },
  ];

  const presentCount = items.filter((i) => i.present).length;
  const pct = Math.round((presentCount / items.length) * 100);

  const sourceLabel = govVerified
    ? brand.dataSource === "state_filing"
      ? `Gov-filed FDD · ${brand.fddYear}`
      : `FDD Verified · ${brand.fddYear}`
    : "Estimated / Not fully verified";

  return (
    <div className="rounded-xl border border-border bg-background p-5">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-sm font-bold text-foreground">Data Coverage</h3>
          <p className="text-xs text-muted mt-0.5">{sourceLabel}</p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-foreground">{presentCount}<span className="text-base font-normal text-muted">/{items.length}</span></p>
          <p className="text-xs text-muted">items populated</p>
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-1.5 bg-surface rounded-full mb-4 overflow-hidden">
        <div
          className={`h-full rounded-full transition-all ${pct >= 70 ? "bg-success" : pct >= 40 ? "bg-accent" : "bg-warning"}`}
          style={{ width: `${pct}%` }}
        />
      </div>

      {/* Item checklist */}
      <div className="grid grid-cols-2 gap-x-4 gap-y-1.5">
        {items.map((item) => (
          <div key={item.label} className="flex items-center gap-2">
            <span className={`shrink-0 w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold ${
              item.present
                ? "bg-success/15 text-success"
                : item.note
                ? "bg-warning/15 text-warning"
                : "bg-surface text-muted border border-border"
            }`}>
              {item.present ? "✓" : item.note ? "~" : "·"}
            </span>
            <div className="min-w-0">
              <span className={`text-xs ${item.present ? "text-foreground" : "text-muted"}`}>{item.label}</span>
              <span className="text-[10px] text-muted ml-1">{item.item}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
