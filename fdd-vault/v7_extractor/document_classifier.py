"""
Document Classifier

Before universal extraction, classify the document type.
Stops the extractor from treating a license, transfer package,
or development-only document like a standard FDD.

Document types:
  - traditional_franchise: standard single/multi-unit FDD
  - license_program: captive-site or operator license (e.g., Chick-fil-A)
  - area_development: development-focused offering
  - multi_territory: multi-territory agreement package
  - conversion: existing business conversion
  - renewal: renewal disclosure
  - transfer: transfer package
  - other: special structure

This runs BEFORE archetype classification.
"""

import re
from typing import Dict, Any


def classify_document(bootstrap: Dict[str, Any],
                      early_text: str = "") -> Dict[str, Any]:
    """Classify the FDD document type from early signals.

    Uses cover page, description, and offering paths.
    """
    description = bootstrap.get("description", "").lower()
    entity = bootstrap.get("entity", "").lower()
    paths = " ".join(bootstrap.get("offeringPaths", [])).lower()
    combined = description + " " + entity + " " + paths + " " + early_text[:3000].lower()

    doc_type = "traditional_franchise"
    offering_type = "single_unit"
    special_flags = []

    # License program detection
    if re.search(r"licens(?:e|ing|ee)\s+(?:program|agreement|operator)", combined):
        if not re.search(r"franchise\s+(?:agreement|disclosure)", combined[:500]):
            doc_type = "license_program"
        else:
            special_flags.append("has_license_component")

    # Area development
    if re.search(r"area\s+development|development\s+agreement|multi[\-\s]unit\s+development", combined):
        if "development" in paths:
            offering_type = "development"
        special_flags.append("has_development_agreement")

    # Multi-territory
    if re.search(r"multi[\-\s]territory|multiple\s+territories", combined):
        offering_type = "multi_territory"
        special_flags.append("multi_territory")

    # Conversion
    if re.search(r"conversion\s+(?:franchise|program|agreement)", combined):
        doc_type = "conversion"
        special_flags.append("conversion_offering")

    # Transfer package
    if re.search(r"transfer\s+(?:disclosure|package|document)", combined):
        doc_type = "transfer"
        special_flags.append("transfer_document")

    # Renewal
    if re.search(r"renewal\s+(?:disclosure|document|fdd)", combined):
        doc_type = "renewal"
        special_flags.append("renewal_document")

    # Format variants
    if re.search(r"non[\-\s]traditional|express|kiosk|food\s+truck|ghost\s+kitchen", combined):
        special_flags.append("has_non_traditional_format")
    if re.search(r"small[\-\s](?:town|box|format)", combined):
        special_flags.append("has_small_format")
    if re.search(r"drive[\-\s]thr(?:u|ough)", combined):
        special_flags.append("has_drive_thru")

    return {
        "document_type": doc_type,
        "offering_type": offering_type,
        "special_structure_flags": special_flags,
    }
