# 17 Conflict Adjudication — Ivybrook Academy 2025 v2

**Verdict: SKIPPED — no real conflicts.**

B1 regression check (`15_regression_check.md`) and B2 recovery generator (`16_regression_recovery_tasks.md`) identified zero cases where v2 and the prior run disagree on a surfaced value. All differences are pure gaps (v2 missing fields that the prior run captured via vision OCR), which B4 handles via benchmark backfill — not value conflicts requiring adjudication.

**Cross-check of values that appear in both runs**:
- Stockholder's equity 2024 = $345,862 → v2 (VA addendum p137) and prior run agree.
- Franchisor total revenue 2024 = $2,171,363 → both agree (Item 8 p22).
- Fiscal year end = December 31 → both agree.
- Item 19 tables, Item 20 tables, fee stack, term/renewal, noncompete, venue, territory, Brand Fund mechanics → all match.
- Crux acquisition details (2025-08-29, Delaware stack, Dallas TX address) → not in prior run body but reconcilable with prior run's `identity` section.
- Exhibit K label contradiction → both runs agree it is a TOC/body mismatch.

No B3 work performed.
