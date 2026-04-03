"""
Page Offset Calibrator

Converts TOC FDD page numbers into PDF page indices.

FDDs have front matter (cover, TOC, state notices, "How to Use") before page 1.
TOC says "Item 17 is on page 60" but that's FDD page 60.
The actual PDF page might be 65 (offset = 5).

Strategy:
  1. Read page footers for "- N -" patterns to get FDD page numbers
  2. Compare footer numbers to PDF page indices
  3. Score consistency across multiple pages
  4. Reconcile with TOC entries

Allowed regex: footer/page-number normalization ONLY.
Never section extraction.
"""

import re
from typing import List, Dict, Optional, Tuple
from .models import PageRead


def estimate_offset_from_footers(page_reads: List[PageRead],
                                  max_pages: int = 60) -> List[Dict]:
    """Scan page footers for FDD page numbers.

    Returns list of {pdf_page, fdd_page, offset} observations.
    """
    observations = []

    for pr in page_reads[:max_pages]:
        text = pr.text.strip()
        if not text:
            continue

        # Look for "- N -" style footer (most common FDD format)
        # Check last 3 lines of page
        lines = text.split('\n')
        for line in lines[-3:]:
            line = line.strip()
            m = re.match(r'^[-–—]\s*(\d+)\s*[-–—]$', line)
            if m:
                fdd_page = int(m.group(1))
                offset = pr.page_num - fdd_page
                if 0 <= offset <= 25 and 1 <= fdd_page <= 500:
                    observations.append({
                        "pdf_page": pr.page_num,
                        "fdd_page": fdd_page,
                        "offset": offset,
                    })
                break

    return observations


def reconcile_offset(observations: List[Dict],
                     toc_map: Dict[int, int] = None) -> int:
    """Determine the most likely offset from observations.

    Returns single integer offset (PDF page = FDD page + offset).
    """
    if not observations:
        # Fallback: try to estimate from TOC if available
        if toc_map:
            # Most FDDs have 4-8 front matter pages
            return 5  # reasonable default
        return 0

    # Count how many times each offset appears
    from collections import Counter
    offset_counts = Counter(obs["offset"] for obs in observations)

    # Return the most common offset
    most_common = offset_counts.most_common(1)[0]
    return most_common[0]


def build_page_map(offset: int, total_pages: int) -> Dict[int, int]:
    """Build FDD page → PDF page mapping.

    Returns dict: fdd_page → pdf_page_index (0-indexed)
    """
    page_map = {}
    for fdd_page in range(1, total_pages):
        pdf_page = fdd_page + offset
        if 1 <= pdf_page <= total_pages:
            page_map[fdd_page] = pdf_page - 1  # 0-indexed
    return page_map


def calibrate(page_reads: List[PageRead],
              toc_map: Dict[int, int] = None) -> Dict[str, any]:
    """Full calibration: estimate offset and build page map.

    Returns:
      offset: int
      page_map: dict
      observations: list
      confidence: float
    """
    observations = estimate_offset_from_footers(page_reads)
    offset = reconcile_offset(observations, toc_map)
    page_map = build_page_map(offset, len(page_reads))

    # Confidence: how consistent are the observations?
    if observations:
        from collections import Counter
        counts = Counter(obs["offset"] for obs in observations)
        most_common_count = counts.most_common(1)[0][1]
        confidence = most_common_count / len(observations)
    else:
        confidence = 0.3

    return {
        "offset": offset,
        "page_map": page_map,
        "observations": observations[:10],
        "observation_count": len(observations),
        "confidence": round(confidence, 2),
    }
