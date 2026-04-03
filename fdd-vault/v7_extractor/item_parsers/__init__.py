"""
Item Parsers — One module per FDD item (1-23).

Each parser receives an ItemSection (text + tables + notes + cross-refs)
and returns structured data specific to that item.

Tables are used FIRST. Text reading is used for narrative facts.
No regex extraction — that's the QA layer's job.

The parser KNOWS what content belongs in its item:
  Item 5 = initial fees ("lump sum", "non-refundable")
  Item 6 = ongoing fees ("% of Gross", "Royalty", "Ad Fund")
  Item 7 = investment table ("ESTIMATED INITIAL INVESTMENT", "TOTAL")
  Item 8 = supplier control ("approved supplier", "rebates")
  Item 18 = 1-2 lines ("public figure" or a name)
  Item 19 = MONEY ($ > $1,000, "Average", "EBITDA", universal disclaimer)
  Item 20 = LOCATIONS (state names, outlet counts, "Systemwide")
  Item 21 = points to financial exhibit ("see Exhibit X")
"""

from typing import Dict, Any
from ..models import ItemSection


def parse_item(section: ItemSection) -> Dict[str, Any]:
    """Dispatch to the correct item parser."""
    parsers = {
        1: parse_item01, 2: parse_item02, 3: parse_item03, 4: parse_item04,
        5: parse_item05, 6: parse_item06, 7: parse_item07, 8: parse_item08,
        9: parse_item09, 10: parse_item10, 11: parse_item11, 12: parse_item12,
        13: parse_item13, 14: parse_item14, 15: parse_item15, 16: parse_item16,
        17: parse_item17, 18: parse_item18, 19: parse_item19, 20: parse_item20,
        21: parse_item21, 22: parse_item22, 23: parse_item23,
    }
    parser = parsers.get(section.item_num)
    if parser:
        return parser(section)
    return {}


# Import all parsers
from .item01 import parse_item01
from .item02 import parse_item02
from .item03 import parse_item03
from .item04 import parse_item04
from .item05 import parse_item05
from .item06 import parse_item06
from .item07 import parse_item07
from .item08 import parse_item08
from .item09 import parse_item09
from .item10 import parse_item10
from .item11 import parse_item11
from .item12 import parse_item12
from .item13 import parse_item13
from .item14 import parse_item14
from .item15 import parse_item15
from .item16 import parse_item16
from .item17 import parse_item17
from .item18 import parse_item18
from .item19 import parse_item19
from .item20 import parse_item20
from .item21 import parse_item21
from .item22 import parse_item22
from .item23 import parse_item23
