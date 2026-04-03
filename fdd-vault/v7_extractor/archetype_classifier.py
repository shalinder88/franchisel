"""
Archetype Classifier

Classifies the franchise's real business model BEFORE universal extraction.
Uses early pages (cover, Item 1) and exhibit signals.

The archetype drives:
  - expected fee shape
  - expected Item 19 type
  - expected Item 20 structure
  - expected exhibit roles
  - expected kill-switch patterns
  - expected brand-extension modules

Archetypes:
  - qsr_restaurant: Quick-service restaurant (McDonald's, Papa John's, Zaxby's)
  - full_service_restaurant: Sit-down restaurant (Panera, Applebee's)
  - fitness_membership: Gym/studio with recurring membership (Planet Fitness, F45, Orangetheory, Anytime)
  - home_services: Home-based service (SERVPRO, cleaning, painting)
  - retail_inventory: Retail store with inventory
  - captive_site_license: License model, not traditional franchise (Chick-fil-A)
  - coaching_consulting: Professional services
  - health_wellness: Medical/dental/spa/wellness
  - children_education: Tutoring, daycare, enrichment
  - personal_care: Salon, barbershop, spa (Great Clips)
  - automotive: Oil change, car wash, tire
  - real_estate: Property management, brokerage
  - pet_services: Grooming, boarding, daycare
  - drive_thru_beverage: Drive-thru coffee/beverage (Ziggi's, Dutch Bros)
  - boutique_interval_fitness: Boutique studio/interval (F45, Orangetheory)
  - full_size_fitness: Full gym with EFT membership (Planet Fitness, Anytime)
  - home_care_referral: Home care / caregiver placement / referral agency
  - preschool_education: Preschool / education / curriculum
  - youth_sports: Youth sports / area-developer network (i9 Sports)
  - beauty_appointment: Beauty / salon / appointment-driven (Great Clips, Drybar)
  - b2b_gifting: B2B gifting / fulfillment / software-dependent
  - other: Unclassified
"""

import re
from typing import Dict, Any, Optional


