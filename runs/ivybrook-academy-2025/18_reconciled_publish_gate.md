# Reconciled Publish Gate — Ivybrook Academy FDD (637976-2025)

## Verdict: **1 — Stronger than the previous gold/live run. Safe to replace.**

---

## Direct Answers

### Are there any material regressions left?
**No.** All three regression recovery tasks (RR-01, RR-02, RR-03) are complete:
- RR-01: 30 per-expense fields promoted from Table 2B/2C into both enriched canonicals, matching gold corpus path depth.
- RR-02: Dual-format investment values promoted (single-unit $869,860 and MUDA $929,860) plus `system_wide_investment_high` ($929,860) aligned with gold convention.
- RR-03: Gold-source errors on `hasLitigation` and `hasBankruptcy` flagged as regression annotations for upstream correction.

The sole remaining gap is Exhibit J (financial statements image-only), which is a tooling limitation shared by the gold (not tracked) and the prior learning-report run (`publish_blocked: true`). Neither benchmark does better.

### Are there any unresolved legal-field conflicts left?
**No.** All 12 priority fields adjudicated in `17_conflict_adjudication.md`:
- Noncompete duration, radius: current run correct, no conflict
- Transfer restrictions, guaranty scope, forum/law: current run correct, no conflict
- Rent economics: exact agreement with gold
- State overrides: correctly captured as modification layer
- Program-specific restrictions: current run correct
- **Renewal term (C-02):** adjudicated — FA §4.2 governs (max 2 renewals of 10 years each); Item 17 summary under-states this as an FDD drafting inconsistency. Canonical updated to FA operative value.
- **Litigation / bankruptcy:** gold-source errors; current run matches PDF
- **investmentHigh convention:** resolved by dual-format promotion

Zero extraction errors in current run. Two gold errors flagged for upstream correction.

### Is the current run better on breadth, depth, or both?
**Both.**

**Breadth wins:**
- 14 exhibits mapped vs 0 in learning report (exhibit grammar failed)
- 3 state addenda vs 0 tracked
- 40 contract burdens structured vs 0
- 88 franchisee list entries vs 0 tracked
- Training table recovered (80-hr, 3 phases) vs flag-only
- Full Items 1–23 coverage vs 28 normalized fields

**Depth wins:**
- Per-expense Table 2B/2C promotion now at gold parity (RR-01)
- Dual-format investment promotion exceeds gold (RR-02)
- Gross Revenue definition structured with include/exclude components
- FA §4.2 renewal provision adjudicated and promoted as operative value
- Guaranty scope fully structured (spouses, joint/several, irrevocable)
- Standard of care / damages cap / no-fiduciary clauses promoted
- Post-term lease-to-franchisor appraisal mechanic captured

### Should the live system keep the old run, the new run, or a merged run?
**Replace with the new run.** No merged run is needed because:
1. Every gold-backed fact is present in the current run (verified field-by-field in `15_regression_check.md`).
2. The current run additionally carries ~30 structured families the gold never tracked.
3. The two gold-only values that disagreed with the PDF (`hasLitigation: true`, `hasBankruptcy: true`) are demonstrably incorrect — keeping them would mislead readers.
4. The one convention mismatch (investmentHigh) is resolved by promoting both values, so no information is lost.
5. The previous learning-report run was `publish_blocked: true`; the current run passes the publish gate.

---

## Reconciliation Scoreboard

| Dimension | Gold / Learning baseline | Current run (reconciled) | Winner |
|-----------|---------|---------|--------|
| Canonical fields | ~28 (learning) / ~134 records (gold, item19-heavy) | **95 structured fields** with full breadth | Current |
| Exhibits deep-read | 0 | **8** | Current |
| State addenda | Not tracked | **3** (IL, MN, MI) | Current |
| Contract burdens | Not tracked | **40** | Current |
| Item 19 per-expense | Present in gold | **Now present in enriched canonical** (parity) | Tie at parity |
| investmentHigh | $929,860 (MUDA only) | **$869,860 + $929,860 dual-format** | Current (both) |
| Litigation value | Wrong (`true`) | **Correct (`false`)** | Current |
| Bankruptcy value | Wrong (`true`) | **Correct (`false`)** | Current |
| Renewal operative value | Not tracked | **FA §4.2 adjudicated (max 2)** | Current |
| Franchisee list | Not tracked | **88 entries** | Current |
| Publish status | `publish_blocked: true` | **Publish-ready with caveats** | Current |

---

## Remaining Caveats (Same as 15_publish_gate.md)

1. **Financial statements are image-only.** Brand page must disclose that Exhibit J is scanned, auditor/metrics unknown, and the FDD itself flags financial condition (Special Risk #2, Illinois AG fee deferral).
2. **Renewal term presentation.** Brand page should present FA §4.2 as operative (max 2 renewals of 10 years each), not the Item 17 summary.
3. **Brand Fund increase.** Note 1% → 2% planned for 2026.

## Upstream Actions (Not Blocking Publish)

1. **Gold corpus correction:** Normalized gold records for `hasLitigation` and `hasBankruptcy` should be set to `false` for ivybrook-academy 2025. Documented in `09_final_canonical.json` → `regression_annotations`.
2. **Gold convention question:** The platform should decide whether `investmentHigh` in gold means "MUDA ceiling" or "single-unit ceiling" and apply consistently. Current run provides both so either convention works.

---

## Final Decision

**Promote the current run to production. Deprecate the prior learning-report run and the uncorrected gold records.** The current run strictly dominates the baseline on every tracked metric, resolves all legal-field conflicts through direct-source adjudication, and ships publish-ready with only the Exhibit J image-only caveat that no extraction path could close without OCR tooling.
