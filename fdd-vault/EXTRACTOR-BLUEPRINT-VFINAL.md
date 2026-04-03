# Final FDD Extractor Blueprint vFinal

## 1. Product thesis

Build a **full-fidelity franchise intelligence extractor**.
Not a PDF parser. Not a regex scraper. Not a summary bot.

The extractor must answer seven questions for every FDD:

* what is this franchise really selling,
* what does the buyer actually pay,
* what controls the economics,
* what can trigger default or failure,
* what is disclosed versus assumed,
* what changed year over year,
* what should the buyer ask next.

The extractor is broader than the report.
The report is selective.
The extractor is the evidence system behind it.

---

## 2. Core design rules

### A. Extract broadly, explain selectively

### B. Three layers

* FDD facts
* analysis
* user tools / assumptions

### C. PII hard block

* public output must block PII,
* backend extraction may store blocked-page metadata,
* blocked sections should produce **counts/state summaries only**, not raw text.

Output states for blocked content:

* `blocked_pii_section`
* `blocked_public_output`
* `backend_metadata_only`

### D. No invented economics

### E. Follow cross-references

Every cross-reference creates a task object with status:

* unresolved
* resolved
* blocked
* missing_target

### F. Read the whole PDF slowly

Machine behavior translation:

* every page must be visited,
* every page must be classified,
* every page must emit outputs,
* no item can be skipped,
* exhibits must be traversed to the end of the document.

### G. Confidence hierarchy

* **direct table cell with note linked** = highest
* **narrative statement in main item** = high
* **cross-referenced exhibit clause** = high
* **table reconstructed from text lines** = medium
* **regex QA only** = low

---

## 3. The main architecture

**document → page objects → section objects → table/exhibit objects → normalized engines → QA → outputs**

* reading is primary,
* tables are first-class,
* exhibits are first-class,
* regex is last-pass QA only.

---

## 4. Runtime pipeline

### Phase -1: document normalization

For the whole PDF:

* open with PyMuPDF,
* extract page count,
* extract text blocks and coordinates,
* extract drawings/lines,
* detect if page has text layer or is image-heavy,
* strip repeated headers/footers into metadata,
* build page hash,
* preserve reading order,
* detect probable table regions,
* detect probable heading regions.

Outputs:

* `document_meta`
* `page_geometry_index`
* `header_footer_index`
* `possible_table_regions`
* `possible_heading_regions`

### Phase 0: document bootstrap

Built from Phase -1 objects:

* cover page,
* how-to-use page,
* special-risks page,
* state notices,
* TOC,
* exhibit list.

Outputs:

* `document_identity`
* `first_page_brand_summary`
* `offering_paths`
* `risk_flags_early`
* `toc_map`
* `exhibit_map`
* `state_notice_present`

### Phase 1: extraction queues

* item queue,
* priority table queue,
* exhibit queue,
* cross-reference queue,
* `manual_review_queue`
* `missing_table_queue`
* `unresolved_note_queue`
* `state_override_queue`

### Phase 2: page classifier

Page types:

* cover_page
* how_to_use
* special_risks
* state_notice
* toc
* exhibit_list
* item_narrative
* item_table
* mixed_narrative_table
* financial_statement
* agreement_page
* manual_toc
* franchisee_list
* former_franchisee_list
* receipt_page
* signature_page
* appendix_other

### Phase 3: section extraction

Items 1-23 in order, no skipping.

A section is:

* the pages between item boundaries,
* plus continuation tables,
* plus immediately referenced exhibits required to understand that item,
* plus linked notes/footnotes.

### Phase 4: exhibit extraction

Priority order:

1. financial exhibits,
2. franchise/development agreements,
3. state addenda,
4. item-specific supporting exhibits,
5. manual TOC,
6. franchisee lists / receipt exhibits with PII blocking.

### Phase 5: mandatory QA sweep

Regex QA plus non-regex QA:

* contradiction checks,
* unresolved cross-reference checks,
* missing-note linkage checks,
* table continuity checks,
* state-precedence checks,
* PII checks,
* publish gate checks.

