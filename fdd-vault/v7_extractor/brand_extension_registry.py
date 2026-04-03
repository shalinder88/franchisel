"""
Brand Extension Registry

Brand extensions sit ON TOP of the universal schema, not replace it.
This module decides which extra engines run after universal extraction.

Extensions are archetype-driven:
  - rent_engine: for captive-site/license models
  - eft_membership_engine: for fitness membership models
  - gross_volume_scope_engine: for home services with broad volume definitions
  - referral_workflow_engine: for home care/placement agencies
  - gift_card_affiliate_engine: for brands with gift-card affiliates
  - curriculum_software_engine: for education/curriculum-based models
  - venue_sourcing_engine: for event/youth sports area-developer models
  - format_variant_engine: for brands with drive-thru/cafe/non-traditional formats
  - packaging_fulfillment_engine: for B2B fulfillment models
  - sales_milestone_engine: for brands with sales-performance/milestone defaults
"""

from typing import Dict, Any, List


# Archetype → extension engines mapping
ARCHETYPE_EXTENSIONS = {
    "qsr_restaurant": ["format_variant_engine", "sales_milestone_engine"],
    "full_service_restaurant": ["format_variant_engine"],
    "drive_thru_beverage": ["format_variant_engine"],
    "fitness_membership": ["eft_membership_engine", "sales_milestone_engine"],
    "boutique_interval_fitness": ["eft_membership_engine", "sales_milestone_engine"],
    "full_size_fitness": ["eft_membership_engine"],
    "home_services": ["gross_volume_scope_engine"],
    "home_care_referral": ["referral_workflow_engine"],
    "captive_site_license": ["rent_engine"],
    "children_education": ["curriculum_software_engine"],
    "preschool_education": ["curriculum_software_engine"],
    "youth_sports": ["venue_sourcing_engine"],
    "beauty_appointment": ["gift_card_affiliate_engine"],
    "personal_care": ["gift_card_affiliate_engine"],
    "b2b_gifting": ["packaging_fulfillment_engine"],
    "retail_inventory": [],
    "coaching_consulting": [],
    "health_wellness": [],
    "automotive": [],
    "pet_services": [],
    "other": [],
}


def get_required_extensions(archetype: str) -> List[str]:
    """Get the list of extension engines required for this archetype."""
    return ARCHETYPE_EXTENSIONS.get(archetype, [])


def build_extension_plan(archetype: Dict[str, Any]) -> Dict[str, Any]:
    """Build the extension plan from archetype classification.

    Returns a plan describing which extra engines should run
    and what they should look for in the FDD.
    """
    arch_name = archetype.get("archetype", "other")
    extensions = get_required_extensions(arch_name)

    return {
        "archetype": arch_name,
        "required_extensions": extensions,
        "extension_count": len(extensions),
        "notes": _extension_notes(extensions),
    }


def _extension_notes(extensions: List[str]) -> List[str]:
    """Generate notes about what each extension should look for."""
    notes = []
    note_map = {
        "rent_engine": "Look for rent/lease/occupancy in Items 6-7 and franchise agreement",
        "eft_membership_engine": "Look for EFT/membership/recurring billing in Items 6, 8, 11",
        "gross_volume_scope_engine": "Check Gross Volume definition in Item 6 — may include non-traditional revenue",
        "referral_workflow_engine": "Check referral/placement workflow in Items 8, 11, 15",
        "gift_card_affiliate_engine": "Look for gift-card affiliate entity in Items 1, 8",
        "curriculum_software_engine": "Check curriculum/software requirements in Items 8, 11, 14",
        "venue_sourcing_engine": "Check venue/facility sourcing in Items 11, 12",
        "format_variant_engine": "Check for multiple format types in Item 7 investment table",
        "packaging_fulfillment_engine": "Check packaging/shipping/fulfillment in Items 8, 11",
        "sales_milestone_engine": "Check sales-performance/milestone defaults in Items 12, 17 and special risks",
    }
    for ext in extensions:
        if ext in note_map:
            notes.append(note_map[ext])
    return notes
