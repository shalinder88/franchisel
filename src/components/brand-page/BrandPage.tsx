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

export default function BrandPage({ model }: { model: BrandPageModel }) {
  const toc = getTOC(model)
  return (
    <div className="bg-background text-foreground min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 pt-6 pb-16 lg:flex lg:gap-10">
        <StickyTOC entries={toc} />
        <main className="flex-1 min-w-0">
          {/* Breadcrumb — muted, out of the way */}
          <nav aria-label="Breadcrumb" className="text-[10px] text-muted/40 mb-4 tracking-wider">
            <Link href="/" className="hover:text-muted transition-colors">Home</Link>
            <span className="mx-1.5 text-border/40">/</span>
            <Link href="/brands" className="hover:text-muted transition-colors">Brands</Link>
            <span className="mx-1.5 text-border/40">/</span>
            <span className="text-muted/60">{model.hero.brandName}</span>
          </nav>

          <Hero hero={model.hero} summaryItems={model.guidedSummary} />
          <GuidedSummary items={model.guidedSummary} />
          <EconomicsBlock economics={model.economics} />
          <StabilityBlock stability={model.systemStability} />
          <ContractBurdenBlock contract={model.contractBurden} />
          {model.stateAddenda ? <StateAddendaBlock addenda={model.stateAddenda} /> : null}
          <FinancialStrengthBlock financial={model.financialStrength} />
          <RedFlagList flags={model.redFlags} />
          <QuestionList questions={model.franchiseeQuestions} />
          <EvidenceAccordion evidence={model.evidence} provenance={model.provenance} />

          {/* Page-end */}
          <footer className="mt-20 pt-8 pb-12">
            <div className="h-px bg-gradient-to-r from-transparent via-border/50 to-transparent mb-8" />
            <p className="text-[11px] text-muted/40 leading-relaxed max-w-xl">
              Based on the {model.provenance.filingYear} FDD filed by {model.provenance.franchisorLegalName} (file {model.provenance.fddId}).
              All facts extracted from FDD. No illustrative economics. Independent analysis. Not legal or financial advice.
            </p>
          </footer>
        </main>
      </div>
    </div>
  )
}
