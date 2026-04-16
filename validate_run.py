#!/usr/bin/env python3
"""
validate_run.py — Validate FDD extraction run outputs.

Checks file presence, JSON integrity, mode-specific gates, and content completeness.

Usage:
    python3 validate_run.py runs/mcdonalds-2025                # auto-detect mode
    python3 validate_run.py runs/mcdonalds-2025 --mode fresh   # force fresh mode
    python3 validate_run.py runs/mcdonalds-2025 --mode previous # force previous/live mode
    python3 validate_run.py runs/mcdonalds-2025 --json          # machine-readable
    python3 validate_run.py runs/* --quiet                      # batch summary
"""

from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path


# ── File expectations by pipeline stage ─────────────────────────────────────

A1_FILES = [
    "01_source_map.md",
    "02_reader_report.md",
    "03_tables.json",
    "04_exhibits.json",
    "05_canonical.json",
    "06_coverage_audit.md",
    "07_retry_tasks.md",
    "08_final_report.md",
    "09_final_canonical.json",
    "10_scorecard.md",
    "11_canonical_enriched.json",
    "12_canonical_enriched_v2.json",
    "14_run_summary.json",
]

A2_FILES = [
    "RT_depth_financial_notes.json",
    "RT_depth_contract_burdens.json",
    "RT_depth_promotion_audit.json",
    "RT_depth_state_addenda_promotion.json",
]

FRESH_GATE = "15_publish_gate.md"

PREVIOUS_LIVE_FILES = [
    "15_regression_check.md",
    "16_regression_recovery_tasks.md",
    "18_reconciled_publish_gate.md",
]

# B3 and B4 are conditional — only present if conflicts/recoveries existed
PREVIOUS_CONDITIONAL = [
    "17_conflict_adjudication.md",
    "19_reconciliation_patch_log.json",
]


# ── Helpers ─────────────────────────────────────────────────────────────────

def check_file(path: Path) -> dict:
    """Check if a file exists, and if JSON, that it parses."""
    if not path.is_file():
        return {"exists": False}
    info = {"exists": True, "size": path.stat().st_size}
    if path.suffix == ".json":
        try:
            data = json.loads(path.read_text())
            info["json_valid"] = True
            info["leaf_count"] = _count_leaves(data)
        except (json.JSONDecodeError, OSError) as e:
            info["json_valid"] = False
            info["json_error"] = str(e)[:200]
    elif path.suffix == ".md":
        try:
            info["line_count"] = len(path.read_text().strip().splitlines())
        except OSError:
            info["line_count"] = 0
    return info


def _count_leaves(obj, depth=0) -> int:
    if depth > 20:
        return 0
    if isinstance(obj, dict):
        return sum(_count_leaves(v, depth + 1) for v in obj.values())
    if isinstance(obj, list):
        return sum(_count_leaves(v, depth + 1) for v in obj)
    if obj is not None and obj != "" and obj != []:
        return 1
    return 0


def detect_mode(run_dir: Path) -> str:
    """Auto-detect fresh vs previous/live based on which gate file exists."""
    has_regression = (run_dir / "15_regression_check.md").is_file()
    has_reconciled = (run_dir / "18_reconciled_publish_gate.md").is_file()
    if has_regression or has_reconciled:
        return "previous"
    return "fresh"


# ── Content gates ───────────────────────────────────────────────────────────

def check_item19_complete(run_dir: Path) -> dict:
    """Check Item 19 completeness in canonical."""
    result = {"pass": False, "detail": ""}
    canonical_path = run_dir / "09_final_canonical.json"
    if not canonical_path.is_file():
        canonical_path = run_dir / "05_canonical.json"
    if not canonical_path.is_file():
        result["detail"] = "no canonical file"
        return result
    try:
        data = json.loads(canonical_path.read_text())
        flat = json.dumps(data).lower()
        has_item19 = "item_19" in flat or "item19" in flat or "financial_performance" in flat
        if has_item19:
            result["pass"] = True
            result["detail"] = "item19 present"
        else:
            result["detail"] = "item19 not found in canonical"
    except (json.JSONDecodeError, OSError):
        result["detail"] = "canonical parse error"
    return result


