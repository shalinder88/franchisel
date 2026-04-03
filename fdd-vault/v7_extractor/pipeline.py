"""
V7 Extraction Pipeline — Main Orchestrator

Wires all layers together in the correct order:
  Phase -1: Document normalization
  Phase  0: Bootstrap
  Phase  1: Page reading + classification
  Phase  2: Section segmentation
  Phase  3: Table extraction + note linking
  Phase  4: Exhibit location + parsing
  Phase  5: Item parsing → Engine normalization
  Phase  6: QA sweep
  Phase  7: Assembly

Rule: A field may only be published if it came from a PageRead, TableObject,
or ExhibitObject with provenance. Not from a loose regex hit.
"""

import pymupdf
import json
import os
from typing import Dict, Any

from .models import EvidenceStore, FailureState, TABLE_REQUIRED_ITEMS
from .document_normalizer import normalize_document
from .layout_index import index_document_layout
from .document_bootstrap import build_bootstrap
from .page_reader import read_all_pages
from .table_importer import import_tables_for_items
from .note_linker import link_all_notes
from .section_segmenter import segment_items
from .item_coverage import assess_item_coverage
from .cross_reference_engine import collect_all_cross_refs, resolve_cross_refs, check_publish_blocking
from .exhibit_locator import locate_exhibits
from .exhibit_parser import parse_all_exhibits
from .exhibit_role_parser import assign_precedence, get_processing_order, summarize_exhibit_roles
from .state_override_parser import parse_state_addenda
from .item_parsers import parse_item
from .archetype_classifier import classify_archetype
from .content_confirmer import confirm_section_content
from .document_package_engine import build_document_package
from .confidence_engine import compute_overall_confidence
from .reviewer_queues import build_reviewer_queues
from .qa.model_classification_checks import check_model_classification
from .assemblers.visual_ready_builder import build_all_visuals
from .assemblers.memo_output_builder import build_all_memos
from .document_classifier import classify_document
from .brand_extension_registry import build_extension_plan
from .document_graph import DocumentGraph
from .reviewer_pass import build_reviewer_outputs
from .roadmap_reconciliation import reconcile_roadmap
from .reader_pass import run_reader_pass
from .reader_engine_reconciler import reconcile as reconcile_reader_engine
from .completion_audit import run_completion_audit
from .normalizers.engine_builder import build_all_engines
from .qa.pii_checks import check_pii_all_items
from .qa.completeness_checks import check_completeness
from .qa.regex_sweep import run_regex_sweep
from .qa.contradiction_checks import check_contradictions, double_authenticate_pages_1_2
from .table_continuity import merge_all_continuations
from .display_tier_tagger import tag_display_tiers
from .assemblers.brand_json import assemble_brand_json


