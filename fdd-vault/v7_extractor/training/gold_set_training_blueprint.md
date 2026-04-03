# Gold-Set-Guided Extractor Hardening Blueprint

## Core Principle
The 16 manually reviewed brands are the extractor's main learning system.
Not ML training. Stored rules and tests.

## The 16 Gold Brands
### Tier 1 (Deep Manual Review)
1. McDonald's — QSR, rent-engine, strong Item 19
2. Chick-fil-A — captive-site license, NOT standard franchise
3. SERVPRO — securitized restoration, no Item 19
4. Planet Fitness — EFT membership, vendor-controlled remodel
5. Great Clips — personal care, multi-path, supplier/tech control
6. Jersey Mike's — QSR, entity mismatch, hidden Item 11 kill switches

### Tier 2 (Popular Brands)
7. Papa John's — QSR, three formats, development agreement
8. F45 Training — boutique fitness, heavy supplier control
9. Anytime Fitness — full-size fitness, Purpose Brands structure
10. Orangetheory — boutique fitness, affiliate expansion
11. Zaxby's — QSR, securitization, rich Item 20
12. Panera Bread — full-service, dual format, deep tech/IP

### Tier 3 (Small/New Brands)
13-22: Sweat440, Home Halo, Ivybrook Academy, Cupbop, Ziggi's Coffee,
       Hallmark Homecare, Grabbagreen, Drybar, i9 Sports, Cookie Advantage

## Reverse Training Loop
For each brand:
1. Run extractor fully
2. Compare output to known-good manual output
3. Find misses, wrong values, missing exhibits
4. Send extractor back to inspect missed source pages
5. Classify WHY it missed (miss taxonomy)
6. Store as reusable rule, pattern, or test
7. Rerun until fixed without breaking previous brands

## Miss Taxonomy
Every miss is classified into one class:
- locator_miss — wrong item boundary
- item_identity_miss — content belongs to different item
- table_detection_miss — table exists but not imported
- split_table_miss — continuation table not merged
- note_linkage_miss — footnote not attached to table
- cross_reference_miss — "see Exhibit X" not followed
- exhibit_followthrough_miss — exhibit found but not parsed
- state_addendum_miss — state override not captured
- engine_mapping_miss — fact found but mapped to wrong field
- normalization_miss — raw value not converted to clean scalar
- importance_scoring_miss — important fact not prioritized
- discovery_lane_miss — reader didn't capture the fact
- output_render_miss — value extracted but not in final output

## Miss Severity Tiers
### Tier 1 — Fatal (blocks publish)
- Item 19 miss, Item 20 counts miss, Item 21 miss
- State addendum miss, total investment miss
- Agreement/exhibit miss that changes economics or control

### Tier 2 — Major (blocks high confidence)
- Missed footnote with material condition
- Missed unusual clause, missed supplier dependency
- Missed transfer/default restriction

### Tier 3 — Moderate (useful but not fatal)
- Missed supporting detail, missed low-impact row
- Imperfect page summary

## Learning Buckets
Every lesson goes into one of four:
A. Structural rules (section detection, table handling, note linkage)
B. Archetype rules (QSR fee shape, fitness EFT, home care referral)
C. Importance rules (Item 19 disclaimers are critical, state addenda override)
D. Regression tests (concrete expected outputs)

## Hard Rule
Every fix must answer: "Is this a brand patch, or a general extraction lesson?"
Brand patches are rejected or quarantined. General lessons are kept.

## Gold Package Structure (per brand)
- gold_output.json — known-good structured output
- must_not_miss.json — facts that must never be missed
- important_facts.json — why each fact mattered
- required_exhibits.json — exhibits that must be parsed
- manual_notes.json — reviewer observations