def check_item20_complete(run_dir: Path) -> dict:
    """Check Item 20 completeness in canonical."""
    result = {"pass": False, "detail": ""}
    canonical_path = run_dir / "09_final_canonical.json"
    if not canonical_path.is_file():
        canonical_path = run_dir / "05_canonical.json"
    if not canonical_path.is_file():
        result["detail"] = "no canonical file"
        return result
    try:
        data = json.loads(canonical_path.read_text())
        flat = json.dumps(data).lower()
        has_item20 = "item_20" in flat or "item20" in flat or "outlet" in flat or "total_outlets" in flat
        if has_item20:
            result["pass"] = True
            result["detail"] = "item20 present"
        else:
            result["detail"] = "item20 not found in canonical"
    except (json.JSONDecodeError, OSError):
        result["detail"] = "canonical parse error"
    return result


def check_score_gate(run_dir: Path) -> dict:
    """Check scorecard grade is A or B, or all items complete."""
    result = {"pass": False, "grade": "?", "detail": ""}
    scorecard_path = run_dir / "10_scorecard.md"
    if not scorecard_path.is_file():
        result["detail"] = "no scorecard"
        return result
    try:
        text = scorecard_path.read_text()
        low_text = text.lower()

        # Strategy 1: look for explicit grade line
        import re
        grade_match = re.search(
            r'(?:overall\s+grade|grade)\s*[:=]\s*\**([A-Fa-f])\**',
            text, re.IGNORECASE
        )
        if grade_match:
            g = grade_match.group(1).upper()
            result["grade"] = g
            result["pass"] = g in ("A", "B")
            result["detail"] = f"grade {g}"
            return result

        # Strategy 2: if no explicit grade line, check for full-coverage indicators
        has_full_coverage = bool(re.search(r'23\s*/\s*23', text))
        has_zero_gaps = "items with any gap**: 0" in low_text or "items with any gap: 0" in low_text
        if has_full_coverage and has_zero_gaps:
            result["grade"] = "A-inferred"
            result["pass"] = True
            result["detail"] = "grade inferred A from 23/23 + 0 gaps"
            return result

        # Strategy 3: check for high percentage score (>=95%) or "production usable"
        pct_match = re.search(r'(\d{2,3})\s*/\s*\d{2,3}\s*=\s*([\d.]+)%', text)
        if pct_match:
            pct = float(pct_match.group(2))
            if pct >= 95:
                result["grade"] = "A-inferred"
                result["pass"] = True
                result["detail"] = f"grade inferred A from {pct}% score"
                return result
            elif pct >= 80:
                result["grade"] = "B-inferred"
                result["pass"] = True
                result["detail"] = f"grade inferred B from {pct}% score"
                return result

        # Strategy 4: weighted-total percentage from component table
        # Matches TOTAL rows like "| **TOTAL** | **100%** | | **96.7%** |"
        # Takes the last match (post-depth-pass updated score) and requires
        # a decimal point to skip integer-only rows like "95%" table counts.
        wt_matches = re.findall(
            r'\*{0,2}TOTAL\*{0,2}\s*\|[^|]*\|[^|]*\|\s*\*{0,2}(\d+\.\d+)%\*{0,2}',
            text, re.IGNORECASE
        )
        if wt_matches:
            pct = float(wt_matches[-1])
            if pct >= 95:
                result["grade"] = "A-weighted"
                result["pass"] = True
                result["detail"] = f"grade A from {pct}% weighted total"
                return result
            elif pct >= 80:
                result["grade"] = "B-weighted"
                result["pass"] = True
                result["detail"] = f"grade B from {pct}% weighted total"
                return result

        result["detail"] = "grade not found in scorecard"
    except OSError:
        result["detail"] = "read error"
    return result


FINAL_REPORT_REQUIRED_SECTIONS = [
    "executive snapshot",
    "fee",                          # fee stack / fees / investment
    "supplier",                     # supplier control / operations
    "territory",                    # territory / encroachment
    "contract burden",              # contract burden / legal mechanics
    "item 19",                      # FPR / financial performance
    "item 20",                      # outlets
    "item 21",                      # financial statements
    "unresolved",                   # unresolveds section
]

FINAL_REPORT_MIN_LINES = 100


def check_final_report_depth(run_dir: Path) -> dict:
    """Check that 08_final_report.md is a full diligence report, not a concise summary."""
    import re
    result = {"pass": True, "line_count": 0, "missing_sections": [], "detail": ""}
    report_path = run_dir / "08_final_report.md"
    if not report_path.is_file():
        result["pass"] = False
        result["detail"] = "08_final_report.md missing"
        return result
    try:
        text = report_path.read_text()
        lines = text.strip().splitlines()
        result["line_count"] = len(lines)
        low_text = text.lower()

        # Check minimum length
        if len(lines) < FINAL_REPORT_MIN_LINES:
            result["pass"] = False
            result["detail"] = (f"final report too thin: {len(lines)} lines "
                                f"(minimum {FINAL_REPORT_MIN_LINES})")
            return result

        # Check for required section keywords in headings or body
        for section in FINAL_REPORT_REQUIRED_SECTIONS:
            if section not in low_text:
                result["missing_sections"].append(section)

        if result["missing_sections"]:
            result["pass"] = False
            result["detail"] = (f"final report missing sections: "
                                f"{', '.join(result['missing_sections'])}")
        else:
            result["detail"] = f"final report OK ({len(lines)} lines, all sections present)"
    except OSError:
        result["pass"] = False
        result["detail"] = "read error"
    return result


