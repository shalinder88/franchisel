# Retry R3 — Exhibit K vs Exhibit L Labeling Confirmation

## Status: CONFIRMED — document-level error, not extraction artifact

## Evidence matrix

| Source | Page | Exhibit label referenced | What it actually contains |
|---|---|---|---|
| Cover page "How to Use This FDD" Q&A | 2 | "Item 21 or Exhibit K" for financial statements | Financial statements are actually in Exhibit J |
| Cover page "How to Use This FDD" Q&A | 2 | "Item 20 or Exhibit L" for current/former franchisees | Matches physical header of franchisee list (p198) but contradicts TOC |
| Table of Contents | 7 | Exhibit J = Financial Statements; Exhibit K = Current Franchisees; Exhibit L = Franchise Disclosure Questionnaire; Exhibit M = Receipts | Canonical TOC listing |
| Item 20 body text | 53 | "Exhibit K contains the names of all current franchisees..." | Matches TOC |
| Physical exhibit header | 198–201 | "EXHIBIT L TO THE DISCLOSURE DOCUMENT" | Contains current franchisees, schools not yet opened, former franchisees (should be labeled K per TOC) |
| Physical exhibit header | 202–204 | "EXHIBIT L TO THE DISCLOSURE DOCUMENT" | Contains Franchise Disclosure Questionnaire (correctly labeled L) |
| Physical exhibit header | 206–207 | "EXHIBIT M TO THE DISCLOSURE DOCUMENT" | Contains Receipt (correctly labeled M) |

## Conclusion
- Pages 198–201 are mislabeled in the physical document. They carry "EXHIBIT L" on the running header but per the TOC and Item 20 body they are Exhibit K.
- The same "EXHIBIT L" header is reused on pages 202–204 (questionnaire), where it is correct per the TOC.
- The "How to Use" Q&A on page 2 additionally contains a separate unrelated error: it references "Exhibit K" as the location of financial statements, but financials are actually in Exhibit J per the TOC and Item 21 body.
- None of these are extraction artifacts; they are consistent across PyMuPDF text output and the underlying PDF structure. They represent document-quality errors in the source FDD.

## Diligence interpretation
- Both Exhibit K content (franchisee list) and Exhibit L content (questionnaire) are present and directly surfaced; no material content is missing.
- The labeling mismatch is a document-preparation quality signal, not a content gap. A prospect relying on page 2's "How to Use" Q&A as navigation would find the franchisee list under the physical "Exhibit L" header and might not find financial statements under the referenced "Exhibit K".
- Preserve both the TOC labels and the physical header labels in canonical outputs to avoid silently overwriting the contradiction.
