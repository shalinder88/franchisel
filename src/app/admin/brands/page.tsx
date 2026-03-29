"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { brands, categories } from "@/data/brands";

export default function AdminBrandsList() {
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [sortBy, setSortBy] = useState<"name" | "units" | "investment" | "updated">("name");

  const filtered = useMemo(() => {
    let result = [...brands];

    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (b) => b.name.toLowerCase().includes(q) || b.slug.includes(q) || b.category.includes(q)
      );
    }

    if (categoryFilter !== "all") {
      result = result.filter((b) => b.category === categoryFilter);
    }

    result.sort((a, b) => {
      switch (sortBy) {
        case "units": return b.totalUnits - a.totalUnits;
        case "investment": return b.totalInvestmentHigh - a.totalInvestmentHigh;
        case "updated": return b.lastUpdated.localeCompare(a.lastUpdated) * -1;
        default: return a.name.localeCompare(b.name);
      }
    });

    return result;
  }, [search, categoryFilter, sortBy]);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          All Brands <span className="text-gray-400 text-lg font-normal">({filtered.length})</span>
        </h1>
        <Link
          href="/admin/brands/new"
          className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700"
        >
          + Add Brand
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-4">
        <input
          type="text"
          placeholder="Search brands..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg text-sm w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white"
        >
          <option value="all">All Categories</option>
          {categories.map((cat) => (
            <option key={cat.slug} value={cat.slug}>{cat.name}</option>
          ))}
        </select>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
          className="px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white"
        >
          <option value="name">Sort: Name</option>
          <option value="units">Sort: Units</option>
          <option value="investment">Sort: Investment</option>
          <option value="updated">Sort: Last Updated</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Brand</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Category</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Units</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Fee</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Investment</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Royalty</th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Item 19</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">FDD Year</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((brand) => (
                <tr key={brand.slug} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <Link href={`/admin/brands/${brand.slug}`} className="font-medium text-gray-900 hover:text-blue-600">
                      {brand.name}
                    </Link>
                    <p className="text-xs text-gray-400 mt-0.5">{brand.slug}</p>
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    <span className="px-2 py-0.5 bg-gray-100 rounded text-xs">{brand.category}</span>
                  </td>
                  <td className="px-4 py-3 text-right font-mono text-gray-700">{brand.totalUnits.toLocaleString()}</td>
                  <td className="px-4 py-3 text-right font-mono text-gray-700">
                    ${(brand.initialFranchiseFee / 1000).toFixed(0)}K
                  </td>
                  <td className="px-4 py-3 text-right font-mono text-gray-700">
                    ${(brand.totalInvestmentLow / 1000).toFixed(0)}K&ndash;${(brand.totalInvestmentHigh / 1000).toFixed(0)}K
                  </td>
                  <td className="px-4 py-3 text-right font-mono text-gray-700">{brand.royaltyRate}</td>
                  <td className="px-4 py-3 text-center">
                    {brand.hasItem19 ? (
                      <span className="text-green-600 font-bold">Yes</span>
                    ) : (
                      <span className="text-gray-400">No</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-gray-600">{brand.fddYear}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <Link
                        href={`/admin/brands/${brand.slug}/edit`}
                        className="text-xs text-blue-600 hover:text-blue-800"
                      >
                        Edit
                      </Link>
                      <Link
                        href={`/brands/${brand.slug}`}
                        className="text-xs text-gray-400 hover:text-gray-600"
                        target="_blank"
                      >
                        View
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
