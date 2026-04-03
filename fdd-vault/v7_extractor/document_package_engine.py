"""
Document Package Engine

Items 22-23 plus exhibits define which documents actually govern the deal.
This is NOT decorative — it's the contract-control layer.

Tracks:
  - franchise agreement
  - development agreement
  - guaranty
  - transfer docs
  - renewal docs
  - lease riders
  - financing docs
  - payment/ACH docs
  - manual TOC
  - state addenda
  - receipts

Produces a document-package map showing what the buyer actually signs.
"""

from typing import Dict, Any, List
from .models import ExhibitObject, ExhibitRole, ItemSection


def build_document_package(items: Dict[int, ItemSection],
                           exhibits: Dict[str, ExhibitObject]) -> Dict[str, Any]:
    """Build the document-control layer from Items 22-23 and exhibits.

    Returns a structured map of all documents that govern the franchise deal.
    """
    package: Dict[str, Any] = {
        "agreements": [],
        "addenda": [],
        "financial_docs": [],
        "operational_docs": [],
        "disclosure_docs": [],
        "total_documents": 0,
    }

    # Classify exhibits into document categories
    for code, exhibit in exhibits.items():
        doc_entry = {
            "code": code,
            "name": exhibit.raw_name,
            "role": exhibit.role.value,
            "pages": f"{exhibit.start_page}-{exhibit.end_page}" if exhibit.start_page else "not located",
            "parsed": exhibit.parsed,
            "importance": exhibit.importance,
        }

        if exhibit.role in (ExhibitRole.FRANCHISE_AGREEMENT, ExhibitRole.DEVELOPMENT_AGREEMENT,
                            ExhibitRole.NONTRADITIONAL_AGREEMENT, ExhibitRole.SMALLTOWN_AGREEMENT):
            package["agreements"].append(doc_entry)
        elif exhibit.role in (ExhibitRole.STATE_ADDENDA_FDD, ExhibitRole.STATE_ADDENDA_AGREEMENT,
                              ExhibitRole.LEASE_RIDER):
            package["addenda"].append(doc_entry)
        elif exhibit.role in (ExhibitRole.FINANCIALS, ExhibitRole.FINANCING_DOC,
                              ExhibitRole.PAYMENT_ACH):
            package["financial_docs"].append(doc_entry)
        elif exhibit.role in (ExhibitRole.MANUAL_TOC, ExhibitRole.SUPPLIER_AGREEMENT,
                              ExhibitRole.EQUIPMENT_LEASE, ExhibitRole.ADVERTISING_AGREEMENT):
            package["operational_docs"].append(doc_entry)
        else:
            package["disclosure_docs"].append(doc_entry)

    package["total_documents"] = sum(
        len(v) for k, v in package.items() if isinstance(v, list)
    )

    # Extract Item 22 contract references if available
    i22 = items.get(22)
    if i22 and i22.text:
        import re
        exhibit_refs = re.findall(r'Exhibit\s+([A-Z](?:-?\d)?)', i22.text)
        package["item22_exhibit_refs"] = list(set(exhibit_refs))

    return package
