import Link from "next/link"
import type { BrandPageModel } from "@/lib/brand-page-model"
import { getTOC } from "@/lib/brand-pages/mappers"
import StickyTOC from "./StickyTOC"
import Hero from "./Hero"
import GuidedSummary from "./GuidedSummary"
import EconomicsBlock from "./EconomicsBlock"
import StabilityBlock from "./StabilityBlock"
import ContractBurdenBlock from "./ContractBurdenBlock"
import StateAddendaBlock from "./StateAddendaBlock"
import FinancialStrengthBlock from "./FinancialStrengthBlock"
import RedFlagList from "./RedFlagList"
import QuestionList from "./QuestionList"
import EvidenceAccordion from "./EvidenceAccordion"

/**
 * Flagship brand-page layout. Reusable across brands — consumes a BrandPageModel.
 * Fixed teaching sequence: Hero → Guided summary → Economics → Stability →
 * Contract → (State addenda if any) → Financial strength → Red flags →
 * Questions → Evidence.
 */
export default function BrandPage({ model }: { model: BrandPageModel }) {
  const toc = getTOC(model)
  return (
    <div className="bg-background text-foreground min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-10 lg:flex lg:gap-8">
        <StickyTOC entries={toc} />
        <main className="flex-1 min-w-0">
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="text-xs text-muted mb-6">
            <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
            <span className="mx-1.5">/</span>
            <Link href="/brands" className="hover:text-foreground transition-colors">Brands</Link>
            <span className="mx-1.5">/</span>
            <span className="text-foreground/70">{model.hero.brandName}</span>
          </nav>

          <Hero hero={model.hero} />
          <GuidedSummary items={model.guidedSummary} />
          <EconomicsBlock economics={model.economics} />
          <StabilityBlock stability={model.systemStability} />
          <ContractBurdenBlock contract={model.contractBurden} />
          {model.stateAddenda ? <StateAddendaBlock addenda={model.stateAddenda} /> : null}
          <FinancialStrengthBlock financial={model.financialStrength} />
          <RedFlagList flags={model.redFlags} />
          <QuestionList questions={model.franchiseeQuestions} />
          <EvidenceAccordion evidence={model.evidence} provenance={model.provenance} />

          {/* Page-end disclaimer */}
          <footer className="mt-16 border-t border-border pt-8 pb-12 text-xs text-muted leading-relaxed max-w-2xl">
            <p>
              This analysis is based on the {model.provenance.filingYear} Franchise Disclosure
              Document filed by {model.provenance.franchisorLegalName} (file{" "}
              {model.provenance.fddId}). All facts are extracted from the FDD; no illustrative or
              modeled economics are presented. Franchisel is independent and receives no franchisor
              funding. This is not legal or financial advice.
            </p>
          </footer>
        </main>
      </div>
    </div>
  )
}
