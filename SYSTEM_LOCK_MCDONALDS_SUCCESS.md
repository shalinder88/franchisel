# SYSTEM LOCK — McDonald's merged run success

Claude-first automation path is now proven on McDonald's 638437-2025.

## Paths
- **Benchmark (publish artifact)**: `runs/mcdonalds-2025-merged/`
- **OLD (prior production/live run)**: `runs/mcdonalds-2025/`
- **Shadow (A1+A2+recovery)**: `runs/shadow-previous-mcdonalds-2025/`

## Locked pipeline
Bootstrap is **required** before A1. Then run serially:

`A1 → A2 → diagnostic A3 → B1 → B2 → B3 → B4 → B5`

for previous/live shadow benchmarking.

## Merge rule
The **merged artifact is the publish target** whenever OLD and NEW each have unique strengths (e.g. OLD has fuller narrative, NEW has denser structured depth and preserved contradictions). Do not replace OLD wholesale unless NEW is a strict superset.

## Terminal automation
Terminal automation remains **deferred** until another brand passes this same pipeline end-to-end.