def check_canonical_families(run_dir: Path) -> dict:
    """Check that canonical/enriched carry required families when source material supports them.

    Returns dict with pass/fail for each family and an overall pass.
    A family is 'expected' if the source files (audit, final report, state addenda depth)
    contain material that should have been promoted. It is 'present' if the canonical
    JSON has the corresponding top-level key with non-empty content.
    """
    import re
    result = {
        "pass": True,
        "unresolveds": {"expected": False, "present": False, "detail": ""},
        "contradictions": {"expected": False, "present": False, "detail": ""},
        "state_addenda_overrides": {"expected": False, "present": False, "detail": ""},
        "issues": [],
    }

    # --- Load source files to determine what is expected ---
    audit_text = ""
    for f in ("06_coverage_audit.md", "08_final_report.md"):
        p = run_dir / f
        if p.is_file():
            try:
                audit_text += p.read_text()
            except OSError:
                pass

    # Unresolveds expected if source mentions them substantively
    # Look for numbered unresolved lists, "unresolved" headers, or "open question" patterns
    has_unresolved_content = bool(re.search(
        r'(?:^#{1,3}\s+.*[Uu]nresolved|[Uu]nresolved.*\d|[Oo]pen\s+[Qq]uestion|[Pp]ending\s+[Ii]ssue)',
        audit_text, re.MULTILINE
    ))
    result["unresolveds"]["expected"] = has_unresolved_content

    # Contradictions expected if source mentions them substantively
    has_contradiction_content = bool(re.search(
        r'(?:^#{1,3}\s+.*[Cc]ontradict|[Cc]ontradict.*\d|[Dd]iscrepanc|[Mm]ismatch)',
        audit_text, re.MULTILINE
    ))
    result["contradictions"]["expected"] = has_contradiction_content

    # State addenda expected if the depth pass file exists and is non-empty
    sa_file = run_dir / "RT_depth_state_addenda_promotion.json"
    if sa_file.is_file() and sa_file.stat().st_size > 10:
        result["state_addenda_overrides"]["expected"] = True
    else:
        # Also check exhibits for state addenda exhibit
        exhibits_file = run_dir / "04_exhibits.json"
        if exhibits_file.is_file():
            try:
                ex_text = exhibits_file.read_text().lower()
                if "state" in ex_text and ("addend" in ex_text or "effective dates" in ex_text):
                    result["state_addenda_overrides"]["expected"] = True
            except OSError:
                pass

    # --- Check canonical for presence ---
    canonical_path = run_dir / "09_final_canonical.json"
    if not canonical_path.is_file():
        canonical_path = run_dir / "05_canonical.json"
    if canonical_path.is_file():
        try:
            data = json.loads(canonical_path.read_text())
            flat = json.dumps(data).lower()

            # Unresolveds present
            if isinstance(data, dict) and ("unresolveds" in data or "contradictions_and_unresolveds" in data):
                val = data.get("unresolveds") or data.get("contradictions_and_unresolveds")
                if val and (isinstance(val, list) and len(val) > 0 or isinstance(val, dict) and len(val) > 0):
                    result["unresolveds"]["present"] = True
            elif "unresolved" in flat and re.search(r'"unresolved[^"]*"\s*:', flat):
                result["unresolveds"]["present"] = True

            # Contradictions present
            if isinstance(data, dict) and "contradictions" in data:
                val = data["contradictions"]
                if val and (isinstance(val, list) and len(val) > 0 or isinstance(val, dict) and len(val) > 0):
                    result["contradictions"]["present"] = True

            # State addenda overrides present
            if isinstance(data, dict) and "state_addenda_overrides" in data:
                val = data["state_addenda_overrides"]
                if val and isinstance(val, dict) and len(val) > 1:
                    result["state_addenda_overrides"]["present"] = True
        except (json.JSONDecodeError, OSError):
            pass

    # --- Evaluate gates ---
    for family in ("unresolveds", "contradictions", "state_addenda_overrides"):
        fam = result[family]
        if fam["expected"] and not fam["present"]:
            result["pass"] = False
            fam["detail"] = f"{family}: expected (source material contains them) but missing from canonical"
            result["issues"].append(fam["detail"])
        elif fam["expected"] and fam["present"]:
            fam["detail"] = f"{family}: present"
        elif not fam["expected"]:
            fam["detail"] = f"{family}: not expected (no source material)"

    return result


