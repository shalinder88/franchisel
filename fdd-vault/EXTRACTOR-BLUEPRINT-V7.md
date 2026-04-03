# Final Blueprint V7 — Full-Fidelity FDD Extractor

Saved verbatim from user instructions. This is THE spec.
See user message for full text — saved here as reference anchor.
Runtime code must match this exactly.

Module structure:
- document_normalizer.py
- document_bootstrap.py
- page_reader.py
- page_classifier.py
- section_segmenter.py
- table_importer.py
- note_linker.py
- cross_reference_engine.py
- exhibit_locator.py
- exhibit_parser.py
- state_override_parser.py
- item_parsers/item01.py through item23.py
- normalizers/*.py
- qa/contradiction_checks.py, regex_sweep.py, pii_checks.py, completeness_checks.py
- assemblers/brand_json.py, visual_objects.py

Four layers: Reader → Section → Object → Engine
Regex is QA only. Tables are first-class. Exhibits are parsed not listed.
Every fact carries provenance. No fake nulls.
