# Extraction Scorecard — Paul Davis Restoration, Inc. (637929-2025)

## Overview
| Metric | Value |
|--------|-------|
| Filing ID | 637929-2025 |
| Brand | Paul Davis Restoration, Inc. |
| PDF Pages | 256 |
| Issuance Date | March 25, 2025 |
| Extraction Date | 2026-04-15 |

## Coverage
| Category | Score |
|----------|-------|
| Items 1-23 | 23/23 (100%) |
| Material Tables | 16/16 (100%) |
| Exhibits Cataloged | 9/9 (100%) |
| Exhibit Text Extracted | 8/9 (89% — B-2 image-only) |
| State Addenda Parsed | 14/14 (100%) |

## Extraction Quality
| Dimension | Rating | Notes |
|-----------|--------|-------|
| Text Layer Quality | High | pdftoppm extraction; clean text across 256 pages |
| Fee Completeness | High | 29 fee categories extracted with amounts, frequency, notes |
| Item 19 Detail | High | 5 tables, all summary statistics, caveats captured |
| Item 20 Detail | High | 5 tables, 3-year trends, state-by-state data |
| Financial Statements | High | BS, IS, CF, equity for FY2024/2023 |
| Contract Mechanics | High | 22 provisions with FA references |
| State Addenda | High | 14 states with material overrides |

## Key Metrics
| Metric | Value |
|--------|-------|
| System Size | 266 operating (272 total) |
| Initial Investment | $298,800–$804,900 |
| Franchise Fee | $65,000–$208,000 |
| Royalty | 4% of Gross Sales |
| Median Gross Sales (2+ yr) | $3,976,094 |
| Average Gross Sales (2+ yr) | $6,006,779 |
| Total System Gross Sales | $1,099,240,532 (183 reporting units, 2+ yrs) |
| Net Growth (2024) | +21 units |
| Termination Rate (2024) | 2.3% (6/266) |
| Parent Revenue | $850.4M |
| Parent Operating Income | $82.7M |

## Unresolveds
| ID | Description | Severity |
|----|-------------|----------|
| U1 | Exhibit B-2 guarantee text image-only | Low |
| U2 | Consolidated territory reporting distorts per-territory metrics | Medium |
| U3 | Multi-territory operators inflate population/revenue figures | Medium |
| U4 | Table 5 resale valuations include multi-franchise packages | Low |

## Retries
| Task | Status | Impact |
|------|--------|--------|
| R1: State Addenda Overrides | EXECUTED | 14 states parsed with material overrides |
| R2: Exhibit B-2 Guarantee Text | SKIPPED | Image-only; fact confirmed from Item 21 |
| R3: Item 19 Individual Data | SKIPPED | Summaries sufficient; detail in source text |

## Depth Passes (A2)
| Pass | Status | Output |
|------|--------|--------|
| Financial Notes | Completed | 16 notes, all accounting policies |
| Contract Burdens | Completed | 32 FA articles, 14 burden categories |
| Promotion Audit | Completed | 7 facts promoted to canonical |
| State Addenda Structured | Completed | 27 overrides across 9 families |

## Final Verdict
**PASS** — Complete extraction with high confidence across all 23 items, 16 material tables, 9 exhibits, 14 state addenda (27 structured overrides), 4 depth passes, and 7 promoted canonical facts. Two medium-severity unresolveds relate to data consolidation practices inherent in the FDD, not extraction gaps.