def check_publish_gate_verdict(run_dir: Path, filename: str) -> dict:
    """Check a publish gate file for its verdict."""
    result = {"pass": False, "verdict": "?", "detail": ""}
    gate_path = run_dir / filename
    if not gate_path.is_file():
        result["detail"] = f"{filename} missing"
        return result
    try:
        text = gate_path.read_text().lower()
        if "publish" in text[:500] and ("needs recovery" not in text[:500]):
            result["pass"] = True
            result["verdict"] = "publish"
        elif "needs recovery" in text[:500] or "verdict: 3" in text[:500]:
            result["verdict"] = "needs_recovery"
        elif "hold" in text[:500]:
            result["verdict"] = "hold"
        elif "reject" in text[:500]:
            result["verdict"] = "reject"
        else:
            result["verdict"] = "unclear"
        result["detail"] = result["verdict"]
    except OSError:
        result["detail"] = "read error"
    return result


# ── Main validator ──────────────────────────────────────────────────────────

def validate_run(run_dir: Path, mode: str | None = None) -> dict:
    """Full validation of a run directory."""
    if not run_dir.is_dir():
        return {
            "run_dir": str(run_dir),
            "slug": run_dir.name,
            "exists": False,
            "status": "missing",
            "issues": ["run directory does not exist"],
        }

    if mode is None:
        mode = detect_mode(run_dir)

    report = {
        "run_dir": str(run_dir),
        "slug": run_dir.name,
        "exists": True,
        "mode": mode,
        "files": {},
        "gates": {},
        "issues": [],
        "status": "unknown",
    }

    # Check A1 files
    a1_ok = 0
    for f in A1_FILES:
        info = check_file(run_dir / f)
        report["files"][f] = info
        if info.get("exists"):
            if f.endswith(".json") and not info.get("json_valid", True):
                report["issues"].append(f"{f}: invalid JSON — {info.get('json_error', '')}")
            else:
                a1_ok += 1
        else:
            report["issues"].append(f"{f}: missing")
    report["gates"]["a1_complete"] = a1_ok == len(A1_FILES)

    # Check A2 files
    a2_ok = 0
    for f in A2_FILES:
        info = check_file(run_dir / f)
        report["files"][f] = info
        if info.get("exists") and info.get("json_valid", True):
            a2_ok += 1
        elif not info.get("exists"):
            report["issues"].append(f"{f}: missing (depth pass incomplete)")
    report["gates"]["a2_complete"] = a2_ok == len(A2_FILES)

    # Mode-specific gates
    if mode == "fresh":
        # Fresh: must have 15_publish_gate.md
        gate_info = check_file(run_dir / FRESH_GATE)
        report["files"][FRESH_GATE] = gate_info
        if not gate_info.get("exists"):
            report["issues"].append(f"{FRESH_GATE}: missing (fresh publish gate)")
        report["gates"]["fresh_gate_exists"] = gate_info.get("exists", False)

        # Check publish gate verdict
        verdict = check_publish_gate_verdict(run_dir, FRESH_GATE)
        report["gates"]["fresh_verdict"] = verdict

        # Item 19 + 20 completeness
        i19 = check_item19_complete(run_dir)
        i20 = check_item20_complete(run_dir)
        report["gates"]["item19_complete"] = i19
        report["gates"]["item20_complete"] = i20
        if not i19["pass"]:
            report["issues"].append(f"item19: {i19['detail']}")
        if not i20["pass"]:
            report["issues"].append(f"item20: {i20['detail']}")

        # Score gate
        score = check_score_gate(run_dir)
        report["gates"]["score_gate"] = score
        if not score["pass"]:
            report["issues"].append(f"score gate: {score['detail']}")

        # Final report depth gate
        fr_depth = check_final_report_depth(run_dir)
        report["gates"]["final_report_depth"] = fr_depth
        if not fr_depth["pass"]:
            report["issues"].append(f"final report: {fr_depth['detail']}")

        # Canonical family completeness gate
        families = check_canonical_families(run_dir)
        report["gates"]["canonical_families"] = families
        if not families["pass"]:
            for issue in families["issues"]:
                report["issues"].append(f"canonical family: {issue}")

    elif mode == "previous":
        # Previous/live: must have reconciled publish gate
        for f in PREVIOUS_LIVE_FILES:
            info = check_file(run_dir / f)
            report["files"][f] = info
            if not info.get("exists"):
                report["issues"].append(f"{f}: missing (previous/live mode)")
        report["gates"]["previous_files_complete"] = all(
            report["files"].get(f, {}).get("exists", False)
            for f in PREVIOUS_LIVE_FILES
        )

        # Conditional files (note but don't fail)
        for f in PREVIOUS_CONDITIONAL:
            info = check_file(run_dir / f)
            report["files"][f] = info

        # Final decision gate
        verdict = check_publish_gate_verdict(run_dir, "18_reconciled_publish_gate.md")
        report["gates"]["reconciled_verdict"] = verdict

    # Determine overall status
    if not report["gates"].get("a1_complete"):
        report["status"] = "a1_incomplete"
    elif not report["gates"].get("a2_complete"):
        report["status"] = "a2_incomplete"
    elif mode == "fresh":
        if not report["gates"].get("fresh_gate_exists"):
            report["status"] = "needs_publish_gate"
        elif report["gates"]["fresh_verdict"].get("verdict") == "needs_recovery":
            report["status"] = "needs_recovery"
        elif not report["gates"]["fresh_verdict"].get("pass"):
            report["status"] = "needs_review"
        elif not report["gates"]["item19_complete"].get("pass"):
            report["status"] = "needs_review"
        elif not report["gates"]["item20_complete"].get("pass"):
            report["status"] = "needs_review"
        elif not report["gates"]["score_gate"].get("pass"):
            report["status"] = "needs_review"
        elif not report["gates"].get("final_report_depth", {}).get("pass", True):
            report["status"] = "needs_review"
        elif not report["gates"].get("canonical_families", {}).get("pass", True):
            report["status"] = "needs_review"
        else:
            report["status"] = "done"
    elif mode == "previous":
        if not report["gates"].get("previous_files_complete"):
            report["status"] = "regression_incomplete"
        elif report["gates"]["reconciled_verdict"].get("pass"):
            report["status"] = "done"
        else:
            report["status"] = "needs_review"

    return report