---

## 5. Page-level rule

Every page must emit:

1. `page_summary`
2. `structured_facts`
3. `unresolved_pointers`
4. `page_tables`
5. `page_red_flags`

---

## 6. Section location strategy

### Primary

TOC-anchored section boundaries:

* use TOC page number,
* verify with heading on or near target page,
* then walk forward to confirm actual item start.

### Secondary

Heading graph:

* detect all candidate "ITEM X" headings,
* score by typography, line isolation, heading region, and distance from TOC target.

### Tertiary

`find_actual_item()` style text fallback:

* find all matches,
* skip front matter,
* use last qualifying match,
* verify next item boundary.

### Final fallback

manual review flag.

---

## 7. Table extraction strategy

For every page in a table-sensitive item:

### Method 1

PyMuPDF native table detection.

### Method 2

Geometric reconstruction:

* use lines, ruled regions, aligned text blocks, repeated x-coordinates, and column density.

### Method 3

Text-grid reconstruction:

* if the page visually behaves like a table but PyMuPDF misses it, reconstruct rows from aligned text spans.

### Method 4

Line-by-line fallback:

* preserve each apparent table row as `raw_row_text`,
* mark confidence lower,
* send unresolved rows to review queue.

Do not accept "0 tables imported" as success in Items 5, 6, 7, 19, 20, or 21 unless the item truly has no table.

---

## 8. Notes and footnotes linkage

Every table importer must run a **note linker**.

### Note-linking rules

* capture footnotes below the table bbox,
* capture numbered notes after the table,
* capture "Notes:" blocks on the next page if the table continues,
* map note references from row labels/cells to note objects,
* allow table-level notes and row-level notes.

Each table object must store:

* `table_notes`
* `row_note_refs`
* `cell_note_refs`

No Item 19 table is complete without notes. Same for Item 7 and many Item 21 statements.

---

## 9. Universal schema

Top-level objects:

* `offering_paths`
* `entity_graph`
* `page_read_log`
* `table_registry`
* `cross_reference_graph`
* `negative_evidence_registry`
* `failure_state_registry`
* `schema_version`

### Negative evidence registry

Every field can be:

* present
* explicitly absent
* not found
* not yet parsed
* blocked by pii
* referenced but missing target
* ambiguous needs review

---

## 10. Item definitions

Item identity is determined by **section boundary + content signals**, not content signals alone.

---

## 11. What must always be extracted

### Items 5-8: Economics model

#### Item 5
* every fee row,
* every format/development variant,
* every credit/rebate/waiver,
* every non-refundable rule.

#### Item 6
* every recurring fee row,
* minimum payment flags,
* late fees, audit costs, step-in fees,
* transfer/renewal/liquidated damages.

#### Item 7
* every line item,
* total range,
* notes,
* format-specific variants,
* biggest capital drivers,
* franchisor/affiliate-paid amounts.

#### Item 8
* supplier control,
* affiliate economics,
* required software,
* required payment processor,
* required gift card / delivery / ordering stack,
* setup and ongoing required purchase percentages,
* designated distributors,
* rebates/commissions.

### Items 9-17: Control/risk model

### Items 19-21: Performance/stability model

### Items 22-23 + exhibits: Document-control model

---

## 12. Table schema

```json
{
  "table_id": "",
  "section": "",
  "title": "",
  "pages": [],
  "table_type": "",
  "table_detection_method": "pymupdf|geometric_reconstruction|text_grid|line_fallback",
  "currency": "",
  "population": {},
  "columns": [],
  "rows": [],
  "table_notes": [],
  "continuation_of_table_id": null,
  "continued_on_next_page": false,
  "bbox_by_page": {},
  "provenance": {
    "source_item": "",
    "source_exhibit": null,
    "page_start": 0,
    "page_end": 0,
    "confidence": "high",
    "needs_review": false
  }
}
```

### For Items 5, 6, 7, 8

* `full_row_text`
* `row_bbox`
* `source_table_id`

