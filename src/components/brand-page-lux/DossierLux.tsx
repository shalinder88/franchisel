import type { FranchiseDossier } from "@/data/dossiers"
import { SectionLux, StatFigure, Chip, DataLine } from "./primitives"
import { Icon } from "./icons"

function fmt(v: unknown): string {
  if (v === null || v === undefined) return "—"
  if (typeof v === "string") return v
  if (typeof v === "number") return v.toLocaleString()
  if (typeof v === "boolean") return v ? "yes" : "no"
  if (typeof v === "object") {
    const o = v as Record<string, unknown>
    if ("rate" in o) {
      const rate = o.rate
      const ratePct =
        typeof rate === "number"
          ? rate <= 1
            ? `${(rate * 100).toFixed(rate * 100 < 1 ? 2 : 1)}%`
            : `${rate}%`
          : String(rate)
      const basis = o.calculation_basis ?? o.basis
      return `${ratePct}${basis ? " of " + String(basis) : ""}`
    }
    if ("low" in o && "high" in o) {
      const money = (x: unknown) => (typeof x === "number" ? `$${x.toLocaleString()}` : String(x))
      return `${money(o.low)} – ${money(o.high)}`
    }
    if ("value" in o) return fmt(o.value)
    if ("current_rate" in o) {
      const rate = o.current_rate
      return typeof rate === "number" ? (rate <= 1 ? `${(rate * 100).toFixed(2)}%` : `${rate}%`) : String(rate)
    }
  }
  try { return JSON.stringify(v) } catch { return String(v) }
}

function asNumber(v: unknown): number | null {
  if (typeof v === "number") return v
  if (typeof v === "string") {
    const n = Number(v.replace(/[^0-9.\-]/g, ""))
    return Number.isFinite(n) ? n : null
  }
  return null
}

