# Retry Tasks — Sweat440 FDD 2025

Filing: 637910-2025 | Date: 2026-04-14

## Retry R1: Item 20 Table 4 — Company-Owned Studio Status

**Status**: EXECUTE  
**Rationale**: Complete coverage of all 5 Item 20 tables. Table 4 data was read but not structured as a table object.  
**Action**: Extract Table 4 from pages 50 and write as retry_R1.json.

## Retry R2: Auditor Firm Name

**Status**: SKIP  
**Rationale**: Auditor name appears on letterhead/image on pages 55-56. Text layer captures the report body but not the firm name from the graphic header. Auditor location (Melville, NY) and audit date (March 11, 2025) are confirmed. The firm name would require image-based extraction which is outside the text layer. Not material to extraction quality.

## Retry R3: Item 19 Revenue Statistics

**Status**: EXECUTE  
**Rationale**: Calculate aggregate statistics from the 17-studio gross revenue table for canonical enrichment.  
**Action**: Compute mean, median, quartiles from extracted data.

---

## Executed Retries

### R1: Item 20 Table 4 — Written to retry_R1.json ✅
### R3: Item 19 Statistics — Written to retry_R3.json ✅