def extract_fdd(pdf_path: str) -> Dict[str, Any]:
    """Run the full V7 extraction pipeline on a single FDD PDF.

    Returns the complete extraction result with all layers.
    """
    doc = pymupdf.open(pdf_path)
    filename = os.path.basename(pdf_path)
    total_pages = doc.page_count

    print(f"Reading {filename}: {total_pages} pages")

    # ════════════════════════════════════════════════════════════════
    # PHASE -1: DOCUMENT NORMALIZATION
    # ════════════════════════════════════════════════════════════════
    print(f"\n--- Phase -1: Document normalization ---")
    geometry = normalize_document(doc)
    print(f"  Pages: {geometry['total_pages']}")
    print(f"  Headings: {len(geometry['heading_candidates'])}")
    print(f"  Table regions: {geometry['pages_with_tables']}")

    # Build layout index (block/span geometry for heading candidates)
    layout_idx = index_document_layout(doc)
    print(f"  Layout: {len(layout_idx.heading_candidates)} heading candidates, {len(layout_idx.table_regions)} table regions")

    # ════════════════════════════════════════════════════════════════
    # PHASE 1: PAGE READING + CLASSIFICATION
    # ════════════════════════════════════════════════════════════════
    print(f"\n--- Phase 1: Reading all {total_pages} pages ---")
    page_reads = read_all_pages(doc, geometry)
    from collections import Counter
    type_counts = Counter(p.page_type.value for p in page_reads)
    print(f"  Page types: {dict(type_counts)}")

    # ════════════════════════════════════════════════════════════════
    # PHASE 0: BOOTSTRAP
    # ════════════════════════════════════════════════════════════════
    print(f"\n--- Phase 0: Bootstrap ---")
    bootstrap = build_bootstrap(page_reads)
    print(f"  Entity: {bootstrap['entity'][:60]}")
    print(f"  Issue: {bootstrap['issueDate']}")
    print(f"  Paths: {bootstrap['offeringPaths']}")
    print(f"  Risks: {bootstrap['specialRisks']}")
    print(f"  TOC: {sorted(bootstrap['tocMap'].keys())}")
    print(f"  Exhibits: {list(bootstrap['exhibitMap'].keys())}")

    # ════════════════════════════════════════════════════════════════
    # DOCUMENT CLASSIFICATION (before archetype)
    # ════════════════════════════════════════════════════════════════
    print(f"\n--- Document classification ---")
    doc_class = classify_document(bootstrap)
    print(f"  Type: {doc_class['document_type']} | Offering: {doc_class['offering_type']}")
    if doc_class['special_structure_flags']:
        print(f"  Flags: {doc_class['special_structure_flags']}")

    # ════════════════════════════════════════════════════════════════
    # ARCHETYPE CLASSIFICATION (before extraction)
    # ════════════════════════════════════════════════════════════════
    print(f"\n--- Archetype classification ---")
    archetype = classify_archetype(bootstrap)
    print(f"  Archetype: {archetype['archetype']} (confidence: {archetype['confidence']})")
    print(f"  Expected fee shape: {archetype.get('expected_fee_shape', '?')}")
    print(f"  Expected Item 19: {archetype.get('expected_item19', '?')}")
    extension_plan = build_extension_plan(archetype)
    if extension_plan["required_extensions"]:
        print(f"  Extensions: {extension_plan['required_extensions']}")

    # ════════════════════════════════════════════════════════════════
    # PHASE 2: SECTION SEGMENTATION
    # ════════════════════════════════════════════════════════════════
    print(f"\n--- Phase 2: Section segmentation ---")
    items = segment_items(page_reads, bootstrap.get("tocMap"), layout_idx)
    for n in range(1, 24):
        s = items.get(n)
        if s:
            # Content confirmation for critical items
            if n in (5, 6, 7, 18, 19, 20, 21):
                conf = confirm_section_content(n, s.text)
                conf_str = " ✓" if conf["confirmed"] else f" ⚠️{conf['reason'][:40]}"
            else:
                conf_str = ""
            print(f"  Item {n:2d}: pages {s.start_page:>3}-{s.end_page:>3} | {s.text_length:6,} chars | {s.page_count} pages{conf_str}")
        else:
            print(f"  Item {n:2d}: NOT FOUND")

    # ════════════════════════════════════════════════════════════════
    # PHASE 3: TABLE EXTRACTION + NOTE LINKING
    # ════════════════════════════════════════════════════════════════
    print(f"\n--- Phase 3: Table extraction ---")
    all_tables = import_tables_for_items(doc, page_reads, items)
    print(f"  Tables: {len(all_tables)}, Rows: {sum(t.row_count for t in all_tables)}")
    for n in sorted(items.keys()):
        s = items[n]
        if s.tables:
            print(f"  Item {n:2d}: {len(s.tables)} tables, {sum(t.row_count for t in s.tables)} rows | {s.failure_state.value}")

    print(f"\n  Linking notes...")
    link_all_notes(page_reads, items)

    print(f"\n  Merging split tables...")
    merge_all_continuations(items)
    # Recount after merging
    merged_table_count = sum(len(s.tables) for s in items.values())
    print(f"  Tables after merge: {merged_table_count}")

    # ════════════════════════════════════════════════════════════════
    # PHASE 4: EXHIBIT LOCATION + PARSING
    # ════════════════════════════════════════════════════════════════
    print(f"\n--- Phase 4: Exhibit parsing ---")
    exhibits = locate_exhibits(page_reads, bootstrap.get("exhibitMap", {}))
    assign_precedence(exhibits)  # Set precedence levels before parsing
    processing_order = get_processing_order(exhibits)
    exhibit_data = parse_all_exhibits(exhibits, page_reads)
    state_overrides = parse_state_addenda(exhibits, page_reads)
    exhibit_summary = summarize_exhibit_roles(exhibits)
    for code in processing_order:
        ex = exhibits[code]
        status = "PARSED" if ex.parsed else "located" if ex.start_page > 0 else "not_found"
        print(f"  Exhibit {code}: {ex.role.value} | p{ex.precedence_level} | {status}")
    if state_overrides:
        print(f"  State overrides: {len(state_overrides)}")
    if exhibit_summary["unparsed_critical"]:
        print(f"  ⚠️ Unparsed critical exhibits: {exhibit_summary['unparsed_critical']}")

    # Close doc — all data extracted
    doc.close()

    # ════════════════════════════════════════════════════════════════
    # PHASE 5: ITEM PARSING → ENGINE NORMALIZATION
    # ════════════════════════════════════════════════════════════════
    print(f"\n--- Phase 5: Item parsing + engine normalization ---")
    # Lane B: Normalization engines
    parsed_items = {}
    for item_num, section in items.items():
        parsed_items[item_num] = parse_item(section)

    evidence = EvidenceStore()
    engines = build_all_engines(items, parsed_items, exhibit_data, evidence)

    # ════════════════════════════════════════════════════════════════
    # LANE A: READER/DISCOVERY PASS
    # Runs after items are segmented and tables extracted.
    # Reads the document like a human analyst.
    # ════════════════════════════════════════════════════════════════
    print(f"\n--- Lane A: Reader/discovery pass ---")
    reader_output = run_reader_pass(page_reads, items, bootstrap)
    print(f"  Brand: {reader_output['brand_memory'].get('brand_name', '?')[:50]}")
    print(f"  Ledger: {reader_output['ledger'].get('resolved', 0)}/{reader_output['ledger'].get('total', 0)} resolved")
    print(f"  Facts: {reader_output['fact_store'].get('total_facts', 0)} discovered, {reader_output['fact_store'].get('uncaptured', 0)} uncaptured")
    print(f"  Exhibits: {reader_output['exhibit_tracker'].get('parsed', 0)}/{reader_output['exhibit_tracker'].get('total', 0)} parsed")

    # ════════════════════════════════════════════════════════════════
    # LANE C: RECONCILIATION
    # Compares discovery findings against engine outputs
    # ════════════════════════════════════════════════════════════════
    print(f"\n--- Lane C: Reconciliation ---")
    recon = reconcile_reader_engine(reader_output, engines, evidence.to_dict())
    print(f"  Aligned: {recon['aligned_count']}")
    print(f"  Discovery-only: {recon['discovery_only_count']}")
    print(f"  Engine-only: {recon['engine_only_count']}")
    if recon['material_disagreement']:
        print(f"  ⚠️ MATERIAL DISAGREEMENT between reader and engine lanes")

    # ════════════════════════════════════════════════════════════════
    # PHASE 6: QA SWEEP
    # ════════════════════════════════════════════════════════════════
    print(f"\n--- Phase 6: QA sweep ---")

    # Item coverage assessment
    coverage = assess_item_coverage(items)
    for n in range(1, 24):
        state = coverage.get(n, "not_found")
        if state != "complete":
            print(f"  Item {n:2d}: {state}")

    pii_violations = check_pii_all_items(items)
    full_text = "\n".join(p.text for p in page_reads)
    completeness = check_completeness(items, evidence.to_dict())
    regex_findings = run_regex_sweep(items, full_text, evidence.to_dict())
    contradictions = check_contradictions(evidence.to_dict(), bootstrap, items)

    all_cross_refs = collect_all_cross_refs(items)
    resolve_cross_refs(all_cross_refs, items, exhibits)
    xref_blocking = check_publish_blocking(all_cross_refs)

    # Cross-reference blocking: if critical refs unresolved, cap at review_needed
    if xref_blocking["blocks_gold"]:
        if completeness["publish_gate"] == "gold_publishable":
            completeness["publish_gate"] = "publishable_standard"
            print(f"  ⚠️ Unresolved cross-refs — publish gate downgraded")

    # Item 20 hard-block: if not found, cannot exceed review_needed
    if 20 not in items or coverage.get(20) == "not_found":
        if completeness["publish_gate"] in ("gold_publishable", "publishable_standard"):
            completeness["publish_gate"] = "review_needed"
            print(f"  ⚠️ Item 20 missing — publish gate downgraded to review_needed")

    print(f"  Items: {23 - len(completeness['missing_items'])}/23")
    print(f"  Missing: {completeness['missing_items']}")
    print(f"  Tables: {len(all_tables)}, Rows: {sum(t.row_count for t in all_tables)}")
    print(f"  Missing tables: {completeness['missing_tables']}")
    print(f"  Cross-refs: {len(all_cross_refs)}")
    print(f"  PII violations: {len(pii_violations)}")
    print(f"  Regex findings: {len(regex_findings)}")
    print(f"  Contradictions: {len(contradictions)}")
    print(f"  Gate: {completeness['publish_gate']}")

    # ════════════════════════════════════════════════════════════════
    # PAGES 1-2 DOUBLE AUTHENTICATION
    # ════════════════════════════════════════════════════════════════
    print(f"\n  Double-authenticating pages 1-2...")
    auth_findings = double_authenticate_pages_1_2(bootstrap, evidence.to_dict(), items)
    for af in auth_findings:
        sev = af["severity"]
        icon = "❌" if sev == "critical" else "⚠️" if sev == "warning" else "ℹ️"
        print(f"  {icon} {af['type']}: {af['detail']}")

    # ════════════════════════════════════════════════════════════════
    # COMPLETION AUDIT — end-of-run verification
    # ════════════════════════════════════════════════════════════════
    print(f"\n  Completion audit...")
    audit = run_completion_audit(reader_output, recon, evidence.to_dict(), items)
    print(f"  Audit: {audit['pass_count']}/{audit['total_checks']} checks passed | Result: {audit['audit_result']}")
    for check in audit["checks"]:
        if not check["passed"]:
            print(f"    ❌ {check['check']}: {check['detail']}")

    # ════════════════════════════════════════════════════════════════
    # PHASE 7: ASSEMBLY
    # ════════════════════════════════════════════════════════════════
    print(f"\n--- Phase 7: Assembly ---")
    brand = assemble_brand_json(engines, bootstrap, evidence, completeness)
    brand_tagged = tag_display_tiers(brand)

    # Build document package, visuals, memos, confidence, reviewer queues
    doc_package = build_document_package(items, exhibits)
    visuals = build_all_visuals(engines)
    memos = build_all_memos(engines, evidence.to_dict(), coverage)
    confidence_summary = compute_overall_confidence(evidence)
    model_checks = check_model_classification(archetype, evidence.to_dict(), engines)
    reviewer = build_reviewer_queues(items, exhibits, evidence.to_dict(), archetype, coverage)

    # Build document graph
    doc_graph = DocumentGraph()
    doc_graph.build_from_extraction(items, exhibits, all_cross_refs)

    # Build reviewer pass outputs
    reviewer_outputs = build_reviewer_outputs(items, evidence.to_dict(), coverage, engines)

    # Count reviewer issues
    total_review_tasks = sum(len(q) for q in reviewer.values())
    if total_review_tasks > 0:
        print(f"  Reviewer tasks: {total_review_tasks}")
        for qname, tasks in reviewer.items():
            if tasks:
                print(f"    {qname}: {len(tasks)}")

    print(f"  Confidence: {confidence_summary['overall_label']} (score: {confidence_summary['overall_score']})")
    print(f"  Entity: {brand['parentCompany'][:50]}")
    print(f"  Units: {brand['totalUnits']} (F:{brand['franchisedUnits']}, CO:{brand['companyOwnedUnits']})")
    if brand.get('initialFranchiseFee'):
        print(f"  Fee: ${brand['initialFranchiseFee']:,}")
    print(f"  Royalty: {brand.get('royaltyRate', '?')} | Ad: {brand.get('marketingFundRate', '?')}")
    if brand.get('totalInvestmentLow'):
        print(f"  Investment: ${brand['totalInvestmentLow']:,}-${brand['totalInvestmentHigh']:,}")
    print(f"  FPR: {brand['hasItem19']}" + (f" | Avg: ${brand['item19_avgRevenue']:,}" if brand.get('item19_avgRevenue') else ""))
    i17 = brand.get('item17', {})
    print(f"  Term: {i17.get('initialTermYears','?')}yr | NC: {i17.get('nonCompeteYears','?')}yr/{i17.get('nonCompeteMiles','?')}mi | Arb: {i17.get('mandatoryArbitration','?')}")
    i21 = brand.get('item21', {})
    print(f"  Auditor: {i21.get('auditorName','?')} | Opinion: {i21.get('auditorOpinion','?')} | Strength: {i21.get('financialStrengthSignal','?')}")
    print(f"  Gate: {brand['publishGate']}")

    # ════════════════════════════════════════════════════════════════
    # BUILD RESULT
    # ════════════════════════════════════════════════════════════════
    result = {
        "meta": {
            "pdf": filename,
            "totalPages": total_pages,
            "extractor": "V7",
            "schema_version": "V7-1.0",
        },
        "bootstrap": bootstrap,
        "items": {str(n): {
            "start_page": s.start_page, "end_page": s.end_page,
            "text_length": s.text_length, "page_count": s.page_count,
            "table_count": len(s.tables),
            "table_rows": sum(t.row_count for t in s.tables),
            "failure_state": s.failure_state.value,
        } for n, s in items.items()},
        "table_registry": [{
            "table_id": t.table_id, "source_page": t.source_page,
            "source_item": t.source_item,
            "detection_method": t.detection_method.value,
            "row_count": t.row_count, "col_count": t.col_count,
            "columns": t.columns, "rows": t.rows[:20],  # cap for JSON size
            "table_notes": [{"note_num": n.note_num, "text": n.text[:200]} for n in t.table_notes],
            "confidence": t.confidence,
        } for t in all_tables],
        "exhibits": {code: {
            "role": ex.role.value,
            "start_page": ex.start_page, "end_page": ex.end_page,
            "parsed": ex.parsed,
        } for code, ex in exhibits.items()},
        "exhibit_data": exhibit_data,
        "exhibit_summary": exhibit_summary,
        "state_overrides": [{"state": o.state, "domain": o.clause_domain,
                             "text": o.override_text[:200]} for o in state_overrides],
        "engines": {k: v for k, v in engines.items() if not isinstance(v, dict) or v},
        "evidence": evidence.to_dict(),
        "qa": {
            "completeness": completeness,
            "item_coverage": coverage,
            "pii_violations": pii_violations,
            "regex_findings": regex_findings,
            "contradictions": contradictions,
            "cross_ref_count": len(all_cross_refs),
            "cross_ref_blocking": xref_blocking,
            "double_authentication": auth_findings,
            "roadmap_reconciliation": reconcile_roadmap(
                bootstrap.get("tocMap", {}), items, items, evidence.to_dict(), coverage
            ),
        },
        "brand": brand,
        "brand_tagged": brand_tagged,
        "document_classification": doc_class,
        "archetype": archetype,
        "extension_plan": extension_plan,
        "document_package": doc_package,
        "document_graph": doc_graph.to_dict(),
        "visuals": visuals,
        "memos": memos,
        "confidence": confidence_summary,
        "model_checks": model_checks,
        "reviewer_queues": {k: v for k, v in reviewer.items() if v},
        "reviewer_pass": reviewer_outputs,
        "reader_discovery": reader_output,
        "reconciliation": recon,
        "completion_audit": audit,
    }

    return result
