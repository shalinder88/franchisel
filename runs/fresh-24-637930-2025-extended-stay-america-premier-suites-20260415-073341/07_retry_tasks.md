# Retry Tasks — Extended Stay America Premier Suites FDD (2025)

## R1: Auditor Identity Recovery
- **Target**: Identify auditing firm from financial statements
- **Status**: EXECUTE
- **Rationale**: Auditor identity is a required field. Text layer doesn't contain firm name (likely image/signature). Will attempt to read surrounding pages for any textual reference.
- **Pages to re-read**: 200, 201, 211, 214, 215

## R2: Exhibit K Verification
- **Target**: Confirm whether Exhibit K exists or is intentionally omitted
- **Status**: SKIP
- **Rationale**: Zero terminations/non-renewals across all reported years. The exhibit is almost certainly empty or a blank divider. Not material to diligence.

## R3: Digital Marketing Commission Confirmation
- **Status**: SKIP
- **Rationale**: FDD text clearly states "will go into effect at the beginning of 2025." This is adequately documented in canonical.

---

## R1 Execution: Auditor Identity

Re-reading pages 200-201 and 211 for auditor identification.

The auditor report text on page 200 begins with "INDEPENDENT AUDITOR'S REPORT / To ESH Hospitality Strategies LLC:" and provides the standard opinion/basis/emphasis sections. The firm's name and signature are not in the text layer — they appear to be rendered as an image element on the PDF.

The second set of financial statements (pages 213-225) follows the same pattern. The auditor report on page 214 similarly lacks the firm name in the text layer.

**Recovery attempt result**: Auditor firm name could not be recovered from text layer. Based on the format, structure, and the emphasis of matter paragraph style, this appears consistent with a Big Four or major national firm. However, per extraction rules, the identity cannot be confirmed without textual evidence.

**Updated status**: Unresolved — auditor identity not recoverable from text extraction alone.
