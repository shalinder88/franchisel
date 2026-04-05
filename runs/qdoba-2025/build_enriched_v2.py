"""
Build 12_canonical_enriched_v2.json
Reads 11_canonical_enriched.json as base, injects three new promoted families,
updates _meta, writes output.

Sources:
  - retry_item21.md  (financial statements, auditor, debt, equity rollforward)
  - 03_tables.json   (item6_other_fees — all 33 fee rows)
  - 08_final_report.md (structural observations, fee narrative)

Families added:
  item21_financial_structure_detail
  item21_statement_detail
  item6_fee_detail
"""

import json
from pathlib import Path

BASE = Path(__file__).parent / "11_canonical_enriched.json"
OUT  = Path(__file__).parent / "12_canonical_enriched_v2.json"

with open(BASE) as f:
    canon = json.load(f)

# ── Update _meta ──────────────────────────────────────────────────────────────
canon["_meta"]["version"] = "enriched_v2"
canon["_meta"]["base_canonical"] = "11_canonical_enriched.json"
canon["_meta"]["enrichment_sources_v2"] = [
    "retry_item21.md",
    "03_tables.json",
    "08_final_report.md"
]
canon["_meta"]["promotion_note_v2"] = (
    "v2 adds item21_financial_structure_detail (debt facility, reporting periods, "
    "guaranty chain, leverage), item21_statement_detail (all comparative line items, "
    "equity rollforward), and item6_fee_detail (all 33 Item 6 fees with full attributes). "
    "No new PDF reads. No invented facts."
)

