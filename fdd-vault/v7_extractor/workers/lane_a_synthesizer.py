"""
Worker 29: Lane A Fact Synthesizer

Merges all item-worker raw discoveries into typed fact packets.
This is the discovery-side truth builder.

Reads all fact packets from all workers, classifies them using
the fact ontology, and produces typed, ranked, bindable facts
for Lane B to normalize.
"""

from typing import Any, Dict, List
from .base_worker import BaseWorker
from .fact_packet import (
    SourceZone, ObjectType, Importance, ConsumptionState, FactPacket
)


class LaneASynthesizerWorker(BaseWorker):

    @property
    def worker_id(self) -> str:
        return "lane_a_synthesizer"

    @property
    def worker_num(self) -> int:
        return 29

    def execute(self) -> Dict[str, Any]:
        """Synthesize all worker discoveries into typed fact packets."""
        # Get all active (non-rejected, non-superseded) packets
        all_packets = self.fact_store.get_active()

        synthesized = []
        by_family = {}
        by_item = {}
        conflicts_found = []

        # ── Group packets by fact_type for dedup and conflict detection ──
        by_type: Dict[str, List[FactPacket]] = {}
        for packet in all_packets:
            ft = packet.fact_type
            if ft not in by_type:
                by_type[ft] = []
            by_type[ft].append(packet)

        # ── Process each fact type group ──
        for fact_type, packets in by_type.items():
            if len(packets) == 1:
                # Single source — mark as used by Lane A
                packets[0].mark_used_by_A()
                synthesized.append(packets[0].object_id)
            elif len(packets) > 1:
                # Multiple sources — need to pick winner or flag conflict
                winner, losers, is_conflict = self._resolve_competing_facts(fact_type, packets)
                if winner:
                    winner.mark_used_by_A()
                    synthesized.append(winner.object_id)
                    for loser in losers:
                        if is_conflict:
                            loser.mark_conflict([winner.object_id])
                            conflicts_found.append({
                                "fact_type": fact_type,
                                "winner": winner.object_id,
                                "loser": loser.object_id,
                            })
                        else:
                            loser.mark_superseded(winner.object_id)

            # Track by family and item
            for p in packets:
                if p.family:
                    by_family[p.family] = by_family.get(p.family, 0) + 1
                if p.source_item:
                    by_item[p.source_item] = by_item.get(p.source_item, 0) + 1

        # ── Emit synthesis summary ──
        self.emit(
            fact_type="lane_a_synthesis_summary",
            fact_payload={
                "total_active": len(all_packets),
                "synthesized": len(synthesized),
                "conflicts": len(conflicts_found),
                "by_family": by_family,
                "by_item": by_item,
            },
            source_zone=SourceZone.FRONT_MATTER,
            family="document",
            importance=Importance.CONTEXT,
            confidence=1.0,
        )

        return {
            "sources_parsed": [],
            "unresolved": [c["fact_type"] for c in conflicts_found],
            "total_packets": len(all_packets),
            "synthesized": len(synthesized),
            "conflicts": len(conflicts_found),
            "by_family": by_family,
        }

    def _resolve_competing_facts(self, fact_type: str,
                                  packets: List[FactPacket]):
        """Resolve competition between multiple packets of the same fact type.

        Precedence:
        1. Table evidence > narrative evidence
        2. Higher confidence > lower confidence
        3. Cross-cutting specialist > item worker
        4. Exhibit evidence > item evidence
        """
        # Sort by precedence
        def precedence_key(p: FactPacket):
            zone_score = {
                "exhibit": 4,
                "addendum": 4,
                "table": 3,
                "item": 2,
                "front_matter": 1,
            }.get(p.source_zone.value, 0)

            # Cross-cutting specialists get a bonus
            specialist_bonus = 1 if p.emitted_by in ("table_extractor", "exhibit_extractor") else 0

            return (zone_score + specialist_bonus, p.confidence)

        sorted_packets = sorted(packets, key=precedence_key, reverse=True)
        winner = sorted_packets[0]
        losers = sorted_packets[1:]

        # Check for actual conflict (different values) vs duplicate (same value)
        is_conflict = False
        winner_val = str(winner.fact_payload.get("value", ""))
        for loser in losers:
            loser_val = str(loser.fact_payload.get("value", ""))
            if loser_val and winner_val and loser_val != winner_val:
                is_conflict = True
                break

        return winner, losers, is_conflict
