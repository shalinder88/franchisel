import Link from "next/link"
import type { BrandPageModel } from "@/lib/brand-page-model"
import type { FranchiseDossier } from "@/data/dossiers"
import StickyTocLux from "./StickyTocLux"
import HeroLux from "./HeroLux"
import GuidedLux from "./GuidedLux"
import EconomicsLux from "./EconomicsLux"
import StabilityLux from "./StabilityLux"
import ContractLux from "./ContractLux"
import StateLux from "./StateLux"
import FinancialLux from "./FinancialLux"
import RedFlagsLux from "./RedFlagsLux"
import QuestionsLux from "./QuestionsLux"
import DecisionLux from "./DecisionLux"
import DossierLux from "./DossierLux"

export default function BrandPageLux({
  model,
  dossier,
}: {
  model: BrandPageModel
  dossier?: FranchiseDossier | null
}) {
  const toc: Array<{ id: string; label: string }> = [
    { id: "hero", label: "Snapshot" },
    { id: "guided-summary", label: "Five questions" },
    { id: "economics", label: "What you pay" },
    { id: "stability", label: "Is it growing?" },
    { id: "contract", label: "What you give up" },
  ]
  if (model.stateAddenda && model.stateAddenda.entries.length > 0) {
    toc.push({ id: "state-addenda", label: "State overrides" })
  }
  toc.push(
    { id: "financial-strength", label: "Franchisor health" },
    { id: "red-flags", label: "What could go wrong" },
    { id: "questions", label: "Questions to ask" },
    { id: "decision", label: "Decision framing" },
  )
  if (dossier) toc.push({ id: "dossier", label: "The full dossier" })

  return (
    <div className="mcd-lux bg-[color:var(--lux-surface-0)] text-[color:var(--lux-ink)] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 pt-6 pb-20 lg:flex lg:gap-10">
        <StickyTocLux entries={toc} />
        <main className="flex-1 min-w-0">
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="text-[10px] tracking-[0.18em] uppercase text-[color:var(--lux-ink-faint)] mb-4">
            <Link href="/" className="hover:text-[color:var(--lux-ink-mute)] transition-colors">Home</Link>
            <span className="mx-2 text-[color:var(--lux-edge-strong)]">/</span>
            <Link href="/brands" className="hover:text-[color:var(--lux-ink-mute)] transition-colors">Brands</Link>
            <span className="mx-2 text-[color:var(--lux-edge-strong)]">/</span>
            <span className="text-[color:var(--lux-ink-mute)]">{model.hero.brandName}</span>
          </nav>

          <HeroLux hero={model.hero} provenance={model.provenance} />
          <GuidedLux items={model.guidedSummary} />
          <EconomicsLux economics={model.economics} />
          <StabilityLux stability={model.systemStability} />
          <ContractLux contract={model.contractBurden} />
          {model.stateAddenda ? <StateLux addenda={model.stateAddenda} /> : null}
          <FinancialLux financial={model.financialStrength} />
          <RedFlagsLux flags={model.redFlags} />
          <QuestionsLux questions={model.franchiseeQuestions} />
          <DecisionLux hero={model.hero} questions={model.franchiseeQuestions} />
          {dossier && <DossierLux dossier={dossier} />}

          {/* Footer */}
          <footer className="mt-20 pt-10 pb-4">
            <div className="lux-rule mb-8" />
            <p className="text-[11px] text-[color:var(--lux-ink-faint)] leading-relaxed max-w-2xl">
              Based on the {model.provenance.filingYear} FDD filed by {model.provenance.franchisorLegalName} (file {model.provenance.fddId}).
              All facts extracted from the FDD. No illustrative or modeled economics.
              Independent analysis. Not legal or financial advice.
            </p>
          </footer>
        </main>
      </div>
    </div>
  )
}