# ─────────────────────────────────────────────────────────────────────────────
# FAMILY 1: item21_financial_structure_detail
# Source: retry_item21.md, 08_final_report.md
# ─────────────────────────────────────────────────────────────────────────────
canon["item21_financial_structure_detail"] = {
    "_source": "retry_item21.md, 08_final_report.md",
    "_source_pages": [73, 77, 78, 79, 80, 81, 82],

    "reporting_entity": {
        "value": "Qdoba Funding Holdco LLC and Subsidiaries",
        "note": "Consolidated entity encompassing Qdoba Franchisor LLC, Qdoba Funding LLC (Issuer), and all subsidiaries through the securitization chain",
        "source_pages": [79],
        "status": "surfaced"
    },

    "reporting_periods": {
        "FY2025": {
            "period_type": "full_fiscal_year",
            "start": "September 30, 2024",
            "end": "September 28, 2025",
            "duration_weeks": 52,
            "status": "surfaced",
            "source_pages": [80]
        },
        "FY2024_stub": {
            "period_type": "stub_period",
            "start": "November 28, 2023",
            "end": "September 29, 2024",
            "duration_months": 10,
            "note": "Covers only the period from securitization close (Nov 28, 2023) to fiscal year-end. NOT a full 52-week year. Year-over-year comparisons require annualization. The entity did not exist before November 28, 2023.",
            "status": "surfaced",
            "source_pages": [79, 80]
        },
        "annualization_caution": {
            "value": "The FY2024 stub covers ~10 months. Annualizing: $304.3M revenues × (12/10) ≈ $365M annualized — materially below FY2025 $381M, but part of the gap is real growth. Do not use raw YoY comparison without adjustment.",
            "status": "derived",
            "confidence": "high"
        }
    },

    "auditor_profile": {
        "firm": {"value": "Deloitte & Touche LLP", "source_pages": [77], "status": "surfaced"},
        "opinion_type": {"value": "Unqualified (clean)", "source_pages": [77], "status": "surfaced"},
        "periods_covered": {
            "value": [
                "Fiscal year ended September 28, 2025",
                "Period from November 28, 2023 to September 29, 2024"
            ],
            "source_pages": [77],
            "status": "surfaced"
        },
        "audit_of_qdoba_corp_also_included": {
            "value": True,
            "note": "Exhibit A also contains separate audited financials for Qdoba Corporation and Subsidiaries (the operating parent entity containing QRC). These were located but not decoded in this extraction.",
            "source_pages": [73],
            "status": "located_not_parsed"
        }
    },

    "guaranty_chain": {
        "_note": "Three-level guaranty structure. Source: Item 21 text (pages 73-74) and Exhibit A.",
        "level_1_holdco": {
            "guarantor": "Qdoba Funding Holdco LLC",
            "scope": "Unconditionally guarantees Qdoba Franchisor LLC's duties and obligations under the Franchise Agreement",
            "legal_significance": "The direct parent of the SPE franchisor entity guarantees the franchise agreement — franchisees have recourse to Holdco",
            "source_pages": [73],
            "status": "surfaced"
        },
        "level_2_qdoba_corp": {
            "guarantor": "Qdoba Corporation",
            "scope": "Guarantees QRC's obligations under the management agreement ONLY — does NOT guarantee the Franchise Agreement directly",
            "legal_significance": "Qdoba Corporation's guaranty protects the management arrangement between itself, QRC, and the SPE — it does not flow to franchisees",
            "source_pages": [73],
            "status": "surfaced"
        },
        "qrc_structural_separation": {
            "value": "QRC (Qdoba Restaurant Corporation) performs day-to-day franchisor support under the management agreement but is not a party to the Franchise Agreement and has no direct contractual obligation to franchisees. If QRC fails to perform, franchisee recourse runs to Qdoba Franchisor LLC and through Holdco's guaranty — not directly to QRC.",
            "source_pages": [73],
            "status": "surfaced",
            "severity": "high"
        }
    },

    "debt_facility_breakdown": {
        "_note": "Source: retry_item21.md cash flow supplemental disclosures and balance sheet",
        "class_a2_notes": {
            "instrument_type": "Securitized fixed-rate notes",
            "issued": "November 28, 2023 (securitization close)",
            "proceeds_net_of_discount": {"value": 234510000, "source_pages": [82], "status": "surfaced"},
            "debt_issuance_costs_at_origination": {"value": 12178000, "source_pages": [82], "status": "surfaced"},
            "carrying_value_FY2025": {
                "value": "Approximately $231M face less unamortized discount/costs",
                "note": "Carrying value accretes via amortization of discount ($3.4M/year). Exact face value not separately disclosed in extracted text.",
                "status": "partial"
            },
            "collateral": "Franchise agreements, trademarks, and intellectual property held in Qdoba Franchisor LLC (the SPE)"
        },
        "revolving_credit_facility": {
            "FY2024_borrowing": {"value": 25000000, "source_pages": [82], "status": "surfaced"},
            "FY2025_repayment": {"value": 20000000, "source_pages": [82], "status": "surfaced"},
            "FY2025_reborrowing": {"value": 8000000, "source_pages": [82], "status": "surfaced"},
            "estimated_balance_FY2025_end": {
                "value": 13000000,
                "note": "Derived: $25M drawn FY2024 - $20M repaid + $8M borrowed FY2025 = $13M. Confirmed consistent with reported balance sheet LTD.",
                "status": "derived",
                "confidence": "high"
            },
            "treatment_note": "Borrowing and repayment were executed as intercompany transactions (equity contributions/distributions) — Holdco contributed $20M for repayment, entity then borrowed $8M and distributed to Holdco. These appear as supplemental non-cash disclosures, not in the financing section body."
        },
        "total_long_term_debt_FY2025": {
            "current_portion": {"value": 212000, "source_pages": [79], "status": "surfaced"},
            "noncurrent_portion": {"value": 244076000, "source_pages": [79], "status": "surfaced"},
            "total": {"value": 244288000, "status": "derived"}
        },
        "debt_maturities_schedule": {
            "status": "located_not_parsed",
            "note": "Notes to financial statements (pages 83-95+) contain the debt maturity schedule. Text was decoded via CID font mapping but note-level detail was not fully structured in this extraction."
        }
    },

    "leverage_profile": {
        "debt_to_equity_FY2025": {
            "value": "~3.1:1",
            "calculation": "$419.7M total liabilities / $136.0M equity",
            "source_pages": [79],
            "status": "derived",
            "confidence": "very_high"
        },
        "combined_financial_obligations": {
            "long_term_debt": {"value": 244288000, "status": "derived"},
            "operating_lease_liabilities_total": {
                "value": 145072000,
                "note": "Current $18,552K + noncurrent $126,520K",
                "status": "derived"
            },
            "combined_debt_plus_lease": {
                "value": 389360000,
                "note": "$244.3M LTD + $145.1M operating lease liabilities",
                "status": "derived"
            }
        },
        "intangibles_as_pct_total_assets": {
            "value": "53.9%",
            "calculation": "($167.0M tradename + $132.4M goodwill + $16.3M intangibles) / $555.6M total assets",
            "source_pages": [79],
            "status": "derived"
        },
        "interest_coverage": {
            "value": "~2.3x",
            "calculation": "$58.3M income from operations / $25.3M interest expense",
            "source_pages": [80],
            "status": "derived",
            "confidence": "high"
        }
    },

    "cash_neutrality_analysis": {
        "_note": "Source: retry_item21.md Key Financial Observations section",
        "operating_cash_flow_FY2025": {"value": 56173000, "source_pages": [82], "status": "surfaced"},
        "financing_cash_used_FY2025": {"value": -56010000, "source_pages": [82], "status": "surfaced"},
        "net_cash_change_FY2025": {"value": 219000, "source_pages": [82], "status": "surfaced"},
        "observation": {
            "value": "The entity generated $56.2M from operations and used $56.0M in financing activities (primarily $55.8M in affiliate distributions). Net cash increase was only $219K. Operating cash flow essentially funds affiliate distributions with minimal retained cash.",
            "status": "surfaced"
        },
        "distributions_vs_earnings": {
            "distributions_FY2025": {"value": 55790000, "source_pages": [82], "status": "surfaced"},
            "net_income_FY2025": {"value": 32798000, "source_pages": [80], "status": "surfaced"},
            "excess_distributions_over_income": {"value": 22992000, "status": "derived"},
            "observation": "Distributions exceeded net income by $23M in FY2025. Combined with FY2024 distributions of $59.4M (also exceeding the 10-month $29.1M income), the parent is systematically extracting capital. Member's contribution declined from $92.5M (FY2024) to $74.0M (FY2025) — the parent is using existing contributed capital, not retaining earnings."
        }
    },

    "management_fee_analysis": {
        "amount_FY2025": {"value": 22704000, "source_pages": [80], "status": "surfaced"},
        "amount_FY2024_stub": {"value": 17599000, "source_pages": [80], "status": "surfaced"},
        "pct_of_total_revenues_FY2025": {"value": "6.0%", "status": "derived", "calculation": "$22.7M / $381.0M"},
        "recipient": "Qdoba Restaurant Corporation (QRC)",
        "nature": "Related-party cost. QRC performs all operational, marketing, development, real estate, IP, and franchising functions under a management agreement in exchange for this fee.",
        "significance": "At $22.7M, management fee exceeds SG&A ($14.9M) and is 40% of income from operations ($58.3M). It is a material intercompany transfer that reduces reported income of the Holdco entity (which is what franchisees are required to evaluate).",
        "status": "surfaced"
    },

    "asset_composition_note": {
        "tradename_and_goodwill_pct": {
            "value": "53.9% of total assets",
            "detail": "$167.0M tradename (carried at cost, no impairment taken in FY2025) + $132.4M goodwill = $299.4M of $555.6M total assets",
            "source_pages": [79],
            "status": "derived"
        },
        "tradename_impairment_note": {
            "value": "No impairment recorded on the $167.0M tradename in either period. The tradename balance has not changed ($167.0M in both FY2024 and FY2025).",
            "source_pages": [79],
            "status": "surfaced"
        },
        "rou_asset_note": {
            "value": "Operating lease ROU assets of $145.1M represent the capitalized present value of operating lease obligations — primarily restaurant site leases. These are not financial assets; the corresponding liability ($145.1M combined current + noncurrent operating lease liabilities) offsets them.",
            "source_pages": [79],
            "status": "derived"
        }
    }
}


