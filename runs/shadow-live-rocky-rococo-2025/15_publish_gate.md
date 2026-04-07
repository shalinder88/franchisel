# A3 Publish Gate — Rocky Rococo 2025 shadow-live run

## Verdict: **1 — Publish-ready**

## Rationale
A1 + A2 extraction is complete and evidence-grounded. All 23 items are captured (17 positive, 6 negative disclosures). All five Item 20 tables balance. Exhibit FIN is fully extracted with all 5 notes and clean opinion. Contract burden and financial-note depth passes are complete. State-addenda absence is confirmed. `unresolveds`, `contradictions`, and `state_addenda_overrides` families are all present in `09_final_canonical.json`. Final report is ~270 lines of narrative diligence covering all required sections.

## Item-by-item assessment

1. **Item 19 completeness — PASS.** Negative disclosure captured verbatim (no FPR, no authorization, contact person for unauthorized claims = Thomas R. Hester III). No tables to extract.

2. **Item 20 completeness — PASS.** All 5 tables present (systemwide summary, transfers, franchised status, company-owned status, projected openings); totals balance (2024 end: 24 franchised + 7 company + 0 predecessor = 31 total). 27 named franchisee entities captured with reconciliation note. Gag clause flag set (no confidentiality clauses last 3 years). Terminated list = None captured.

3. **Item 21 sufficiency — PASS.** Auditor (Vrakas, S.C.), report date, clean unqualified opinion, no going-concern. Balance sheet, P&L, cash flow all extracted for 3 fiscal years. Notes 1–5 covered in RT_depth_financial_notes.json (accounting policies, coop ad fund, location info, income taxes, related party).

4. **State addenda sufficiency — PASS.** Confirmed no dedicated state addenda exhibit in the filing (receipts list only FIN/FA/FDA/CAL; Exhibit ST is agency info). `state_addenda_overrides` family is present in canonical with empty list and explanatory note.

5. **Key exhibit sufficiency — PASS for financials, PARTIAL for Franchise Agreement.** FIN is fully deep-read. FA/FDA/CAL are catalogued and the Item 17 table (which is the authoritative FDD summary of FA provisions) is captured. Full line-by-line FA extraction is not performed — documented as an enrichment boundary, not a publish-blocker.

6. **Unresolveds and contradictions — PASS.** 8 unresolveds and 3 contradictions present as top-level families in canonical; C1 (FA vs FDA 5-mile vs 50-mile noncompete) flagged as high severity and unresolved; C2 and C3 reconciled with rationale. All are business-risk flags, not extraction gaps.

7. **Final report depth — PASS.** `08_final_report.md` contains Executive Snapshot, Fees/Investment, Supplier/Operations/Tech, Territory, Contract Burden, Item 19 detail, Item 20 detail, Item 21 detail (with balance sheet, P&L, cash flow summaries), State Addenda summary, Unresolveds, Contradictions, Final Coverage Note. ~270 lines of narrative.

8. **Score gate — PASS.** Scorecard records 23/23 item coverage; canonical fill ≥95% across all items; clean audit; all evidence page-cited.

## Recovery passes
None required.
