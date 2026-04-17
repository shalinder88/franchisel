import Link from "next/link"
import type { BrandPageModel } from "@/lib/brand-page-model"
import type { FranchiseDossier } from "@/data/dossiers"
import StickyTocLux from "./StickyTocLux"
import HeroLux from "./HeroLux"
import TrustRailLux from "./TrustRailLux"
import ModeSwitcherLux from "./ModeSwitcherLux"
import WhatChangedLux from "./WhatChangedLux"
import LeanStripLux from "./LeanStripLux"
import CTARailLux from "./CTARailLux"
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
import CompareTrayLux from "./CompareTrayLux"

/**
 * BrandPageLux — top-level orchestrator.
 *
 * Modes (via ModeSwitcherLux + data-mode attribute on .mcd-lux root):
 *   quick     — verdict only: hero, CTA, lean, decision, trust rail
 *   guided    — default walkthrough, everything visible
 *   evidence  — proof first: hero, trust, contract, state, financial,
 *               questions, dossier. Teaching layer is hidden.
 *
 * Sections opt out of a mode via data-mode-hide on the <section id=...>
 * tag. CSS in globals.css does the hiding.
 */
export default function BrandPageLux({
  model,
  dossier,
}: {
  model: BrandPageModel
  dossier?: FranchiseDossier | null
}) {
  const toc: Array<{ id: string; label: string }> = [
    { id: "hero", label: "Snapshot" },
    { id: "lean-strip", label: "30-second read" },
    { id: "guided-summary", label: "Five questions" },
    { id: "economics", label: "What you actually pay" },
    { id: "stability", label: "Is it really growing?" },
    { id: "contract", label: "Where flexibility dies" },
  ]
  if (model.stateAddenda && model.stateAddenda.entries.length > 0) {
    toc.push({ id: "state-addenda", label: "States that change the deal" })
  }
  toc.push(
    { id: "financial-strength", label: "What financials tell you" },
    { id: "red-flags", label: "What could go wrong" },
    { id: "questions", label: "Questions to ask" },
    { id: "decision", label: "Decision framing" },
  )
  if (dossier) toc.push({ id: "dossier", label: "Evidence dossier" })

  return (
    <div
      className="mcd-lux bg-[color:var(--lux-surface-0)] text-[color:var(--lux-ink)] min-h-screen"
      data-mode="guided"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 pt-6 pb-20 lg:flex lg:gap-10">
        <StickyTocLux entries={toc} />
        <main className="flex-1 min-w-0">
          {/* Breadcrumb */}
          <nav
            aria-label="Breadcrumb"
            className="text-[10px] tracking-[0.18em] uppercase text-[color:var(--lux-ink-faint)] mb-4"
          >
            <Link
              href="/"
              className="hover:text-[color:var(--lux-ink-mute)] transition-colors"
            >
              Home
            </Link>
            <span className="mx-2 text-[color:var(--lux-edge-strong)]">/</span>
            <Link
              href="/brands"
              className="hover:text-[color:var(--lux-ink-mute)] transition-colors"
            >
              Brands
            </Link>
            <span className="mx-2 text-[color:var(--lux-edge-strong)]">/</span>
            <span className="text-[color:var(--lux-ink-mute)]">
              {model.hero.brandName}
            </span>
          </nav>

          <TrustRailLux model={model} dossier={dossier} />

          <WhatChangedLux />

          <ModeSwitcherLux />

          <div data-mode-hide="">
            <HeroLux hero={model.hero} provenance={model.provenance} />
          </div>

          <div data-mode-hide="evidence">
            <CTARailLux hasDossier={!!dossier} />
          </div>

          <div data-mode-hide="evidence">
            <LeanStripLux hero={model.hero} />
          </div>

          <div data-mode-hide="quick evidence">
            <GuidedLux items={model.guidedSummary} />
          </div>

          <div data-mode-hide="quick">
            <EconomicsLux economics={model.economics} />
          </div>

          <div data-mode-hide="quick">
            <StabilityLux stability={model.systemStability} />
          </div>

          <div data-mode-hide="quick">
            <ContractLux contract={model.contractBurden} />
          </div>

          {model.stateAddenda ? (
            <div data-mode-hide="quick">
              <StateLux addenda={model.stateAddenda} />
            </div>
          ) : null}

          <div data-mode-hide="quick">
            <FinancialLux financial={model.financialStrength} />
          </div>

          <div data-mode-hide="quick evidence">
            <RedFlagsLux flags={model.redFlags} />
          </div>

          <div data-mode-hide="quick">
            <QuestionsLux questions={model.franchiseeQuestions} />
          </div>

          <div data-mode-hide="evidence">
            <DecisionLux
              hero={model.hero}
              questions={model.franchiseeQuestions}
            />
          </div>

          {dossier && (
            <div data-mode-hide="quick">
              <DossierLux dossier={dossier} />
            </div>
          )}

          {/* Footer */}
          <footer className="mt-20 pt-10 pb-4">
            <div className="lux-rule mb-8" />
            <p className="text-[11px] text-[color:var(--lux-ink-faint)] leading-relaxed max-w-2xl">
              Based on the {model.provenance.filingYear} FDD filed by{" "}
              {model.provenance.franchisorLegalName} (file{" "}
              {model.provenance.fddId}). All facts extracted from the FDD. No
              illustrative or modeled economics. Independent analysis. Not
              legal or financial advice.
            </p>
          </footer>
        </main>
      </div>

      <CompareTrayLux />
    </div>
  )
}