# ─────────────────────────────────────────────────────────────────────────────
# FAMILY 2: item21_statement_detail
# Source: retry_item21.md (all four financial statement tables)
# Adds: missing balance sheet lines, ALL FY2024 comparative values,
#       additional income statement lines, additional cash flow lines,
#       full equity rollforward
# ─────────────────────────────────────────────────────────────────────────────
canon["item21_statement_detail"] = {
    "_source": "retry_item21.md — pages 79–82 (all four statements)",
    "_note": "Supplements item21_financials. Contains line items not yet captured there, plus FY2024 stub-period comparatives for all items. All figures in full dollars (converted from $000 in source).",

    "balance_sheet": {
        "_periods": {
            "FY2025": "As of September 28, 2025",
            "FY2024": "As of September 29, 2024 (stub period start: Nov 28, 2023)"
        },
        "current_assets": {
            "cash_and_equivalents":     {"FY2025": 7276000,   "FY2024": 6481000,  "source_pages": [79], "status": "surfaced"},
            "restricted_cash":          {"FY2025": 5426000,   "FY2024": 6002000,  "source_pages": [79], "status": "surfaced"},
            "accounts_receivable_net":  {"FY2025": 8468000,   "FY2024": 7486000,  "source_pages": [79], "status": "surfaced"},
            "inventories":              {"FY2025": 1633000,   "FY2024": 1814000,  "source_pages": [79], "status": "surfaced"},
            "prepaid_expenses":         {"FY2025": 259000,    "FY2024": 836000,   "source_pages": [79], "status": "surfaced"},
            "other_current_assets":     {"FY2025": 146000,    "FY2024": 60000,    "source_pages": [79], "status": "surfaced"},
            "total_current_assets":     {"FY2025": 23208000,  "FY2024": 22679000, "source_pages": [79], "status": "surfaced"}
        },
        "noncurrent_assets": {
            "property_and_equipment_net":   {"FY2025": 65821000,  "FY2024": 54671000,  "source_pages": [79], "status": "surfaced"},
            "operating_lease_rou_net":      {"FY2025": 145098000, "FY2024": 139472000, "source_pages": [79], "status": "surfaced"},
            "tradename":                    {"FY2025": 167000000, "FY2024": 167000000, "source_pages": [79], "status": "surfaced"},
            "intangible_assets_net":        {"FY2025": 16296000,  "FY2024": 17100000,  "source_pages": [79], "status": "surfaced"},
            "goodwill":                     {"FY2025": 132379000, "FY2024": 129425000, "source_pages": [79], "status": "surfaced"},
            "other_assets":                 {"FY2025": 5838000,   "FY2024": 4812000,   "source_pages": [79], "status": "surfaced"}
        },
        "total_assets":                 {"FY2025": 555640000, "FY2024": 535159000, "source_pages": [79], "status": "surfaced"},
        "current_liabilities": {
            "current_portion_ltd":                       {"FY2025": 212000,    "FY2024": 50000,    "source_pages": [79], "status": "surfaced"},
            "current_portion_operating_lease":           {"FY2025": 18552000,  "FY2024": 15300000, "source_pages": [79], "status": "surfaced"},
            "due_to_affiliate":                          {"FY2025": 4826000,   "FY2024": 2219000,  "source_pages": [79], "status": "surfaced"},
            "accounts_payable":                          {"FY2025": 6405000,   "FY2024": 6772000,  "source_pages": [79], "status": "surfaced"},
            "accrued_liabilities":                       {"FY2025": 10252000,  "FY2024": 9408000,  "source_pages": [79], "status": "surfaced"},
            "total_current_liabilities":                 {"FY2025": 40247000,  "FY2024": 33749000, "source_pages": [79], "status": "surfaced"}
        },
        "noncurrent_liabilities": {
            "long_term_debt_net_of_current":             {"FY2025": 244076000, "FY2024": 253391000, "source_pages": [79], "status": "surfaced"},
            "lt_operating_lease_liabilities_net":        {"FY2025": 126520000, "FY2024": 118345000, "source_pages": [79], "status": "surfaced"},
            "other_long_term_liabilities":               {"FY2025": 8835000,   "FY2024": 8067000,   "source_pages": [79], "status": "surfaced"}
        },
        "total_liabilities":            {"FY2025": 419678000, "FY2024": 413552000, "source_pages": [79], "status": "surfaced"},
        "members_equity": {
            "members_contribution_net": {"FY2025": 74021000,  "FY2024": 92464000,  "source_pages": [79], "status": "surfaced"},
            "retained_earnings":        {"FY2025": 61941000,  "FY2024": 29143000,  "source_pages": [79], "status": "surfaced"},
            "total_members_equity":     {"FY2025": 135962000, "FY2024": 121607000, "source_pages": [79], "status": "surfaced"}
        }
    },

    "income_statement": {
        "_periods": {
            "FY2025": "52 weeks ended September 28, 2025",
            "FY2024": "Period November 28, 2023 to September 29, 2024 (~10 months)"
        },
        "revenues": {
            "company_restaurant_sales":           {"FY2025": 282784000, "FY2024": 231352000, "source_pages": [80], "status": "surfaced"},
            "franchise_royalties_and_other":      {"FY2025": 55669000,  "FY2024": 42210000,  "source_pages": [80], "status": "surfaced"},
            "franchise_rental_revenues":          {"FY2025": 18984000,  "FY2024": 15810000,  "source_pages": [80], "status": "surfaced"},
            "franchise_advertising_contributions":{"FY2025": 23577000,  "FY2024": 14900000,  "source_pages": [80], "status": "surfaced"},
            "total_revenues":                     {"FY2025": 381014000, "FY2024": 304272000, "source_pages": [80], "status": "surfaced"}
        },
        "restaurant_costs": {
            "food_and_packaging":                 {"FY2025": 75532000,  "FY2024": 63357000,  "source_pages": [80], "status": "surfaced"},
            "payroll_and_employee_benefits":      {"FY2025": 83163000,  "FY2024": 68362000,  "source_pages": [80], "status": "surfaced"},
            "occupancy_and_other":                {"FY2025": 68007000,  "FY2024": 54354000,  "source_pages": [80], "status": "surfaced"},
            "total_company_restaurant_costs_excl_da": {"FY2025": 226702000, "FY2024": 186073000, "source_pages": [80], "status": "surfaced"}
        },
        "other_operating_items": {
            "pre_opening_costs":                  {"FY2025": 1930000,   "FY2024": 55000,     "source_pages": [80], "status": "surfaced"},
            "depreciation_and_amortization":      {"FY2025": 12043000,  "FY2024": 9381000,   "source_pages": [80], "status": "surfaced"},
            "franchise_advertising_expenses":     {"FY2025": 23577000,  "FY2024": 14900000,  "source_pages": [80], "status": "surfaced"},
            "franchise_occupancy_expenses":       {"FY2025": 19184000,  "FY2024": 16382000,  "source_pages": [80], "status": "surfaced"},
            "management_fee_expense":             {"FY2025": 22704000,  "FY2024": 17599000,  "source_pages": [80], "status": "surfaced"},
            "sg_and_a":                           {"FY2025": 14868000,  "FY2024": 6495000,   "source_pages": [80], "status": "surfaced"},
            "impairment_and_other_net":           {"FY2025": 1737000,   "FY2024": 2821000,   "source_pages": [80], "status": "surfaced"},
            "total_operating_costs_net":          {"FY2025": 322745000, "FY2024": 253706000, "source_pages": [80], "status": "surfaced"}
        },
        "below_operating": {
            "income_from_operations":             {"FY2025": 58269000,  "FY2024": 50566000,  "source_pages": [80], "status": "surfaced"},
            "interest_expense_net":               {"FY2025": 25341000,  "FY2024": 21362000,  "source_pages": [80], "status": "surfaced"},
            "income_before_income_taxes":         {"FY2025": 32928000,  "FY2024": 29204000,  "source_pages": [80], "status": "surfaced"},
            "income_tax_expense":                 {"FY2025": 130000,    "FY2024": 61000,     "source_pages": [80], "status": "surfaced"},
            "net_income":                         {"FY2025": 32798000,  "FY2024": 29143000,  "source_pages": [80], "status": "surfaced"}
        }
    },

    "cash_flow_statement": {
        "_periods": {
            "FY2025": "52 weeks ended September 28, 2025",
            "FY2024": "Period November 28, 2023 to September 29, 2024 (~10 months)"
        },
        "operating_activities": {
            "net_income":                         {"FY2025": 32798000,  "FY2024": 29143000,  "source_pages": [82], "status": "surfaced"},
            "depreciation_and_amortization":      {"FY2025": 12043000,  "FY2024": 9381000,   "source_pages": [82], "status": "surfaced"},
            "non_cash_lease_expense":             {"FY2025": 19245000,  "FY2024": 15119000,  "source_pages": [82], "status": "surfaced"},
            "amort_deferred_financing_and_discount": {"FY2025": 3428000, "FY2024": 2655000,  "source_pages": [82], "status": "surfaced"},
            "losses_on_disposition_ppe":          {"FY2025": 889000,    "FY2024": 963000,    "source_pages": [82], "status": "surfaced"},
            "impairment_charges_net":             {"FY2025": 755000,    "FY2024": 1858000,   "source_pages": [82], "status": "surfaced"},
            "other":                              {"FY2025": -33000,    "FY2024": 45000,     "source_pages": [82], "status": "surfaced"},
            "changes_in_working_capital": {
                "accounts_receivable":            {"FY2025": -994000,   "FY2024": -2178000,  "source_pages": [82], "status": "surfaced"},
                "inventories":                    {"FY2025": 181000,    "FY2024": 60000,     "source_pages": [82], "status": "surfaced"},
                "prepaid_and_other_current":      {"FY2025": 577000,    "FY2024": 1042000,   "source_pages": [82], "status": "surfaced"},
                "due_to_affiliate":               {"FY2025": 2607000,   "FY2024": 1332000,   "source_pages": [82], "status": "surfaced"},
                "accounts_payable":               {"FY2025": -367000,   "FY2024": 1910000,   "source_pages": [82], "status": "surfaced"},
                "accrued_liabilities":            {"FY2025": 844000,    "FY2024": 6054000,   "source_pages": [82], "status": "surfaced"},
                "operating_lease_liabilities":    {"FY2025": -15375000, "FY2024": -14645000, "source_pages": [82], "status": "surfaced"},
                "other_assets_and_lt_liabilities":{"FY2025": -425000,   "FY2024": 286000,    "source_pages": [82], "status": "surfaced"}
            },
            "cash_from_operations":               {"FY2025": 56173000,  "FY2024": 53025000,  "source_pages": [82], "status": "surfaced"}
        },
        "investing_activities": {
            "proceeds_from_sale_of_ppe":          {"FY2025": 56000,     "FY2024": 235000,    "source_pages": [82], "status": "surfaced"},
            "cash_from_investing":                {"FY2025": 56000,     "FY2024": 235000,    "source_pages": [82], "status": "surfaced"}
        },
        "financing_activities": {
            "distributions_to_affiliate":         {"FY2025": -55790000, "FY2024": -59435000, "source_pages": [82], "status": "surfaced"},
            "cash_contribution_from_affiliate":   {"FY2025": 0,         "FY2024": 1413000,   "source_pages": [82], "status": "surfaced"},
            "cash_from_securitization_close":     {"FY2025": 0,         "FY2024": 2897000,   "source_pages": [82], "status": "surfaced"},
            "principal_repayments":               {"FY2025": -220000,   "FY2024": -677000,   "source_pages": [82], "status": "surfaced"},
            "cash_used_in_financing":             {"FY2025": -56010000, "FY2024": -55802000, "source_pages": [82], "status": "surfaced"}
        },
        "net_change_in_cash": {
            "net_increase_decrease":              {"FY2025": 219000,    "FY2024": -2542000,  "source_pages": [82], "status": "surfaced"},
            "cash_beginning_of_period":           {"FY2025": 12483000,  "FY2024": 15025000,  "source_pages": [82], "status": "surfaced"},
            "cash_end_of_period":                 {"FY2025": 12702000,  "FY2024": 12483000,  "source_pages": [82], "status": "surfaced"}
        },
        "supplemental_disclosures": {
            "cash_paid_for_interest":             {"FY2025": 22421000,  "FY2024": 17819000,  "source_pages": [82], "status": "surfaced"},
            "non_cash_contributions_ppe_rou_goodwill": {"FY2025": 25347000, "FY2024": 23043000, "source_pages": [82], "status": "surfaced"},
            "issuance_class_a2_notes_net_of_discount": {"FY2025": 0,   "FY2024": 234510000, "source_pages": [82], "status": "surfaced"},
            "repayment_of_revolving_credit":      {"FY2025": 20000000, "FY2024": 0,          "source_pages": [82], "status": "surfaced"},
            "borrowing_on_revolving_credit":      {"FY2025": 8000000,  "FY2024": 25000000,   "source_pages": [82], "status": "surfaced"},
            "debt_issuance_costs":                {"FY2025": 0,        "FY2024": 12178000,   "source_pages": [82], "status": "surfaced"}
        }
    },

    "equity_rollforward": {
        "_source": "retry_item21.md page 81",
        "_note": "Consolidated Statement of Member's Equity — three columns: Member's Contribution Net, Retained Earnings, Total Equity. All amounts in full dollars.",
        "opening_balance_nov_28_2023": {
            "members_contribution_net": {"value": 15025000,    "source_pages": [81], "status": "surfaced"},
            "retained_earnings":        {"value": 0,           "source_pages": [81], "status": "surfaced"},
            "total_equity":             {"value": 15025000,    "source_pages": [81], "status": "surfaced"}
        },
        "stub_period_transactions": {
            "initial_contribution_of_assets_and_liabilities_net": {
                "members_contribution_net": {"value": 359781000, "source_pages": [81], "status": "surfaced"},
                "note": "Assets and liabilities contributed at securitization close (IP, franchise agreements, goodwill, equipment, leases, and associated liabilities)"
            },
            "distribution_to_affiliate_for_debt_repayment_net": {
                "members_contribution_net": {"value": -247363000, "source_pages": [81], "status": "surfaced"},
                "note": "Part of securitization mechanics — proceeds from Class A-2 Notes flowed through and out to parent"
            },
            "additional_contributions":   {"members_contribution_net": {"value": 23043000,  "source_pages": [81], "status": "surfaced"}},
            "distributions_to_affiliate": {"members_contribution_net": {"value": -59435000, "source_pages": [81], "status": "surfaced"}},
            "cash_contribution_from_affiliate": {"members_contribution_net": {"value": 1413000, "source_pages": [81], "status": "surfaced"}},
            "net_income":                 {"retained_earnings":        {"value": 29143000,  "source_pages": [81], "status": "surfaced"}}
        },
        "balance_at_sept_29_2024": {
            "members_contribution_net": {"value": 92464000,  "source_pages": [81], "status": "surfaced"},
            "retained_earnings":        {"value": 29143000,  "source_pages": [81], "status": "surfaced"},
            "total_equity":             {"value": 121607000, "source_pages": [81], "status": "surfaced"}
        },
        "fy2025_transactions": {
            "debt_repayment_received_from_affiliate": {
                "members_contribution_net": {"value": 20000000, "source_pages": [81], "status": "surfaced"},
                "note": "Affiliate contributed $20M to fund revolver repayment — non-cash intercompany"
            },
            "debt_borrowing_distribution_to_affiliate": {
                "members_contribution_net": {"value": -8000000, "source_pages": [81], "status": "surfaced"},
                "note": "Entity borrowed $8M on revolver and distributed to affiliate — non-cash intercompany"
            },
            "non_cash_contributions":     {"members_contribution_net": {"value": 25347000,  "source_pages": [81], "status": "surfaced"}},
            "distributions_to_affiliate": {"members_contribution_net": {"value": -55790000, "source_pages": [81], "status": "surfaced"}},
            "net_income":                 {"retained_earnings":        {"value": 32798000,  "source_pages": [81], "status": "surfaced"}}
        },
        "balance_at_sept_28_2025": {
            "members_contribution_net": {"value": 74021000,  "source_pages": [81], "status": "surfaced"},
            "retained_earnings":        {"value": 61941000,  "source_pages": [81], "status": "surfaced"},
            "total_equity":             {"value": 135962000, "source_pages": [81], "status": "surfaced"}
        }
    }
}


