"use client";

import { useState } from "react";
import Link from "next/link";
import { categories } from "@/data/brands";

export default function AdminNewBrand() {
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    tagline: "",
    description: "",
    parentCompany: "",
    headquartersState: "",
    category: "food-beverage",
    subcategory: "",
    yearFounded: 2020,
    yearFranchisingBegan: 2020,
    initialFranchiseFee: 0,
    totalInvestmentLow: 0,
    totalInvestmentHigh: 0,
    royaltyRate: "",
    royaltyStructure: "percentage",
    marketingFundRate: "",
    totalUnits: 0,
    franchisedUnits: 0,
    companyOwnedUnits: 0,
    statesOfOperation: 0,
    hasItem19: false,
    fddYear: 2024,
  });
  const [saved, setSaved] = useState(false);

  const update = (field: string, value: string | number | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Auto-generate slug from name
    if (field === "name") {
      const slug = String(value)
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");
      setFormData((prev) => ({ ...prev, slug }));
    }
  };

  const handleSave = async () => {
    try {
      const res = await fetch("/api/admin/brands", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setSaved(true);
      } else {
        alert("Failed to create brand.");
      }
    } catch {
      alert("Network error.");
    }
  };

  const handleExportJSON = () => {
    const fullBrand = {
      ...formData,
      dataSource: "state_filing" as const,
      lastUpdated: new Date().toISOString().split("T")[0],
      dataVerified: new Date().toISOString().split("T")[0],
      reportAvailable: false,
      communityReviews: 0,
      redFlags: [],
      litigation: { activeLawsuits: 0, types: [], trend: "stable" },
      scores: { investmentValue: 5, franchiseeSupport: 5, financialTransparency: 5, unitGrowth: 5, brandStrength: 5, territoryProtection: 5 },
      unitEconomics: { unitsStartOfPeriod: 0, unitsEndOfPeriod: formData.totalUnits, unitsOpened: 0, unitsClosed: 0, unitsTransferred: 0, netGrowth: 0, turnoverRate: 0 },
    };
    const blob = new Blob([JSON.stringify(fullBrand, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${formData.slug || "new-brand"}.json`;
    a.click();
  };

  if (saved) {
    return (
      <div className="text-center py-12">
        <div className="text-4xl mb-4">&#9989;</div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Brand Created</h2>
        <p className="text-gray-500 mb-6">The brand data has been saved. Rebuild required for it to appear on the site.</p>
        <div className="flex gap-3 justify-center">
          <Link href="/admin/brands" className="px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg">
            Back to Brands
          </Link>
          <button onClick={() => { setSaved(false); setFormData({ ...formData, name: "", slug: "" }); }} className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg">
            Add Another
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Add New Brand</h1>
        <div className="flex gap-3">
          <button onClick={handleExportJSON} className="px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200">
            Export JSON
          </button>
          <button onClick={handleSave} className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700">
            Create Brand
          </button>
        </div>
      </div>

      <div className="space-y-6">
        <FormSection title="Basic Information">
          <Field label="Brand Name" value={formData.name} onChange={(v) => update("name", v)} />
          <Field label="Slug (auto-generated)" value={formData.slug} onChange={(v) => update("slug", v)} />
          <Field label="Tagline" value={formData.tagline} onChange={(v) => update("tagline", v)} />
          <TextArea label="Description" value={formData.description} onChange={(v) => update("description", v)} />
          <Field label="Parent Company" value={formData.parentCompany} onChange={(v) => update("parentCompany", v)} />
          <Field label="HQ State" value={formData.headquartersState} onChange={(v) => update("headquartersState", v)} />
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Category</label>
            <select
              value={formData.category}
              onChange={(e) => update("category", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white"
            >
              {categories.map((cat) => (
                <option key={cat.slug} value={cat.slug}>{cat.name}</option>
              ))}
            </select>
          </div>
          <Field label="Subcategory" value={formData.subcategory} onChange={(v) => update("subcategory", v)} />
          <NumberField label="Year Founded" value={formData.yearFounded} onChange={(v) => update("yearFounded", v)} />
          <NumberField label="Year Franchising Began" value={formData.yearFranchisingBegan} onChange={(v) => update("yearFranchisingBegan", v)} />
        </FormSection>

        <FormSection title="Financial Details">
          <NumberField label="Initial Franchise Fee ($)" value={formData.initialFranchiseFee} onChange={(v) => update("initialFranchiseFee", v)} />
          <NumberField label="Total Investment Low ($)" value={formData.totalInvestmentLow} onChange={(v) => update("totalInvestmentLow", v)} />
          <NumberField label="Total Investment High ($)" value={formData.totalInvestmentHigh} onChange={(v) => update("totalInvestmentHigh", v)} />
          <Field label="Royalty Rate" value={formData.royaltyRate} onChange={(v) => update("royaltyRate", v)} />
          <Field label="Marketing Fund Rate" value={formData.marketingFundRate} onChange={(v) => update("marketingFundRate", v)} />
        </FormSection>

        <FormSection title="Unit Data">
          <NumberField label="Total Units" value={formData.totalUnits} onChange={(v) => update("totalUnits", v)} />
          <NumberField label="Franchised Units" value={formData.franchisedUnits} onChange={(v) => update("franchisedUnits", v)} />
          <NumberField label="Company-Owned Units" value={formData.companyOwnedUnits} onChange={(v) => update("companyOwnedUnits", v)} />
          <NumberField label="States of Operation" value={formData.statesOfOperation} onChange={(v) => update("statesOfOperation", v)} />
          <NumberField label="FDD Year" value={formData.fddYear} onChange={(v) => update("fddYear", v)} />
        </FormSection>
      </div>
    </div>
  );
}

function FormSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h2 className="text-sm font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-100">{title}</h2>
      <div className="grid md:grid-cols-2 gap-4">{children}</div>
    </div>
  );
}

function Field({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-500 mb-1">{label}</label>
      <input type="text" value={value} onChange={(e) => onChange(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
    </div>
  );
}

function NumberField({ label, value, onChange }: { label: string; value: number; onChange: (v: number) => void }) {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-500 mb-1">{label}</label>
      <input type="number" value={value} onChange={(e) => onChange(Number(e.target.value))} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
    </div>
  );
}

function TextArea({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div className="md:col-span-2">
      <label className="block text-xs font-medium text-gray-500 mb-1">{label}</label>
      <textarea value={value} onChange={(e) => onChange(e.target.value)} rows={3} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
    </div>
  );
}
