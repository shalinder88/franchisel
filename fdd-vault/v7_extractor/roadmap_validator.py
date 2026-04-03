"""
Document Roadmap Validation — Pre-Segmentation Gate

No brand enters normal item extraction until all three are resolved:
  1. TOC parsed or explicitly marked absent
  2. Exhibit list parsed or explicitly marked absent
  3. FDD-to-PDF page offset calibrated or explicitly unresolved

If any are unresolved, segmentation trust drops and the extractor
falls back to reader-first mode with aggressive table/exhibit capture.

McDonald's proved why: without validated roadmap, every downstream
engine reads the wrong pages.
"""

from typing import Dict, Any
from enum import Enum


class SegmentationTrust(str, Enum):
    HIGH = "high"          # TOC + exhibits + offset all resolved
    MEDIUM = "medium"      # TOC resolved, minor gaps
    LOW = "low"            # TOC or offset unresolved — downstream unreliable
    BLOCKED = "blocked"    # Nothing resolved — do not run normal engines


def validate_roadmap(bootstrap: Dict[str, Any],
                     total_pages: int) -> Dict[str, Any]:
    """Validate the document roadmap before segmentation.

    Returns:
      toc_status: parsed / absent / failed
      exhibit_list_status: parsed / absent / failed
      page_offset_status: calibrated / uncalibrated / unknown
      multi_item_page_risk: bool
      segmentation_trust: high / medium / low / blocked
      warnings: list of issues
    """
    toc_map = bootstrap.get("tocMap", {})
    exhibit_map = bootstrap.get("exhibitMap", {})
    offset = bootstrap.get("fddToPdfOffset", 0)

    warnings = []

    # ── TOC status ──
    if toc_map and len(toc_map) >= 10:
        toc_status = "parsed"
    elif toc_map and len(toc_map) >= 5:
        toc_status = "partial"
        warnings.append(f"TOC only has {len(toc_map)}/23 items — partial coverage")
    else:
        toc_status = "failed"
        warnings.append("TOC not parsed — segmentation will rely on content signals only")

    # ── Exhibit list status ──
    if exhibit_map and len(exhibit_map) >= 3:
        exhibit_status = "parsed"
    elif exhibit_map:
        exhibit_status = "partial"
        warnings.append(f"Exhibit list only has {len(exhibit_map)} entries")
    else:
        exhibit_status = "failed"
        warnings.append("Exhibit list not parsed — exhibit role classification will be weak")

    # ── Page offset status ──
    if offset != 0:
        offset_status = "calibrated"
    elif toc_map:
        # TOC was parsed but no offset needed (or couldn't calibrate)
        # Check if TOC page numbers look reasonable
        max_toc_page = max(toc_map.values()) if toc_map else 0
        if max_toc_page <= total_pages:
            offset_status = "calibrated"  # offset is 0, which may be correct
        else:
            offset_status = "uncalibrated"
            warnings.append(f"TOC references page {max_toc_page} but PDF has {total_pages} pages — offset likely wrong")
    else:
        offset_status = "unknown"
        warnings.append("Page offset unknown — no TOC to calibrate from")

    # ── Multi-item page risk ──
    multi_item_risk = False
    if toc_map:
        pages = sorted(toc_map.values())
        for i in range(len(pages) - 1):
            if pages[i] == pages[i + 1]:
                multi_item_risk = True
                warnings.append("Multiple items share the same start page — intra-page segmentation needed")
                break

    # ── Compute trust level ──
    if toc_status == "parsed" and offset_status == "calibrated":
        trust = SegmentationTrust.HIGH
    elif toc_status in ("parsed", "partial") and offset_status in ("calibrated", "unknown"):
        trust = SegmentationTrust.MEDIUM
    elif toc_status == "failed" and exhibit_status == "failed":
        trust = SegmentationTrust.BLOCKED
    else:
        trust = SegmentationTrust.LOW

    return {
        "toc_status": toc_status,
        "toc_items_found": len(toc_map),
        "exhibit_list_status": exhibit_status,
        "exhibit_count": len(exhibit_map),
        "page_offset": offset,
        "page_offset_status": offset_status,
        "multi_item_page_risk": multi_item_risk,
        "segmentation_trust": trust.value,
        "warnings": warnings,
    }