export default function DossierLux({ dossier }: { dossier: FranchiseDossier }) {
  const cs = dossier.current_snapshot
  const econ = dossier.economics
  const i19 = dossier.item19_quality
  const i20 = dossier.item20_system_movement
  const cb = dossier.contract_burden
  const fs = dossier.financial_strength
  const so = dossier.state_overrides

  const techFees = econ.tech_fee_detail as
    | { tech_fees_itemized?: Array<{ name: string; annual_fee_usd: number; one_time_fee_usd?: number; optional?: boolean; purpose?: string }>; tech_fee_annual_total_required_only?: string; tech_fee_annual_total_with_optional?: string }
    | null
    | undefined

  const techItems = techFees?.tech_fees_itemized
    ? [...techFees.tech_fees_itemized]
        .filter((t) => (asNumber(t.annual_fee_usd) ?? 0) > 0)
        .sort((a, b) => (asNumber(b.annual_fee_usd) ?? 0) - (asNumber(a.annual_fee_usd) ?? 0))
    : []

  const techTotalReq = techItems.filter((t) => !t.optional).reduce((a, t) => a + (asNumber(t.annual_fee_usd) ?? 0), 0)
  const techTotalAll = techItems.reduce((a, t) => a + (asNumber(t.annual_fee_usd) ?? 0), 0)
  const techMax = techItems[0] ? asNumber(techItems[0].annual_fee_usd) ?? 1 : 1

  const stateAddendaCount = (() => {
    if (!so || typeof so !== "object") return 0
    const v = so as Record<string, unknown>
    if (Array.isArray(v.states_with_addenda)) return v.states_with_addenda.length
    return Object.keys(v).filter((k) => k !== "states_with_addenda").length
  })()

  const auditOpinionStr = typeof fs.audit_opinion === "string" ? fs.audit_opinion : ""
  const isClean = auditOpinionStr.toLowerCase().includes("clean") || auditOpinionStr.toLowerCase().includes("unqualified")
  const primaryRun = (dossier.source_evidence?.primary_run as string) ?? "—"

  return (
    <SectionLux
      id="dossier"
      eyebrow="The full dossier"
      headline={`What the ${cs.fdd_filing_year ?? ""} FDD actually says`}
      kicker="Every field below is extracted from the government-filed document. Internal contradictions are preserved, not resolved silently."
    >
      {/* Headline row — 4 big stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
        <div className="lux-card p-6">
          <StatFigure label="Franchise fee" value={fmt(cs.franchise_fee_headline)} size="md" />
        </div>
        <div className="lux-card p-6">
          <StatFigure label="Total investment" value={fmt(cs.investment_range_headline)} size="sm" />
        </div>
        <div className="lux-card p-6">
          <div className="lux-eyebrow mb-2">Royalty</div>
          <div className="text-[14px] leading-snug text-[color:var(--lux-ink)] lux-serif">
            {fmt(cs.royalty_headline)}
          </div>
        </div>
        <div className="lux-card p-6">
          <div className="lux-eyebrow mb-2">Advertising / brand fund</div>
          <div className="text-[14px] leading-snug text-[color:var(--lux-ink)] lux-serif">
            {fmt(cs.ad_fund_headline)}
          </div>
        </div>
      </div>

      {/* Tech-fee stacked bar — 22 components visualized */}
      {techItems.length > 0 && (
        <div className="lux-card p-7 mb-5">
          <div className="flex items-start justify-between flex-wrap gap-4 mb-5">
            <div>
              <div className="lux-eyebrow mb-2">Tech-fee stack · 22 components</div>
              <div className="flex items-baseline gap-3">
                <span className="lux-serif font-medium text-[34px] text-[color:var(--lux-ink)] lux-num tracking-tight leading-none">
                  ${techTotalReq.toLocaleString()}
                </span>
                <span className="text-[12px] text-[color:var(--lux-ink-mute)]">required / year</span>
              </div>
              <div className="mt-2 text-[11px] text-[color:var(--lux-ink-faint)]">
                ${techTotalAll.toLocaleString()} with optional lines
              </div>
            </div>
            <div className="text-[11px] text-[color:var(--lux-ink-mute)] text-right max-w-xs">
              Itemized from Item 6. Required fees are invisible in most FDD reads — they stack to real money.
            </div>
          </div>

          {/* Horizontal ranked bars */}
          <div className="space-y-1.5">
            {techItems.slice(0, 14).map((t, i) => {
              const amt = asNumber(t.annual_fee_usd) ?? 0
              const pct = (amt / techMax) * 100
              return (
                <div key={i} className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4">
                  <div className="min-w-0">
                    <div className="flex items-baseline gap-2 mb-1">
                      <span className="text-[12px] text-[color:var(--lux-ink-soft)] truncate">
                        {t.name}
                      </span>
                      {t.optional && <span className="text-[9px] uppercase tracking-wider text-[color:var(--lux-ink-faint)]">opt</span>}
                    </div>
                    <div className="h-2 bg-[color:var(--lux-surface-0)] rounded-full overflow-hidden border border-[color:var(--lux-edge)]">
                      <div
                        className={`h-full rounded-full ${t.optional ? "bg-[color:var(--lux-ink-faint)]" : "bg-[color:var(--lux-accent)]"}`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                  <span className="lux-num text-[12px] text-[color:var(--lux-ink)] min-w-[70px] text-right">
                    ${amt.toLocaleString()}
                  </span>
                </div>
              )
            })}
          </div>
          {techItems.length > 14 && (
            <div className="mt-3 text-[10px] text-[color:var(--lux-ink-faint)] text-right">
              +{techItems.length - 14} smaller components
            </div>
          )}
        </div>
      )}

      {/* Item 19 + Item 20 side-by-side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 mb-5">
        <div className="lux-card p-7">
          <div className="flex items-center gap-2 mb-4">
            <Icon name="audit" width={15} height={15} className="text-[color:var(--lux-ink-mute)]" />
            <div className="lux-eyebrow">Item 19 quality</div>
          </div>
          {cs.item_19_present ? (
            <div>
              <DataLine label="Cohort n" value={fmt(i19.cohort_n)} />
              <DataLine label="Average AUV" value={fmt(i19.average ?? (i19 as Record<string, unknown>).average_auv)} />
              <DataLine label="Median AUV" value={fmt(i19.median ?? (i19 as Record<string, unknown>).median_auv)} />
              <DataLine label="High / low" value={fmt(i19.high_low)} />
              <DataLine label="Presentation basis" value={fmt(i19.presentation_basis)} />
            </div>
          ) : (
            <div className="text-[13px] text-[color:var(--lux-ink-mute)]">Item 19 not surfaced in the merged dossier.</div>
          )}
        </div>

        <div className="lux-card p-7">
          <div className="flex items-center gap-2 mb-4">
            <Icon name="growth" width={15} height={15} className="text-[color:var(--lux-ink-mute)]" />
            <div className="lux-eyebrow">Item 20 system movement</div>
          </div>
          <DataLine label="System total" value={fmt(i20.system_total)} />
          <DataLine label="Franchised" value={fmt(i20.franchised)} />
          <DataLine label="Company-owned" value={fmt(i20.company_owned)} />
          <DataLine label="Openings" value={fmt(i20.openings)} />
          <DataLine label="Terminations" value={fmt(i20.terminations)} />
          <DataLine label="Non-renewals" value={fmt(i20.non_renewals)} />
          <DataLine label="Transfers" value={fmt(i20.transfers)} />
        </div>
      </div>

      {/* Contract + financial + state — 3-up evidence cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 mb-5">
        <div className="lux-card p-7">
          <div className="flex items-center gap-2 mb-4">
            <Icon name="scale" width={15} height={15} className="text-[color:var(--lux-ink-mute)]" />
            <div className="lux-eyebrow">Contract burden</div>
          </div>
          <DataLine label="Termination (cause)" value={fmt(cb.termination_with_cause)} />
          <DataLine label="Franchisee termination" value={fmt(cb.termination_by_franchisee)} />
          <DataLine label="Transfer" value={fmt(cb.transfer)} />
          <DataLine label="Non-compete (in-term)" value={fmt(cb.noncompete_in_term)} />
          <DataLine label="Non-compete (post-term)" value={fmt(cb.noncompete_post_term)} />
        </div>

        <div className={`lux-card p-7 ${isClean ? "lux-rail-neutral" : ""}`}>
          <div className="flex items-center justify-between gap-2 mb-4">
            <div className="flex items-center gap-2">
              <Icon name="audit" width={15} height={15} className="text-[color:var(--lux-ink-mute)]" />
              <div className="lux-eyebrow">Financial strength</div>
            </div>
            {isClean && <Chip severity="neutral" icon="check">Clean</Chip>}
          </div>
          <DataLine label="Auditor" value={fmt(fs.auditor)} />
          <DataLine label="Opinion" value={fmt(fs.audit_opinion)} />
          <DataLine label="Opinion date" value={fmt(fs.audit_opinion_date)} />
          <DataLine label="FYE" value={fmt(fs.fiscal_year_end)} />
          <DataLine label="Total revenue" value={fmt(fs.total_revenue)} />
          <DataLine label="Net income" value={fmt(fs.net_income)} />
        </div>

        <div className="lux-card p-7">
          <div className="flex items-center gap-2 mb-4">
            <Icon name="territory" width={15} height={15} className="text-[color:var(--lux-ink-mute)]" />
            <div className="lux-eyebrow">State overrides</div>
          </div>
          {stateAddendaCount > 0 ? (
            <>
              <div className="lux-serif text-[26px] text-[color:var(--lux-ink)] lux-num leading-none mb-1">
                {stateAddendaCount}
              </div>
              <div className="text-[11px] text-[color:var(--lux-ink-mute)] mb-4">
                state{stateAddendaCount === 1 ? "" : "s"} with overrides to the default FA
              </div>
              {so && typeof so === "object" && Array.isArray((so as Record<string, unknown>).states_with_addenda) && (
                <div className="flex flex-wrap gap-1.5">
                  {(((so as Record<string, unknown>).states_with_addenda as string[]) ?? []).map((s) => (
                    <span key={s} className="rounded-md border border-[color:var(--lux-edge)] bg-[color:var(--lux-surface-0)] px-2 py-0.5 text-[10px] text-[color:var(--lux-ink-mute)] tracking-wider">
                      {s}
                    </span>
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="text-[13px] text-[color:var(--lux-ink-mute)]">No state-level overrides surfaced.</div>
          )}
        </div>
      </div>

      {/* Validation questions + red flags + filing changes (if any) */}
      {dossier.validation_questions.length > 0 && (
        <div className="lux-card p-7 mb-5">
          <div className="flex items-center gap-2 mb-5">
            <Icon name="info" width={15} height={15} className="text-[color:var(--lux-ink-mute)]" />
            <div className="lux-eyebrow">Validation questions for the franchisor</div>
            <span className="text-[11px] text-[color:var(--lux-ink-faint)] ml-auto">{dossier.validation_questions.length} questions</span>
          </div>
          <ol className="space-y-2.5">
            {dossier.validation_questions.slice(0, 8).map((q, i) => (
              <li key={i} className="grid grid-cols-[auto_1fr] gap-3 text-[13px] leading-[1.55] text-[color:var(--lux-ink-soft)]">
                <span className="lux-serif text-[color:var(--lux-ink-faint)] lux-num pt-0.5 w-7">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span>{q}</span>
              </li>
            ))}
          </ol>
        </div>
      )}

      {dossier.filing_changes.length > 0 && (
        <div className="lux-card p-7 mb-5">
          <div className="flex items-center gap-2 mb-4">
            <Icon name="transfer" width={15} height={15} className="text-[color:var(--lux-ink-mute)]" />
            <div className="lux-eyebrow">Filing-year changes vs prior runs</div>
          </div>
          <div className="space-y-2">
            {dossier.filing_changes.slice(0, 8).map((fc, i) => (
              <div key={i} className="grid grid-cols-[minmax(0,1fr)_auto_auto] items-baseline gap-3 py-2 border-b border-[color:var(--lux-edge)] last:border-b-0 text-[12px]">
                <span className="font-mono text-[color:var(--lux-ink-soft)] truncate">{fc.field}</span>
                <span className="text-[color:var(--lux-ink-mute)] lux-num">was <span className="text-[color:var(--lux-ink)]">{fmt(fc.old_value)}</span></span>
                <span className="text-[color:var(--lux-accent)] lux-num">now <span className="text-[color:var(--lux-ink)]">{fmt(fc.current_value)}</span></span>
              </div>
            ))}
          </div>
        </div>
      )}

      {dossier.red_flags.length > 0 && (
        <div className="space-y-2 mb-5">
          <div className="lux-eyebrow mb-2">Red flags from the merged dossier</div>
          {dossier.red_flags.slice(0, 6).map((rf, i) => {
            const isCritical = rf.severity === "critical"
            const isWarning = rf.severity === "warning"
            const sev = isCritical ? "high" : isWarning ? "caution" : "neutral"
            return (
              <div key={i} className={`lux-card px-6 py-4 flex items-start gap-4 ${sev === "high" ? "lux-rail-high" : sev === "caution" ? "lux-rail-caution" : "lux-rail-neutral"}`}>
                <Chip severity={sev}>{rf.severity}</Chip>
                <div className="flex-1 min-w-0">
                  <div className="lux-eyebrow mb-1">{rf.kind}</div>
                  <p className="text-[13px] text-[color:var(--lux-ink-soft)] leading-relaxed">{rf.summary}</p>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Footer line */}
      <div className="mt-8 pt-6 border-t border-[color:var(--lux-edge)] flex flex-wrap items-baseline gap-x-5 gap-y-1 text-[10px] text-[color:var(--lux-ink-faint)]">
        <span className="tracking-wider uppercase">Source</span>
        <span className="font-mono text-[color:var(--lux-ink-mute)]">{primaryRun}</span>
        {Array.isArray(dossier.source_evidence?.harvest_runs) && (dossier.source_evidence?.harvest_runs as string[]).length > 0 && (
          <span>+ {(dossier.source_evidence?.harvest_runs as string[]).length} harvest run{(dossier.source_evidence?.harvest_runs as string[]).length === 1 ? "" : "s"}</span>
        )}
        <span className="ml-auto">Internal unresolveds preserved · {dossier.internal_unresolveds.length}</span>
      </div>
    </SectionLux>
  )
}