ARCHETYPE_SIGNALS = {
    "qsr_restaurant": {
        "keywords": [r"restaurant|pizza|burger|chicken|sandwich|taco|sub|wing|donut|bakery",
                     r"drive.thru|drive.through|dine.in|carry.out|delivery|quick.service|fast.casual"],
        "fee_shape": "percentage_of_gross_sales",
        "expected_item19": "gross_sales_or_net_sales",
        "expected_item20": "multi_state_large_system",
    },
    "full_service_restaurant": {
        "keywords": [r"bakery.cafe|full.service|casual.dining|sit.down|bar.and.grill"],
        "fee_shape": "percentage_of_gross_sales",
        "expected_item19": "net_sales_or_gross_sales",
        "expected_item20": "multi_state_large_system",
    },
    "fitness_membership": {
        "keywords": [r"fitness|gym|studio|workout|training|exercise|yoga|pilates|cycling|boxing|martial",
                     r"membership|monthly.dues|EFT|electronic.fund.transfer|access"],
        "fee_shape": "percentage_of_gross_sales_or_eft",
        "expected_item19": "gross_revenue_or_membership_revenue",
        "expected_item20": "multi_state_growing_or_contracting",
    },
    "home_services": {
        "keywords": [r"home.service|restoration|cleaning|painting|plumbing|hvac|handyman|roofing|flooring",
                     r"mobile|service.area|territory.based"],
        "fee_shape": "percentage_of_gross_volume",
        "expected_item19": "gross_volume_or_revenue",
        "expected_item20": "territory_based",
    },
    "retail_inventory": {
        "keywords": [r"retail|store|shop|merchandise|inventory|products"],
        "fee_shape": "percentage_of_gross_sales",
        "expected_item19": "gross_sales",
        "expected_item20": "store_count",
    },
    "captive_site_license": {
        "keywords": [r"license|licensing|operator|licensee|captive.site",
                     r"we.own|company.owns|we.select.the.site|we.provide.the.location"],
        "fee_shape": "percentage_plus_rent_or_split",
        "expected_item19": "operator_revenue",
        "expected_item20": "company_controlled",
    },
    "coaching_consulting": {
        "keywords": [r"coaching|consulting|advisory|professional.service|staffing|recruiting"],
        "fee_shape": "percentage_of_revenue",
        "expected_item19": "revenue_or_billings",
        "expected_item20": "territory_based",
    },
    "health_wellness": {
        "keywords": [r"medical|dental|chiropractic|spa|wellness|urgent.care|clinic|therapy|weight.loss"],
        "fee_shape": "percentage_of_collected_revenue",
        "expected_item19": "collected_revenue_or_gross",
        "expected_item20": "location_based",
    },
    "children_education": {
        "keywords": [r"tutoring|education|learning|school|academy|child|children|daycare|enrichment|stem"],
        "fee_shape": "percentage_of_gross_revenue",
        "expected_item19": "tuition_or_enrollment_revenue",
        "expected_item20": "center_count",
    },
    "personal_care": {
        "keywords": [r"salon|barber|hair|beauty|wax|nail|grooming|spa|massage"],
        "fee_shape": "percentage_of_gross_sales",
        "expected_item19": "gross_sales_per_salon",
        "expected_item20": "salon_count",
    },
    "automotive": {
        "keywords": [r"automotive|auto|oil.change|car.wash|tire|brake|transmission|muffler"],
        "fee_shape": "percentage_of_gross_sales",
        "expected_item19": "gross_sales",
        "expected_item20": "location_count",
    },
    "pet_services": {
        "keywords": [r"pet|dog|cat|grooming|boarding|daycare|veterinar"],
        "fee_shape": "percentage_of_gross_revenue",
        "expected_item19": "gross_revenue",
        "expected_item20": "location_count",
    },
    "drive_thru_beverage": {
        "keywords": [r"drive[\-\s]thr(?:u|ough).*(?:coffee|beverage|drink)",
                     r"coffee.*(?:drive|stand|kiosk)", r"espresso|latte|smoothie"],
        "fee_shape": "percentage_of_gross_sales",
        "expected_item19": "gross_sales",
        "expected_item20": "location_count",
    },
    "boutique_interval_fitness": {
        "keywords": [r"(?:boutique|interval|HIIT|circuit|functional)\s+(?:fitness|training|studio)",
                     r"(?:45|30|60)[\-\s]minute\s+(?:workout|class|session)"],
        "fee_shape": "percentage_of_gross_sales",
        "expected_item19": "gross_sales_studio_level",
        "expected_item20": "studio_count",
    },
    "full_size_fitness": {
        "keywords": [r"(?:24[\-\s]hour|24/7)\s+(?:fitness|gym|access)",
                     r"(?:membership|EFT|electronic\s+fund\s+transfer).*(?:gym|fitness)",
                     r"(?:cardio|weight|strength)\s+(?:equipment|training)"],
        "fee_shape": "percentage_of_gross_sales_or_eft",
        "expected_item19": "membership_revenue",
        "expected_item20": "center_count",
    },
    "home_care_referral": {
        "keywords": [r"home\s+(?:care|health|companion)", r"caregiver|nurse|aide",
                     r"referral\s+agency|placement|staffing.*(?:care|health)"],
        "fee_shape": "percentage_of_collected_revenue",
        "expected_item19": "collected_revenue",
        "expected_item20": "territory_based",
    },
    "preschool_education": {
        "keywords": [r"preschool|pre[\-\s]school|early\s+learning|daycare|child\s+care",
                     r"(?:STEM|STEAM|Montessori|curriculum)\s+(?:program|center|school)"],
        "fee_shape": "percentage_of_gross_revenue",
        "expected_item19": "tuition_enrollment_revenue",
        "expected_item20": "center_count",
    },
    "youth_sports": {
        "keywords": [r"youth\s+(?:sports|athletics|league)", r"(?:flag\s+)?football|soccer|baseball|basketball",
                     r"area\s+developer.*(?:sports|athletic)"],
        "fee_shape": "percentage_of_gross_revenue",
        "expected_item19": "registration_revenue",
        "expected_item20": "territory_based",
    },
    "beauty_appointment": {
        "keywords": [r"salon|barber|hair\s+(?:cut|style|care)|beauty|blow\s*(?:dry|out)",
                     r"wax(?:ing)?|nail|manicure|pedicure|lash|brow",
                     r"appointment|walk[\-\s]in|gift\s+card"],
        "fee_shape": "percentage_of_gross_sales",
        "expected_item19": "gross_sales_per_location",
        "expected_item20": "salon_count",
    },
    "b2b_gifting": {
        "keywords": [r"(?:corporate|business)\s+(?:gift|gifting)", r"fulfillment|packaging|shipping",
                     r"(?:B2B|business[\-\s]to[\-\s]business)\s+(?:service|platform)"],
        "fee_shape": "percentage_of_gross_revenue",
        "expected_item19": "revenue_or_billings",
        "expected_item20": "territory_based",
    },
}


def classify_archetype(bootstrap: Dict[str, Any],
                       item1_text: str = "") -> Dict[str, Any]:
    """Classify the franchise archetype from early signals.

    Uses cover page description, offering paths, and Item 1 text.
    Returns archetype classification with confidence and expectations.
    """
    description = bootstrap.get("description", "").lower()
    offering_paths = " ".join(bootstrap.get("offeringPaths", [])).lower()
    combined = description + " " + offering_paths + " " + item1_text[:5000].lower()

    scores: Dict[str, int] = {}
    for archetype, signals in ARCHETYPE_SIGNALS.items():
        score = 0
        for pattern in signals["keywords"]:
            if re.search(pattern, combined, re.I):
                score += 1
        scores[archetype] = score

    if not scores or max(scores.values()) == 0:
        return {
            "archetype": "other",
            "confidence": 0.0,
            "expectations": {},
        }

    best = max(scores, key=scores.get)
    best_score = scores[best]
    total_signals = len(ARCHETYPE_SIGNALS[best]["keywords"])
    confidence = min(1.0, best_score / max(total_signals, 1))

    signals = ARCHETYPE_SIGNALS[best]
    return {
        "archetype": best,
        "confidence": round(confidence, 2),
        "expected_fee_shape": signals["fee_shape"],
        "expected_item19": signals["expected_item19"],
        "expected_item20": signals["expected_item20"],
        "all_scores": {k: v for k, v in scores.items() if v > 0},
    }
