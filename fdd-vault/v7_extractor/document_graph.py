"""
Document Graph

The FDD is a connected document graph, not a flat stream of pages.
Key terms often live in exhibits, riders, notes, or state addenda
rather than in main-item summaries.

Nodes: items, exhibits, addenda, notes
Edges: "see Exhibit X", "see Note Y", "see Item Z", "see Attachment W"

This makes exhibit-following and provenance cleaner than a loose queue.
"""

from typing import Dict, List, Any, Optional
from .models import CrossReference, ItemSection, ExhibitObject


class DocumentGraph:
    """Represents the FDD as a connected graph of items, exhibits, and notes."""

    def __init__(self):
        self.nodes: Dict[str, Dict[str, Any]] = {}
        self.edges: List[Dict[str, Any]] = []

    def add_item_node(self, item_num: int, section: ItemSection):
        """Add an item as a node."""
        self.nodes[f"item_{item_num}"] = {
            "type": "item",
            "id": item_num,
            "start_page": section.start_page,
            "end_page": section.end_page,
            "text_length": section.text_length,
            "table_count": len(section.tables),
        }

    def add_exhibit_node(self, code: str, exhibit: ExhibitObject):
        """Add an exhibit as a node."""
        self.nodes[f"exhibit_{code}"] = {
            "type": "exhibit",
            "code": code,
            "role": exhibit.role.value,
            "start_page": exhibit.start_page,
            "end_page": exhibit.end_page,
            "parsed": exhibit.parsed,
        }

    def add_edge(self, cross_ref: CrossReference):
        """Add a cross-reference as an edge."""
        source = f"item_{cross_ref.source_item}" if cross_ref.source_item else "unknown"
        target = cross_ref.target_id.replace(" ", "_").lower()

        self.edges.append({
            "source": source,
            "target": target,
            "label": cross_ref.text,
            "source_page": cross_ref.source_page,
            "status": cross_ref.status,
        })

    def build_from_extraction(self, items: Dict[int, ItemSection],
                               exhibits: Dict[str, ExhibitObject],
                               cross_refs: List[CrossReference]):
        """Build the full graph from extraction results."""
        for item_num, section in items.items():
            self.add_item_node(item_num, section)
        for code, exhibit in exhibits.items():
            self.add_exhibit_node(code, exhibit)
        for cr in cross_refs:
            self.add_edge(cr)

    def get_unresolved_paths(self) -> List[Dict]:
        """Get all edges that are unresolved — data may be missing."""
        return [e for e in self.edges if e["status"] in ("unresolved", "missing_target")]

    def get_node_connections(self, node_id: str) -> Dict[str, List]:
        """Get all connections for a given node."""
        outgoing = [e for e in self.edges if e["source"] == node_id]
        incoming = [e for e in self.edges if e["target"] == node_id]
        return {"outgoing": outgoing, "incoming": incoming}

    def summary(self) -> Dict[str, Any]:
        """Produce graph summary for output."""
        return {
            "total_nodes": len(self.nodes),
            "item_nodes": sum(1 for n in self.nodes.values() if n["type"] == "item"),
            "exhibit_nodes": sum(1 for n in self.nodes.values() if n["type"] == "exhibit"),
            "total_edges": len(self.edges),
            "unresolved_edges": len(self.get_unresolved_paths()),
            "resolved_edges": sum(1 for e in self.edges if e["status"] == "resolved"),
        }

    def to_dict(self) -> Dict[str, Any]:
        """Serialize graph for JSON output."""
        return {
            "nodes": self.nodes,
            "edges": self.edges,
            "summary": self.summary(),
        }
