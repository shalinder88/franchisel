// Canonical view-model for flagship brand pages.
// Keep extraction-shaped data out; this is the chart/teach-ready shape.

export type Severity = "neutral" | "caution" | "high"

export type Provenance = {
  fddId: string
  filingYear: string
  franchisorLegalName: string
  runArtifacts: string[] // pointers into runs/<brand>-<year>/...
  sourceMap?: string // optional 01_source_map.md pointer
}

export type StateAddendum = {
  state: string
  affectedFamily: string
  overrideSummary: string
  whyItMatters: string
  sourcePages?: number[]
  severity?: Severity
}

export type BrandPageModel = {
  provenance: Provenance

  hero: {
    brandName: string
    category: string
    filingYear: string
    thesis: string
    verificationLabel: string
    keyMetrics: Array<{ label: string; value: string; sublabel?: string }>
    positives: string[]
    cautions: string[]
  }

  guidedSummary: Array<{
    id: string
    title: string
    verdict: string
    whyItMatters: string
    severity?: Severity
  }>

  economics: {
    investment: {
      rangeLow: number | null
      rangeHigh: number | null
      buckets: Array<{
        label: string
        low?: number | null
        high?: number | null
        value?: number | null
      }>
      takeaways: string[]
    }
    ongoingFees: {
      components: Array<{
        label: string
        value: string
        type: "recurring" | "conditional"
        note?: string
      }>
      takeaways: string[]
    }
    item19: {
      headlineMetric?: string
      metricLabel?: string
      period?: string
      sampleSize?: string
      revenueType?: "gross" | "net" | "unclear" | "other"
      basis?: string
      qualityFlags: Array<{
        label: string
        status: "good" | "mixed" | "caution"
        note?: string
      }>
      takeaways: string[]
    }
  }

  systemStability: {
    ownershipMix: Array<{ label: string; value: number }>
    annualMovement: Array<{
      year: string
      openings?: number
      closures?: number
      transfers?: number
    }>
    topStates?: Array<{ state: string; units: number }>
    takeaways: string[]
  }

  contractBurden: {
    overallVerdict: string
    familyScores: Array<{
      family:
        | "territory"
        | "supplier"
        | "capex"
        | "operations"
        | "transfer"
        | "renewal"
        | "termination"
        | "post_term"
      severity: Severity
      summary: string
      evidencePoints: string[]
    }>
    takeaways: string[]
  }

  stateAddenda?: {
    overallVerdict: string
    entries: StateAddendum[]
    statesWithoutAddendum?: string[]
    takeaways: string[]
  }

  financialStrength: {
    highlights: Array<{
      label: string
      value: string
      note?: string
      severity?: Severity
    }>
    takeaways: string[]
  }

  redFlags: Array<{
    title: string
    severity: "caution" | "high"
    summary: string
    whyItMatters: string
    linkedSectionId?: string
  }>

  franchiseeQuestions: Array<{
    category: "economics" | "operations" | "contract_exit" | "support"
    question: string
    basedOn: string
  }>

  evidence: {
    sections: Array<{
      title: string
      items: Array<{ label: string; detail: string; sourceRef?: string }>
    }>
  }
}