# ── Display ─────────────────────────────────────────────────────────────────

def print_report(report: dict, verbose: bool = True):
    """Print human-readable validation report."""
    slug = report["slug"]
    mode = report.get("mode", "?")
    status = report["status"]

    colors = {
        "done": "\033[32m",
        "needs_review": "\033[33m",
        "needs_recovery": "\033[33m",
        "a1_incomplete": "\033[31m",
        "a2_incomplete": "\033[31m",
        "missing": "\033[31m",
    }
    reset = "\033[0m"
    color = colors.get(status, "\033[33m")

    a1 = "ok" if report.get("gates", {}).get("a1_complete") else "INCOMPLETE"
    a2 = "ok" if report.get("gates", {}).get("a2_complete") else "INCOMPLETE"

    print(f"  {color}{status:<20s}{reset}  {slug:<35s}  mode={mode:<10s}  A1={a1}  A2={a2}")

    if verbose and report.get("issues"):
        for issue in report["issues"]:
            print(f"       ! {issue}")


# ── CLI ─────────────────────────────────────────────────────────────────────

def main():
    parser = argparse.ArgumentParser(description="Validate FDD extraction run outputs")
    parser.add_argument("runs", nargs="*", help="Run directories to validate")
    parser.add_argument("--mode", choices=["fresh", "previous"],
                        help="Force validation mode")
    parser.add_argument("--json", action="store_true", help="JSON output")
    parser.add_argument("--quiet", action="store_true", help="Suppress per-issue details")

    args = parser.parse_args()

    if not args.runs:
        parser.print_help()
        sys.exit(1)

    reports = []
    for r in args.runs:
        p = Path(r)
        if p.is_dir():
            reports.append(validate_run(p, mode=args.mode))

    if args.json:
        print(json.dumps(reports, indent=2))
        return

    print(f"\n{'='*80}")
    print(f"  Validation — {len(reports)} run(s)")
    print(f"{'='*80}\n")

    for r in reports:
        print_report(r, verbose=not args.quiet)

    statuses = {}
    for r in reports:
        s = r["status"]
        statuses[s] = statuses.get(s, 0) + 1

    print(f"\n{'─'*80}")
    for s, c in sorted(statuses.items()):
        print(f"  {s}: {c}")
    total_issues = sum(len(r.get("issues", [])) for r in reports)
    print(f"  issues: {total_issues}")
    print(f"{'='*80}\n")


if __name__ == "__main__":
    main()
