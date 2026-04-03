"""
Cross-Reference Mention

Dataclass for item/exhibit mentions that are NOT section starts.
Separate from SectionCandidate.

The obligations matrix in Item 9 is full of references like "Item 6 (q)"
that are document graph edges pointing to other items, not section boundaries.

This model ensures cross-reference mentions never become section candidates.
"""

from dataclasses import dataclass, field
from typing import Optional, List


@dataclass
class CrossReferenceMention:
    """An item or exhibit mention that is a cross-reference, not a section start."""
    mentioned_item: Optional[int] = None  # "Item 6" → 6
    mentioned_exhibit: Optional[str] = None  # "Exhibit A" → "A"
    source_page: int = 0
    source_item: Optional[int] = None  # which item section contains this mention
    text: str = ""  # raw text of the mention
    context: str = ""  # surrounding text (for debugging)
    is_obligations_matrix: bool = False  # from Item 9 table
    is_narrative_reference: bool = False  # "see Item 6 above"


def extract_cross_reference_mentions(text: str, page_num: int,
                                       source_item: Optional[int] = None) -> List[CrossReferenceMention]:
    """Extract item/exhibit cross-reference mentions from page text.

    Uses simple word matching. These are graph edges, not section starts.
    """
    mentions = []
    text_lower = text.lower()

    # Find "Item N" mentions (simple word matching)
    import re
    for m in re.finditer(r'item\s+(\d+)', text_lower):
        item_num = int(m.group(1))
        if 1 <= item_num <= 23:
            # Get surrounding context
            start = max(0, m.start() - 30)
            end = min(len(text), m.end() + 50)
            context = text[start:end].replace('\n', ' ').strip()

            mentions.append(CrossReferenceMention(
                mentioned_item=item_num,
                source_page=page_num,
                source_item=source_item,
                text=text[m.start():m.end()],
                context=context[:100],
            ))

    # Find "Exhibit X" mentions
    for m in re.finditer(r'exhibit\s+([a-z])', text_lower):
        code = m.group(1).upper()
        start = max(0, m.start() - 30)
        end = min(len(text), m.end() + 50)
        context = text[start:end].replace('\n', ' ').strip()

        mentions.append(CrossReferenceMention(
            mentioned_exhibit=code,
            source_page=page_num,
            source_item=source_item,
            text=text[m.start():m.end()],
            context=context[:100],
        ))

    return mentions
