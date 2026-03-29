"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { brands } from "@/data/brands";
import type { FranchiseBrand } from "@/lib/types";

export default function AdminBrandEdit() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  const brand = brands.find((b) => b.slug === slug);

  const [formData, setFormData] = useState<Partial<FranchiseBrand> | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (brand) setFormData({ ...brand });
  }, [brand]);

  if (!brand || !formData) {
    return <div className="text-center py-12 text-gray-500">Brand not found</div>;
  }

  const update = (field: string, value: string | number | boolean) => {
    setFormData((prev) => prev ? { ...prev, [field]: value } : prev);
    setSaved(false);
  };

  const updateNested = (parent: string, field: string, value: string | number) => {
    setFormData((prev) => {
      if (!prev) return prev;
      const parentObj = (prev as Record<string, Record<string, unknown>>)[parent] || {};
      return { ...prev, [parent]: { ...parentObj, [field]: value } };
    });
    setSaved(false);
  };

  const handleSave = async () => {
    try {
      const res = await fetch(`/api/admin/brands/${slug}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      } else {
        alert("Failed to save. Check console for details.");
      }
    } catch {
      alert("Network error saving brand.");
    }
  };

  const handleExportJSON = () => {
    const blob = new Blob([JSON.stringify(formData, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${slug}.json`;
    a.click();
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Link href="/admin/brands" className="hover:text-gray-700">Brands</Link>
          <span>/</span>
          <Link href={`/admin/brands/${slug}`} className="hover:text-gray-700">{brand.name}</Link>
          <span>/</span>
          <span className="text-gray-900 font-medium">Edit</span>
        </div>
        <div className="flex gap-3">
          {saved && <span className="text-green-600 text-sm font-medium self-center">Saved!</span>}
          <button
            onClick={handleExportJSON}
            className="px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200"
          >
            Export JSON
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700"
          >
            Save Changes
          </button>
        </div>
      </div>

      <div className="space-y-6">
        {/* Basic Info */}
        <FormSection title="Basic Information">
          <Field label="Name" value={formData.name || ""} onChange={(v) => update("name", v)} />
          <Field label="Slug" value={formData.slug || ""} onChange={(v) => update("slug", v)} />
          <Field label="Tagline" value={formData.tagline || ""} onChange={(v) => update("tagline", v)} />
          <TextArea label="Description" value={formData.description || ""} onChange={(v) => update("description", v)} />
          <Field label="Parent Company" value={formData.parentCompany || ""} onChange={(v) => update("parentCompany", v)} />
          <Field label="HQ State" value={formData.headquartersState || ""} onChange={(v) => update("headquartersState", v)} />
          <Field label="Category" value={formData.category || ""} onChange={(v) => update("category", v)} />
          <Field label="Subcategory" value={formData.subcategory || ""} onChange={(v) => update("subcategory", v)} />
          <NumberField label="Year Founded" value={formData.yearFounded || 0} onChange={(v) => update("yearFounded", v)} />
          <NumberField label="Year Franchising Began" value={formData.yearFranchisingBegan || 0} onChange={(v) => update("yearFranchisingBegan", v)} />
        </FormSection>

        {/* Financial */}
        <FormSection title="Financial Details">
          <NumberField label="Initial Franchise Fee ($)" value={formData.initialFranchiseFee || 0} onChange={(v) => update("initialFranchiseFee", v)} />
          <NumberField label="Total Investment Low ($)" value={formData.totalInvestmentLow || 0} onChange={(v) => update("totalInvestmentLow", v)} />
          <NumberField label="Total Investment High ($)" value={formData.totalInvestmentHigh || 0} onChange={(v) => update("totalInvestmentHigh", v)} />
          <Field label="Royalty Rate" value={formData.royaltyRate || ""} onChange={(v) => update("royaltyRate", v)} />
          <Field label="Marketing Fund Rate" value={formData.marketingFundRate || ""} onChange={(v) => update("marketingFundRate", v)} />
        </FormSection>

        {/* Units */}
        <FormSection title="Unit Data">
          <NumberField label="Total Units" value={formData.totalUnits || 0} onChange={(v) => update("totalUnits", v)} />
          <NumberField label="Franchised Units" value={formData.franchisedUnits || 0} onChange={(v) => update("franchisedUnits", v)} />
          <NumberField label="Company-Owned Units" value={formData.companyOwnedUnits || 0} onChange={(v) => update("companyOwnedUnits", v)} />
          <NumberField label="States of Operation" value={formData.statesOfOperation || 0} onChange={(v) => update("statesOfOperation", v)} />
        </FormSection>

        {/* Scores */}
        <FormSection title="Scores (0-10)">
          <NumberField label="Investment Value" value={formData.scores?.investmentValue || 0} onChange={(v) => updateNested("scores", "investmentValue", v)} />
          <NumberField label="Franchisee Support" value={formData.scores?.franchiseeSupport || 0} onChange={(v) => updateNested("scores", "franchiseeSupport", v)} />
          <NumberField label="Financial Transparency" value={formData.scores?.financialTransparency || 0} onChange={(v) => updateNested("scores", "financialTransparency", v)} />
          <NumberField label="Unit Growth" value={formData.scores?.unitGrowth || 0} onChange={(v) => updateNested("scores", "unitGrowth", v)} />
          <NumberField label="Brand Strength" value={formData.scores?.brandStrength || 0} onChange={(v) => updateNested("scores", "brandStrength", v)} />
          <NumberField label="Territory Protection" value={formData.scores?.territoryProtection || 0} onChange={(v) => updateNested("scores", "territoryProtection", v)} />
        </FormSection>

        {/* Unit Economics */}
        <FormSection title="Unit Economics (Item 20)">
          <NumberField label="Units Start of Period" value={formData.unitEconomics?.unitsStartOfPeriod || 0} onChange={(v) => updateNested("unitEconomics", "unitsStartOfPeriod", v)} />
          <NumberField label="Units End of Period" value={formData.unitEconomics?.unitsEndOfPeriod || 0} onChange={(v) => updateNested("unitEconomics", "unitsEndOfPeriod", v)} />
          <NumberField label="Units Opened" value={formData.unitEconomics?.unitsOpened || 0} onChange={(v) => updateNested("unitEconomics", "unitsOpened", v)} />
          <NumberField label="Units Closed" value={formData.unitEconomics?.unitsClosed || 0} onChange={(v) => updateNested("unitEconomics", "unitsClosed", v)} />
          <NumberField label="Units Transferred" value={formData.unitEconomics?.unitsTransferred || 0} onChange={(v) => updateNested("unitEconomics", "unitsTransferred", v)} />
          <NumberField label="Net Growth" value={formData.unitEconomics?.netGrowth || 0} onChange={(v) => updateNested("unitEconomics", "netGrowth", v)} />
          <NumberField label="Turnover Rate (%)" value={formData.unitEconomics?.turnoverRate || 0} onChange={(v) => updateNested("unitEconomics", "turnoverRate", v)} />
        </FormSection>

        {/* Meta */}
        <FormSection title="Metadata">
          <NumberField label="FDD Year" value={formData.fddYear || 0} onChange={(v) => update("fddYear", v)} />
          <Field label="Last Updated" value={formData.lastUpdated || ""} onChange={(v) => update("lastUpdated", v)} />
          <Field label="Data Verified" value={formData.dataVerified || ""} onChange={(v) => update("dataVerified", v)} />
          <NumberField label="Community Reviews" value={formData.communityReviews || 0} onChange={(v) => update("communityReviews", v)} />
        </FormSection>
      </div>

      {/* Bottom Save */}
      <div className="mt-8 flex gap-3 justify-end sticky bottom-4 bg-white/80 backdrop-blur rounded-lg p-4 border border-gray-200">
        <button onClick={() => router.push(`/admin/brands/${slug}`)} className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800">
          Cancel
        </button>
        <button onClick={handleExportJSON} className="px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200">
          Export JSON
        </button>
        <button onClick={handleSave} className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700">
          Save Changes
        </button>
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
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
}

function NumberField({ label, value, onChange }: { label: string; value: number; onChange: (v: number) => void }) {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-500 mb-1">{label}</label>
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
}

function TextArea({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div className="md:col-span-2">
      <label className="block text-xs font-medium text-gray-500 mb-1">{label}</label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={3}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
}
