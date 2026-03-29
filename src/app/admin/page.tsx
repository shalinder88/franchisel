import Link from "next/link";
import { brands, categories } from "@/data/brands";

export default function AdminDashboard() {
  const totalBrands = brands.length;
  const totalUnits = brands.reduce((sum, b) => sum + b.totalUnits, 0);
  const withItem19 = brands.filter((b) => b.hasItem19).length;
  const avgInvestment = Math.round(
    brands.reduce((sum, b) => sum + (b.totalInvestmentLow + b.totalInvestmentHigh) / 2, 0) / totalBrands
  );

  const categoryCounts = categories.map((cat) => ({
    ...cat,
    count: brands.filter((b) => b.category === cat.slug).length,
  })).sort((a, b) => b.count - a.count);

  const recentBrands = [...brands]
    .sort((a, b) => b.lastUpdated.localeCompare(a.lastUpdated))
    .slice(0, 10);

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Admin Dashboard</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard label="Total Brands" value={totalBrands.toLocaleString()} />
        <StatCard label="Total Units" value={totalUnits.toLocaleString()} />
        <StatCard label="With Item 19" value={`${withItem19} (${Math.round((withItem19 / totalBrands) * 100)}%)`} />
        <StatCard label="Avg Investment" value={`$${(avgInvestment / 1000).toFixed(0)}K`} />
      </div>

      {/* Two Column Layout */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Category Breakdown */}
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <h2 className="text-sm font-semibold text-gray-900 mb-3">Brands by Category</h2>
          <div className="space-y-2">
            {categoryCounts.map((cat) => (
              <div key={cat.slug} className="flex items-center justify-between text-sm">
                <span className="text-gray-700">{cat.name}</span>
                <span className="text-gray-500 font-mono">{cat.count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recently Updated */}
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <h2 className="text-sm font-semibold text-gray-900 mb-3">Recently Updated</h2>
          <div className="space-y-2">
            {recentBrands.map((brand) => (
              <Link
                key={brand.slug}
                href={`/admin/brands/${brand.slug}`}
                className="flex items-center justify-between text-sm hover:bg-gray-50 px-2 py-1 rounded -mx-2"
              >
                <span className="text-gray-700">{brand.name}</span>
                <span className="text-gray-400 text-xs font-mono">{brand.lastUpdated}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-8 flex gap-3">
        <Link
          href="/admin/brands"
          className="px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors"
        >
          Browse All Brands
        </Link>
        <Link
          href="/admin/brands/new"
          className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
        >
          Add New Brand
        </Link>
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">{label}</p>
      <p className="text-xl font-bold text-gray-900 mt-1">{value}</p>
    </div>
  );
}
