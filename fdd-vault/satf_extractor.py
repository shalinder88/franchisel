#!/usr/bin/env python3
"""
Franchisel FDD Extractor V7 — Entry Point

Usage: python3 satf_extractor.py <pdf_path>

Full-fidelity extraction: document → pages → sections → tables/exhibits → engines → QA → output
"""

import sys
import os
import json

# Add parent directory to path so v7_extractor package is importable
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from v7_extractor.pipeline import extract_fdd


def main():
    if len(sys.argv) < 2:
        print("Usage: python3 satf_extractor.py <pdf_path>")
        sys.exit(1)

    pdf_path = sys.argv[1]
    if not os.path.exists(pdf_path):
        print(f"Error: {pdf_path} not found")
        sys.exit(1)

    result = extract_fdd(pdf_path)

    out_path = "/tmp/satf_result.json"
    with open(out_path, "w") as f:
        json.dump(result, f, indent=2, default=str)
    print(f"\nResult saved to {out_path}")


if __name__ == "__main__":
    main()
