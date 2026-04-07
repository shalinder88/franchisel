# B2 Regression Recovery Generator — Embassy Suites 2025

## Input
- `B1_regression_check.md`: no prior run; self-audit only; 0 regressions identified.

## Generated recovery tasks
**None.** B1 surfaced no regressions requiring recovery.

## Derived-but-not-regression flags carried from A3 caveats
These are NOT regressions (since there is no baseline), but are known extraction gaps that could be addressed in a future deeper pass:

| id | description | source | severity | would_require_subagent |
|---|---|---|---|---|
| G1 | Exhibit D-1 State Addenda to Franchise Agreement not deep-read | 04_exhibits.json, A3 caveat 2 | LOW | no |
| G2 | Exhibit E Guaranty scope (personal/spousal/unlimited) not confirmed | 04_exhibits.json, A3 caveat 3 | LOW | no |
| G3 | Exhibit A franchised hotel list not row-level transcribed | 04_exhibits.json, A3 caveat 4 | LOW | no |
| G4 | Exhibit D-2 Development Incentive Promissory Note terms not extracted | 04_exhibits.json, A3 caveat 5 | LOW | no |

## Verdict
No B3/B4 recovery execution required. Proceed to B5 reconciled publish gate.