### For Item 19

* `metric_scope`
* `inclusion_rule_raw`
* `exclusion_rule_raw`
* `not_profit_warning`
* `substantiation_statement_raw`

### For Item 20

* `year`
* `table_name`
* `unit_type` (franchised/company_owned/total/developers/unopened)
* `state_breakdown_flag`

### For Item 21

* `statement_type`
* `fiscal_year_end`
* `auditor_tier`
* `guarantor_present`
* `note_refs`

---

## 13. Exhibit system

### Exhibit role taxonomy

* financials
* franchise_agreement
* development_agreement
* nontraditional_agreement
* smalltown_agreement
* guaranty
* lease_rider
* equipment_lease
* supplier_agreement
* advertising_agreement
* payment_or_ach
* financing_doc
* manual_toc
* item20_support
* franchisee_list
* former_franchisee_list
* unopened_units_list
* state_addenda_fdd
* state_addenda_agreement
* receipt
* other

### Exhibit precedence

1. state-specific addenda
2. exhibit-specific rider to the relevant agreement
3. agreement exhibit
4. main item narrative
5. cover-page summary

---

## 14. State override engine

For every state addendum:

* detect which agreement it modifies,
* extract overridden fields,
* attach override to affected engines,
* store state-specific precedence rule.

Fields most likely overridden:

* venue/arbitration,
* termination/cure,
* renewal,
* transfer,
* repurchase,
* release/waiver language,
* compensation rights.

---

## 15. Kill-switch engine

Explicit fields:

* minimum payments,
* sales-performance requirements,
* development schedule default,
* cure period,
* immediate termination,
* cross-default,
* management takeover,
* tech cutoff,
* service suspension,
* liquidated damages,
* ROFR / asset purchase rights,
* debranding cost,
* post-term noncompete,
* spouse/personal guaranty,
* venue burden.

---

## 16. Confidence and failure states

### Field confidence hierarchy

* exact table cell + note linked = very high
* direct narrative clause = high
* exhibit clause referenced by item = high
* reconstructed row = medium
* QA regex only = low
* inference = very low

### Failure states

Every item/engine can end as:

* complete
* partial
* present_no_table
* referenced_exhibit_missing
* table_missed_needs_review
* contradiction_found
* blocked_pii
* no_data_disclosed
* parse_failed

---

## 17. Publish gates

Tiers:

* `draft`
* `backend_complete`
* `review_required`
* `publishable_standard`
* `gold_publishable`

### Gold gate requires:

* all major tables imported,
* all referenced exhibits followed,
* Item 19 complete or explicitly partial/absent,
* Item 20 complete,
* Item 21 complete if present,
* state overrides checked,
* no unresolved contradictions,
* no unresolved cross-references,
* no PII leakage.

---

## 18. Training strategy

### Runtime extractor

Deterministic and universal.

### Training loop

Teaches:

* archetype rules,
* brand-specific extensions,
* edge-case handling,
* QA priorities,
* scoring interpretation.

---

## 19. Testing framework

### Golden test set

* McDonald's, Chick-fil-A, SERVPRO, Planet Fitness, Great Clips, Jersey Mike's
* Papa John's, F45, Anytime Fitness, Orangetheory, Zaxby's, Panera

### Test categories

* heading detection
* item boundary detection
* table detection
* note linkage
* exhibit following
* state addenda override
* Item 19 completeness
* Item 20 completeness
* Item 21 numeric accuracy
* PII blocking
* contradiction detection

### Metrics

* table recall,
* row recall,
* exhibit follow-through rate,
* unresolved cross-reference count,
* Item 19/20/21 false-negative rates,
* gold-publish rate.

---

## 20. Final operating rule

**Read every page. Classify every page. Import every important table as a first-class object. Follow every note, exhibit, and addendum. Normalize all 23 items into engines with provenance. Use regex only at the end to QA what the reading pass may have missed. Never invent economics. Never leak PII. Never publish gold output when required tables or exhibits are incomplete.**
