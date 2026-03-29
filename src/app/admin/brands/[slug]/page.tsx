import Link from "next/link";
import { notFound } from "next/navigation";
import { getBrandBySlug } from "@/data/brands";

export default async function AdminBrandDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const brand = getBrandBySlug(slug);
  if (!brand) notFound();

  const fmt = (n: number) => n.toLocaleString();
  const fmtDollar = (n: number) => `$${n.toLocaleString()}`;
  const overallScore = (
    (brand.scores.investmentValue * 0.25 +
      brand.scores.franchiseeSupport * 0.2 +
      brand.scores.financialTransparency * 0.2 +
      brand.scores.unitGrowth * 0.15 +
      brand.scores.brandStrength * 0.1 +
      brand.scores.territoryProtection * 0.1)
  ).toFixed(1);

  return (
    <div>
      {/* Breadcrumb + Actions */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Link href="/admin/brands" className="hover:text-gray-700">Brands</Link>
          <span>/</span>
          <span className="text-gray-900 font-medium">{brand.name}</span>
        </div>
        <div className="flex gap-3">
          <Link
            href={`/admin/brands/${brand.slug}/edit`}
            className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700"
          >
            Edit Brand
          </Link>
          <Link
            href={`/brands/${brand.slug}`}
            className="px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200"
            target="_blank"
          >
            View Public Page
          </Link>
        </div>
      </div>

      {/* Brand Header */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
        <h1 className="text-2xl font-bold text-gray-900">{brand.name}</h1>
        <p className="text-sm text-gray-500 mt-1">{brand.tagline}</p>
        <div className="flex flex-wrap gap-3 mt-3">
          <Badge color="blue">{brand.category}</Badge>
          <Badge color="purple">{brand.subcategory}</Badge>
          <Badge color="green">Score: {overallScore}/10</Badge>
          <Badge color="gray">{brand.fddYear} FDD</Badge>
          <Badge color="gray">{brand.dataSource}</Badge>
          {brand.hasItem19 && <Badge color="emerald">Has Item 19</Badge>}
        </div>
        <p className="text-sm text-gray-600 mt-4">{brand.description}</p>
      </div>

      {/* Data Grid */}
      <div className="grid md:grid-cols-3 gap-6 mb-6">
        {/* Financials */}
        <Section title="Financial Details">
          <Row label="Franchise Fee" value={fmtDollar(brand.initialFranchiseFee)} />
          <Row label="Total Investment" value={`${fmtDollar(brand.totalInvestmentLow)} - ${fmtDollar(brand.totalInvestmentHigh)}`} />
          <Row label="Royalty Rate" value={brand.royaltyRate} />
          <Row label="Royalty Structure" value={brand.royaltyStructure} />
          <Row label="Marketing Fund" value={brand.marketingFundRate} />
        </Section>

        {/* Operations */}
        <Section title="Operations">
          <Row label="Total Units" value={fmt(brand.totalUnits)} />
          <Row label="Franchised Units" value={fmt(brand.franchisedUnits)} />
          <Row label="Company-Owned" value={fmt(brand.companyOwnedUnits)} />
          <Row label="States" value={fmt(brand.statesOfOperation)} />
          <Row label="Founded" value={String(brand.yearFounded)} />
          <Row label="Franchising Since" value={String(brand.yearFranchisingBegan)} />
        </Section>

        {/* Scores */}
        <Section title="Scores (out of 10)">
          <Row label="Investment Value" value={brand.scores.investmentValue.toFixed(1)} />
          <Row label="Franchisee Support" value={brand.scores.franchiseeSupport.toFixed(1)} />
          <Row label="Financial Transparency" value={brand.scores.financialTransparency.toFixed(1)} />
          <Row label="Unit Growth" value={brand.scores.unitGrowth.toFixed(1)} />
          <Row label="Brand Strength" value={brand.scores.brandStrength.toFixed(1)} />
          <Row label="Territory Protection" value={brand.scores.territoryProtection.toFixed(1)} />
        </Section>
      </div>

      {/* Unit Economics */}
      <div className="grid md:grid-cols-2 gap-6 mb-6">
        <Section title="Unit Economics (Item 20)">
          <Row label="Start of Period" value={fmt(brand.unitEconomics.unitsStartOfPeriod)} />
          <Row label="End of Period" value={fmt(brand.unitEconomics.unitsEndOfPeriod)} />
          <Row label="Opened" value={fmt(brand.unitEconomics.unitsOpened)} />
          <Row label="Closed" value={fmt(brand.unitEconomics.unitsClosed)} />
          <Row label="Transferred" value={fmt(brand.unitEconomics.unitsTransferred)} />
          <Row label="Net Growth" value={fmt(brand.unitEconomics.netGrowth)} />
          <Row label="Turnover Rate" value={`${brand.unitEconomics.turnoverRate}%`} />
        </Section>

        {/* Litigation */}
        <Section title="Litigation & Red Flags">
          <Row label="Active Lawsuits" value={String(brand.litigation.activeLawsuits)} />
          <Row label="Types" value={brand.litigation.types.join(", ") || "None"} />
          <Row label="Trend" value={brand.litigation.trend} />
          {brand.redFlags.length > 0 ? (
            <div className="mt-3 space-y-2">
              {brand.redFlags.map((flag, i) => (
                <div key={i} className={`text-xs p-2 rounded ${
                  flag.severity === "critical" ? "bg-red-50 text-red-800" : "bg-yellow-50 text-yellow-800"
                }`}>
                  <strong>{flag.severity.toUpperCase()}:</strong> {flag.description}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-gray-400 mt-2">No red flags identified</p>
          )}
        </Section>
      </div>

      {/* Item 19 Data */}
      {brand.item19 && (
        <Section title="Item 19 — Financial Performance Representations">
          {brand.item19.grossRevenueAvg && <Row label="Avg Gross Revenue" value={fmtDollar(brand.item19.grossRevenueAvg)} />}
          {brand.item19.grossRevenueMedian && <Row label="Median Gross Revenue" value={fmtDollar(brand.item19.grossRevenueMedian)} />}
          <Row label="Units Included" value={fmt(brand.item19.unitsIncluded)} />
          <Row label="Basis" value={brand.item19.basis} />
          <Row label="Time Period" value={brand.item19.timePeriod} />
          {brand.item19.notes && <Row label="Notes" value={brand.item19.notes} />}
        </Section>
      )}

      {/* Meta */}
      <div className="mt-6 bg-gray-50 rounded-lg border border-gray-200 p-4 text-xs text-gray-500">
        <p><strong>Slug:</strong> {brand.slug} | <strong>Parent Company:</strong> {brand.parentCompany} | <strong>HQ:</strong> {brand.headquartersState}</p>
        <p className="mt-1"><strong>Data Source:</strong> {brand.dataSource} | <strong>Last Updated:</strong> {brand.lastUpdated} | <strong>Verified:</strong> {brand.dataVerified}</p>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <h2 className="text-sm font-semibold text-gray-900 mb-3 pb-2 border-b border-gray-100">{title}</h2>
      <div className="space-y-2">{children}</div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between text-sm">
      <span className="text-gray-500">{label}</span>
      <span className="text-gray-900 font-medium text-right ml-4">{value}</span>
    </div>
  );
}

function Badge({ children, color }: { children: React.ReactNode; color: string }) {
  const colors: Record<string, string> = {
    blue: "bg-blue-50 text-blue-700",
    purple: "bg-purple-50 text-purple-700",
    green: "bg-green-50 text-green-700",
    emerald: "bg-emerald-50 text-emerald-700",
    gray: "bg-gray-100 text-gray-600",
  };
  return (
    <span className={`px-2 py-0.5 rounded text-xs font-medium ${colors[color] || colors.gray}`}>
      {children}
    </span>
  );
}
