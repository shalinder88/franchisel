"""
32-Extractor Worker Architecture

Control layer:
  1. Master Orchestrator — job graph, assignment, tracking, recovery
  2. Front Matter + Roadmap — structure-first parsing, page map, exhibit map

Item workers (3-25):
  Workers 3-25 map to Items 1-23

Cross-cutting specialists:
  26. Essential Table Extractor — global table parsing
  27. Essential Exhibit Extractor — global exhibit parsing
  28. Recovery / Backfill Extractor — missing objects, spill pages, broken carries

Truth-building layer:
  29. Lane A Fact Synthesizer — merge raw discoveries into typed fact packets
  30. Lane B Normalizer — map fact packets into canonical fields
  31. Reconciler / Auditor — compare all lanes, resolve conflicts
  32. Final Assembler — build canonical export + reports
"""
