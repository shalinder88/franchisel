import { notFound } from "next/navigation";
import Link from "next/link";
import { getBrandBySlug } from "@/data/brands";
import { computeDownsideEconomics, computeCompositeScores, computeManagementSignal, computeTerritoryRisk, computeSupplierRisk } from "@/lib/diligence";
import { formatCurrency, formatInvestmentRange } from "@/lib/types";
import WatchButton from "@/components/WatchButton";
import PrintButton from "@/components/PrintButton";
import type { Metadata } from "next";

export const dynamic = 'force-dynamic';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const brand = getBrandBySlug(slug);
  if (!brand) return {};
  return {
    title: `${brand.name} — Lender Readiness Pack`,
    description: `SBA-ready financial summary for ${brand.name} franchise opportunity. Sourced from ${brand.fddYear} government-filed FDD.`,
    robots: { index: false },
  };
}

/* ── Helpers ── */
function Row({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <tr className="border-b border-border last:border-0">
      <td className="px-5 py-3 text-sm text-muted font-medium">{label}</td>
      <td className={`px-5 py-3 text-sm text-right font-semibold ${highlight ? "text-success" : "text-foreground"}`}>{value}</td>
    </tr>
  );
}

function Section({ title, citation, children }: { title: string; citation?: string; children: React.ReactNode }) {
  return (
    <section className="rounded-xl border border-border bg-background overflow-hidden mb-6">
      <div className="px-5 py-3 border-b border-border bg-surface flex items-baseline justify-between">
        <h2 className="text-sm font-bold text-foreground uppercase tracking-wider">{title}</h2>
        {citation && <span className="text-[10px] font-mono text-muted">{citation}</span>}
      </div>
      <div>{children}</div>
    </section>
  );
}

