"""
Worker 30: Lane B Normalizer

Maps fact packets, table objects, and exhibit objects into canonical fields
and structured objects.

Uses the existing V7 engine builder and canonical export as the target schema.
Consumes Lane A's synthesized facts and produces canonical field values.
"""

from typing import Any, Dict, List
from .base_worker import BaseWorker
from .fact_packet import SourceZone, ObjectType, Importance, ConsumptionState


class LaneBNormalizerWorker(BaseWorker):

    @property
    def worker_id(self) -> str:
        return "lane_b_normalizer"

    @property
    def worker_num(self) -> int:
        return 30

    def execute(self) -> Dict[str, Any]:
        """Normalize all synthesized facts into canonical fields."""
        # Get all Lane A synthesized packets
        all_packets = self.fact_store.get_active()
        lane_a_packets = [p for p in all_packets
                          if p.consumption_state in (
                              ConsumptionState.USED_BY_LANE_A,
                              ConsumptionState.VALIDATED,
                              ConsumptionState.EMITTED,
                          )]

        normalized_fields = {}
        normalization_log = []

        # ── Use existing V7 engines if available ──
        engines = self.context.get("engines", {})
        evidence = self.context.get("evidence", {})

        # ── Normalize each packet into canonical fields ──
        for packet in lane_a_packets:
            mappings = self._map_to_canonical(packet)
            for field_name, value in mappings.items():
                if field_name not in normalized_fields:
                    normalized_fields[field_name] = {
                        "value": value,
                        "source_packet": packet.object_id,
                        "confidence": packet.confidence,
                    }
                    packet.mark_used_by_B()
                    normalization_log.append({
                        "field": field_name,
                        "from_packet": packet.object_id,
                        "fact_type": packet.fact_type,
                    })

        # ── Emit normalized output ──
        self.emit(
            fact_type="lane_b_normalization_summary",
            fact_payload={
                "fields_normalized": len(normalized_fields),
                "packets_consumed": len([p for p in lane_a_packets if p.used_by_lane_B]),
                "fields": list(normalized_fields.keys()),
            },
            source_zone=SourceZone.FRONT_MATTER,
            family="document",
            importance=Importance.CONTEXT,
            confidence=1.0,
        )

        return {
            "sources_parsed": [],
            "unresolved": [],
            "fields_normalized": len(normalized_fields),
            "normalized_fields": normalized_fields,
            "normalization_log": normalization_log[:50],
        }

    def _map_to_canonical(self, packet) -> Dict[str, Any]:
        """Map a fact packet to canonical field(s).

        Uses the fact_type → engine_field mapping from the fact ontology.
        """
        mappings = {}
        ft = packet.fact_type
        payload = packet.fact_payload
        value = payload.get("value") if isinstance(payload, dict) else payload

        # ── Direct fact_type → canonical field mappings ──
        DIRECT_MAPPINGS = {
            "entity_name": {"entity": lambda p: p.get("entity", "")},
            "issue_date": {"issueDate": lambda p: p.get("issueDate", "")},
            "amendment_date": {"amendmentDate": lambda p: p.get("amendmentDate", "")},
            "offering_paths": {"offeringPaths": lambda p: p.get("offeringPaths", [])},
            "franchise_fee": {"initialFranchiseFee": lambda p: self._extract_fee_amount(p.get("value"))},
            "royalty_mechanics": {"royaltyRate": lambda p: p.get("groups", [None])[0] if p.get("groups") else None},
            "initial_term": {"initialTermYears": lambda p: p.get("years")},
            "non_compete": {"nonCompeteYears": lambda p: p.get("years"),
                            "nonCompeteMiles": lambda p: p.get("miles")},
            "territory_classification": {"territoryType": lambda p: p.get("territory_type")},
            "auditor": {"auditorName": lambda p: p.get("name")},
            "audit_opinion": {"auditorOpinion": lambda p: p.get("type")},
            "fpr_format": {"item19_format": lambda p: p.get("format")},
            "fpr_reporting_period": {"item19_reportingPeriod": lambda p: p.get("year")},
            "fpr_includes_company_units": {"item19_includesCompanyUnits": lambda p: p.get("included")},
            "required_purchase_percentage": {"requiredPurchasePct": lambda p: p.get("percentage")},
        }

        if ft in DIRECT_MAPPINGS:
            for field_name, extractor in DIRECT_MAPPINGS[ft].items():
                val = extractor(payload)
                if val is not None:
                    mappings[field_name] = val

        # ── Value passthrough for parsed item facts ──
        elif ft in ("has_fpr", "fpr_tables", "franchise_fee", "non_refundable",
                     "veteran_discount", "fee_rows"):
            if isinstance(value, dict) and "amount" in value:
                mappings[ft] = value["amount"]
            elif value is not None:
                mappings[ft] = value

        return mappings

    def _extract_fee_amount(self, value) -> int:
        """Extract a numeric fee amount from various formats."""
        if isinstance(value, (int, float)):
            return int(value)
        if isinstance(value, dict):
            if "amount" in value:
                return int(value["amount"])
            if "low" in value:
                return int(value["low"])
        return 0