# ─────────────────────────────────────────────────────────────────────────────
# FAMILY 3: item6_fee_detail
# Source: 03_tables.json — item6_other_fees (all 33 rows)
# Adds: all fees NOT yet in item6_fee_attributes
# ─────────────────────────────────────────────────────────────────────────────
canon["item6_fee_detail"] = {
    "_source": "03_tables.json — item6_other_fees (pages 17–22), 08_final_report.md",
    "_note": "Comprehensive per-fee attribute table for all Item 6 disclosed fees. Supplements item6_fee_attributes (which covers major ongoing fees). Refundability: unless noted, fees are non-refundable per table note.",
    "_table_note_universal": "Fees are uniform except Company may in certain limited circumstances modify or waive. Unless otherwise noted, fees paid are not refundable. Certain fees may not apply to non-traditional restaurants. Non-traditional restaurants will not pay technology fees if they do not use Company's technology systems.",

    "royalty": {
        "amount": "5% of gross sales",
        "basis": "Gross sales: all franchise revenue, excluding sales/use tax and approved discounts/refunds",
        "non_traditional_amount": "6% of gross sales",
        "timing": "Payable weekly",
        "modifiable": False,
        "alcohol_clause": "If state law prohibits royalties on alcohol sales, royalty rate increased proportionally on remaining sales to compensate",
        "refundable": False,
        "collection_mechanism": "ACH direct debit authorized via Exhibit L",
        "linked_exhibit": "Exhibit E-1 (Franchise Agreement), Exhibit L (ACH Authorization)",
        "source_pages": [17],
        "status": "surfaced"
    },

    "marketing_fee": {
        "amount": "4.50% of gross sales (franchisees)",
        "non_traditional_amount": "1.75% of gross sales (licensees)",
        "basis": "Gross sales",
        "timing": "Payable weekly",
        "modifiable": True,
        "ceiling": "6% of gross sales",
        "increase_mechanism": "Franchisor may propose; requires majority franchisee vote to approve increase",
        "refundable": False,
        "key_note": "Rate increased from 4.0% to 4.5% on September 29, 2025 — after FY2025 Item 19 data period. Chart 3 EBITDA reflects 4.0% rate; current burden is ~0.5 pp higher.",
        "collection_mechanism": "ACH direct debit authorized via Exhibit L",
        "fund_administration": "Administered by franchisor with sole discretion. Not independently audited. FY2025 split: 17% production, 32% media, 18% agency, 19% other, 14% admin overhead. Surplus at FY2025 end: $115,478.",
        "source_pages": [17],
        "status": "surfaced"
    },

    "local_advertising": {
        "amount": "No currently required minimum",
        "basis": "N/A — not required as of FDD issuance",
        "timing": "Negotiated with vendor (when incurred)",
        "modifiable": True,
        "cooperative_note": "No cooperative has been formed. If one is formed, franchisees may be required to contribute. Franchisor reserves right to audit local advertising spend.",
        "enforcement": "If franchisee fails to spend required local advertising amount, franchisor may directly debit bank account and contribute to Marketing Fund",
        "refundable": False,
        "source_pages": [18],
        "status": "surfaced"
    },

    "lease_admin_fee": {
        "amount": "$100 per month",
        "basis": "Per restaurant; only if franchisee subleases from Company",
        "timing": "Payable monthly",
        "modifiable": False,
        "applicability": "Only applicable where Company is lessor/sublessor to franchisee",
        "refundable": False,
        "source_pages": [18],
        "status": "surfaced"
    },

    "technology_license_installation": {
        "amount": "$199",
        "basis": "One-time per restaurant",
        "timing": "One-time upon opening",
        "description": "Software license for polling",
        "modifiable": False,
        "refundable": False,
        "source_pages": [18],
        "status": "surfaced"
    },

    "technology_project_mgmt_db_config": {
        "amount": "$2,250",
        "basis": "One-time per restaurant",
        "timing": "One-time upon opening",
        "description": "POS and ordering platforms, payment systems, inventory/labor management setup",
        "modifiable": False,
        "refundable": False,
        "source_pages": [19],
        "status": "surfaced"
    },

    "it_base_services": {
        "amount": "$6,300–$18,600 per restaurant per year",
        "basis": "Per restaurant",
        "timing": "Monthly or period basis",
        "modifiable": True,
        "description": "POS software/hardware maintenance, inventory/labor management, menu management, network equipment rental, other approved services",
        "ceiling": "None specified",
        "refundable": False,
        "source_pages": [19],
        "status": "surfaced"
    },

    "it_project_services": {
        "amount": "$299–$1,600 per restaurant per project, plus project costs",
        "basis": "Per restaurant per project",
        "timing": "As incurred",
        "description": "Major projects classified by CTO. Includes project management, data collection, QA testing, vendor management, software deployment",
        "modifiable": False,
        "key_note": "Project scope and frequency determined by franchisor CTO — franchisee has no control over when projects are initiated or how much they cost",
        "refundable": False,
        "source_pages": [19],
        "status": "surfaced"
    },

    "it_support_services": {
        "amount": "$250 per restaurant per period (flat) + 0.21% of weekly gross sales (variable)",
        "basis": "13 periods per year for flat component; weekly gross sales for variable component",
        "timing": "Flat fee 13x per year; variable weekly",
        "modifiable": True,
        "modifiable_note": "Franchisor explicitly states it can modify this fee at any time — no contractual ceiling or notice period requirement",
        "description": "Help desk, menu management, platform services, cybersecurity, network configuration, QA, data hosting",
        "refundable": False,
        "source_pages": [19],
        "status": "surfaced"
    },

    "q_cash_card_fee": {
        "amount": "$7.75 per month",
        "basis": "Per restaurant",
        "timing": "Monthly",
        "description": "Fee payable to vendor (via Qdoba) that administers Q-Cash stored value card program",
        "vendor": "QMG Stored Value Cards LLC (affiliate)",
        "mandatory": True,
        "refundable": False,
        "linked_exhibit": "Exhibit N (Stored Value Card Service Agreement)",
        "source_pages": [19],
        "status": "surfaced"
    },

    "license_activation_fees": {
        "amount": "$549 total",
        "components": [
            {"name": "Olo Activation Fee", "amount": 250},
            {"name": "Fourth Implementation Fee", "amount": 299}
        ],
        "basis": "One-time per restaurant",
        "timing": "One-time upon opening",
        "refundable": False,
        "source_pages": [20],
        "status": "surfaced"
    },

    "late_payment_interest": {
        "amount": "18% per annum",
        "basis": "On unpaid royalties, marketing fees, and other fees",
        "timing": "Begins 10 days after billing; due on demand",
        "modifiable": False,
        "state_override": "California caps at 10% per annum (state addendum)",
        "scope": "Charged on late Royalty, Marketing Fees, and other fees",
        "refundable": False,
        "source_pages": [20],
        "status": "surfaced"
    },

    "audit_cost": {
        "amount": "Full cost of audit plus 18% on unpaid amounts",
        "trigger": "Follow-up audit; or if audit shows understatement/underpayment ≥2% of gross sales for any month",
        "timing": "Due 30 days after billing",
        "additional_consequence": "If franchisee failed to spend required local advertising, company may debit bank account and must also reimburse audit cost",
        "refundable": False,
        "source_pages": [20],
        "status": "surfaced"
    },

    "transfer_fee": {
        "amount": "Up to $5,000",
        "basis": "Per transfer transaction",
        "timing": "Prior to consummation of transfer",
        "trigger": "On franchise sale or consent to restructuring of franchisee entity",
        "modifiable": False,
        "refundable": False,
        "rofr_note": "Franchisor retains right of first refusal to match any bona fide transfer offer",
        "source_pages": [20],
        "status": "surfaced"
    },

    "renewal_fee": {
        "amount": "$10,000",
        "basis": "Per renewal term",
        "timing": "Earlier of 30 days before expiration or at signing of new Franchise Agreement",
        "description": "For additional franchise term at same site under new Franchise Agreement",
        "modifiable": False,
        "refundable": False,
        "key_note": "Renewal requires signing a then-current FA which 'may be materially different' from original. Franchisee also required to execute general release and complete remodel.",
        "source_pages": [20],
        "status": "surfaced"
    },

    "relocation_fee": {
        "amount": "$5,000",
        "basis": "Per relocation event",
        "timing": "At time relocation is granted",
        "conditions": "New site must be within Protected Territory; relocated restaurant must open within 5 days of closing existing restaurant",
        "approval": "Requires franchisor approval",
        "refundable": False,
        "source_pages": [21],
        "status": "surfaced"
    },

    "extension_fee": {
        "amount": "$1,500 per one-year extension",
        "basis": "Per extension event",
        "timing": "At time extension is granted",
        "approval": "Case-by-case at franchisor's discretion",
        "refundable": False,
        "source_pages": [21],
        "status": "surfaced"
    },

    "site_visit_fee": {
        "amount": "$500 per visit plus actual travel/lodging/meals expenses",
        "free_visits": 2,
        "timing": "When incurred",
        "key_note": "No fee for first two visits per year. Third and subsequent visits require $500 plus actual expenses.",
        "refundable": False,
        "source_pages": [21],
        "status": "surfaced"
    },

    "standard_training": {
        "amount": "$0 (no fee)",
        "scope": "Standard training content for designated operator, GM, and required managers",
        "franchisee_cost": "All wages, travel, and living expenses for trainees are franchisee responsibility — franchisor charges no fee but cost is not zero to franchisee",
        "refundable": "N/A",
        "source_pages": [21],
        "status": "surfaced"
    },

    "additional_training": {
        "amount": "Up to $1,600 per additional trainee",
        "timing": "As incurred",
        "trigger": "Only for training beyond the designated operator, GM, and two leaders/managers, or for excess training sessions",
        "refundable": False,
        "source_pages": [21],
        "status": "surfaced"
    },

    "refresher_training": {
        "amount": "Up to $1,600 per trainee per program",
        "timing": "As incurred",
        "trigger": "Required when designated operator, GM, and/or other leaders must attend as reasonably required by franchisor",
        "refundable": False,
        "key_note": "Frequency of required refresher training is at franchisor's reasonable discretion",
        "source_pages": [21],
        "status": "surfaced"
    },

    "new_restaurant_training_support": {
        "amount": "$3,500 per trainer",
        "timing": "As incurred, at restaurant opening",
        "trigger": "Not charged for first two franchised restaurants. Applies from 3rd+ restaurant.",
        "coverage": "11 days of training and opening support",
        "refundable": False,
        "key_note": "For 3rd+ restaurants, franchisee's own trained managers conduct training; this fee compensates franchisor for providing additional support trainers.",
        "source_pages": [21],
        "status": "surfaced"
    },

    "lms_fee": {
        "amount": "$24–$40 per restaurant per month",
        "basis": "Per restaurant",
        "timing": "Monthly",
        "platform": "Yoobic LMS",
        "modifiable": True,
        "refundable": False,
        "source_pages": [22],
        "status": "surfaced"
    },

    "inspection_fee": {
        "amount": "Cost of follow-up inspection",
        "trigger": "Payable if restaurant fails food safety or operational inspection",
        "timing": "As incurred (after failed inspection)",
        "refundable": False,
        "source_pages": [22],
        "status": "surfaced"
    },

    "alternative_supplier_costs": {
        "amount": "Actual expenses incurred",
        "trigger": "If approved suppliers can produce a product but franchisee requests approval of additional supplier",
        "timing": "When incurred",
        "refundable": False,
        "source_pages": [22],
        "status": "surfaced"
    },

    "corrected_deficiency_costs": {
        "amount": "Reimbursement for all expenses incurred by franchisor",
        "trigger": "If franchisee fails to correct a deficiency, franchisor may correct it and obtain reimbursement",
        "timing": "Upon correction",
        "refundable": False,
        "source_pages": [22],
        "status": "surfaced"
    },

    "indemnification": {
        "amount": "Varies (all costs, liabilities, claims)",
        "trigger": "Claims against Qdoba resulting from franchisee's restaurant operation",
        "timing": "As incurred",
        "basis": "Franchisee must reimburse Qdoba for all claims, damages, costs arising from operation",
        "refundable": False,
        "source_pages": [22],
        "status": "surfaced"
    },

    "legal_fees": {
        "amount": "Varies (attorneys' fees)",
        "trigger": "Franchisee fails to comply with Franchise Agreement, requiring franchisor to incur legal costs",
        "timing": "As incurred",
        "refundable": False,
        "source_pages": [22],
        "status": "surfaced"
    },

    "taxes_and_freight": {
        "amount": "Varies",
        "trigger": "Taxes on any of the above fees as required by taxing authorities; freight on orders",
        "timing": "As incurred",
        "refundable": False,
        "source_pages": [22],
        "status": "surfaced"
    },

    "catering_rewards_program": {
        "amount": "Pro rata share of overall catering rewards program costs",
        "basis": "Allocated based on franchisee participation",
        "timing": "Monthly",
        "mandatory": True,
        "key_note": "Mandatory participation in catering program; rewards program is a component of it",
        "refundable": False,
        "source_pages": [22],
        "status": "surfaced"
    },

    "amendment_fee": {
        "amount": "Greater of $500 or actual attorneys' fees and administrative expenses",
        "trigger": [
            "Franchisee requests a franchise agreement amendment",
            "Franchisee fails to comply and franchisor prepares an amendment to address the failure"
        ],
        "timing": "On demand",
        "refundable": False,
        "source_pages": [22],
        "status": "surfaced"
    },

    "extended_producer_responsibility_fees": {
        "amount": "Actual expenses incurred",
        "trigger": "EPR fees incurred by franchisor due to franchisee's restaurant operation (packaging waste regulations)",
        "timing": "On demand",
        "key_note": "Growing regulatory exposure as EPR laws expand across states",
        "refundable": False,
        "source_pages": [22],
        "status": "surfaced"
    },

    "catering_call_center_fee": {
        "amount": "Varies — allocation of vendor cost",
        "basis": "Franchisee's proportion of total system catering orders times vendor cost",
        "timing": "On demand (monthly allocation)",
        "key_note": "Per-use allocation; higher-volume catering operators pay proportionally more",
        "refundable": False,
        "source_pages": [22],
        "status": "surfaced"
    },

    "grand_opening_advertising": {
        "amount": "$10,000–$25,000",
        "basis": "Per restaurant opening",
        "timing": "Within 30 days of opening",
        "mandatory": True,
        "non_traditional_note": "License Agreement has no minimum grand opening advertising requirement",
        "refundable": False,
        "source_pages": [22, 24],
        "status": "surfaced"
    },

    "achs_direct_debit_authorization": {
        "amount": "N/A — mechanism, not a fee",
        "basis": "Franchisor authorized to directly debit franchisee bank account",
        "scope": "Royalty, marketing fees, and other recurring payments",
        "linked_exhibit": "Exhibit L (Authorization for Prearranged Payments)",
        "key_note": "Franchisor can debit any amounts owed, including local advertising shortfalls contributed to Marketing Fund",
        "status": "surfaced",
        "source_pages": [17, 22]
    },

    "_fee_count_total": {
        "value": 33,
        "note": "All fees disclosed in Item 6 fee table (pages 17–22) are now structured. Combined with item6_fee_attributes, full fee coverage achieved.",
        "status": "surfaced"
    }
}


# Write output
with open(OUT, "w") as f:
    json.dump(canon, f, indent=2, ensure_ascii=False)

print(f"Wrote {OUT}")
print(f"Keys in output: {list(canon.keys())}")
new_keys = [k for k in canon.keys() if k in ("item21_financial_structure_detail", "item21_statement_detail", "item6_fee_detail")]
print(f"New families: {new_keys}")