/* ── Page ── */
export default async function LenderPackPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const brand = getBrandBySlug(slug);
  if (!brand) notFound();

  const isGovVerified = brand.dataSource === "fdd_verified" || brand.dataSource === "state_filing";
  const economics = computeDownsideEconomics(brand);
  const scores = computeCompositeScores(brand);
  const mgmtSignal = computeManagementSignal(brand);
  const terr = computeTerritoryRisk(brand);
  const supplierRisk = computeSupplierRisk(brand);
  const today = new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });

  return (
    <div className="min-h-screen bg-background">

      {/* ── Print header ── */}
      <div className="hidden print:block px-8 pt-8 pb-4 border-b border-border mb-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs text-muted">FRANCHISEL.COM — LENDER READINESS PACK</p>
            <h1 className="text-2xl font-bold text-foreground mt-1">{brand.name}</h1>
            <p className="text-sm text-muted">{brand.parentCompany}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-muted">Generated {today}</p>
            <p className="text-xs text-muted">Source: {brand.fddYear} FDD</p>
            <p className="text-xs font-semibold text-foreground mt-1">
              {isGovVerified ? "Government-Filed Source ✓" : "Verified Source"}
            </p>
          </div>
        </div>
      </div>

      {/* ── Screen header ── */}
      <header className="print:hidden border-b border-border bg-surface-alt">
        <div className="max-w-4xl mx-auto px-6 py-5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link href={`/brands/${brand.slug}`} className="text-muted hover:text-accent transition-colors shrink-0">
              ← Back
            </Link>
            <div className="w-px h-4 bg-border shrink-0" />
            <div>
              <h1 className="text-base font-bold text-foreground">{brand.name}</h1>
              <p className="text-xs text-muted">Lender Readiness Pack · {brand.fddYear} FDD</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
          <WatchButton slug={brand.slug} name={brand.name} variant="icon" className="print:hidden" />
          <PrintButton />
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-8 print:px-4 space-y-0">

        {/* ── Purpose statement ── */}
        <div className="mb-6 p-4 rounded-xl bg-surface border border-border text-xs text-muted leading-relaxed">
          <p className="font-semibold text-foreground mb-1">Purpose of This Document</p>
          This Lender Readiness Pack summarizes key financial metrics for a {brand.name} franchise opportunity, sourced from
          the {brand.fddYear} Franchise Disclosure Document{isGovVerified ? " filed with a state franchise regulator" : ""}.
          All financial figures are from official FDD disclosures. Editorial projections are labeled as such and do not constitute guarantees.
          Consult a franchise attorney and SBA lender before making any commitments.
        </div>

        {/* ── 1. Business Summary ── */}
        <Section title="1. Business Overview" citation="Items 1-2">
          <table className="w-full text-sm">
            <tbody>
              <Row label="Franchisor" value={brand.parentCompany} />
              <Row label="Concept" value={brand.name} />
              <Row label="Category" value={brand.category.replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase())} />
              <Row label="Year Franchising Began" value={brand.yearFranchisingBegan > 0 ? String(brand.yearFranchisingBegan) : "See FDD"} />
              <Row label="Total System Units" value={brand.totalUnits > 0 ? brand.totalUnits.toLocaleString() : "See FDD"} />
              <Row label="Franchised Units" value={brand.franchisedUnits > 0 ? brand.franchisedUnits.toLocaleString() : "See FDD"} />
              <Row label="FDD Year" value={`${brand.fddYear}`} />
              <Row label="Data Source" value={isGovVerified ? `${brand.fddYear} Government-Filed FDD ✓` : `${brand.fddYear} FDD`} />
            </tbody>
          </table>
        </Section>

        {/* ── 2. Investment Requirements ── */}
        <Section title="2. Investment Requirements" citation="Items 5-7">
          <table className="w-full text-sm">
            <tbody>
              <Row label="Total Investment Range" value={brand.totalInvestmentLow > 0 ? formatInvestmentRange(brand.totalInvestmentLow, brand.totalInvestmentHigh) : "See FDD"} />
              {brand.totalInvestmentLow > 0 && (
                <>
                  <Row label="Investment — Low Estimate" value={formatCurrency(brand.totalInvestmentLow)} />
                  <Row label="Investment — High Estimate" value={formatCurrency(brand.totalInvestmentHigh)} />
                  <Row label="Investment — Midpoint" value={formatCurrency((brand.totalInvestmentLow + brand.totalInvestmentHigh) / 2)} />
                </>
              )}
              <Row label="Initial Franchise Fee" value={brand.initialFranchiseFee > 0 ? formatCurrency(brand.initialFranchiseFee) : "See FDD"} />
              <Row label="Ongoing Royalty" value={brand.royaltyRate} />
              <Row label="Marketing Fund" value={brand.marketingFundRate} />
              {brand.technologyFee != null && (
                <Row label="Technology Fee" value={`${formatCurrency(brand.technologyFee)}/mo`} />
              )}
            </tbody>
          </table>
        </Section>

        {/* ── 3. Revenue Performance (Item 19) ── */}
        <Section title="3. Revenue Performance (Item 19)" citation="Item 19">
          {brand.hasItem19 && brand.item19?.grossRevenueAvg ? (
            <table className="w-full text-sm">
              <tbody>
                <Row label="Average Gross Revenue" value={formatCurrency(brand.item19.grossRevenueAvg)} highlight />
                {brand.item19.grossRevenueMedian != null && (
                  <Row label="Median Revenue" value={formatCurrency(brand.item19.grossRevenueMedian)} />
                )}
                {brand.item19.grossRevenue25th != null && (
                  <Row label="25th Percentile" value={formatCurrency(brand.item19.grossRevenue25th)} />
                )}
                {brand.item19.grossRevenue75th != null && (
                  <Row label="75th Percentile" value={formatCurrency(brand.item19.grossRevenue75th)} />
                )}
                <Row label="Units Included" value={brand.item19.unitsIncluded > 0 ? brand.item19.unitsIncluded.toLocaleString() : "Not specified"} />
                <Row label="Basis" value={brand.item19.basis.replace(/_/g, " ")} />
                <Row label="Revenue Type" value={brand.item19.revenueType ?? "not specified"} />
                <Row label="Measurement Period" value={brand.item19.timePeriod || "See FDD"} />
                {brand.item19.measurementYear && (
                  <Row label="Measurement Year" value={String(brand.item19.measurementYear)} />
                )}
              </tbody>
            </table>
          ) : (
            <div className="px-5 py-4 text-sm text-muted">
              <p className="font-semibold text-warning">⚠ Item 19 Not Provided</p>
              <p className="mt-1">This franchisor did not include a Financial Performance Representation. Verify revenue independently with existing franchisees (Item 20 contact list).</p>
            </div>
          )}
        </Section>

        {/* Scenario Economics removed — core product shows FDD-reported economics only.
           Illustrative models create implied earnings claims per FTC guidance. */}

        {/* ── 5. System Health ── */}
        <Section title="5. System Health (Item 20)" citation="Item 20">
          <table className="w-full text-sm">
            <tbody>
              <Row label="Units Opened (reporting period)" value={brand.unitEconomics.unitsOpened > 0 ? `+${brand.unitEconomics.unitsOpened}` : "0"} />
              <Row label="Units Closed" value={String(brand.unitEconomics.unitsClosed)} />
              <Row label="Net Unit Growth" value={`${brand.unitEconomics.netGrowth >= 0 ? "+" : ""}${brand.unitEconomics.netGrowth}`} highlight={brand.unitEconomics.netGrowth >= 0} />
              <Row label="Annual Turnover Rate" value={brand.unitEconomics.turnoverRate > 0 ? `${brand.unitEconomics.turnoverRate}%` : "See FDD"} />
              {scores.systemHealth != null && (
                <Row label="System Health Score (FDD-derived)" value={`${scores.systemHealth}/10`} highlight={(scores.systemHealth ?? 0) >= 7} />
              )}
            </tbody>
          </table>
        </Section>

        {/* ── 6. Franchisor Financial Health ── */}
        <Section title="6. Franchisor Financial Health (Item 21)" citation="Item 21">
          {brand.item21?.hasAuditedFinancials ? (
            <table className="w-full text-sm">
              <tbody>
                <Row label="Audited Financials" value="Yes — independent audit" highlight />
                {brand.item21.auditorName && <Row label="Auditor" value={brand.item21.auditorName.toUpperCase()} />}
                {brand.item21.auditorOpinion && <Row label="Auditor Opinion" value={brand.item21.auditorOpinion.charAt(0).toUpperCase() + brand.item21.auditorOpinion.slice(1)} highlight={brand.item21.auditorOpinion === "clean"} />}
                <Row label="Going Concern Warning" value={brand.item21.goingConcernWarning ? "⚠ YES — review before proceeding" : "None ✓"} highlight={!brand.item21.goingConcernWarning} />
                {brand.item21.franchisorRevenue != null && <Row label="Franchisor Revenue" value={formatCurrency(brand.item21.franchisorRevenue)} />}
                {brand.item21.franchisorTotalAssets != null && <Row label="Total Assets" value={formatCurrency(brand.item21.franchisorTotalAssets)} />}
                {brand.item21.franchisorEquity != null && <Row label="Equity" value={formatCurrency(brand.item21.franchisorEquity)} highlight={brand.item21.franchisorEquity > 0} />}
                {brand.item21.franchisorNetIncome != null && <Row label="Net Income" value={formatCurrency(brand.item21.franchisorNetIncome)} highlight={brand.item21.franchisorNetIncome > 0} />}
                {brand.item21.financialStrengthSignal && <Row label="Financial Strength Signal" value={brand.item21.financialStrengthSignal.charAt(0).toUpperCase() + brand.item21.financialStrengthSignal.slice(1)} highlight={brand.item21.financialStrengthSignal === "strong"} />}
                {scores.franchisorStrength != null && <Row label="Franchisor Strength Score (FDD-derived)" value={`${scores.franchisorStrength}/10`} highlight={(scores.franchisorStrength ?? 0) >= 7} />}
              </tbody>
            </table>
          ) : (
            <div className="px-5 py-4 text-sm text-muted">
              <p>Item 21 financial data not yet extracted for this brand. Review the FDD directly for audited financial statements.</p>
            </div>
          )}
        </Section>

        {/* ── 7. Contract Risk ── */}
        {brand.item17 && (
        <Section title="7. Contract Summary (Item 17)" citation="Item 17">
          <table className="w-full text-sm">
            <tbody>
              {brand.item17.initialTermYears && <Row label="Initial Term" value={`${brand.item17.initialTermYears} years`} />}
              {brand.item17.renewalCount && <Row label="Renewal Rights" value={`${brand.item17.renewalCount}× ${brand.item17.renewalTermYears ? brand.item17.renewalTermYears + " yr" : ""}`} />}
              {typeof brand.item17.transferFee === "number" && <Row label="Transfer Fee" value={formatCurrency(brand.item17.transferFee)} />}
              {brand.item17.curePeriodDays != null && <Row label="Cure Period (before termination)" value={`${brand.item17.curePeriodDays} days`} highlight={brand.item17.curePeriodDays >= 30} />}
              <Row label="Non-Compete (post-termination)" value={brand.item17.hasNonCompete ? `${brand.item17.nonCompeteYears ?? "?"}yr / ${brand.item17.nonCompeteMiles ?? "?"}mi` : "None"} highlight={!brand.item17.hasNonCompete} />
              <Row label="Mandatory Arbitration" value={brand.item17.mandatoryArbitration ? "Yes" : "No"} highlight={!brand.item17.mandatoryArbitration} />
              {brand.item17.disputeVenue && <Row label="Dispute Venue" value={brand.item17.disputeVenue} />}
              {scores.contractFriction != null && <Row label="Contract Friction Score (FDD-derived)" value={`${scores.contractFriction}/10`} highlight={(scores.contractFriction ?? 0) >= 7} />}
            </tbody>
          </table>
        </Section>
        )}

        {/* ── 8. Territory Risk (Item 12) ── */}
        {brand.item12 && terr.level !== "unknown" && (
        <Section title="8. Territory Analysis (Item 12)" citation="Item 12">
          <div className="px-5 py-4 space-y-2 text-sm">
            <table className="w-full">
              <tbody>
                <Row label="Territory Risk Score" value={`${terr.score ?? "—"}/10 — ${terr.label}`} highlight={(terr.score ?? 0) >= 6} />
                {brand.item12.exclusiveTerritory != null && (
                  <Row label="Exclusive Territory" value={brand.item12.exclusiveTerritory ? "Yes — granted" : "No — encroachment risk"} highlight={brand.item12.exclusiveTerritory} />
                )}
                {brand.item12.territoryType && (
                  <Row label="Territory Type" value={brand.item12.territoryType} />
                )}
                {brand.item12.territoryRadius != null && (
                  <Row label="Territory Radius" value={`${brand.item12.territoryRadius} miles`} />
                )}
                {brand.item12.territoryPopulation != null && (
                  <Row label="Territory Population" value={brand.item12.territoryPopulation.toLocaleString()} />
                )}
                {brand.item12.franchisorMayCompete != null && (
                  <Row label="Franchisor May Compete" value={brand.item12.franchisorMayCompete ? "Yes — risk to borrower" : "No"} highlight={!brand.item12.franchisorMayCompete} />
                )}
                {brand.item12.onlineSalesReserved != null && (
                  <Row label="Online Sales Reserved by Franchisor" value={brand.item12.onlineSalesReserved ? "Yes" : "No"} highlight={!brand.item12.onlineSalesReserved} />
                )}
              </tbody>
            </table>
            <p className="text-muted text-xs mt-1">{terr.rationale}</p>
          </div>
        </Section>
        )}

        {/* ── 9. Management Quality (Item 2) ── */}
        {brand.managementData && mgmtSignal.level !== "unknown" && (
        <Section title="9. Management Team (Item 2)" citation="Item 2">
          <div className="px-5 py-4 space-y-2 text-sm">
            <table className="w-full">
              <tbody>
                <Row label="Management Quality Score" value={`${mgmtSignal.score ?? "—"} / 10 — ${mgmtSignal.label}`} />
                {brand.managementData.execCount != null && (
                  <Row label="Senior Executives" value={String(brand.managementData.execCount)} />
                )}
                {brand.managementData.hasFranchiseExp != null && (
                  <Row label="Franchise System Experience" value={brand.managementData.hasFranchiseExp ? "Yes — disclosed in Item 2" : "Not indicated"} />
                )}
                {brand.managementData.hasStableLeadership != null && (
                  <Row label="Long-Tenured Leadership (5+ yrs)" value={brand.managementData.hasStableLeadership ? "Yes" : "Not indicated"} />
                )}
                {brand.managementData.hasLeadershipChanges != null && (
                  <Row label="Recent Leadership Changes" value={brand.managementData.hasLeadershipChanges ? "Yes — within 2 yrs of FDD filing" : "No"} />
                )}
              </tbody>
            </table>
            <p className="text-muted text-xs mt-2">{mgmtSignal.rationale}</p>
            <p className="text-muted text-[10px]">Extracted from Item 2 (Business Experience) via automated pattern matching · Confidence: {brand.managementData.extractionConfidence ?? "medium"}</p>
          </div>
        </Section>
        )}

        {/* ── 10. Supplier Dependence (Item 8) ── */}
        {brand.item8 && supplierRisk.level !== "unknown" && (
        <Section title="10. Supplier Dependence (Item 8)" citation="Item 8">
          <div className="px-5 py-4 space-y-2 text-sm">
            <table className="w-full">
              <tbody>
                <Row label="Supplier Risk Score" value={`${supplierRisk.score ?? "—"} / 10 — ${supplierRisk.label}`} />
                {brand.item8.hasRequiredPurchases != null && (
                  <Row label="Required Purchases" value={brand.item8.hasRequiredPurchases ? "Yes" : "No"} />
                )}
                {brand.item8.approvedSupplierList != null && (
                  <Row label="Approved Supplier List" value={brand.item8.approvedSupplierList ? "Yes — defined list required" : "No"} />
                )}
                {brand.item8.specificationsOnly != null && (
                  <Row label="Spec-Based Sourcing" value={brand.item8.specificationsOnly ? "Yes — free sourcing if specs met" : "No"} />
                )}
                {brand.item8.franchisorReceivesSupplierRevenue != null && (
                  <Row label="Franchisor Supplier Revenue" value={brand.item8.franchisorReceivesSupplierRevenue ? "Yes ⚠" : "No"} />
                )}
                {brand.item8.alternativeSupplierPossible != null && (
                  <Row label="Alternative Suppliers Allowed" value={brand.item8.alternativeSupplierPossible ? "Yes (with approval)" : "No"} />
                )}
                {brand.item8.lockInScore != null && (
                  <Row label="Lock-In Score (0–10)" value={`${brand.item8.lockInScore} / 10`} />
                )}
              </tbody>
            </table>
            <p className="text-muted text-xs mt-2">{supplierRisk.rationale}</p>
          </div>
        </Section>
        )}

        {/* ── 11. Broker / Sales Channel ── */}
        {brand.brokerData?.usesBrokers && (
        <Section title="11. Sales Channel Disclosure" citation="Items 1, 5-6">
          <div className="px-5 py-4 space-y-2 text-sm">
            <p className="text-muted">
              <span className="font-semibold text-warning">⚑ Broker Involvement: </span>
              This FDD discloses use of franchise brokers or Franchise Sales Organizations (FSOs).
              Lenders should note that broker fees may inflate the effective cost of acquisition.
            </p>
            {brand.brokerData.paysReferralFee && (
              <p className="text-muted">
                <span className="font-semibold text-foreground">Referral Fees Paid: </span>
                The franchisor pays commissions to brokers who originate franchise sales.
                {brand.brokerData.feeDisclosureNote && ` Disclosure: "${brand.brokerData.feeDisclosureNote}"`}
              </p>
            )}
            {brand.brokerData.brokerNetworks && brand.brokerData.brokerNetworks.length > 0 && (
              <p className="text-muted">
                <span className="font-semibold text-foreground">Networks: </span>
                {brand.brokerData.brokerNetworks.join(", ")}
              </p>
            )}
          </div>
        </Section>
        )}

        {/* ── 12. SBA Lending Notes ── */}
        <Section title="12. SBA Lending Notes">
          <div className="px-5 py-4 space-y-3 text-sm">
            <div>
              <p className="font-semibold text-foreground mb-1">Loan Amount Guidance</p>
              <p className="text-muted">
                Based on the investment range ({formatInvestmentRange(brand.totalInvestmentLow, brand.totalInvestmentHigh)}),
                {brand.totalInvestmentLow > 0 ? ` an SBA 7(a) loan would typically cover ${formatCurrency(Math.round(brand.totalInvestmentLow * 0.8))}–${formatCurrency(Math.round(brand.totalInvestmentHigh * 0.8))} (80% of total investment). Down payment requirement: typically 10–30% of total project cost.` : " consult your lender for loan sizing guidance."}
              </p>
            </div>
            <div>
              <p className="font-semibold text-foreground mb-1">SBA Registry Status</p>
              <p className="text-muted">Check the SBA Franchise Registry (franchisedirectory.sba.gov) to confirm whether {brand.name} is listed. Brands on the registry have pre-approved franchise agreements, simplifying the loan process.</p>
            </div>
            <div>
              <p className="font-semibold text-foreground mb-1">Documents Required for SBA Application</p>
              <ul className="text-muted space-y-1 mt-1 ml-4 list-disc text-xs">
                <li>Current FDD (Item 21 audited financial statements are required)</li>
                <li>Signed franchise agreement (or executed copy)</li>
                <li>Personal financial statement (SBA Form 413)</li>
                <li>Business plan with financial projections (prepare separately with your accountant)</li>
                <li>3 years personal tax returns</li>
                <li>Real estate lease or letter of intent</li>
              </ul>
            </div>
          </div>
        </Section>

        {/* ── Disclaimer ── */}
        <section className="rounded-xl border border-border/50 bg-surface p-4 mb-8">
          <p className="text-[10px] text-muted leading-relaxed">
            <span className="font-semibold text-foreground">Disclaimer: </span>
            This Lender Readiness Pack was generated by Franchisel.com from the {brand.fddYear} Franchise Disclosure Document
            {isGovVerified ? " filed with a state franchise regulator" : ""}. Source: {brand.sourceNotes ?? "filed FDD"}.
            Scenario economics are editorial projections using category cost benchmarks — they are NOT guarantees of performance and
            are NOT sourced from the FDD. This document does not constitute legal, financial, or investment advice.
            Verify all figures with a qualified franchise attorney and SBA lender before proceeding.
            Generated {today} by Franchisel.com — buyer-aligned, never franchisor-funded.
          </p>
        </section>

        {/* ── Actions ── */}
        <div className="print:hidden flex flex-wrap gap-3 pb-8">
          <Link
            href={`/brands/${brand.slug}`}
            className="px-4 py-2 rounded-lg border border-border text-sm font-medium text-muted hover:text-foreground transition-all"
          >
            ← Full Profile
          </Link>
          <Link
            href={`/brands/${brand.slug}/diligence`}
            className="px-4 py-2 rounded-lg border border-border text-sm font-medium text-muted hover:text-foreground transition-all"
          >
            View Diligence Memo →
          </Link>
        </div>

      </main>
    </div>
  );
}
